import React, { useEffect, useMemo, useState } from "react";
import {
  Heart, BookOpen, Sparkles, Star, Trophy, HelpCircle, ExternalLink,
  ArrowRight, CalendarDays, MessageCircle, History, Copy, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { format, parseISO, isWithinInterval, startOfWeek, endOfWeek, subDays } from "date-fns";

// STORAGE
import { STORAGE_KEYS, readEntries, uniqueDaySet, computeStreak } from "@/utils/wellnessStorage";

// util to read JSON from localStorage
function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}




// ----- Palette (your exact colors; corrected CEE2EO -> CEE2E0)
const PALETTE = {
  indigo50: "#E8EAFF",
  peach100: "#FFE5B2",
  blush100: "#FCD4D2",
  blush300: "#F2A8A5",
  cream50: "#F4E7E1",
  teal100: "#CEE2E0",
  indigo100: "#C3CBF9",
  indigo500: "#7A87FA",
};
const PURPLE = "#717EF3";

// ----- Mascot stages (imports)
import stage1 from "@/assets/mascot/stage1.png";
import stage2 from "@/assets/mascot/stage2.png";
import stage3 from "@/assets/mascot/stage3.png";
import stage4 from "@/assets/mascot/stage4.png";
import stage5 from "@/assets/mascot/stage5.png";
import stage6 from "@/assets/mascot/stage6.png";
import stage7 from "@/assets/mascot/stage7.png";
import stage8 from "@/assets/mascot/stage8.png";
import stage9 from "@/assets/mascot/stage9.png";
import stage10 from "@/assets/mascot/stage10.png";
import stage11 from "@/assets/mascot/stage11.png";
import stage12 from "@/assets/mascot/stage12.png";
import stage13 from "@/assets/mascot/stage13.png";
import stage14 from "@/assets/mascot/stage14.png";
import stage15 from "@/assets/mascot/stage15.png";
import stage16 from "@/assets/mascot/stage16.png";
import stage17 from "@/assets/mascot/stage17.png";
import stage18 from "@/assets/mascot/stage18.png";
import stage19 from "@/assets/mascot/stage19.png";
import stage20 from "@/assets/mascot/stage20.png";

const STAGE_IMAGES = [stage1,stage2,stage3,stage4,stage5,stage6,stage7,stage8,stage9,stage10,stage11,stage12,stage13,stage14,stage15,stage16,stage17,stage18,stage19,stage20];

const STAGE_LINES: string[] = [
  "EVERY ENTRY IS WARMTH FOR ME TO HATCH!",
  "KEEP GOING, YOU'RE BUILDING MY LITTLE WORLD",
  "KEEP JOURNALING~ I'M STARTING TO WIGGLE!",
  "ONE MORE STEP, AND I'LL BREAK THROUGH THE SHELL!",
  "HELLO! THANKS FOR HELPING ME HATCH",
  "EVERY LOG IS LIKE FOOD, I'M GROWING!",
  "I'M SMALL, BUT YOUR WORDS MAKE ME BRAVER",
  "I CAN FEEL MYSELF GROWING STRONGER",
  "YOUR REFLECTIONS ARE MY HEARTBEAT",
  "DON'T STOP, EACH THOUGHT GIVES ME STRENGTH",
  "YOUR WORDS ARE MY SUNSHINE",
  "LOOK AT ME! I'VE GOT TINY WINGS NOW",
  "I'M TRANSFORMING INTO MY NEW COAT!",
  "YOUR JOURNALING IS TEACHING ME TO FLAP",
  "I TRUST YOU! LET'S KEEP GROWING TOGETHER",
  "KEEP GOING, YOUR WORDS FILL ME WITH OF JOY",
  "WHEN YOU SHARE YOUR MOOD, I FEEL HONORED",
  "WE'RE LEARNING TO FLY, ONE ENTRY AT A TIME",
  "I CAN HOP AROUND NOW.. ALMOST READY TO SOAR!",
  "YOU'VE GUIDED ME THIS FAR, LET'S REACH THE SKIES TOGETHER!",
];

