import React from "react";
import { Button } from "@/components/ui/button";
import { Send, Plus, Loader2 } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

type Props = {
  onInsert: (lines: string[]) => void; // add into current specialty list
  activeSpecialty: string;
  seaLionConfig: { SEA_LION_KEY: string; SEA_LION_MODEL: string; SEA_LION_URL: string };
};

const systemPrompt =
  "You are MindfulBot, a safe mental health support assistant. No diagnosis.\n" +
  "STRICT RULES:\n" +
  "1. Never provide advice, guidance, coping strategies, or agree/disagree with the user.\n" +
  "2. Your ONLY task is to transform the user’s own inputs (mood logs, journal entries, mindfulbot chats, mental health overview) into concise patient-to-doctor questions.\n" +
  "3. Do not invent topics. Every question must directly reflect something already mentioned in the user’s data.\n" +
  "4. Format:\n" +
  "   - One question per line, no multiple questions in the same line.\n" +
  "   - Use first-person ('I', 'my').\n" +
  "   - Each question ≤ 18 words.\n" +
  "   - Each ends with a question mark.\n" +
  "   - Output only short bullet-point style questions (no explanations, no introductions).\n" +
  "5. Never speculate, never diagnose, never recommend treatments.\n" +
  "6. Questions in the perspective of a patient asking a specialist.\n" +
  "7. If unsure, output nothing.\n";


const MindfulBotSmallVer: React.FC<Props> = ({ onInsert, activeSpecialty, seaLionConfig }) => {
  const [msgs, setMsgs] = React.useState<Msg[]>([
    { role: "assistant", content: "Hi! I can suggest mindful questions or help refine them for your appointments." },
  ]);
  const [draft, setDraft] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const abortRef = React.useRef<AbortController | null>(null);

  const ask = async () => {
    const content = draft.trim();
    if (!content) return;
    setDraft("");
    setMsgs((m) => [...m, { role: "user", content }]);

    try {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      setBusy(true);

      const r = await fetch(seaLionConfig.SEA_LION_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${seaLionConfig.SEA_LION_KEY}`,
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          model: seaLionConfig.SEA_LION_MODEL,
          max_completion_tokens: 400,
          temperature: 0.4,
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content:
                `Active specialty: ${activeSpecialty || "General Doctor"}.\n` +
                "If user requests new questions, provide 6–10 concise bullets in a neat and readable format (<= 18 words). " +
                "Otherwise, respond briefly.\n\n" +
                content,
            },
          ],
        }),
        signal: ctrl.signal,
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error?.message || r.statusText);
      const text = (data?.choices?.[0]?.message?.content ?? "").trim();
      setMsgs((m) => [...m, { role: "assistant", content: text }]);
    } catch (e: any) {
      if (e?.name === "AbortError") return;
      setMsgs((m) => [...m, { role: "assistant", content: `Sorry—AI error: ${e?.message || "failed"}` }]);
    } finally {
      setBusy(false);
    }
  };

  const extractBullets = (s: string): string[] => {
    return s
      .split(/\r?\n/) // split into lines
      .map((x) => x.replace(/^\s*(?:[-*•]|\d+\.)\s*/, "").trim()) // strip leading bullets/numbers
      .filter((x) => x.endsWith("?")) // keep only valid questions
  };

  const lastAssistant = [...msgs].reverse().find((m) => m.role === "assistant");

  return (
    <div className="flex flex-col h-[560px]">
      {/* Header */}
      <div className="px-4 py-3 border-b">
        <h3 className="text-sm font-semibold text-gray-900">MindfulBot (compact)</h3>
        <p className="text-xs text-gray-500">Ask for more questions or refine wording. One-click insert.</p>
      </div>

      {/* Chat window */}
      <div className="flex-1 overflow-auto p-3 space-y-3 bg-white">
        {msgs.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm leading-relaxed shadow-sm whitespace-pre-line ${
                m.role === "user"
                  ? "bg-blue-500 text-white rounded-br-sm"
                  : "bg-gray-100 text-gray-800 rounded-bl-sm"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input + Insert */}
      <div className="px-3 pb-2">
        <div className="flex gap-2 mb-2">
          <input
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
            placeholder={`Ask MindfulBot… (will tailor to ${activeSpecialty || "General Doctor"})`}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") ask();
            }}
          />
          <Button onClick={ask} disabled={busy || !draft.trim()}>
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>

        <Button
          variant="secondary"
          className="w-full"
          disabled={!lastAssistant}
          onClick={() => {
            if (!lastAssistant) return;
            const bullets = extractBullets(lastAssistant.content);
            if (!bullets.length) {
              alert("No bullet-like suggestions found in the last reply.");
              return;
            }
            onInsert(bullets);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Insert suggestions into "{activeSpecialty || "General Doctor"}"
        </Button>
      </div>
    </div>
  );
};

export default MindfulBotSmallVer;
