import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  TrendingUp,
  Heart,
  Target,
  Lightbulb,
  Activity,
  Sparkles,
  BookOpen,
  Users,
  Wind,
  Phone,
  CheckCircle,
  AlertTriangle,
  Star,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { format, subDays, startOfWeek } from "date-fns";
import { STORAGE_KEYS, readEntries } from "@/utils/wellnessStorage";
const LEGACY_JOURNAL_KEY = "mh:journal"; // from JournalPage

// If this import errors, your alias/path is wrong. Use a relative path from this file to src/assets.
import overviewHeroImage from "../assets/Statistics-bro.svg";

const PURPLE = "#717EF3";

function normalizeAI(text: string) {
  if (!text) return "";
  let t = text.replace(/\r/g, "");

  // remove bold/italic markers
  t = t.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1");

  // convert list markers to a single style
  t = t.replace(/^\s*[*\-•]\s+/gm, "• ");

  // remove heading #'s and extra spaces
  t = t.replace(/^[ \t]*#{1,6}[ \t]*/gm, "");
  t = t.split("\n").map(s => s.trim()).filter(Boolean).join("\n");

  return t;
}

function toHyphenBullets(block: string) {
  if (!block) return "";
  const lines = block
    .split(/\n+/)
    .map(l => l.replace(/^\s*(?:[-*•]|(\d+)[\.)])\s*/g, "").trim())
    .filter(Boolean);
  return lines.map(l => `- ${l}`).join("\n");
}