// ----- SEA-LION config (mini-game)
const SEA_LION_KEY = "sk-TSbEBjqQN9HKMcutANxL5A";
const SEA_LION_URL = "https://api.sea-lion.ai/v1/chat/completions";
const SEA_LION_MODEL = "aisingapore/Llama-SEA-LION-v3-70B-IT";

function makeRewardCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const pick = (n: number) => Array.from({ length: n }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
  return `${pick(3)}-${pick(4)}`;
}

const QUOTES = [
  "Small steps, big heart. — unknown",
  "You showed up today—that matters. — gentle reminder",
  "Healing isn’t linear, but you’re moving. — true self",
  "Let today be lighter than yesterday. — quiet voice",
  "Growth loves patience. — a friend",
];

const HomePage: React.FC = () => {

  const [moodStreakSynced, setMoodStreakSynced] = useState<number | null>(null);
  const [journalStreakSynced, setJournalStreakSynced] = useState<number | null>(null);
  const [moodBadgesSynced, setMoodBadgesSynced] = useState<string[]>([]);
  const [journalBadgesSynced, setJournalBadgesSynced] = useState<string[]>([]);

  useEffect(() => {
    const load = () => {
      setMoodStreakSynced(readJSON<number | null>("mh:mood:streak", null));
      setJournalStreakSynced(readJSON<number | null>("mh:journal:streak", null));
      setMoodBadgesSynced(readJSON<string[]>("mh:mood:badges", []));
      setJournalBadgesSynced(readJSON<string[]>("mh:journal:badges", []));
    };
    load();
    // keep in sync if Mood/Journal pages update while Home is open (or in another tab)
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);


  // Read persisted entries
  const moodEntries = readEntries(STORAGE_KEYS.mood);
  const journalEntries = readEntries(STORAGE_KEYS.journal);

  // Demo fallback (if both empty)
  const [demoDates] = useState<string[]>(() => {
    if (moodEntries.length || journalEntries.length) return [];
    const today = new Date();
    return Array.from({ length: 12 }).map((_, i) => format(subDays(today, i + 1), "yyyy-MM-dd"));
  });

  const moodDays = useMemo(() => {
    const s = uniqueDaySet(moodEntries);
    demoDates.forEach((d, i) => i % 2 === 0 && s.add(d));
    return s;
  }, [moodEntries, demoDates]);

  const journalDays = useMemo(() => {
    const s = uniqueDaySet(journalEntries);
    demoDates.forEach((d, i) => i % 2 === 1 && s.add(d));
    return s;
  }, [journalEntries, demoDates]);

  const combinedDays = useMemo(() => new Set<string>([...moodDays, ...journalDays]), [moodDays, journalDays]);

  const totalUnique = combinedDays.size;
  const targetDays = 20 * 5;
  const stage = Math.min(20, Math.max(1, Math.ceil(totalUnique / 5)));
  const stagePct = Math.min(100, Math.round((totalUnique / targetDays) * 100));

  const thisWeek = useMemo(() => {
    const start = startOfWeek(new Date());
    const end = endOfWeek(new Date());
  
    const inRange = (ds: string) => {
      const d = new Date(ds + "T00:00:00"); // local midnight of that day
      return d >= start && d <= end;
    };
    const count = (s: Set<string>) => [...s].filter(inRange).length;
  
    return { mood: count(moodDays), journal: count(journalDays) };
  }, [moodDays, journalDays]);
  



  // existing computation from entries (kept as fallback)
    const streakMoodComputed = computeStreak(moodDays);
    const streakJournalComputed = computeStreak(journalDays);

    // what we actually show
    const streakMood = moodStreakSynced ?? streakMoodComputed;
    const streakJournal = journalStreakSynced ?? streakJournalComputed;

  



  // Past stages
  const [openStages, setOpenStages] = useState(false);

  // Mini-game
  const [g1, setG1] = useState(""); const [g2, setG2] = useState(""); const [g3, setG3] = useState("");
  const [aiText, setAiText] = useState(""); const [reward, setReward] = useState("");
  const [copyOK, setCopyOK] = useState(false); const [loadingAI, setLoadingAI] = useState(false);
  const [quote, setQuote] = useState("");

  async function runMiniGame() {
    setLoadingAI(true); setAiText(""); setReward(""); setQuote("");
    try {
      const system = { role: "system", content: "You are an encouraging SEA-friendly wellbeing coach. Be brief (2–4 sentences), warm, strengths-based, and specific. Avoid clinical claims. Always stay positive." };
      const user = { role: "user", content: `Three things I want to share:\n1) ${g1}\n2) ${g2}\n3) ${g3}\nPlease respond with gentle encouragement and one tiny next step.` };

      const res = await fetch(SEA_LION_URL, {
        method: "POST",
        headers: { accept: "application/json", Authorization: `Bearer ${SEA_LION_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: SEA_LION_MODEL, temperature: 0.5, max_completion_tokens: 120, messages: [system as any, user as any] }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      const txt = data?.choices?.[0]?.message?.content?.trim() || "";
      setAiText(txt || "Proud of you for showing up today. Write one line after a deep breath.");
      setReward(makeRewardCode());
    } catch {
      setAiText("Proud of you for sharing. Try a 1-minute box-breathing and write one sentence after.");
      setReward(makeRewardCode());
    } finally {
      // pretty quote
      setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
      setLoadingAI(false);
    }
  }
  function copyReward() {
    navigator.clipboard.writeText(reward);
    setCopyOK(true);
    setTimeout(() => setCopyOK(false), 1100);
  }

  // Achievements colored pills
  const earned = useMemo(() => new Set([...moodBadgesSynced, ...journalBadgesSynced]), [moodBadgesSynced, journalBadgesSynced]);

  const achievements = useMemo(() => ([
    {
      label: "First Log",
      // Either “Mood Starter” or “Reflection Starter” from pages:
      earned: earned.has("Mood Starter") || earned.has("Reflection Starter"),
      bg: PALETTE.indigo50,
    },
    {
      label: "7-Day Streak (Mood)",
      // Your mood page uses: "Consistency Builder (7-day streak)"
      earned: earned.has("Consistency Builder (7-day streak)") || streakMood >= 7,
      bg: PALETTE.blush100,
    },
    {
      label: "7-Day Streak (Journal)",
      // Journal page uses the same label in your sample; fallback to computed
      earned: earned.has("Consistency Builder (7-day streak)") || streakJournal >= 7,
      bg: PALETTE.blush300,
    },
    // You can keep the mascot progress ones computed from entries:
    { label: "Hatchling", earned: stage >= 5, bg: PALETTE.peach100 },
    { label: "Consistency ×30", earned: combinedDays.size >= 30, bg: PALETTE.teal100 },
    { label: "Taking Flight", earned: stage >= 15, bg: PALETTE.indigo100 },
    { label: "Sky Explorer", earned: stage === 20, bg: PALETTE.indigo500 },
  ]), [earned, streakMood, streakJournal, stage, combinedDays.size]);



  return (
    <div className="min-h-screen" style={{ background: PALETTE.cream50 }}>
      {/* HERO */}
      <section className="relative pt-10 pb-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left: headline + CTA */}
          <div>

            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-black mb-4">
              Take care of your{" "}
              <span className="bg-clip-text text-transparent"
                    style={{ backgroundImage: `linear-gradient(90deg, ${PALETTE.indigo500}, ${PALETTE.blush300})` }}>
                mental health
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed max-w-2xl mb-8">
              Two simple pillars: <br></br><strong>Track your Mood</strong> and <strong>Reflect in your Journal</strong>.<br></br><br></br>
              Watch your Scarlet Minivet pet grow with every day you show up.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg px-8 py-4 shadow transition"
                      style={{ backgroundColor: PURPLE, color: "#fff" }}
                      onClick={() => (window.location.href = "/moodtracker")}>
                <Heart className="w-5 h-5 mr-2" /> Track Your Mood
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-white"
                      style={{ borderColor: PURPLE, color: PURPLE, borderWidth: 2 }}
                      onClick={() => (window.location.href = "/journal")}>
                <BookOpen className="w-5 h-5 mr-2" /> Journal your thoughts
              </Button>
            </div>
          </div>

          {/* Right: Scarlet Minivet PET (no extra container; text/progress/buttons UNDER image) */}
          <div className="relative text">
            <h3 className="text-3xl font-bold mb-2">Your Scarlet Minivet</h3>
            <div className="relative inline-block">
              <img
                src={STAGE_IMAGES[Math.max(0, stage - 1)]}
                alt={`Mascot stage ${stage}`}
                className="max-w-[440px] h-auto mx-auto"
              />
              {/* Speech bubble (no icon) */}
              <div
                className="absolute -top-4 right-0 w-40 translate-x-6 p-2 rounded-xl shadow text-xs"
                style={{
                  background: "#fff",
                  border: `2px solid ${PALETTE.indigo100}`,
                }}
              >
                <span className="leading-snug">{STAGE_LINES[Math.max(0, stage - 1)]}</span>
              </div>
            </div>


            {/* UNDER the image: rule, text, progress, buttons */}
            <div className="mt-4">
              <div className="mb-3 text-sm text-gray-700">
                Every <strong>unique day</strong> you log a mood or a journal entry advances the mascot.
                <br /><span className="text-gray-600">5 days per stage • 20 stages total</span>
              </div>
              <div className="w-full h-4 rounded-full overflow-hidden border"
                   style={{ borderColor: PALETTE.indigo100 }}>
                <div className="h-full"
                     style={{ width: `${stagePct}%`,
                              background: `linear-gradient(90deg, ${PALETTE.indigo500}, ${PALETTE.blush300})` }} />
              </div>
              <div className="mt-2 text-xs text-gray-600">{stagePct}% to full flight</div>

              <div className="flex gap-3 mt-5">
                <Button variant="outline" className="bg-white"
                        style={{ borderColor: PURPLE, color: PURPLE, borderWidth: 2 }}
                        onClick={() => setOpenStages(true)}>
                  <History className="w-4 h-4 mr-2" /> See Past Stages
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STREAKS + ACHIEVEMENTS — colored pills */}
      <section className="pb-2 -mt-2">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mood Streak */}
          <Card className="bg-white" style={{ backgroundColor: "#E8EAFF", borderColor: PALETTE.indigo100, borderWidth: 2 }}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5" style={{ color: PURPLE }} />
                <CardTitle className="text-lg">Mood Streak<br></br></CardTitle>
                
              </div>
              <CardDescription className="text-3xl font-semibold text-center text-black"><br />{streakMood} days<br /><br /></CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{ background: PALETTE.indigo50, color: "#2b2b2b", border: `1px solid ${PALETTE.indigo100}` }}>
                  Aim for 4–5 days/week to build momentum.
                </span>
              </div>
              <div className="w-full h-3 rounded-full overflow-hidden"
                   style={{ background: PALETTE.indigo50, border: `1px solid ${PALETTE.indigo100}` }}>
                <div className="h-full"
                     style={{ width: `${Math.min(100, (thisWeek.mood / 7) * 100)}%`, background: PALETTE.indigo500 }} />
              </div>
            </CardContent>
          </Card>

          {/* Journal Streak */}
          <Card className="bg-white" style={{ backgroundColor: "#C3CBF9", borderColor: PALETTE.indigo100, borderWidth: 2 }}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" style={{ color: PURPLE }} />
                <CardTitle className="text-lg">Journal Streak</CardTitle>
              </div>
              <CardDescription className="text-3xl font-semibold text-center text-black"><br />{streakJournal} days <br /><br /></CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{ background: PALETTE.peach100, color: "#2b2b2b", border: `1px solid ${PALETTE.indigo100}` }}>
                  Even one sentence counts. Keep it light.
                </span>
              </div>
              <div className="w-full h-3 rounded-full overflow-hidden"
                   style={{ background: PALETTE.peach100, border: `1px solid ${PALETTE.indigo100}` }}>
                <div className="h-full"
                     style={{ width: `${Math.min(100, (thisWeek.journal / 7) * 100)}%`, background: PALETTE.blush300 }} />
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="bg-white" style={{ backgroundColor: "#FCD4D2", borderColor: PALETTE.indigo100, borderWidth: 2 }}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5" style={{ color: PURPLE }} />
                <CardTitle className="text-lg">Achievements</CardTitle>
              </div>
              <CardDescription>Gentle milestones to celebrate effort</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {achievements.map((a, i) => (
                <span key={i}
                      className="px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: a.earned ? a.bg : "#ffffff",
                        color: a.earned ? "#1f2937" : "#8b8b8b",
                        border: `1px solid ${PALETTE.indigo100}`,
                      }}>
                  {a.earned ? <Star className="w-3 h-3 inline mr-1" /> : <Star className="w-3 h-3 inline mr-1 opacity-40" />}
                  {a.label}
                </span>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mini-game: three things → AI note + Quote */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Card className="bg-white" style={{ backgroundColor: "#CEE2E0", borderColor: PALETTE.indigo100, borderWidth: 2 }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" style={{ color: PURPLE }} />
                What did you do today?
              </CardTitle>
              <CardDescription>Share 3 thoughts or actions you did today.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* inputs */}
              <div className="space-y-3">
                <Input placeholder="First Thought/Action" value={g1} onChange={(e) => setG1(e.target.value)} />
                <Input placeholder="Second Thought/Action" value={g2} onChange={(e) => setG2(e.target.value)} />
                <Input placeholder="Third Thought/Action" value={g3} onChange={(e) => setG3(e.target.value)} />
                <Button className="w-full" style={{ backgroundColor: PURPLE, color: "#fff" }}
                        onClick={runMiniGame} disabled={loadingAI || !g1 || !g2 || !g3}>
                  {loadingAI ? "Thinking…" : "Get Encouragement"}
                </Button>

              </div>

              {/* output */}
              <div className="lg:col-span-2 space-y-4">
                <div className="rounded-xl p-4 border bg-white min-h-[160px]"
                     style={{ borderColor: PALETTE.indigo100 }}>
                  {aiText ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" style={{ color: PURPLE }} />
                        <span className="text-sm font-semibold" style={{ color: PURPLE }}>Your AI note</span>
                      </div>
                      <p className="text-[15px] leading-7 text-slate-800">{aiText}</p>

 
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm">Your AI note will appear here…</div>
                  )}
                </div>

                {/* Pretty quote below the note */}
                {aiText && (
                  <div className="rounded-xl p-4 border"
                       style={{ background: PALETTE.indigo50, borderColor: PALETTE.indigo100 }}>
                    <blockquote className="text-[15px] leading-7 text-gray-800 italic">
                      “{quote}”
                    </blockquote>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Past Stages Modal */}
      {openStages && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
             onClick={() => setOpenStages(false)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 border"
               style={{ borderColor: PALETTE.indigo100 }}
               onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-lg font-semibold">Past Stages</div>
                <div className="text-sm text-gray-600">See how your Scarlet Minivet pet has grown</div>
              </div>
              <Button variant="outline" onClick={() => setOpenStages(false)}
                      style={{ borderColor: PALETTE.indigo100 }}>
                Close
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {STAGE_IMAGES.slice(0, Math.max(1, stage)).map((src, i) => (
                <div key={i} className="rounded-xl overflow-hidden border bg-white"
                     style={{ borderColor: PALETTE.indigo100 }}>
                  <img src={src} alt={`Stage ${i + 1}`} className="w-full h-32 object-contain bg-white" />
                  <div className="p-2 text-xs text-gray-700">
                    <div className="font-semibold">Stage {i + 1}</div>
                    <div className="text-[11px] mt-1">{STAGE_LINES[i]}</div>
                  </div>
                </div>
              ))}
            </div>
            {stage < 20 && (
              <div className="mt-4 text-xs text-gray-600">
                Keep going! Next stage unlocks at{" "}
                <span className="font-semibold">{stage * 5 + 1} unique days</span>.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
