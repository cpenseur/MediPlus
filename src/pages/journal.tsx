import React, { useEffect, useMemo, useState } from "react";
import { format, isWithinInterval, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subDays } from "date-fns";
import { Calendar as CalendarIcon, Edit3, PlusCircle, Sparkles, Search, ExternalLink, Trophy, HelpCircle, Trash2 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";


// confirm dialog (shadcn)
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import journalingImage from "@/assets/journaling-girl.svg";
import { generateJournalSeedFromSept1, Mood as SeedMood } from "@/data/seeds";



/* ===== localStorage helpers ===== */
export const LS_KEYS = {
  JOURNAL: "mh:journal",
} as const;

export function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
export function saveJSON<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// Always update entries AND persist to localStorage in one go
function updateEntries(
  set: React.Dispatch<React.SetStateAction<JournalEntry[]>>,
  updater: (prev: JournalEntry[]) => JournalEntry[]
) {
  set(prev => {
    const next = updater(prev);
    saveJSON(LS_KEYS.JOURNAL, next);
    return next;
  });
}


// ---- AI: Sea-Lion config ----
const AI_ENDPOINT = "https://api.sea-lion.ai/v1/chat/completions";
const AI_MODEL = "aisingapore/Llama-SEA-LION-v3-70B-IT";
// Prefer env var for safety; keep the string for local dev only.
const AI_KEY = import.meta.env.VITE_SEALION_KEY || "sk-TSbEBjqQN9HKMcutANxL5A";



// Remove leading dates/emojis if the model tries to add them
const cleanTitle = (raw: string) =>
  raw
    .replace(/^\s*\p{Emoji_Presentation}+/gu, "")   // strip leading emoji
    .replace(/^\s*\d{1,2}[\-/]\d{1,2}[\-/]\d{2,4}\s*[:\-–]\s*/u, "") // 09/18/2025:
    .replace(/^\s*(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)[^\w]+/i, "")        // Weekday:
    .replace(/^\s*(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\s*[:\-–]\s*/i, "")
    .trim();

// Call Sea-Lion to get a 150-word entry for a given date
async function fetchAIEntryFor(date: Date): Promise<{ title: string; body: string }> {
  const sys = {
    role: "system",
    content:
      "You are a concise journaling assistant. Return ONLY valid JSON for a journal entry.",
  };

  const user = {
    role: "user",
    content: [
      "Write a reflective personal journal entry about an ordinary day (work/school/family/life).",
      "Length: ~150 words (2–4 short paragraphs).",
      "Tone: warm, grounded, realistic. No lists. No quotes. No markdown.",
      "Return ONLY JSON exactly like:",
      '{ "title": "Two or Five Word Title", "body": "150-word body here" }',
      "Rules:",
      "- Title: 2–6 words, no date, no emoji.",
      "- Body: ~150 words, natural flow.",
    ].join("\n"),
  };

  const res = await fetch(AI_ENDPOINT, {
    method: "POST",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${AI_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: AI_MODEL,
      temperature: 0.6,
      max_completion_tokens: 350,
      messages: [sys, user],
    }),
  });

  const json = await res.json();
  const text = json?.choices?.[0]?.message?.content ?? "";
  // Extract strict JSON (in case model adds text around it)
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("AI did not return JSON");

  const parsed = JSON.parse(text.slice(start, end + 1));
  const title = cleanTitle(String(parsed.title || "Daily Reflection"));
  const body = String(parsed.body || "").trim();
  if (!title || !body) throw new Error("AI missing title/body");
  return { title, body };
}

// Generate 2–4 short content-based tags from title/body
async function fetchTagsFor(title: string, body: string): Promise<string[]> {
  const sys = { role: "system", content: "You create concise tags for diary entries. Return ONLY JSON." };
  const user = {
    role: "user",
    content: [
      "Create 2–4 short, content-based tags for this personal journal entry.",
      "Rules:",
      "- Tags must be lowercase, no emojis, no dates, no '#', no spaces (use hyphen if needed).",
      "- Examples: ['work-stress','small-wins','family','gratitude']",
      "Return ONLY JSON exactly like:",
      '{ "tags": ["tag1","tag2","tag3"] }',
      "",
      `Title: ${title}`,
      `Body: ${body}`
    ].join("\n")
  };

  try {
    const res = await fetch(AI_ENDPOINT, {
      method: "POST",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${AI_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: AI_MODEL,
        temperature: 0.5,
        max_completion_tokens: 80,
        messages: [sys, user],
      }),
    });

    const json = await res.json();
    const text = json?.choices?.[0]?.message?.content ?? "";
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error("AI did not return JSON for tags");

    const parsed = JSON.parse(text.slice(start, end + 1));
    const out = Array.isArray(parsed?.tags) ? parsed.tags : [];
    // sanitize
    const clean = out
      .map((t: string) => String(t).toLowerCase().trim())
      .map((t: string) => t.replace(/^#+/, ""))        // remove leading '#'
      .map((t: string) => t.replace(/\s+/g, "-"))      // spaces → hyphen
      .map((t: string) => t.replace(/[^a-z0-9\-]/g, "")) // keep a-z0-9-
      .filter(Boolean)
      .slice(0, 4);

    // sensible fallback if model returned empty
    if (clean.length === 0) {
      const keywords = (title + " " + body)
        .toLowerCase()
        .match(/[a-z0-9]+/g) || [];
      const uniq = Array.from(new Set(keywords)).slice(0, 3);
      return uniq.length ? uniq : ["reflection"];
    }
    return clean;
  } catch (e) {
    console.error("Tag generation failed:", e);
    return ["reflection"]; // final fallback
  }
}





/* ===========================
   THEME / TYPES
=========================== */
const PURPLE = "#717EF3";

type Mood = "great" | "good" | "okay" | "low" | "difficult";
interface JournalEntry {
  id: string;
  date: string; // ISO yyyy-MM-dd
  title: string;
  content: string;
  mood: Mood;
  tags: string[];
}

const moodColors: Record<Mood, string> = {
  great: "bg-emerald-100 text-emerald-800 border-emerald-200",
  good: "bg-blue-100 text-blue-800 border-blue-200",
  okay: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-orange-100 text-orange-800 border-orange-200",
  difficult: "bg-red-100 text-red-800 border-red-200",
};
const moodEmojis: Record<Mood, string> = { great:"😊", good:"🙂", okay:"😐", low:"😕", difficult:"😔" };

/* prompts */
const PROMPTS = [
  "What’s one small joy you noticed today?",
  "How did family or friends affect your feelings today?",
  "What helped you feel calm or grounded?",
  "Which expectation felt heavy today, and how did you handle it?",
  "If you could send encouragement to your future self, what would it say?",
  "What gave you energy today? What drained it?",
];

/* ===== initial entries with versioning (runs once) ===== */
const getInitialEntries = (): JournalEntry[] => {
  if (typeof window === "undefined") return [];
  const SEED_VERSION = "journal-seed-v4";
  const verKey = LS_KEYS.JOURNAL + ":ver";

  const stored = loadJSON<JournalEntry[] | null>(LS_KEYS.JOURNAL, null);
  const storedVer = localStorage.getItem(verKey);

  if (!stored || storedVer !== SEED_VERSION) {
    const seeded = generateJournalSeedFromSept1().map(s => ({
      ...s,
      mood: s.mood as Mood, // types align
    }));
    saveJSON(LS_KEYS.JOURNAL, seeded);
    localStorage.setItem(verKey, SEED_VERSION);
    return seeded;
  }
  return stored;
};

/* ===========================
   JOURNAL PAGE
=========================== */
const JournalPage: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>(getInitialEntries);

  // Persist on every change
  // On mount, backfill missing days (including today), and SAVE immediately.
  // Each AI entry uses AI-generated tags (content-based).
  useEffect(() => {
    (async () => {
      if (!AI_KEY || AI_KEY === "REPLACE_WITH_DEV_KEY_ONLY") return;
  
      const today = new Date();
      const todayStr = format(today, "yyyy-MM-dd");
  
      // We only block AI generation if an AI entry already exists for that date.
      const hasAiForDate = (ds: string) =>
        entries.some(e => e.date === ds && e.id.startsWith("ai-"));
  
      // Find latest date we have (any source)
      const latestStr = entries.reduce((max, e) => (e.date > max ? e.date : max), "1970-01-01");
      const latest = latestStr === "1970-01-01" ? null : parseISO(latestStr);
      const startDate = latest ? subDays(latest, -1) : today;
  
      // Build list of dates from startDate→today (inclusive) that lack an AI entry
      const toCreate: string[] = [];
      for (let d = new Date(startDate); format(d, "yyyy-MM-dd") <= todayStr; d.setDate(d.getDate() + 1)) {
        const ds = format(d, "yyyy-MM-dd");
        if (!hasAiForDate(ds)) toCreate.push(ds);
      }
      if (!toCreate.length) return;
  
      const newOnes: JournalEntry[] = [];
      for (const ds of toCreate) {
        try {
          const { title, body } = await fetchAIEntryFor(parseISO(ds));
          const aiTags = await fetchTagsFor(title, body); // content-based tags
          newOnes.push({
            id: `ai-${ds}-${Date.now()}`,        // <-- identifies it as AI
            date: ds,
            title,
            content: body,
            mood: "okay",
            tags: aiTags,
          });
        } catch (e) {
          console.error("AI generation failed for", ds, e);
        }
      }
  
      if (newOnes.length) {
        // newest first (to match your UI)
        const sorted = newOnes.sort((a, b) => (a.date > b.date ? -1 : 1));
        updateEntries(setEntries, prev => [...sorted, ...prev]); // saves to localStorage immediately
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  useEffect(() => {
    saveJSON(LS_KEYS.JOURNAL, entries);
  }, [entries]);
  



  const [filterType, setFilterType] = useState<"all" | "day" | "week" | "month" | "year">("all");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState<string>("");

  // new entry dialog
  const [newEntry, setNewEntry] = useState<{ title: string; content: string; mood: Mood; tags: string }>({
    title: "",
    content: "",
    mood: "okay",
    tags: "",
  });

  // edit entry dialog
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);

  const insertRandomPrompt = () => {
    const p = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
    setNewEntry(prev => ({ ...prev, content: prev.content ? `${prev.content}\n\n${p}` : p }));
  };

  /* ---------- derived filtered ---------- */
  const filteredEntries = useMemo(() => {
    let base = entries.slice().sort((a, b) => (a.date > b.date ? -1 : 1));
    if (filterType !== "all") {
      base = base.filter((entry) => {
        const d = parseISO(entry.date);
        switch (filterType) {
          case "day":   return format(d, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
          case "week":  return isWithinInterval(d, { start: startOfWeek(selectedDate), end: endOfWeek(selectedDate) });
          case "month": return isWithinInterval(d, { start: startOfMonth(selectedDate), end: endOfMonth(selectedDate) });
          case "year":  return isWithinInterval(d, { start: startOfYear(selectedDate), end: endOfYear(selectedDate) });
          default:      return true;
        }
      });
    }
    const q = searchTerm.trim().toLowerCase();
    if (!q) return base;
    return base.filter((e) => {
      const hay = [e.title, e.content, e.tags.join(","), e.mood].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [entries, filterType, selectedDate, searchTerm]);

  /* ---------- weekly progress ---------- */
  const weeklyProgress = useMemo(() => {
    const start = startOfWeek(new Date());
    const end = endOfWeek(new Date());
    const daysWithEntry = new Set(
      entries
        .filter((e) => isWithinInterval(parseISO(e.date), { start, end }))
        .map((e) => format(parseISO(e.date), "yyyy-MM-dd"))
    );
    return { count: daysWithEntry.size, total: 7, pct: Math.round((daysWithEntry.size / 7) * 100) };
  }, [entries]);

  /* ---------- streak + badges ---------- */

  const [streak, setStreak] = useState<number>(0);
  const [streakIncludesToday, setStreakIncludesToday] = useState<boolean>(false);
  const [badges, setBadges] = useState<string[]>([]);

  useEffect(() => {
    const dates = new Set(entries.map((e) => format(parseISO(e.date), "yyyy-MM-dd")));
    const todayStr = format(new Date(), "yyyy-MM-dd");
    const hasToday = dates.has(todayStr);

    // if today not in entries, start from yesterday
    let current = hasToday ? new Date() : subDays(new Date(), 1);

    let s = 0;
    while (dates.has(format(current, "yyyy-MM-dd"))) {
      s += 1;
      current = subDays(current, 1);
    }

    setStreak(s);
    setStreakIncludesToday(hasToday);

    // badges
    const earned: string[] = [];
    if (entries.length >= 1) earned.push("Reflection Starter");
    if (s >= 7) earned.push("Consistency Builder (7-day streak)");
    const moods = entries
      .slice()
      .sort((a, b) => (a.date > b.date ? 1 : -1))
      .map((e) => e.mood);
    for (let i = 0; i <= moods.length - 3; i++) {
      const tri = moods.slice(i, i + 3);
      if (tri.every((m) => m === "low" || m === "difficult")) {
        earned.push("Resilience");
        break;
      }
    }
    if (entries.length >= 10) earned.push("Reflection ×10");
    setBadges(earned);
  }, [entries]);

  useEffect(() => {
    saveJSON("mh:journal:streak", streak);
    saveJSON("mh:journal:badges", badges);
  }, [streak, badges]);

  // === AI Summary (week/month) ===
  const [aiScope, setAiScope] = useState<"week" | "month">("week");
  const [aiBusy, setAiBusy] = useState(false);
  const [aiText, setAiText] = useState("");

  async function generateJournalAISummary(scope: "week" | "month") {
    setAiBusy(true);

    // ---- move these OUTSIDE try so catch can see them ----
    const now = new Date();
    const start = scope === "week" ? startOfWeek(now) : startOfMonth(now);
    const end   = scope === "week" ? endOfWeek(now)   : endOfMonth(now);

    const inScope = entries.filter((e) =>
      isWithinInterval(parseISO(e.date), { start, end })
    );

    const moodCounts = inScope.reduce<Record<string, number>>((acc, e) => {
      acc[e.mood] = (acc[e.mood] || 0) + 1;
      return acc;
    }, {});

    const tagCounts = inScope
      .flatMap((e) => e.tags || [])
      .reduce<Record<string, number>>((acc, t) => {
        acc[t] = (acc[t] || 0) + 1;
        return acc;
      }, {});

    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([t, n]) => `${t}:${n}`)
      .join(", ");

    const context = [
      `SCOPE: ${scope.toUpperCase()}`,
      `ENTRIES: ${inScope.length}`,
      `MOODS: ${Object.entries(moodCounts).map(([m, n]) => `${m}:${n}`).join(", ")}`,
      `TOP TAGS: ${topTags || "none"}`,
    ].join("\n");
    // ------------------------------------------------------

    try {
      const res = await fetch(AI_ENDPOINT, {
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${AI_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: AI_MODEL,
          temperature: 0.5,
          max_completion_tokens: 160,
          messages: [
            {
              role: "system",
              content:
                "You write concise wellness summaries. Return 90–110 words, plain text only. No lists, no markdown, no headings.",
            },
            {
              role: "user",
              content:
                `Write a supportive one-paragraph summary of these journal trends:\n${context}\n` +
                "Tone: warm, grounded, encouraging. Focus on trends, not diagnoses.",
            },
          ],
        }),
      });

      if (!res.ok) throw new Error(`AI ${res.status}`);
      const data = await res.json();
      const raw = (data?.choices?.[0]?.message?.content || "").trim();

      const clean = raw.replace(/[*_#>`-]+/g, " ").replace(/\s+/g, " ").trim();
      setAiText(clean);
    } catch (e) {
      // now these are in scope and safe to use
      const total = inScope.length || 1;
      const pct = (n: number) => Math.round((n / total) * 100);
      const g = pct(moodCounts["great"] || 0);
      const good = pct(moodCounts["good"] || 0);
      const ok = pct(moodCounts["okay"] || 0);
      const low = pct(moodCounts["low"] || 0);
      const diff = pct(moodCounts["difficult"] || 0);

      const fallback =
        `Here’s a short look at your ${scope} of journaling. You checked in ${inScope.length} time(s), with moods leaning ` +
        `great/good ${g + good}% and okay/low/difficult ${ok + low + diff}%. Tags suggest frequent themes around ` +
        `${topTags ? topTags.replace(/:\d+/g, "").replace(/,/g, ", ") : "reflection"}. Keep leaning on simple, steady habits—` +
        `brief entries, gentle prompts, and small routines. Consider a short walk, a two-minute breath, and one gratitude line ` +
        `on tougher days. You’re showing up consistently, which matters most.`;

      setAiText(fallback);
    } finally {
      setAiBusy(false);
    }
  }




  /* ---------- handlers ---------- */
  const handleSaveEntry = () => {
    if (!newEntry.title || !newEntry.content) return;
    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: format(new Date(), "yyyy-MM-dd"),
      title: newEntry.title,
      content: newEntry.content,
      mood: newEntry.mood,
      tags: newEntry.tags
        .split(",")
        .map(t => t.trim())
        .filter(Boolean)
        .map(t => t.replace(/^#/, "")), // strip leading '#'
    };
    updateEntries(setEntries, prev => [entry, ...prev]); // <— persists now
    setNewEntry({ title: "", content: "", mood: "okay", tags: "" });
  };
  
  const handleUpdateEntry = () => {
    if (!editingEntry) return;
    updateEntries(setEntries, prev => prev.map(e => (e.id === editingEntry.id ? editingEntry : e)));
    setEditingEntry(null);
  };
  
  const handleDeleteEntry = (id: string) => {
    updateEntries(setEntries, prev => prev.filter(e => e.id !== id));
    setEditingEntry(prev => (prev?.id === id ? null : prev));
  };
  

  /* ===========================
     UI
  =========================== */
  return (
    <div className="min-h-screen bg-[#FFF5EC]">
      {/* HERO */}
      <section className="relative pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left: headline + CTAs (design preserved) */}
            <div className="flex-1">
              <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-black mb-4">
                Reflection
                <span className="block bg-gradient-to-r from-primary via-wellness to-secondary bg-clip-text text-transparent">
                  Journal
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed max-w-2xl">
                Gentle check-ins. Simple prompts. Small wins that build your well-being.
              </p>

              {/* Add Entry + Browse */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      className="text-lg px-8 py-4 shadow transition"
                      style={{ backgroundColor: PURPLE, color: "#fff" }}
                    >
                      <PlusCircle className="w-5 h-5 mr-2" />
                      Add New Entry
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Journal Entry</DialogTitle>
                      <DialogDescription>Write freely. Small steps count.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="Entry title…"
                        value={newEntry.title}
                        onChange={(e) => setNewEntry((p) => ({ ...p, title: e.target.value }))}
                      />

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 flex items-center gap-2">
                          <HelpCircle className="w-4 h-4" />
                          Stuck? Click for a gentle prompt.
                        </span>
                        <Button
                          variant="outline"
                          className="bg-white"
                          style={{ borderColor: PURPLE, color: PURPLE, borderWidth: 2 }}
                          type="button"
                          onClick={insertRandomPrompt}
                        >
                          Need a prompt?
                        </Button>
                      </div>


                      {/* SINGLE-PAGE JOURNAL */}
                        <div className="mx-auto max-w-3xl">
                          <div className="relative rounded-[28px] border ring-1 ring-black/5 bg-[#FFF8F0] text-stone-700 shadow-xl overflow-hidden">
                            {/* lined paper background */}
                            <div
                              className="absolute inset-0 pointer-events-none"
                              style={{
                                backgroundImage:
                                  "repeating-linear-gradient(transparent, transparent 36px, rgba(0,0,0,0.18) 37px)",
                              }}
                            />

                            <Textarea
                              placeholder="Write your thoughts here…"
                              rows={16}
                              className="
                                relative z-10 w-full h-[36rem]
                                resize-vertical
                                font-serif text-[18px] leading-[36px]
                                px-10
                                !bg-transparent outline-none !ring-0 focus:!ring-0
                              "
                              style={{
                                paddingTop: "36px", // align first line with first rule
                                paddingBottom: "36px",
                                fontFamily: "'Georgia', serif",
                              } as React.CSSProperties}
                              value={newEntry.content}
                              onChange={(e) =>
                                setNewEntry((p) => ({ ...p, content: e.target.value }))
                              }
                            />
                          </div>
                        </div>














                      <div className="flex flex-wrap gap-3">
                        <Select value={newEntry.mood} onValueChange={(v: Mood) => setNewEntry((p) => ({ ...p, mood: v }))}>
                          <SelectTrigger className="w-44">
                            <SelectValue placeholder="Mood" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="great">😊 Great</SelectItem>
                            <SelectItem value="good">🙂 Good</SelectItem>
                            <SelectItem value="okay">😐 Okay</SelectItem>
                            <SelectItem value="low">😕 Low</SelectItem>
                            <SelectItem value="difficult">😔 Difficult</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder="Tags (comma separated)"
                          value={newEntry.tags}
                          onChange={(e) => setNewEntry((p) => ({ ...p, tags: e.target.value }))}
                          className="flex-1"
                        />
                      </div>
                      <Button onClick={handleSaveEntry} className="w-full" style={{ backgroundColor: PURPLE, color: "#fff" }}>
                        Save Entry
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <a href="#entries" className="inline-block">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-4 bg-white"
                    style={{ borderColor: PURPLE, color: PURPLE, borderWidth: 2 }}
                  >
                    Browse Entries
                  </Button>
                </a>
              </div>
            </div>

            {/* Right: hero illustration */}
            <div className="flex-1">
              <img src={journalingImage} alt="Person journaling" className="w-full h-auto rounded-2xl object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* STREAK + WEEKLY PROGRESS + BADGES */}
      <section className="pb-2 -mt-4">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">


          {/* Streak */}
          <Card className="bg-white" style={{ backgroundColor: "#E8EAFF", borderColor: `${PURPLE}33`, borderWidth: 2 }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = PURPLE)}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = `${PURPLE}33`)}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" style={{ color: PURPLE }} />
                <CardTitle className="text-lg">Your Streak</CardTitle>
              </div>
              <CardDescription className="font-bold">Consecutive days you’ve reflected</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: PURPLE }}>
                {streak} {streak === 1 ? "day" : "days"}
              </div>
              <p className="text-sm font-bold text-gray-600 mt-1">
                {streakIncludesToday
                  ? "You're on a roll ✨"
                  : "No entry today yet — add one to keep the streak going 🌱"}
              </p>
            </CardContent>
          </Card>

          {/* Weekly progress */}
          <Card className="bg-white" style={{ backgroundColor: "#FCD4D2", borderColor: `${PURPLE}33`, borderWidth: 2 }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = PURPLE)}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = `${PURPLE}33`)}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5" style={{ color: PURPLE }} />
                <CardTitle className="text-lg">This Week</CardTitle>
              </div>
              <CardDescription className="font-bold">{weeklyProgress.count} / {weeklyProgress.total} days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full" style={{ width: `${weeklyProgress.pct}%`, backgroundColor: PURPLE, transition: "width 300ms ease" }} />
              </div>
              <p className="text-sm font-bold text-gray-600 mt-2">Goal: 4–5 days is a great start.</p>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card className="bg-white" style={{ backgroundColor: "#F4E7E1", borderColor: `${PURPLE}33`, borderWidth: 2 }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = PURPLE)}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = `${PURPLE}33`)}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5" style={{ color: PURPLE }} />
                <CardTitle className="text-lg">Badges</CardTitle>
              </div>
              <CardDescription className="font-bold">Earn badges as you build your journaling habit - small rewards for showing up.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {badges.length === 0
                ? <span className="text-sm text-gray-600">Write your first entry to earn “Reflection Starter”.</span>
                : badges.map((b, i) => (
                  <Badge key={i} className="text-xs bg-white" variant="outline" style={{ borderColor: `${PURPLE}66`, color: PURPLE }}>
                    {b}
                  </Badge>
                ))
              }
            </CardContent>
          </Card>
        </div>
      </section>

      {/* TOP FILTER BAR (moved above entries) */}
      <section id="entries" className="pt-6">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {/* AI Summary Card */}
        <Card
          className="bg-white"
          style={{ backgroundColor: "#CEE2E0", borderColor: `${PURPLE}33`, borderWidth: 2 }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = PURPLE)}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = `${PURPLE}33`)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" style={{ color: PURPLE }} />
                <CardTitle className="text-lg">AI Journal Summary</CardTitle>
              </div>
              <Select value={aiScope} onValueChange={(v: "week" | "month") => setAiScope(v)}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <CardDescription>A short summary of your entries.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              style={{ backgroundColor: PURPLE, color: "#fff" }}
              disabled={aiBusy}
              onClick={() => generateJournalAISummary(aiScope)}
            >
              {aiBusy ? "Summarizing..." : "Generate Summary"}
            </Button>

            {aiText ? (
              <div className="p-4 rounded-xl border bg-white" style={{ borderColor: `${PURPLE}33` }}>
                <p className="text-[15px] leading-7 text-slate-800">{aiText}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-600">
              </p>
            )}
          </CardContent>
        </Card>

        {/* Browse Entries Card */}
        <Card className="bg-white mb-6"
                    style={{ backgroundColor: "#FFE5B2", borderColor: `${PURPLE}33`, borderWidth: 2 }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = PURPLE)}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = `${PURPLE}33`)}>
                    <CardHeader className="pb-3">
                      <CardTitle>Browse Entries</CardTitle>
                      <CardDescription>Filter by timeframe and search</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3 md:grid-cols-3">
                      <div className="flex gap-2 items-center">
                        <Select value={filterType} onValueChange={(v: any) => setFilterType(v)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Filter by…" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Entries</SelectItem>
                            <SelectItem value="day">Today</SelectItem>
                            <SelectItem value="week">This Week</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                            <SelectItem value="year">This Year</SelectItem>
                          </SelectContent>
                        </Select>
                        {filterType !== "all" && (
                          <Input
                            type="date"
                            value={format(selectedDate, "yyyy-MM-dd")}
                            onChange={(e) => setSelectedDate(new Date(e.target.value))}
                            className="w-[11.5rem]"
                          />
                        )}
                      </div>
        
                      <div className="md:col-span-2 relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <Input
                          placeholder="Search by word/tag…"
                          className="pl-9"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
        
                      <div className="md:col-span-3">
                        <Badge variant="outline" className="bg-white" style={{ borderColor: `${PURPLE}66`, color: PURPLE }}>
                          {filteredEntries.length} result{filteredEntries.length !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

          {/* ENTRIES LIST (full width under the toolbar) */}
            <div className="space-y-6">
              {filteredEntries.length === 0 ? (
                <Card className="bg-white text-center py-16"
                  style={{ borderColor: `${PURPLE}33`, borderWidth: 2 }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = PURPLE)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = `${PURPLE}33`)}>
                  <CardContent>
                    <CalendarIcon className="w-10 h-10 mx-auto mb-3" style={{ color: PURPLE }} />
                    <p className="text-gray-600">No entries found</p>
                  </CardContent>
                </Card>
              ) : (
                filteredEntries.map((entry) => (
                  <Card key={entry.id} className="bg-white transition"
                    style={{ borderColor: `${PURPLE}33`, borderWidth: 2 }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = PURPLE)}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = `${PURPLE}33`)}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        {/* LEFT: date, mood, title */}
                        <div className="flex flex-col">
                          <div className="flex items-center gap-3 mb-2">
                            <CalendarIcon className="w-4 h-4" style={{ color: PURPLE }} />
                            <span className="text-sm text-gray-600">
                              {format(parseISO(entry.date), "EEEE, MMMM d, yyyy")}
                            </span>
                            <Badge className={`text-xs ${moodColors[entry.mood]}`}>
                              {moodEmojis[entry.mood]} {entry.mood}
                            </Badge>
                          </div>
                          <CardTitle className="text-2xl">{entry.title}</CardTitle>
                        </div>

                        {/* RIGHT: Edit + Delete (tight gap) */}
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setEditingEntry(entry)} aria-label="Edit entry">
                            <Edit3 className="w-4 h-4" />
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" aria-label="Delete entry">
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  “{entry.title}” dated {format(parseISO(entry.date), "MMM d, yyyy")} will be permanently removed.
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteEntry(entry.id)} className="bg-red-600 hover:bg-red-700">
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <p className="text-[15px] leading-8 text-slate-800 mb-4">{entry.content}</p>
                      <div className="flex flex-wrap gap-2">
                        {entry.tags.map((t, i) => (
                          <Badge key={i} variant="outline" className="text-xs bg-white"
                            style={{ borderColor: `${PURPLE}66`, color: PURPLE }}>
                            #{t}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
      </section>

      {/* CTA to overview */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <Card className="bg-white" style={{ backgroundColor: "#FCD4D2", borderColor: `${PURPLE}33`, borderWidth: 2 }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = PURPLE)}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = `${PURPLE}33`)}>
            <CardHeader>
              <CardTitle>Want more insights & suggestions?</CardTitle>
              <CardDescription className="font-semibold">Visit the Mental Health Overview for exercises, resources, and trends.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="gap-2 bg-white"
                style={{ borderColor: PURPLE, color: PURPLE, borderWidth: 2 }}
                onClick={() => (window.location.href = "/MentalHealthOverview")}
              >
                Go to Mental Health Overview
                <ExternalLink className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Edit Entry Dialog */}
      {editingEntry && (
        <Dialog open={!!editingEntry} onOpenChange={() => setEditingEntry(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Journal Entry</DialogTitle>
              <DialogDescription>Update your thoughts and reflections</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                value={editingEntry.title}
                onChange={(e) => setEditingEntry((prev) => (prev ? { ...prev, title: e.target.value } : prev))}
              />
              <Textarea
                rows={8}
                value={editingEntry.content}
                onChange={(e) => setEditingEntry((prev) => (prev ? { ...prev, content: e.target.value } : prev))}
              />
              <div className="flex flex-wrap gap-3">
                <Select
                  value={editingEntry.mood}
                  onValueChange={(v: Mood) => setEditingEntry((prev) => (prev ? { ...prev, mood: v } : prev))}
                >
                  <SelectTrigger className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="great">😊 Great</SelectItem>
                    <SelectItem value="good">🙂 Good</SelectItem>
                    <SelectItem value="okay">😐 Okay</SelectItem>
                    <SelectItem value="low">😕 Low</SelectItem>
                    <SelectItem value="difficult">😔 Difficult</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={editingEntry.tags.join(", ")}
                  onChange={(e) =>
                    setEditingEntry((prev) =>
                      prev ? { ...prev, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) } : prev
                    )
                  }
                  placeholder="Tags (comma separated)"
                  className="flex-1"
                />
              </div>
              <Button onClick={handleUpdateEntry} className="w-full" style={{ backgroundColor: PURPLE, color: "#fff" }}>
                Update Entry
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default JournalPage;
