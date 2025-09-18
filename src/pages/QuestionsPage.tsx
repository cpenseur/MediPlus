import React from "react";
import SpecialtyTabs from "@/components/SpecialtyTabs";
import QuestionsList from "@/components/QuestionsList";
import MindfulBotSmallVer from "@/components/MindfulBotSmallVer";
import { Button } from "@/components/ui/button";
import { Sparkles, RotateCw } from "lucide-react";

/** ---------- SEA-LION (AI client) ---------- */
const SEA_LION_KEY = "sk-TSbEBjqQN9HKMcutANxL5A";
const SEA_LION_URL = "https://api.sea-lion.ai/v1/chat/completions";
const SEA_LION_MODEL = "aisingapore/Gemma-SEA-LION-v4-27B-IT";

async function seaLionChatJSON(prompt: string, signal?: AbortSignal): Promise<any> {
  if (!SEA_LION_KEY) throw new Error("Missing SEA-LION API key");
  const r = await fetch(SEA_LION_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SEA_LION_KEY}`,
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      model: SEA_LION_MODEL,
      max_completion_tokens: 700,
      temperature: 0.25,
      messages: [
        {
          role: "system",
          content:
            "You are a careful health assistant. Output MUST be valid minified JSON with no commentary. " +
            "No diagnosis. Generate specific, patient-friendly questions based ONLY on the provided context.",
        },
        { role: "user", content: prompt },
      ],
    }),
    signal,
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data?.error?.message || r.statusText);
  const text = (data?.choices?.[0]?.message?.content ?? "").trim();
  try {
    return JSON.parse(text);
  } catch {
    const m = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (!m) throw new Error("AI did not return JSON");
    return JSON.parse(m[0]);
  }
}

/** ---------- Types & storage ---------- */
export type Question = {
  id: string;
  text: string;
  checked: boolean;
  createdAt: number;
  updatedAt: number;
  source?: "ai" | "user" | "mindfulbot";
};

type QState = {
  version: number;
  specialties: string[];
  active: string;
  questions: Record<string, Question[]>;
};

const QS_KEY = "mediplus.questions.v2";

/** ---------- Helpers ---------- */
const uid = () => Math.random().toString(36).slice(2, 10);

// ✅ Narrow specialties to mental health focused ones
const DEFAULT_SPECIALTIES = [
  "Psychiatrist",
  "Psychologist",
  "Therapist",
  "Counselor"
];

function loadState(): QState {
  try {
    const obj = JSON.parse(localStorage.getItem(QS_KEY) || "null");
    if (obj?.version === 2 && obj?.specialties && obj?.questions) return obj;
  } catch (_e) {}
  const first = DEFAULT_SPECIALTIES[0];
  const blank: QState = {
    version: 2,
    specialties: [...DEFAULT_SPECIALTIES],
    active: first,
    questions: Object.fromEntries(DEFAULT_SPECIALTIES.map((s) => [s, []])),
  };
  localStorage.setItem(QS_KEY, JSON.stringify(blank));
  return blank;
}

function saveState(s: QState) {
  localStorage.setItem(QS_KEY, JSON.stringify(s));
}

/** ---------- Context keys ---------- */
const JOURNAL_KEY = "mediplus.journal.entries";
const MOOD_KEY = "mediplus.mood.log";
const CHAT_MINDFUL_KEY = "mediplus.chat.mindfulbot";
const MENTAL_OVERVIEW_KEY = "mediplus.mentalhealth.overview";

function readLS<T = any>(k: string, fallback: any = []): T {
  try {
    return JSON.parse(localStorage.getItem(k) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

/** ---------- Build payload ---------- */
function buildAIRequestPayload() {
  const journal = readLS<any[]>(JOURNAL_KEY, []);
  const mood = readLS<any[]>(MOOD_KEY, []);
  const mindfulRecent = readLS<any[]>(CHAT_MINDFUL_KEY, []).slice(-12);
  const mentalOverview = readLS<any>(MENTAL_OVERVIEW_KEY, {});

  return {
    journalRecent: journal.slice(-10),
    moodRecent: mood.slice(-10),
    mindfulRecent,
    mentalOverview, // includes analytics + analysisResult
  };
}

/** ---------- AI prompts ---------- */
function questionsPromptForAllSpecialties(payload: any) {
  return (
    "Generate 2-3 **specific patient-to-doctor questions** for each specialty for the user's next appointments.\n" +
    "Ground every question directly in the context (mood logs, journal, mindfulbot chats, and mental health overview).\n" +
    "If the overview shows common triggers (e.g., work, sleep, etc), ask about them explicitly.\n" +
    "If journal entries show gratitude or stress themes, make targeted questions.\n" +
    "If MindfulBot chats mention certain mental health conditions, reflect it in the questions.\n\n" +
    "Rules:\n" +
    "- First-person ('I', 'my').\n" +
    "- Each ends with '?'.\n" +
    "- ≤18 words each.\n" +
    "- No advice/diagnosis, only user’s questions.\n" +
    "- Ask specific unique questions that relates to that specialist's domain\n" +
    "- Avoid generic wording. Be specific to the data provided.\n\n" +
    "Specialties: Psychiatrist, Psychologist, Therapist, Counselor.\n\n" +
    "CONTEXT:\n" +
    JSON.stringify(payload) +
    "\n\nRespond ONLY with minified JSON mapping specialties to arrays of strings."
  );
}

function questionsPromptForOneSpecialty(payload: any, specialty: string) {
  return (
    `Generate 5–8 **specific patient-to-doctor questions** for the ${specialty}.\n` +
    "Ground every question in the context (mood logs, journal, mindfulbot chats, and mental health overview).\n" +
    "If the overview shows triggers like work, poor sleep or other repeating patterns, mention them directly.\n" +
    "If journal entries highlight positive or negative patterns, ask about them.\n" +
    "If MindfulBot chats mention certain mental health conditions, reflect it in the questions.\n\n" +
    "Rules:\n" +
    "- First-person ('I', 'my').\n" +
    "- Each ends with '?'.\n" +
    "- ≤18 words each.\n" +
    "- No advice/diagnosis, only user’s questions.\n" +
    "- Ask specific unique questions that relates to that specialist's domain\n" +
    "- Avoid generic wording. Be specific to the data provided.\n\n" +
    "CONTEXT:\n" +
    JSON.stringify(payload) +
    `\n\nRespond ONLY with a minified JSON array of strings.`
  );
}

/** ---------- Page ---------- */
const QuestionsPage: React.FC = () => {
  const [state, setState] = React.useState<QState>(() => loadState());
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string>("");

  const active = state.active;
  const list = state.questions[active] || [];

  const save = React.useCallback((next: QState | ((s: QState) => QState)) => {
    setState((prev) => {
      const v = typeof next === "function" ? (next as any)(prev) : next;
      saveState(v);
      return v;
    });
  }, []);

  /** Tabs handlers */
  const selectTab = (name: string) => save((s) => ({ ...s, active: name }));
  const addSpecialty = async (name: string) => {
    save((s) => {
      if (s.specialties.includes(name)) return s;
      return {
        ...s,
        specialties: [...s.specialties, name],
        questions: { ...s.questions, [name]: [] },
        active: name,
      };
    });
    await generateForName(name);
  };
  const renameSpecialty = (oldName: string, newName: string) =>
    save((s) => {
      if (oldName === newName || s.specialties.includes(newName)) return s;
      const specialties = s.specialties.map((x) => (x === oldName ? newName : x));
      const questions = { ...s.questions, [newName]: s.questions[oldName] ?? [] };
      delete questions[oldName];
      const active = s.active === oldName ? newName : s.active;
      return { ...s, specialties, questions, active };
    });
  const deleteSpecialty = (name: string) =>
    save((s) => {
      const specialties = s.specialties.filter((x) => x !== name);
      const questions = { ...s.questions };
      delete questions[name];
      const active = s.active === name ? specialties[0] ?? "" : s.active;
      return { ...s, specialties, questions, active };
    });

  /** List handlers */
  const setList = (nextList: Question[]) =>
    save((s) => ({ ...s, questions: { ...s.questions, [active]: nextList } }));

  const addQuestion = (text: string, source: Question["source"] = "user") => {
    const now = Date.now();
    setList([
      ...list,
      { id: uid(), text: text.trim(), checked: false, createdAt: now, updatedAt: now, source },
    ]);
  };

  const insertMany = (arr: string[], source: Question["source"] = "ai") => {
    if (!arr?.length) return;
    const now = Date.now();
    const have = new Set(
      (state.questions[state.active] || []).map((q) => q.text.trim().toLowerCase())
    );

    const items = arr
      .map((t) => String(t).trim())
      .filter(Boolean)
      .map((t) => (t.endsWith("?") ? t : `${t}?`))
      .filter((t) => {
        const key = t.toLowerCase();
        if (have.has(key)) return false;
        have.add(key);
        return true;
      })
      .map((t) => ({ id: uid(), text: t, checked: false, createdAt: now, updatedAt: now, source }));

    if (!items.length) return;
    setList([...(state.questions[state.active] || []), ...items]);
  };

  /** AI generation */
  const abortRef = React.useRef<AbortController | null>(null);
  const isAbortError = (e: any) =>
    e?.name === "AbortError" || String(e?.message || "").toLowerCase().includes("abort");

  const generateAll = async () => {
    try {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      setBusy(true);
      setError("");
      const payload = buildAIRequestPayload();
      const json = await seaLionChatJSON(questionsPromptForAllSpecialties(payload), ctrl.signal);

      const now = Date.now();
      save((s) => {
        const next = { ...s };
        for (const [spec, arr] of Object.entries(json || {})) {
          if (!next.specialties.includes(spec)) next.specialties.push(spec);
          const existing = next.questions[spec] ?? [];
          const existingSet = new Set(existing.map((q) => q.text.toLowerCase().trim()));
          const newbies: Question[] = (arr as any[])
            .map((t) => String(t).replace(/\s+/g, " ").trim())
            .filter((t) => !!t && !existingSet.has(t.toLowerCase()))
            .map((t) => ({ id: uid(), text: t, checked: false, createdAt: now, updatedAt: now, source: "ai" }));
          next.questions[spec] = [...existing, ...newbies];
        }
        return next;
      });
    } catch (e: any) {
      if (!isAbortError(e)) setError(e?.message || "Failed to generate");
    } finally {
      setBusy(false);
    }
  };

  const generateForActive = async () => {
    await generateForName(active);
  };

  const generateForName = async (name: string) => {
    try {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      setBusy(true);
      setError("");
      const payload = buildAIRequestPayload();
      const json = await seaLionChatJSON(questionsPromptForOneSpecialty(payload, name), ctrl.signal);
      insertMany(json as string[], "ai");
    } catch (e: any) {
      if (!isAbortError(e)) setError(e?.message || "Failed to generate");
    } finally {
      setBusy(false);
    }
  };

  React.useEffect(() => {
    const allEmpty = state.specialties.every((sp) => (state.questions[sp] ?? []).length === 0);
    if (!allEmpty) return;
    generateAll();
  }, []);

  /** ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">Questions for Your Doctor</h1>
            <p className="text-gray-600">AI-generated, editable checklists tailored to your mental health data.</p>
          </div>
          <div className="flex gap-2">
            <Button
              className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white"
              onClick={generateForActive}
              disabled={busy || !active}
              title={`Generate more questions for ${active}`}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate for {active || "—"}
            </Button>
            <Button
              variant="secondary"
              onClick={generateAll}
              disabled={busy}
              title="Generate across all specialties"
            >
              <RotateCw className="w-4 h-4 mr-2" />
              Generate All
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr_360px] gap-6">
          <div className="bg-white rounded-2xl shadow p-4">
            <SpecialtyTabs
              tabs={state.specialties}
              active={active}
              onSelect={selectTab}
              onAdd={addSpecialty}
              onRename={renameSpecialty}
              onDelete={deleteSpecialty}
            />
          </div>

          <div className="bg-white rounded-2xl shadow p-4">
            <QuestionsList
              items={list}
              onChange={setList}
              onAdd={(t) => addQuestion(t, "user")}
              busy={busy}
              error={error}
            />
          </div>

          <div className="bg-white rounded-2xl shadow p-0 overflow-hidden">
            <MindfulBotSmallVer
              onInsert={(arr) => insertMany(arr, "mindfulbot")}
              activeSpecialty={active}
              seaLionConfig={{ SEA_LION_KEY, SEA_LION_MODEL, SEA_LION_URL }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuestionsPage;