/* ---------------- Navigation Helper ---------------- */
function goToResourceSection(
  navigate: ReturnType<typeof useNavigate>,
  resourceKey: string
) {
  const resource = RESOURCE_MAP[resourceKey];

  if (!resource) return;

  // If it's a condition → navigate to its page
  if (
    ["anxiety", "depression", "panic", "stress", "bipolar", "ptsd"].includes(resourceKey)
  ) {
    navigate(`/${resourceKey}`);
    return;
  }

  // Else → go to resources page + scroll to section
  navigate("/resources");
  if (resource.section) {
    setTimeout(() => {
      const el = document.getElementById(resource.section!);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
  }
}


const RESOURCE_MAP: Record<string, { title: string; desc: string; section?: string }> = {
  breathing: { title: "Breathing Exercises", desc: "Guided exercises to calm and relax your body.", section: "breathing" },
  crisis: { title: "Crisis Support Hotlines", desc: "24/7 hotlines to get immediate support.", section: "crisis" },
};




function loadMood(): MoodEntry[] {
  return (readEntries(STORAGE_KEYS.mood) as MoodEntry[]).slice().sort((a,b) =>
    new Date(`${b.date}T${b.time || "00:00"}`).getTime() -
    new Date(`${a.date}T${a.time || "00:00"}`).getTime()
  );
}

function loadJournalMerged(): JournalEntry[] {
  const a = (readEntries(STORAGE_KEYS.journal) as JournalEntry[]) || [];
  const b = (readEntries(LEGACY_JOURNAL_KEY) as JournalEntry[]) || [];

  // merge + dedupe by id (fallback to date+title for older seeds missing id)
  const map = new Map<string, JournalEntry>();
  [...a, ...b].forEach(e => {
    const key = e.id || `j-${e.date}-${(e.title || "").slice(0,24)}`;
    if (!map.has(key)) map.set(key, e);
  });

  return Array.from(map.values()).sort((x, y) => (x.date > y.date ? -1 : 1));
}


/* ============================= Types ============================= */

type EmotionType =
  | "ecstatic" | "joyful" | "content" | "peaceful" | "optimistic" | "grateful"
  | "neutral" | "bored" | "tired"
  | "stressed" | "anxious" | "worried" | "frustrated" | "angry" | "sad" | "lonely" | "overwhelmed" | "hopeless";

type JournalMood = "great" | "good" | "okay" | "low" | "difficult";

interface MoodEntry {
  id: string;
  emotion: EmotionType;
  date: string; // yyyy-MM-dd
  time: string; // HH:mm
  notes?: string;
  triggers?: string[];
}

interface JournalEntry {
  id: string;
  date: string; // yyyy-MM-dd
  title: string;
  content: string;
  mood: JournalMood;
  tags: string[];
}

interface Emotion {
  id: EmotionType;
  name: string;
  emoji: string;
  color: string;
  intensity: number; // 1–10
  category: "positive" | "neutral" | "negative";
}

interface AnalysisResult {
  insights: string;
  suggestions: string;
  patterns: string;
  recommendations: string;
}

/* ============================= Data ============================= */

const emotions: Emotion[] = [
  { id: "ecstatic", name: "Ecstatic", emoji: "🤩", color: "#9D4EDD", intensity: 10, category: "positive" },
  { id: "joyful", name: "Joyful", emoji: "😄", color: "#F59E0B", intensity: 9, category: "positive" },
  { id: "content", name: "Content", emoji: "😊", color: "#22C55E", intensity: 8, category: "positive" },
  { id: "peaceful", name: "Peaceful", emoji: "😌", color: "#10B981", intensity: 7, category: "positive" },
  { id: "optimistic", name: "Optimistic", emoji: "🙂", color: "#06B6D4", intensity: 7, category: "positive" },
  { id: "grateful", name: "Grateful", emoji: "🙏", color: "#3B82F6", intensity: 8, category: "positive" },
  { id: "neutral", name: "Neutral", emoji: "😐", color: "#9CA3AF", intensity: 5, category: "neutral" },
  { id: "bored", name: "Bored", emoji: "😑", color: "#A78BFA", intensity: 4, category: "neutral" },
  { id: "tired", name: "Tired", emoji: "😴", color: "#60A5FA", intensity: 4, category: "neutral" },
  { id: "stressed", name: "Stressed", emoji: "😰", color: "#F97316", intensity: 3, category: "negative" },
  { id: "anxious", name: "Anxious", emoji: "😟", color: "#F59E0B", intensity: 2, category: "negative" },
  { id: "worried", name: "Worried", emoji: "😕", color: "#FBBF24", intensity: 3, category: "negative" },
  { id: "frustrated", name: "Frustrated", emoji: "😤", color: "#EF4444", intensity: 2, category: "negative" },
  { id: "angry", name: "Angry", emoji: "😡", color: "#DC2626", intensity: 1, category: "negative" },
  { id: "sad", name: "Sad", emoji: "😢", color: "#60A5FA", intensity: 2, category: "negative" },
  { id: "lonely", name: "Lonely", emoji: "😔", color: "#64748B", intensity: 2, category: "negative" },
  { id: "overwhelmed", name: "Overwhelmed", emoji: "😵", color: "#F43F5E", intensity: 1, category: "negative" },
  { id: "hopeless", name: "Hopeless", emoji: "😞", color: "#6B7280", intensity: 1, category: "negative" },
];





/* ============================= Component ============================= */

const MentalHealthOverview: React.FC = () => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  const navigate = useNavigate();

  const [timeframe, setTimeframe] = useState<"week" | "month" | "quarter">("month");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    // initial load
    setMoodEntries(loadMood());
    setJournalEntries(loadJournalMerged());

    // react to writes from wellnessStorage
    const onUpdated = (e: any) => {
      if (e?.detail?.key === STORAGE_KEYS.mood) setMoodEntries(loadMood());
      if (e?.detail?.key === STORAGE_KEYS.journal) setJournalEntries(loadJournalMerged());
    };
    window.addEventListener("wellness:entries-updated", onUpdated as EventListener);

    // also refresh when tab/page regains focus
    const onFocus = () => {
      setMoodEntries(loadMood());
      setJournalEntries(loadJournalMerged());
    };
    window.addEventListener("visibilitychange", onFocus);
    window.addEventListener("focus", onFocus);

    return () => {
      window.removeEventListener("wellness:entries-updated", onUpdated as EventListener);
      window.removeEventListener("visibilitychange", onFocus);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const analytics = useMemo(() => {
    const now = new Date();
    let startDate: Date;

    switch (timeframe) {
      case "week":
        startDate = startOfWeek(now);
        break;
      case "month":
        startDate = subDays(now, 30);
        break;
      case "quarter":
        startDate = subDays(now, 90);
        break;
    }

    const filteredMoods = moodEntries.filter(entry => new Date(entry.date) >= startDate);
    const filteredJournals = journalEntries.filter(entry => new Date(entry.date) >= startDate);

    // Mood intensity trend (robust: keep iso + label, sort by iso)
    const moodDayBuckets = filteredMoods.reduce((acc, entry) => {
      const emotion = emotions.find(e => e.id === entry.emotion);
      if (!emotion) return acc;
      const iso = entry.date; // yyyy-MM-dd
      const idx = acc.findIndex(x => x.iso === iso);
      if (idx >= 0) {
        acc[idx].total += emotion.intensity;
        acc[idx].count += 1;
      } else {
        acc.push({ iso, total: emotion.intensity, count: 1 });
      }
      return acc;
    }, [] as { iso: string; total: number; count: number }[]);

    const moodTrend = moodDayBuckets
      .map(x => ({
        iso: x.iso,
        label: format(new Date(x.iso), "MMM dd"),
        average: Math.round((x.total / x.count) * 10) / 10,
      }))
      .sort((a, b) => new Date(a.iso).getTime() - new Date(b.iso).getTime())
      .slice(-14);

    // Emotion distribution
    const emotionCounts = filteredMoods.reduce((acc, entry) => {
      acc[entry.emotion] = (acc[entry.emotion] || 0) + 1;
      return acc;
    }, {} as Record<EmotionType, number>);

    const emotionDistribution = emotions
      .map(e => ({
        name: e.name,
        value: emotionCounts[e.id] || 0,
        color: e.color,
        category: e.category,
      }))
      .filter(e => e.value > 0)
      .sort((a, b) => b.value - a.value);

    // Category breakdown
    const categoryBreakdown = emotions.reduce((acc, emotion) => {
      const count = emotionCounts[emotion.id] || 0;
      acc[emotion.category] = (acc[emotion.category] || 0) + count;
      return acc;
    }, {} as Record<"positive" | "neutral" | "negative", number>);

    const total = (categoryBreakdown.positive || 0) + (categoryBreakdown.neutral || 0) + (categoryBreakdown.negative || 0);
    const pct = (n: number) => (total ? Math.round((n / total) * 100) : 0);

    const positivePercentage = pct(categoryBreakdown.positive || 0);
    const neutralPercentage = pct(categoryBreakdown.neutral || 0);
    const negativePercentage = pct(categoryBreakdown.negative || 0);

    // Journal mood correlation
    const journalMoodMapping: Record<JournalMood, number> = { great: 9, good: 7, okay: 5, low: 3, difficult: 2 };
    const avgJournalMood =
      filteredJournals.length > 0
        ? filteredJournals.reduce((sum, entry) => sum + journalMoodMapping[entry.mood], 0) / filteredJournals.length
        : 5;

    // Triggers
    const triggers = filteredMoods.flatMap(entry => entry.triggers || []);
    const triggerCounts = triggers.reduce((acc, trigger) => {
      acc[trigger] = (acc[trigger] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topTriggers = Object.entries(triggerCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([trigger, count]) => ({ trigger, count }));

    // Simple wellness score: positivity + closeness of journal avg to 5 (center) weighted
    const wellnessScore = Math.round((positivePercentage + (10 - Math.abs(5 - avgJournalMood)) * 10) / 2);

    return {
      moodTrend,
      emotionDistribution,
      positivePercentage,
      neutralPercentage,
      negativePercentage,
      avgJournalMood,
      topTriggers,
      totalMoodEntries: filteredMoods.length,
      totalJournalEntries: filteredJournals.length,
      wellnessScore,
    };
  }, [moodEntries, journalEntries, timeframe]);

  /* ============================= AI Analysis ============================= */

  const generateAnalysis = async () => {
    setIsAnalyzing(true);
  
    try {
      const moodSummary = analytics.emotionDistribution
        .slice(0, 5)
        .map(e => `${e.name}: ${e.value} times`)
        .join(", ");
  
      const journalSummary = journalEntries
        .slice(0, 3)
        .map(e => `${e.date}: ${e.mood} mood - ${e.title}`)
        .join("; ");
  
      const dataContext = `
  TIMEFRAME: ${timeframe}
  WELLNESS SCORE: ${analytics.wellnessScore}/100
  MOOD BREAKDOWN: ${analytics.positivePercentage}% positive, ${analytics.neutralPercentage}% neutral, ${analytics.negativePercentage}% negative
  TOP EMOTIONS: ${moodSummary}
  JOURNAL AVERAGE: ${analytics.avgJournalMood}/10
  TOP TRIGGERS: ${analytics.topTriggers.map(t => t.trigger).join(", ")}
  RECENT JOURNAL ENTRIES: ${journalSummary}
  TOTAL ENTRIES: ${analytics.totalMoodEntries} mood logs, ${analytics.totalJournalEntries} journal entries
  `.trim();
  
      // --- AI call (client-side demo only; keys in client are unsafe) ---
      const AI_ENDPOINT = "https://api.sea-lion.ai/v1/chat/completions";
      const AI_KEY =
        (import.meta as any)?.env?.VITE_SEALION_KEY ||
        "sk-Y8L5mwaeYGh4PSl2xXDbAA"; 
  
      const payload = {
        model: "aisingapore/Gemma-SEA-LION-v4-27B-IT", // safer default
        temperature: 0.7,
        max_tokens: 800, // <- use max_tokens
        messages: [
          {
            role: "system",
            content:
              "You are a compassionate mental health analyst. Return PLAIN TEXT ONLY (no markdown). Output EXACTLY four sections in this strict format:\n\nINSIGHTS:\n- item 1\n- item 2\n\nSUGGESTIONS:\n- suggestion 1\n- suggestion 2\n\nPATTERNS:\n- pattern 1\n- pattern 2\n\nRECOMMENDATIONS:\n- recommendation 1\n- recommendation 2\n\nDo not include section numbers (1,2,3,4) or repeat headings. Do not include extra text outside these sections."
          },
          { role: "user", content: `Analyze this mental health data:\n\n${dataContext}` },
        ],
      };
  
      let content = "";
      try {
        const resp = await fetch(AI_ENDPOINT, {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            Authorization: `Bearer ${AI_KEY}`,
          },
          body: JSON.stringify(payload),
        });
  
        if (!resp.ok) {
          const text = await resp.text().catch(() => "(no body)");
          console.error("[AI] HTTP error", resp.status, text);
          throw new Error(`AI ${resp.status}`);
        }
  
        const json = await resp.json();
        content = json?.choices?.[0]?.message?.content?.trim() || "";
      } catch (err) {
        // Network/CORS/Key errors land here
        console.warn("[AI] request failed, using fallback:", err);
        content = "";
      }

      content = normalizeAI(content);

      const get = (key: string) => normalizeAI(section(key) || "");

  
      // Extract sections if present; otherwise fallback copy
      const section = (key: string) => {
        const re = new RegExp(`${key}\\s*:?\\s*([\\s\\S]*?)(?=\\n\\s*[A-Z][A-Z ]{2,}:|$)`, "i");
        return content.match(re)?.[1]?.trim();
      };

      const result: AnalysisResult = {
        insights: get("INSIGHTS") || "Consistent tracking with a mostly balanced mood profile...",
        suggestions: toHyphenBullets(get("SUGGESTIONS")) ||
          "- Try a 5-minute breathing break after lunch\n- Add one mid-week joy activity\n- Short stretch in the afternoon\n- Journal a quick gratitude on stressful days",
        patterns: get("PATTERNS") || "Positives cluster on socially active days...",
        recommendations: get("RECOMMENDATIONS") || "Keep the logging habit; aim for 7h sleep...",
      };
  

  
      setAnalysisResult(result);
    } finally {
      setIsAnalyzing(false);
    }
  };
  

  useEffect(() => {
    const t = setTimeout(() => generateAnalysis(), 150);
    return () => clearTimeout(t);
  }, [timeframe, moodEntries, journalEntries]);



  /* ============================= Render ============================= */

  return (
    <div className="min-h-screen bg-[#FFF5EC]">
      {/* Hero */}
      <section className="relative pt-2 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-black mb-4">
                Mental Health
                <span className="block bg-gradient-to-r from-primary via-wellness to-secondary bg-clip-text text-transparent pb-1">
                  Overview
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed max-w-2xl mb-8">
                Comprehensive insights from your mood tracking and journal entries. Understand patterns, celebrate progress, and get personalized recommendations.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="text-lg px-8 py-4 shadow transition"
                  style={{ backgroundColor: PURPLE, color: "#fff" }}
                  onClick={generateAnalysis}
                  disabled={isAnalyzing}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {isAnalyzing ? "Analyzing..." : "Refresh Analysis"}
                </Button>
              </div>
            </div>

            <div className="flex-1">
              <img
                src={overviewHeroImage}
                alt="Mental health overview illustration"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
              <p className="text-gray-600">Comprehensive analysis of your mental health data</p>
            </div>
            <Select value={timeframe} onValueChange={(v: "week" | "month" | "quarter") => setTimeframe(v)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Past Week</SelectItem>
                <SelectItem value="month">Past Month</SelectItem>
                <SelectItem value="quarter">Past 3 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Wellness Score & Key Metrics */}
      <section className="py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Wellness Score */}
            <Card className="bg-white border-2" style={{ backgroundColor: "#E8EAFF", borderColor: `${PURPLE}33` }}>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Target className="w-5 h-5" style={{ color: PURPLE }} />
                  Wellness Score
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      fill="none"
                      stroke={PURPLE}
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - analytics.wellnessScore / 100)}`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold" style={{ color: PURPLE }}>
                      {analytics.wellnessScore}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Overall wellbeing</p>
              </CardContent>
            </Card>

            {/* Mood Balance */}
            <Card className="bg-white border-2" style={{ backgroundColor: "#FFE5B2", borderColor: `${PURPLE}33` }}>
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5" style={{ color: PURPLE }} />
                  Mood Balance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Positive</span>
                    <span className="text-green-600">{analytics.positivePercentage}%</span>
                  </div>
                  <Progress value={analytics.positivePercentage} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Neutral</span>
                    <span className="text-yellow-600">{analytics.neutralPercentage}%</span>
                  </div>
                  <Progress value={analytics.neutralPercentage} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Challenging</span>
                    <span className="text-red-600">{analytics.negativePercentage}%</span>
                  </div>
                  <Progress value={analytics.negativePercentage} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Activity Summary */}
            <Card className="bg-white border-2" style={{ backgroundColor: "#FCD4D2", borderColor: `${PURPLE}33` }}>
              <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                  <Activity className="w-5 h-5" style={{ color: PURPLE }} />
                  Activity Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-600">Mood Logs</span>
                  <Badge variant="secondary">{analytics.totalMoodEntries}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-600">Journal Entries</span>
                  <Badge variant="secondary">{analytics.totalJournalEntries}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-600">Avg Journal Mood</span>
                  <Badge variant="outline" style={{ borderColor: PURPLE, color: PURPLE }}>
                    {analytics.avgJournalMood.toFixed(1)}/10
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Top Trigger */}
            <Card className="bg-white border-2" style={{ backgroundColor: "#F6BDBB", borderColor: `${PURPLE}33` }}>
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <AlertTriangle className="w-5 h-5" style={{ color: PURPLE }} />
                  Key Trigger
                </CardTitle>
              </CardHeader>
              <CardContent>
                <br></br>
                {analytics.topTriggers.length > 0 ? (
                  <div className="text-center">
                    <div className="text-3xl font-bold capitalize mb-2" style={{ color: PURPLE }}>
                      {analytics.topTriggers[0].trigger}
                    </div>
                    <br></br>
                    <p className="text-xl font-bold text-gray-600">Appeared {analytics.topTriggers[0].count} times</p>
                  </div>
                ) : (
                  <p className="text-xl text-gray-500 text-center">No triggers recorded</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Charts */}
      <section className="py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Mood Trend Chart */}
            <Card className="bg-white border-2" style={{ borderColor: `${PURPLE}33` }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" style={{ color: PURPLE }} />
                  Mood Trends
                </CardTitle>
                <CardDescription>Average mood intensity over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analytics.moodTrend}>
                    <defs>
                      <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={PURPLE} stopOpacity={0.8} />
                        <stop offset="100%" stopColor={PURPLE} stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" fontSize={12} />
                    <YAxis domain={[1, 10]} fontSize={12} />
                    <Tooltip />
                    <Area type="monotone" dataKey="average" stroke={PURPLE} fill="url(#moodGradient)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Emotions (progress list) */}
            <Card className="bg-white border-2" style={{ borderColor: `${PURPLE}33` }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" style={{ color: PURPLE }} />
                  Top Emotions
                </CardTitle>
                <CardDescription>Most frequent emotions logged</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(() => {
                    const total = analytics.emotionDistribution.reduce((s, e) => s + e.value, 0) || 1;
                    return analytics.emotionDistribution.slice(0, 6).map((emotion) => {
                      const percentage = Math.round((emotion.value / total) * 100);
                      return (
                        <div key={emotion.name} className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: emotion.color }} />
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium">{emotion.name}</span>
                              <span className="text-sm text-gray-600">{percentage}%</span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                          <span className="text-sm text-gray-500">{emotion.value}</span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Analysis Results */}
      {analysisResult && (
        <section className="py-4">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Insights & Patterns */}
              <div className="space-y-6">
                <Card className="border-2" style={{ backgroundColor: "#CEE2E0", borderColor: `${PURPLE}33` }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" style={{ color: PURPLE }} />
                      Key Insights
                    </CardTitle>
                    <CardDescription >Patterns discovered in your data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-line text-gray-700 leading-relaxed">{analysisResult.insights}</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2" style={{ backgroundColor: "#CEE2E0", borderColor: `${PURPLE}33` }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" style={{ color: PURPLE }} />
                      Notable Patterns
                    </CardTitle>
                    <CardDescription>Trends and correlations in your wellness data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-line text-gray-700 leading-relaxed">{analysisResult.patterns}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Suggestions & Recommendations */}
              <div className="space-y-6">
                <Card className=" border-2" style={{ backgroundColor: "#CEE2E0", borderColor: `${PURPLE}33` }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" style={{ color: PURPLE }} />
                      Immediate Suggestions
                    </CardTitle>
                    <CardDescription>Actionable steps you can take today</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-line text-gray-700 leading-relaxed">{analysisResult.suggestions}</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className=" border-2" style={{ backgroundColor: "#CEE2E0", borderColor: `${PURPLE}33` }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" style={{ color: PURPLE }} />
                      Long-term Recommendations
                    </CardTitle>
                    <CardDescription>Strategies for continued wellness growth</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-line text-gray-700 leading-relaxed">{analysisResult.recommendations}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Quick Actions & Resources */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Take Action</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Breathing */}
            <Card className="group bg-white border-2 hover:border-blue-400 transition-all duration-200 cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Wind className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Breathing Exercises</CardTitle>
                    <CardDescription>Calm your mind instantly</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Practice 4-7-8 breathing, box breathing, or belly breathing techniques.</p>

                <Button
                  className="w-full" style={{ borderColor: PURPLE, color: PURPLE }}
                  variant="outline"
                  onClick={() => goToResourceSection(navigate, RESOURCE_MAP["breathing"].section)}
                >
                  Start Exercise
                </Button>

              </CardContent>
            </Card>

            {/* Journal */}
            <Card className="group bg-white border-2 hover:border-green-400 transition-all duration-200 cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Journal Reflection</CardTitle>
                    <CardDescription>Process your thoughts</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Write about your day, emotions, or practice gratitude journaling.</p>
                <Button variant="outline" className="w-full" style={{ borderColor: PURPLE, color: PURPLE }} asChild>
                  <Link to="/journal">Open Journal</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Resources */}
            <Card className="group bg-white border-2 hover:border-purple-400 transition-all duration-200 cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Get Support</CardTitle>
                    <CardDescription>Professional resources</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Access crisis support, therapy resources, and community help.</p>
                <Button variant="outline" className="w-full" style={{ borderColor: PURPLE, color: PURPLE }} asChild>
                  <Link to="/resources">View Resources</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Mood check */}
            <Card className="group bg-white border-2 hover:border-yellow-400 transition-all duration-200 cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Quick Mood Check</CardTitle>
                    <CardDescription>Log how you're feeling</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Take a moment to check in with your emotions and log your current mood.</p>
                <Button variant="outline" className="w-full" style={{ borderColor: PURPLE, color: PURPLE }} asChild>
                  <Link to="/MoodTracker">Log Mood</Link>
                </Button>
              </CardContent>
            </Card>

            {/* MindfulBot */}
            <Card className="group bg-white border-2 hover:border-indigo-400 transition-all duration-200 cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Talk to MindfulBot</CardTitle>
                    <CardDescription>AI-powered support</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Get personalized guidance and support from our AI wellness assistant.</p>
                <Button variant="outline" className="w-full" style={{ borderColor: PURPLE, color: PURPLE }} asChild>
                  <Link to="/mindfulbot">Start Chat</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Crisis */}
            <Card className="group bg-white border-2 hover:border-red-400 transition-all duration-200 cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Crisis Support</CardTitle>
                    <CardDescription>Immediate help available</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  24/7 crisis hotlines and emergency mental health resources.
                </p>
                <Button
                  className="w-full border-red-300 text-red-600 hover:bg-red-50"
                  variant="outline"
                  onClick={() => goToResourceSection(navigate, RESOURCE_MAP["crisis"].section)}
                >
                  Get Help Now
                </Button>
            </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Progress */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Card className="bg-white border-2" style={{ backgroundColor: "#FCD4D2", borderColor: `${PURPLE}33` }}>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Star className="w-5 h-5" style={{ color: PURPLE }} />
                Your Wellness Journey
              </CardTitle>
              <CardDescription>Tracking your progress helps build awareness and celebrate growth</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold mb-2" style={{ color: PURPLE }}>
                    {analytics.totalMoodEntries + analytics.totalJournalEntries}
                  </div>
                  <p className="font-bold text-gray-600">Total Check-ins</p>
                  <p className="text-sm text-gray-500 mt-1">Keep building the habit</p>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2" style={{ color: PURPLE }}>
                    {Math.max(1, Math.floor(analytics.totalMoodEntries / 7))}
                  </div>
                  <p className="font-bold text-gray-600">Weeks Tracking</p>
                  <p className="text-sm text-gray-500 mt-1">Consistency is key</p>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2" style={{ color: PURPLE }}>
                    {analytics.wellnessScore}%
                  </div>
                  <p className="font-bold text-gray-600">Wellness Score</p>
                  <p className="text-sm text-gray-500 mt-1">You're doing great</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default MentalHealthOverview;