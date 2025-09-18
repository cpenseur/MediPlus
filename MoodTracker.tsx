import React, { useEffect, useMemo, useState } from "react";
import {
  STORAGE_KEYS,
  readEntries,
  writeEntries,
  seedStreakFrom,
  uniqueDaySet,
  computeStreak,
} from "@/utils/wellnessStorage";
import {
  Calendar,
  Clock,
  TrendingUp,
  Brain,
  Heart,
  BarChart3,
  ExternalLink,
  HelpCircle,
  Sparkles,
  Target,
  Plus,
  Trophy,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { format, subDays, isWithinInterval, startOfWeek, endOfWeek, parseISO } from "date-fns";
import moodHeroImage from "@/assets/moodtracking.svg";

const SEED_KEY = "mood_seed_version";
const CURRENT_SEED_VERSION = "oct-judging-v1";

// Lightweight local note pool (safe for client)
const NOTE_POOL = [
  "Short walk helped",
  "Work was heavy but manageable",
  "Coffee chat lifted mood",
  "Music break eased tension",
  "Slept late, felt groggy",
  "Breathing exercise calmed me",
];

const PURPLE = "#717EF3";

import { addDays, differenceInCalendarDays } from "date-fns";

function seedDailyMoodRange(startISO: string, includeToday = true) {
  // Use your existing utils to read/write
  const existing = readEntries(STORAGE_KEYS.mood) as any[];

  const start = new Date(startISO + "T00:00:00");
  const today = new Date();
  const end = includeToday ? today : addDays(today, -1);
  const total = differenceInCalendarDays(end, start) + 1;
  if (total <= 0) return;

  // Build a map keyed by date so each day gets at least one entry
  const byDate = new Map<string, any[]>();
  for (const e of existing) {
    if (!byDate.has(e.date)) byDate.set(e.date, []);
    byDate.get(e.date)!.push(e);
  }

  const ids = EMOTIONS.map(e => e.id);

  const next = [...existing];
  for (let i = 0; i < total; i++) {
    const d = addDays(start, i);
    const iso = format(d, "yyyy-MM-dd");

    // If there’s already at least one entry that day, skip making another
    if (byDate.get(iso)?.length) continue;

    // Random but stable-ish: vary emotion + time
    const emotion = ids[Math.floor(Math.random() * ids.length)];
    const hour = 8 + Math.floor(Math.random() * 10); // 08:00–17:59
    const minute = Math.floor(Math.random() * 60);
    const time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

    next.push({
      id: `m-${iso}-${time}`,
      emotion,
      date: iso,
      time,
      notes: NOTE_POOL[Math.floor(Math.random() * NOTE_POOL.length)],
      triggers: Math.random() < 0.5 ? ["work", "sleep", "exercise"].filter(() => Math.random() < 0.5) : undefined,
    });
  }

  // newest first
  next.sort(
    (a, b) =>
      new Date(`${b.date} ${b.time}`).getTime() -
      new Date(`${a.date} ${a.time}`).getTime()
  );

  writeEntries(STORAGE_KEYS.mood, next);
}


/* ===========================
   AI (client-side demo)
   ⚠️ For dev only — don’t ship secrets in client.
=========================== */
const AI_ENDPOINT = "https://api.sea-lion.ai/v1/chat/completions";
const AI_MODEL = "aisingapore/Llama-SEA-LION-v3-70B-IT";
// Put your key here for local testing only:
const AI_KEY = "sk-TSbEBjqQN9HKMcutANxL5A";

/* ===========================
   Types / Catalog
=========================== */
type EmotionType =
  | "ecstatic" | "joyful" | "content" | "peaceful" | "optimistic" | "grateful"
  | "neutral" | "bored" | "tired"
  | "stressed" | "anxious" | "worried" | "frustrated" | "angry" | "sad" | "lonely" | "overwhelmed" | "hopeless";

interface EmotionMeta {
  id: EmotionType;
  name: string;
  emoji: string;
  intensity: number; // 1–10
  category: "positive" | "neutral" | "negative";
}

const EMOTIONS: EmotionMeta[] = [
  { id: "ecstatic", name: "Ecstatic", emoji: "🤩", intensity: 10, category: "positive" },
  { id: "joyful", name: "Joyful", emoji: "😄", intensity: 9, category: "positive" },
  { id: "content", name: "Content", emoji: "😊", intensity: 8, category: "positive" },
  { id: "peaceful", name: "Peaceful", emoji: "😌", intensity: 7, category: "positive" },
  { id: "optimistic", name: "Optimistic", emoji: "🙂", intensity: 7, category: "positive" },
  { id: "grateful", name: "Grateful", emoji: "🙏", intensity: 8, category: "positive" },
  { id: "neutral", name: "Neutral", emoji: "😐", intensity: 5, category: "neutral" },
  { id: "bored", name: "Bored", emoji: "😑", intensity: 4, category: "neutral" },
  { id: "tired", name: "Tired", emoji: "😴", intensity: 4, category: "neutral" },
  { id: "stressed", name: "Stressed", emoji: "😰", intensity: 3, category: "negative" },
  { id: "anxious", name: "Anxious", emoji: "😟", intensity: 2, category: "negative" },
  { id: "worried", name: "Worried", emoji: "😕", intensity: 3, category: "negative" },
  { id: "frustrated", name: "Frustrated", emoji: "😤", intensity: 2, category: "negative" },
  { id: "angry", name: "Angry", emoji: "😡", intensity: 1, category: "negative" },
  { id: "sad", name: "Sad", emoji: "😢", intensity: 2, category: "negative" },
  { id: "lonely", name: "Lonely", emoji: "😔", intensity: 2, category: "negative" },
  { id: "overwhelmed", name: "Overwhelmed", emoji: "😵", intensity: 1, category: "negative" },
  { id: "hopeless", name: "Hopeless", emoji: "😞", intensity: 1, category: "negative" },
];

interface MoodEntry {
  id: string;
  emotion: EmotionType;
  date: string;   // yyyy-MM-dd
  time: string;   // HH:mm
  notes?: string;
  triggers?: string[];
}

/* ===========================
   Seed v1 (reseed when you change this)
=========================== */
const MOOD_SEED_VERSION = "mood-seed-v1";

/* ===========================
   Component
=========================== */
const MoodTrackingPage: React.FC = () => {
  // Load from localStorage after (possible) seeding
  const [entries, setEntries] = useState<MoodEntry[]>([]);

  // Seed when version changes or storage empty
  useEffect(() => {
    const seededVersion = localStorage.getItem(SEED_KEY);
    const alreadyHasData = readEntries(STORAGE_KEYS.mood).length > 0;

    if (seededVersion !== CURRENT_SEED_VERSION || !alreadyHasData) {
      // (Optional) wipe mood data to force a clean seed
      localStorage.removeItem(STORAGE_KEYS.mood);

      // Seed from Sep 1 to *today* (so October has entries)
      seedDailyMoodRange("2025-09-01", true);

      localStorage.setItem(SEED_KEY, CURRENT_SEED_VERSION);
    }

    // Load into state
    setEntries(readEntries(STORAGE_KEYS.mood) as MoodEntry[]);
  }, []);

  // Persist whenever entries change (for new logs you add via UI)
  useEffect(() => {
    writeEntries(STORAGE_KEYS.mood, entries);
  }, [entries]);



  


  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | null>(null);
  const [logNotes, setLogNotes] = useState("");

  // Top analytics controls
  const [viewMode, setViewMode] = useState<"daily" | "weekly" | "monthly">("weekly");

  // Entries “Browse” filters
  const [entriesFilterType, setEntriesFilterType] = useState<"all" | "day" | "month">("all");
  const [entriesFilterDay, setEntriesFilterDay] = useState<string>("");
  const [entriesFilterMonth, setEntriesFilterMonth] = useState<string>("");

  // AI summary (based on entries)
  const [aiSummary, setAiSummary] = useState("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Assessment (optional helper)
  const [showAssessment, setShowAssessment] = useState(false);
  const [assessmentAnswers, setAssessmentAnswers] = useState<number[]>([]);
  const assessmentQuestions = [
    {
      question: "How has your energy level been lately?",
      options: [
        { text: "Very high, I feel energetic", emotions: ["ecstatic", "joyful"] },
        { text: "Good, steady energy", emotions: ["content", "optimistic"] },
        { text: "Average, ups and downs", emotions: ["neutral", "bored"] },
        { text: "Low, drained", emotions: ["tired", "sad"] },
        { text: "Very low, exhausted", emotions: ["overwhelmed", "hopeless"] },
      ],
    },
    {
      question: "How would you describe your stress levels?",
      options: [
        { text: "Very relaxed and calm", emotions: ["peaceful", "content"] },
        { text: "Manageable stress", emotions: ["neutral", "optimistic"] },
        { text: "Moderate stress", emotions: ["worried", "tired"] },
        { text: "High stress", emotions: ["stressed", "anxious"] },
        { text: "Overwhelming stress", emotions: ["overwhelmed", "frustrated"] },
      ],
    },
    {
      question: "How satisfied do you feel with your life right now?",
      options: [
        { text: "Extremely satisfied", emotions: ["ecstatic", "grateful"] },
        { text: "Very satisfied", emotions: ["joyful", "content"] },
        { text: "Somewhat satisfied", emotions: ["neutral", "optimistic"] },
        { text: "Not very satisfied", emotions: ["bored", "worried"] },
        { text: "Very dissatisfied", emotions: ["sad", "hopeless"] },
      ],
    },
  ];

  // ---------- Deterministic seed for Sep 01 → Sep 16 (no entry today) ----------
  const seedSep1to16 = (): MoodEntry[] => {
    // Adjust to your current year
    const year = new Date().getFullYear();
    const start = new Date(year, 8, 1); // Sep 1
    const days = 17;

    const ids = EMOTIONS.map(e => e.id);
    const pick = (i: number) => ids[i % ids.length] as EmotionType;

    const arr: MoodEntry[] = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const date = format(d, "yyyy-MM-dd");
      const time = `0${8 + (i % 3)}:0${i % 6}`.slice(-5);
      arr.push({
        id: `seed-${date}-${time}`,
        emotion: pick(i),
        date,
        time,
        notes: i % 2 ? "Short walk helped" : "Work was heavy but manageable",
      });
    }
    // Newest first
    return arr.sort(
      (a, b) =>
        new Date(`${b.date} ${b.time}`).getTime() -
        new Date(`${a.date} ${a.time}`).getTime()
    );
  };


    // -------------------- STREAK / WEEK / BADGES --------------------
    const uniqueDaySet = useMemo(() => {
      const s = new Set<string>();
      for (const e of entries) s.add(e.date);
      return s;
    }, [entries]);

    const computeStreak = (upTo: Date) => {
      let streak = 0;
      let cur = new Date(upTo);
      while (uniqueDaySet.has(format(cur, "yyyy-MM-dd"))) {
        streak += 1;
        cur.setDate(cur.getDate() - 1);
      }
      return streak;
    };

    const streakToday = useMemo(() => computeStreak(new Date()), [uniqueDaySet]);
    const streakYesterday = useMemo(() => computeStreak(subDays(new Date(), 1)), [uniqueDaySet]);

    const streakIncludesToday = streakToday > 0;
    const streak = Math.max(streakToday, streakYesterday); // shows 16 for Sep1–16 with no entry today

    const weeklyProgress = useMemo(() => {
      const start = startOfWeek(new Date());
      const end = endOfWeek(new Date());
      const daysWithEntry = new Set(
        entries
          .filter((e) => isWithinInterval(parseISO(e.date), { start, end }))
          .map((e) => e.date)
      );
      const count = daysWithEntry.size;
      const total = 7;
      return { count, total, pct: Math.round((count / total) * 100) };
    }, [entries]);

    const badges = useMemo(() => {
      const earned: string[] = [];
      if (entries.length >= 1) earned.push("Mood Starter");
      if (streak >= 7) earned.push("Consistency Builder (7-day streak)");
      // 3 consecutive negative logs (by entry, not by day)
      const negatives = new Set(
        EMOTIONS.filter((e) => e.category === "negative").map((e) => e.id)
      );
      for (let i = 0; i <= entries.length - 3; i++) {
        if (negatives.has(entries[i].emotion) &&
            negatives.has(entries[i + 1].emotion) &&
            negatives.has(entries[i + 2].emotion)) {
          earned.push("Resilience");
          break;
        }
      }
      if (entries.length >= 10) earned.push("Mood Logs ×10");
      return earned;
    }, [entries, streak]);

    useEffect(() => {
      if (streak !== undefined) {
        localStorage.setItem("mh:mood:streak", JSON.stringify(streak));
      }
      localStorage.setItem("mh:mood:badges", JSON.stringify(badges));
    }, [streak, badges]);

  /* ---------- Charts / Analytics computed strictly from entries ---------- */
  const chartData = useMemo(() => {
    // group by label depending on view
    const grouped = entries.reduce((acc, e) => {
      const label =
        viewMode === "daily"
          ? `${e.date} ${e.time}`
          : viewMode === "weekly"
          ? format(new Date(e.date), "MMM dd")
          : format(new Date(e.date), "MMM yyyy");
      if (!acc[label]) acc[label] = { date: label, total: 0, count: 0 };
      const meta = EMOTIONS.find(x => x.id === e.emotion);
      if (meta) {
        acc[label].total += meta.intensity;
        acc[label].count += 1;
      }
      return acc;
    }, {} as Record<string, { date: string; total: number; count: number }>);

    return Object.values(grouped)
      .map(g => ({ date: g.date, average: Math.round((g.total / g.count) * 10) / 10 }))
      .slice(0, 24)
      .reverse();
  }, [entries, viewMode]);

  const past7Dist = useMemo(() => {
    const sevenAgo = format(subDays(new Date(), 7), "yyyy-MM-dd");
    const recent = entries.filter(e => e.date >= sevenAgo);
    const counts = recent.reduce((acc, e) => {
      acc[e.emotion] = (acc[e.emotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return EMOTIONS
      .map(m => ({ id: m.id, name: m.name, emoji: m.emoji, value: counts[m.id] || 0 }))
      .filter(x => x.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [entries]);

  const dominant7 = past7Dist[0]?.name;

  /* ---------- Entries filter (Browse) ---------- */
  const filteredEntries = useMemo(() => {
    if (entriesFilterType === "all") return entries;
    if (entriesFilterType === "day" && entriesFilterDay) return entries.filter(e => e.date === entriesFilterDay);
    if (entriesFilterType === "month" && entriesFilterMonth) return entries.filter(e => e.date.startsWith(entriesFilterMonth));
    return entries;
  }, [entries, entriesFilterType, entriesFilterDay, entriesFilterMonth]);

  /* ---------- Logging ---------- */
  const logMood = () => {
    if (!selectedEmotion) return;
    const now = new Date();
    const newEntry: MoodEntry = {
      id: `m-${Date.now()}`,
      emotion: selectedEmotion,
      date: format(now, "yyyy-MM-dd"),
      time: format(now, "HH:mm"),
      notes: logNotes || undefined,
    };
    setEntries(prev => [newEntry, ...prev]);
    setSelectedEmotion(null);
    setLogNotes("");
  };

  /* ---------- AI Summary (from entries) ---------- */
  const generateAISummary = async () => {
    setIsGeneratingAI(true);
    try {
      const recent = entries.slice(0, 40);
      const pos = recent.filter(e => {
        const cat = EMOTIONS.find(x => x.id === e.emotion)?.category;
        return cat === "positive";
      }).length;

      // Create a compact, privacy-light prompt (no raw notes)
      const histogram = EMOTIONS.reduce((acc, m) => {
        acc[m.id] = recent.filter(e => e.emotion === m.id).length;
        return acc;
      }, {} as Record<string, number>);

      const system = {
        role: "system",
        content:
          "You are a supportive mental health assistant. Analyze trends from provided mood counts. Offer 3-4 short, kind suggestions. Keep it plain text only.",
      };
      const user = {
        role: "user",
        content:
          `Recent mood counts (last ${recent.length} logs):\n` +
          Object.entries(histogram).map(([k, v]) => `${k}: ${v}`).join(", ") +
          `\nPositive ratio: ${Math.round((pos / Math.max(1, recent.length)) * 100)}%.\nReturn a short, encouraging analysis in 4-6 lines.`,
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
          temperature: 0.3,
          max_completion_tokens: 180,
          messages: [system, user],
        }),
      });

      const ok = res.ok ? await res.json() : null;
      const text =
        ok?.choices?.[0]?.message?.content?.trim() ||
        // Fallback local summary:
        [
          `Mood Analysis Summary`,
          ``,
          `Recent logs: ${recent.length}`,
          `Top emotion: ${dominant7 || "Neutral"}`,
          `Positive ratio: ${Math.round((pos / Math.max(1, recent.length)) * 100)}%`,
          `Trend: ${pos > recent.length / 2 ? "Generally positive" : "Mixed—prioritize gentleness and rest"}`,
          ``,
          `Suggestions:`,
          `1) Keep daily logs to strengthen insight`,
          `2) Note triggers when emotions feel strong`,
          `3) Pair with journaling for context`,
          `4) Use short breaths or grounding on tough days`,
        ].join("\n");

      setAiSummary(text);
    } catch {
      // Silent fallback (local summary above already covers)
      setAiSummary("We couldn’t reach AI right now. Try again later. Meanwhile, keep logging and caring for yourself.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  /* ===========================
     UI
  =========================== */
    return (
      <div className="min-h-screen bg-[#FFF5EC]">
        {/* HERO */}
        <section className="relative pt-2 pb-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1">
                <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-black mb-4">
                  Mood
                  <span className="block bg-gradient-to-r from-primary via-wellness to-secondary bg-clip-text text-transparent">
                    Tracking
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed max-w-2xl">
                  Track emotions, spot patterns, and celebrate progress—gently and clearly.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  {/* Log Mood */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="lg"
                        className="text-lg px-8 py-4 shadow transition"
                        style={{ backgroundColor: PURPLE, color: "#fff" }}
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Log Mood Now
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>How are you feeling right now?</DialogTitle>
                        <DialogDescription>Select the closest match</DialogDescription>
                      </DialogHeader>

                      <div className="space-y-6">
                        {(["positive", "neutral", "negative"] as const).map(cat => (
                          <div key={cat}>
                            <h3 className="text-lg font-semibold mb-3 capitalize" style={{ color: PURPLE }}>
                              {cat === "positive" ? "Uplifting" : cat === "neutral" ? "Steady" : "Challenging"} Emotions
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {EMOTIONS.filter(e => e.category === cat).map(e => (
                                <Button
                                  key={e.id}
                                  variant={selectedEmotion === e.id ? "default" : "outline"}
                                  className="p-4 h-auto flex flex-col gap-2 transition-all"
                                  style={{
                                    backgroundColor: selectedEmotion === e.id ? PURPLE : "white",
                                    borderColor: PURPLE,
                                    color: selectedEmotion === e.id ? "white" : "#111827",
                                  }}
                                  onClick={() => setSelectedEmotion(e.id)}
                                >
                                  <span className="text-2xl">{e.emoji}</span>
                                  <span className="text-sm font-medium">{e.name}</span>
                                </Button>
                              ))}
                            </div>
                          </div>
                        ))}

                        <div>
                          <Label htmlFor="notes" className="text-sm font-medium">Notes (optional)</Label>
                          <Textarea
                            id="notes"
                            placeholder="What happened? Any context…"
                            value={logNotes}
                            onChange={(e) => setLogNotes(e.target.value)}
                            rows={3}
                            className="mt-2"
                          />
                        </div>

                        <div className="flex gap-3">
                          <Button
                            onClick={logMood}
                            disabled={!selectedEmotion}
                            className="flex-1"
                            style={{ backgroundColor: PURPLE, color: "#fff" }}
                          >
                            Log Mood
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setShowAssessment(true)}
                            style={{ borderColor: PURPLE, color: PURPLE }}
                          >
                            <HelpCircle className="w-4 h-4 mr-2" />
                            Need Help?
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-4 bg-white"
                    style={{ borderColor: PURPLE, color: PURPLE, borderWidth: 2 }}
                    onClick={() => document.getElementById("analytics")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    <BarChart3 className="w-5 h-5 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </div>

              <div className="flex-1">
                <img src={moodHeroImage} alt="Mood tracking illustration" className="w-full h-auto object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* ======= STATS ROW: Streak / This Week / Badges ======= */}
        <section className="pb-1 -mt-2" id="analytics">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Streak */}
            <Card className="bg-white" style={{ backgroundColor: "#E8EAFF", borderColor: `${PURPLE}33`, borderWidth: 2 }}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" style={{ color: PURPLE }} />
                  <CardTitle className="text-lg">Your Streak</CardTitle>
                </div>
                <CardDescription className="font-bold">Consecutive days you’ve logged</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold" style={{ color: PURPLE }}>
                  {streak} day{streak === 1 ? "" : "s"}
                </div>
                <p className="text-sm font-bold text-gray-600 mt-1">
                  Keep going—tiny steps add up 🌱
                </p>
              </CardContent>
            </Card>

            {/* This Week */}
            <Card className="bg-white" style={{ backgroundColor: "#FCD4D2", borderColor: `${PURPLE}33`, borderWidth: 2 }}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" style={{ color: PURPLE }} />
                  <CardTitle className="text-lg">This Week</CardTitle>
                </div>
                <CardDescription className="font-bold">{weeklyProgress.count} / {weeklyProgress.total} days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full"
                    style={{
                      width: `${weeklyProgress.pct}%`,
                      backgroundColor: PURPLE,
                      transition: "width 300ms ease",
                    }}
                  />
                </div>
                <p className="text-sm font-bold text-gray-600 mt-2">Aim for 4–5 days as a solid baseline.</p>
              </CardContent>
            </Card>

            {/* Badges */}
            <Card className="bg-white" style={{ backgroundColor: "#F4E7E1", borderColor: `${PURPLE}33`, borderWidth: 2 }}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" style={{ color: PURPLE }} />
                  <CardTitle className="text-lg">Badges</CardTitle>
                </div>
                <CardDescription className="font-bold">Earn badges as you log your mood - small rewards for showing up.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {badges.length === 0 ? (
                  <span className="text-sm text-gray-600">Log your mood to earn “First Check-in”.</span>
                ) : (
                  badges.map((b, i) => (
                    <Badge key={i} className="text-xs bg-white" variant="outline" style={{ borderColor: `${PURPLE}66`, color: PURPLE }}>
                      {b}
                    </Badge>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ======= ANALYTICS: Trend + Past 7 breakdown ======= */}
        <section className="py-6">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Trend */}
            <Card className="lg:col-span-2 bg-white border-2" style={{ borderColor: `${PURPLE}33` }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" style={{ color: PURPLE }} />
                    Mood Trends
                  </CardTitle>
                  <Select value={viewMode} onValueChange={(v: any) => setViewMode(v)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <CardDescription>Average mood intensity over time (1–10)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 p-3 rounded-xl bg-purple-50 border">
                  <span className="text-sm text-purple-700">
                    {past7Dist.length ? `This week you felt mostly ${dominant7?.toLowerCase()}.` : `Start logging to see your patterns.`}
                  </span>
                </div>

                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                    <defs>
                      <linearGradient id="moodGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#3B82F6" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.6} />
                    <XAxis dataKey="date" fontSize={11} tick={{ fill: "#6b7280" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[1, 10]} fontSize={11} tick={{ fill: "#6b7280" }} axisLine={false} tickLine={false} />
                    {/* @ts-ignore */}
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (!active || !payload?.length) return null;
                        const v = payload[0].value as number;
                        const emoji = v >= 8 ? "😊" : v >= 6 ? "🙂" : v >= 4 ? "😐" : "😔";
                        return (
                          <div className="rounded-xl bg-white p-3 shadow-lg border">
                            <div className="text-sm font-semibold text-purple-700 mb-1">{label}</div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{emoji}</span>
                              <div className="text-sm text-gray-700">Mood Score: <b>{v}/10</b></div>
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="average"
                      stroke="url(#moodGradient)"
                      strokeWidth={4}
                      dot={{ fill: "white", stroke: PURPLE, strokeWidth: 3, r: 5 }}
                      activeDot={{ r: 7, fill: PURPLE, stroke: "white", strokeWidth: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Past 7 days */}
            <Card className="bg-white border-2" style={{ borderColor: `${PURPLE}33` }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" style={{ color: PURPLE }} />
                  Past 7 Days
                </CardTitle>
                <CardDescription>How often you felt each emotion</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {past7Dist.length === 0 && (
                    <div className="text-center py-8 text-sm text-gray-500">
                      No emotions logged in the past 7 days.
                    </div>
                  )}

                  {past7Dist.slice(0, 12).map((item) => (
                    <div key={item.id} className="p-3 rounded-lg border flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{item.emoji}</span>
                        <span className="text-sm font-semibold text-gray-700">{item.name}</span>
                      </div>
                      <Badge variant="outline" style={{ borderColor: PURPLE, color: PURPLE, background: "#fff" }}>
                        {item.value}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>
        </section>

        {/* ======= AI INSIGHTS ======= */}
        <section className="py-6">
          <div className="max-w-7xl mx-auto px-4">
            <Card className="bg-white border-2" style={{ backgroundColor: "#CEE2E0", borderColor: `${PURPLE}33` }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" style={{ color: PURPLE }} />
                  AI Mood Insights
                </CardTitle>
                <CardDescription>Personalized analysis based on your entries</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={generateAISummary}
                  disabled={isGeneratingAI}
                  style={{ backgroundColor: PURPLE, color: "#fff" }}
                >
                  {isGeneratingAI ? "Analyzing..." : "Generate AI Summary"}
                </Button>

                {aiSummary && (
                  <div className="p-6 rounded-xl shadow-md border-2 bg-white" style={{ borderColor: PURPLE }}>
                    <pre className="whitespace-pre-wrap text-gray-700 leading-7">{aiSummary}</pre>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </section>

        {/* ======= PROGRAM CARDS ======= */}
        <section className="py-6">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-400 via-violet-500 to-indigo-600 p-1">
              <div className="relative h-full rounded-3xl bg-white/95 p-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-400 to-violet-500 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                    Mental Health Overview
                  </h3>
                </div>
                <p className="text-gray-600 mt-3">
                  Exercises, resources, and insights to support your well-being.
                </p>
                <Button
                  className="w-full mt-6 bg-gradient-to-r from-purple-500 to-violet-600 text-white"
                  onClick={() => (window.location.href = "/MentalHealthOverview")}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Explore Wellness Hub
                </Button>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-400 via-violet-500 to-indigo-600 p-1">
              <div className="relative h-full rounded-3xl bg-white/95 p-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-400 to-violet-500 flex items-center justify-center">
                    <HelpCircle className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                    Mood Assessment
                  </h3>
                </div>
                <p className="text-gray-600 mt-3">
                  Quick AI-assisted check-in when you need a nudge.
                </p>
                <Button
                  variant="outline"
                  className="w-full mt-6 border-2 border-purple-200 text-purple-600 hover:bg-purple-50"
                  onClick={() => setShowAssessment(true)}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Start a Quick Assessment
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ======= BROWSE & LOGS ======= */}
        <section className="py-6">
          <div className="max-w-7xl mx-auto px-4">
            <Card className="bg-white border-2" style={{ borderColor: `${PURPLE}33` }}>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" style={{ color: PURPLE }} />
                      Browse Mood Logs
                    </CardTitle>
                    <CardDescription>Filter by day or month.</CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                    <Select value={entriesFilterType} onValueChange={(v: any) => setEntriesFilterType(v)}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="day">Day</SelectItem>
                        <SelectItem value="month">Month</SelectItem>
                      </SelectContent>
                    </Select>

                    {entriesFilterType === "day" && (
                      <input
                        type="date"
                        value={entriesFilterDay}
                        onChange={(e) => setEntriesFilterDay(e.target.value)}
                        className="h-10 px-3 rounded-md border"
                        style={{ borderColor: `${PURPLE}33` }}
                      />
                    )}

                    {entriesFilterType === "month" && (
                      <input
                        type="month"
                        value={entriesFilterMonth}
                        onChange={(e) => setEntriesFilterMonth(e.target.value)}
                        className="h-10 px-3 rounded-md border"
                        style={{ borderColor: `${PURPLE}33` }}
                      />
                    )}

                    <Badge variant="outline" style={{ borderColor: PURPLE, color: PURPLE }}>
                      {filteredEntries.length} entries
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {filteredEntries.map((entry) => {
                    const meta = EMOTIONS.find((e) => e.id === entry.emotion);
                    return (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-3 rounded-lg border transition"
                        style={{ borderColor: `${PURPLE}33`, backgroundColor: "#fff" }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{meta?.emoji}</span>
                          <div>
                            <p className="font-medium text-gray-900">{meta?.name}</p>
                            <p className="text-sm text-gray-600">
                              {format(new Date(entry.date + "T00:00:00"), "EEEE, MMM d, yyyy")} · {entry.time}
                            </p>
                          </div>
                        </div>
                        {entry.notes && <p className="text-sm text-gray-600 max-w-[40ch] truncate">{entry.notes}</p>}
                      </div>
                    );
                  })}
                  {filteredEntries.length === 0 && (
                    <div className="text-center py-10 text-gray-500">No logs found for this filter.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>



        {/* Assessment Dialog */}
        <Dialog open={showAssessment} onOpenChange={setShowAssessment}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Mood Assessment</DialogTitle>
              <DialogDescription>Answer a few questions—get an estimated mood</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {assessmentQuestions.map((q, qIndex) => (
                <div key={qIndex}>
                  <h3 className="font-medium mb-3">{q.question}</h3>
                  <RadioGroup
                    value={
                      typeof assessmentAnswers[qIndex] === "number"
                        ? String(assessmentAnswers[qIndex])
                        : undefined
                    }
                    onValueChange={(v) => {
                      const next = [...assessmentAnswers];
                      next[qIndex] = parseInt(v);
                      setAssessmentAnswers(next);
                    }}
                  >
                    {q.options.map((opt, oIndex) => (
                      <div key={oIndex} className="flex items-center space-x-2">
                        <RadioGroupItem value={String(oIndex)} id={`q${qIndex}o${oIndex}`} />
                        <Label htmlFor={`q${qIndex}o${oIndex}`} className="text-sm">
                          {opt.text}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}

              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  style={{ backgroundColor: PURPLE, color: "#fff" }}
                  disabled={assessmentAnswers.length !== assessmentQuestions.length}
                  onClick={() => {
                    // simple heuristic: pick the first suggested label set’s first option
                    const pool: EmotionType[] = [];
                    assessmentAnswers.forEach((ansIdx, qIdx) => {
                      const opt = assessmentQuestions[qIdx].options[ansIdx];
                      if (opt) pool.push(...(opt.emotions as EmotionType[]));
                    });
                    if (pool.length) setSelectedEmotion(pool[0]);
                    setShowAssessment(false);
                  }}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Suggest Mood
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  style={{ borderColor: PURPLE, color: PURPLE }}
                  onClick={() => (window.location.href = "/mindfulbot")}
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Chat with Mindful Bot
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  };


export default MoodTrackingPage;
