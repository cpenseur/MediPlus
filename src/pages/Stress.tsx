// src/pages/Stress.tsx
import React, { useState } from "react";
import {
  Brain,
  Moon,
  BatteryLow,
  Users,
  Stethoscope,
  NotebookPen,
  Activity,
  HelpCircle,
  ArrowRight,
  Wand2,
  PhoneCall,
  Info,
  Wind,
  Dumbbell,
  Flower2,
  Utensils,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import stressImg from "@/assets/stress.png";

/* --------------------------- Theme --------------------------- */
const COLORS = {
  page: "#F7F9FF",
  card: "#F1F4FF",
  ink: "#0F1A2A",
  muted: "#55627A",
  primary: "#4F46E5",
  primary2: "#7C3AED",
  primarySoft: "rgba(79,70,229,0.12)",
  border: "rgba(79,70,229,0.22)",
  white: "#ffffff",
  shadow: "0 16px 40px rgba(23, 23, 55, 0.10)",
};

/* --------------------------- Atoms --------------------------- */
const Section: React.FC<React.PropsWithChildren<{ id?: string; className?: string }>> = ({
  id,
  className,
  children,
}) => <section id={id} className={`max-w-6xl mx-auto px-4 ${className ?? ""}`}>{children}</section>;

const SectionHeader: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="text-center mb-8 md:mb-10">
    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3" style={{ color: COLORS.ink }}>
      {title}
    </h2>
    <div
      className="mx-auto mb-3 h-[10px] w-24 rounded-full blur-[1px]"
      style={{ background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.primary2})` }}
    />
    {subtitle && (
      <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: COLORS.muted }}>
        {subtitle}
      </p>
    )}
  </div>
);

const SoftCard: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className, children }) => (
  <div
    className={`rounded-2xl bg-white ${className ?? ""}`}
    style={{ boxShadow: COLORS.shadow, border: `1px solid ${COLORS.border}` }}
  >
    {children}
  </div>
);

const FeatureRow: React.FC<{ icon: React.ElementType; title: string; blurb: string }> = ({
  icon: Icon,
  title,
  blurb,
}) => (
  <SoftCard className="p-5 sm:p-6">
    <div className="flex items-start gap-4">
      <div
        className="flex h-12 w-12 items-center justify-center rounded-xl shrink-0"
        style={{ background: COLORS.primarySoft, border: `1px solid ${COLORS.border}` }}
      >
        <Icon className="h-6 w-6" style={{ color: COLORS.primary }} />
      </div>
      <div>
        <h4 className="text-lg md:text-xl font-semibold mb-1" style={{ color: COLORS.ink }}>{title}</h4>
        <p className="text-sm md:text-base leading-relaxed" style={{ color: COLORS.muted }}>{blurb}</p>
      </div>
    </div>
  </SoftCard>
);

/* --------------------------- Hero --------------------------- */
const Hero: React.FC = () => (
  <div className="relative overflow-hidden" id="top">
    {/* Gradient blobs */}
    <div className="absolute inset-0 -z-10 opacity-70 pointer-events-none">
      <div
        className="absolute -top-24 -left-24 w-[40rem] h-[40rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle at 30% 30%, #C7D2FE, transparent 60%)" }}
      />
      <div
        className="absolute -bottom-32 -right-24 w-[42rem] h-[42rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle at 70% 70%, #E9D5FF, transparent 60%)" }}
      />
    </div>

    <Section className="py-8 md:py-12">
      <SoftCard className="overflow-hidden">
        <div className="p-6 md:p-10" style={{ background: COLORS.card }}>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <h1
                className="text-[32px] leading-tight md:text-[44px] md:leading-[1.1] font-extrabold tracking-tight mt-3"
                style={{ color: COLORS.ink }}
              >
                Understanding <span className="md:block">Stress</span>
              </h1>
              <p className="mt-3 md:mt-4 text-base md:text-lg leading-relaxed" style={{ color: COLORS.muted }}>
                Stress is a normal response to demands. When it stays high for too long, it can impact mood, sleep,
                focus, and health. Learn the signs and simple ways to reset—at your pace.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                <a href="#what">
                  <Button
                    size="lg"
                    className="px-6 py-6 md:px-7 md:py-6 rounded-2xl text-base md:text-lg font-semibold"
                    style={{ background: COLORS.primary, color: COLORS.white, boxShadow: "0 14px 30px rgba(79,70,229,0.35)" }}
                  >
                    Start exploring <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
                <a href="#check-in">
                  <Button
                    size="lg"
                    className="px-6 py-6 md:px-7 md:py-6 rounded-2xl text-base md:text-lg font-semibold"
                    style={{ background: COLORS.primary2, color: COLORS.white, boxShadow: "0 14px 30px rgba(124,58,237,0.35)" }}
                  >
                    Try self-check <Wand2 className="w-4 h-4 ml-2" />
                  </Button>
                </a>
                <a href="#help">
                  <Button
                    variant="outline"
                    className="px-6 py-6 md:px-7 md:py-6 rounded-2xl text-base md:text-lg font-semibold"
                    style={{ borderColor: COLORS.primary, color: COLORS.primary }}
                  >
                    Get help now
                  </Button>
                </a>
              </div>
            </div>

            {/* illustration card */}
            <SoftCard className="p-0 overflow-hidden">
              <div className="p-5 md:p-6">
                <img
                  src={stressImg}
                  alt="Stress—overwhelm & tension illustration"
                  className="mx-auto w-full max-w-[420px] h-auto object-contain rounded-xl"
                />
              </div>
              <div className="p-4 border-t" style={{ borderColor: COLORS.border }}>
                <div className="flex items-center gap-2 text-sm" style={{ color: COLORS.muted }}>
                  <Activity className="w-4 h-4" style={{ color: "#10b981" }} />
                  Small resets add up—support and recovery are possible.
                </div>
              </div>
            </SoftCard>
          </div>
        </div>
      </SoftCard>
    </Section>
  </div>
);

/* --------------------------- Tiles: What is stress? --------------------------- */
const WhatTiles: React.FC = () => {
  const tiles = [
    { emoji: "⚖️", title: "Normal vs. High", blurb: "Short bursts can motivate. Chronic, high stress can harm mood and body." },
    { emoji: "🧑‍🤝‍🧑", title: "Who is affected?", blurb: "Anyone. Workload, exams, money, family, health—stressors differ by person." },
    { emoji: "🧭", title: "How it shows up", blurb: "Sleep issues, tension, headaches, irritability, brain fog, appetite shifts." },
  ];
  return (
    <Section id="what" className="py-10 md:py-14">
      <SectionHeader title="What is stress?" subtitle="Stress is a part of life, however, too much stress can affect your health. Follow stress relief tips to manage stress and avoid feeling stressed out." />
      <div className="grid md:grid-cols-3 gap-5">
        {tiles.map((t) => (
          <SoftCard key={t.title} className="p-6">
            <div className="text-5xl mb-3">{t.emoji}</div>
            <h4 className="text-lg font-semibold" style={{ color: COLORS.ink }}>{t.title}</h4>
            <p className="mt-1" style={{ color: COLORS.muted }}>{t.blurb}</p>
          </SoftCard>
        ))}
      </div>
    </Section>
  );
};

/* --------------------------- Self-Assessment (custom 8Q) --------------------------- */
type Choice = 0 | 1 | 2 | 3;
const STRESS_QUESTIONS: string[] = [
  "Felt that things were piling up beyond your control",
  "Found it hard to relax even with free time",
  "Felt irritable or short-tempered",
  "Had trouble sleeping or woke unrefreshed",
  "Had headaches, muscle tension, or stomach discomfort",
  "Found it hard to focus or remember things",
  "Skipped meals or over-ate due to stress",
  "Avoided tasks because they felt overwhelming",
];

const CHOICES: { label: string; value: Choice; helper: string; emoji: string }[] = [
  { label: "Not at all", value: 0, helper: "0 days", emoji: "🙂" },
  { label: "Several days", value: 1, helper: "1–7 days", emoji: "😕" },
  { label: "More than half", value: 2, helper: "8–11 days", emoji: "😟" },
  { label: "Nearly every day", value: 3, helper: "12–14 days", emoji: "😣" },
];

const severityFromScore = (score: number) => {
  if (score <= 7) return { label: "Low", color: "#10b981", bar: 20 };
  if (score <= 14) return { label: "Moderate", color: "#eab308", bar: 55 };
  if (score <= 20) return { label: "High", color: "#f97316", bar: 80 };
  return { label: "Very high", color: "#ef4444", bar: 95 };
};

const SelfAssessment: React.FC = () => {
  const [answers, setAnswers] = useState<(Choice | null)[]>(Array(STRESS_QUESTIONS.length).fill(null));
  const [step, setStep] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const progress = Math.round((step / STRESS_QUESTIONS.length) * 100);
  const score = answers.reduce((sum, a) => sum + (a ?? 0), 0);
  const severity = severityFromScore(score);

  const setAnswer = (v: Choice) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[step] = v;
      return next;
    });
  };

  const next = () => {
    if (step < STRESS_QUESTIONS.length - 1) setStep(step + 1);
    else setShowResult(true);
  };
  const prev = () => setStep((s) => Math.max(0, s - 1));
  const reset = () => {
    setAnswers(Array(STRESS_QUESTIONS.length).fill(null));
    setStep(0);
    setShowResult(false);
  };

  return (
    <Section id="check-in" className="py-10 md:py-14">
      <SectionHeader
        title="Perceived Stress Self-Check"
        subtitle="About the last 2 weeks. Not a diagnosis—just a gentle snapshot to help you plan next steps."
      />
      <SoftCard className="p-0 overflow-hidden">
        {/* progress */}
        <div className="p-5 border-b" style={{ borderColor: COLORS.border }}>
          <div className="flex items-center justify-between text-sm" style={{ color: COLORS.muted }}>
            <span>Question {Math.min(step + 1, STRESS_QUESTIONS.length)} / {STRESS_QUESTIONS.length}</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full transition-all duration-500"
              style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.primary2})` }}
            />
          </div>
        </div>

        <div className="p-5 md:p-8">
          {!showResult ? (
            <>
              <div className="rounded-2xl p-5 border" style={{ borderColor: COLORS.border }}>
                <p className="text-xl font-bold mb-3" style={{ color: COLORS.ink }}>
                  {STRESS_QUESTIONS[step]}
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {CHOICES.map((c) => {
                    const active = answers[step] === c.value;
                    return (
                      <button
                        key={c.value}
                        onClick={() => setAnswer(c.value)}
                        className="group text-left rounded-xl p-4 border transition-all"
                        style={{
                          borderColor: active ? COLORS.primary : COLORS.border,
                          background: active ? COLORS.primarySoft : "#fff",
                          color: active ? COLORS.ink : COLORS.muted,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{c.emoji}</span>
                          <div>
                            <div className="font-semibold">{c.label}</div>
                            <div className="text-xs opacity-80">{c.helper}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={prev}
                  className="rounded-xl"
                  style={{ borderColor: COLORS.primary, color: COLORS.primary }}
                  disabled={step === 0}
                >
                  Back
                </Button>
                <Button
                  onClick={next}
                  className="rounded-xl"
                  style={{ background: answers[step] !== null ? COLORS.primary : "#c7d2fe", color: "#fff" }}
                  disabled={answers[step] === null}
                >
                  {step < STRESS_QUESTIONS.length - 1 ? "Next" : "See results"}
                </Button>
                <Button
                  variant="outline"
                  onClick={reset}
                  className="rounded-xl"
                  style={{ borderColor: COLORS.border, color: COLORS.muted }}
                >
                  Reset
                </Button>
              </div>
            </>
          ) : (
            <div className="rounded-2xl p-5 border" style={{ borderColor: COLORS.border }}>
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5" style={{ color: COLORS.primary }} />
                <div>
                  <p className="font-bold text-lg" style={{ color: COLORS.ink }}>
                    Result: <span style={{ color: severity.color }}>{severity.label}</span>
                  </p>
                  <div className="mt-4 h-3 w-full rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${severity.bar}%`,
                        background: "linear-gradient(90deg,#10b981,#eab308,#f97316,#ef4444)",
                      }}
                    />
                  </div>
                  <p className="text-sm mt-4" style={{ color: COLORS.muted }}>
                    This tool is informational only. If your stress feels unmanageable—especially with sleep problems,
                    panic symptoms, or thoughts of self-harm—please reach out for support.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a href="#help">
                      <Button className="rounded-xl" style={{ background: COLORS.primary, color: "#fff" }}>
                        See helplines & support
                      </Button>
                    </a>
                    <Button
                      variant="outline"
                      className="rounded-xl"
                      onClick={reset}
                      style={{ borderColor: COLORS.primary, color: COLORS.primary }}
                    >
                      Take again
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </SoftCard>

      <p className="mt-3 text-xs text-center" style={{ color: COLORS.muted }}>
        If you’re in immediate danger or thinking of harming yourself, please use the helplines below or local emergency services right now.
      </p>
    </Section>
  );
};

/* --------------------------- Myths vs Facts --------------------------- */
const Misconceptions: React.FC = () => {
  const items = [
    {
      emoji: "💼",
      myth: "Stress only happens to weak people.",
      fact: "Stress is a universal biological response. Resilience is built with skills and support, not willpower alone.",
    },
    {
      emoji: "⏳",
      myth: "Stress goes away on its own—just wait.",
      fact: "Chronic stress can build. Early small resets (sleep, breathing, movement, connection) help prevent burnout.",
    },
    {
      emoji: "💊",
      myth: "Only medication fixes stress.",
      fact: "Skills (breathing, boundaries, time-boxing), therapy, social support, and lifestyle changes are effective. Medication is sometimes helpful for related conditions.",
    },
    {
      emoji: "🗣️",
      myth: "Talking about stress makes it worse.",
      fact: "Sharing reduces burden. Naming stress activates coping and problem-solving.",
    },
    {
      emoji: "🧠",
      myth: "If I can’t ‘think’ my way out, I’m failing.",
      fact: "Stress affects body systems. Body-based tools (breathing, posture, walking) work alongside thinking tools.",
    },
    // ✅ New flip card
    {
      emoji: "🌿",
      myth: "Relaxation is just a luxury.",
      fact: "Simple relaxation practices (deep breathing, mindfulness, breaks in nature) reduce stress hormones and support long-term resilience.",
    },
  ];

  return (
    <Section className="py-10 md:py-14">
      <SectionHeader title="Myths vs Facts" subtitle="Hover (or tap) each card to reveal the fact." />
      <div className="grid md:grid-cols-3 gap-5">
        {items.map((it, i) => (
          <div key={i} className="[perspective:1200px]">
            <div className="relative h-56 w-full transition-transform duration-500 [transform-style:preserve-3d] group hover:[transform:rotateY(180deg)]">
              <div className="absolute inset-0 [backface-visibility:hidden]">
                <SoftCard className="h-full flex items-center justify-center text-center p-6">
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="text-6xl mb-3">{it.emoji}</div>
                    <p className="font-semibold text-center" style={{ color: COLORS.ink }}>
                      {it.myth}
                    </p>
                  </div>
                </SoftCard>
              </div>
              <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                <SoftCard className="h-full flex items-center justify-center text-center bg-gradient-to-br from-indigo-50 to-violet-50 p-6">
                  <div className="flex flex-col items-center justify-center h-full p-4">
                    <p className="text-sm md:text-base text-center" style={{ color: COLORS.muted }}>
                      {it.fact}
                    </p>
                  </div>
                </SoftCard>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

/* --------------------------- Tabbed: Types of Stress --------------------------- */
const TypesOfStress: React.FC = () => {
  type Key = "acute" | "episodic" | "chronic";
  const [tab, setTab] = useState<Key>("acute");

  const DATA: Record<Key, { title: string; body: string; video?: string }> = {
    acute: {
      title: "Acute Stress",
      body: "Short-term response to an immediate demand (exams, presentations). Usually resolves after the event. Try box breathing and brief movement.",
      video: "1BBiaxOxXas", 
    },
    episodic: {
      title: "Episodic Acute Stress",
      body: "Acute stress happening frequently (tight deadlines, back-to-back responsibilities). Build micro-breaks, calendar buffers, and weekly planning.",
      video: "DeTw2fvRlXg", 
    },
    chronic: {
      title: "Chronic Stress",
      body: "Long-lasting stress from ongoing issues (finances, caregiving, conflict). Benefits from multi-step support: skills, social connection, and professional help.",
      video: "Mh4E3xiNGe4", 
    },
  };

  return (
    <Section className="py-10 md:py-14">
      <SectionHeader title="Types of Stress" subtitle="Different patterns call for different tools." />
      <div className="grid md:grid-cols-[260px,1fr] gap-6">
        <div className="space-y-3">
          {(
            [
              { k: "acute", label: "Acute stress" },
              { k: "episodic", label: "Episodic acute stress" },
              { k: "chronic", label: "Chronic stress" },
            ] as { k: Key; label: string }[]
          ).map(({ k, label }) => {
            const active = tab === k;
            return (
              <button
                key={k}
                onClick={() => setTab(k)}
                className="w-full text-left px-4 py-3 rounded-xl font-semibold"
                style={{
                  background: active ? "linear-gradient(90deg,#e0e7ff,#ede9fe)" : "#fff",
                  border: `2px solid ${active ? "#c7d2fe" : "#e5e7eb"}`,
                  color: active ? COLORS.ink : COLORS.muted,
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        <SoftCard className="p-6">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-6 h-6" style={{ color: COLORS.primary }} />
            <div>
              <h3 className="text-xl font-bold" style={{ color: COLORS.ink }}>{DATA[tab].title}</h3>
              <p className="mt-2" style={{ color: COLORS.muted }}>{DATA[tab].body}</p>
            </div>
          </div>

          {DATA[tab].video && (
            <div className="mt-5 rounded-xl overflow-hidden border" style={{ borderColor: "#e5e7eb" }}>
              <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${DATA[tab].video}?rel=0&modestbranding=1`}
                  title="Understanding stress"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </SoftCard>
      </div>
    </Section>
  );
};

/* --------------------------- Stress Symptoms & Causes --------------------------- */
/* --------------------------- Stress Symptoms & Causes --------------------------- */
const StressSymptomsAndCauses: React.FC = () => (
  <Section id="stress-symptoms" className="py-10 md:py-14">
    <SectionHeader
      title="Stress Symptoms"
      subtitle="Stress shows up in many ways — body, mind, emotions, and behaviour."
    />

    {/* Symptoms Grid */}
    <div className="grid gap-6 md:grid-cols-2">
      {/* Physical */}
      <SoftCard className="p-6">
        <h4 className="text-lg md:text-xl font-semibold mb-2" style={{ color: COLORS.ink }}>
          Physical
        </h4>
        <ul className="list-disc pl-5 space-y-1" style={{ color: COLORS.muted }}>
          <li>Aches and pains</li>
          <li>Chest pain</li>
          <li>Headaches</li>
          <li>Fatigue / lethargy</li>
          <li>Palpitations</li>
          <li>Stomach upsets</li>
          <li>Dizziness</li>
          <li>Sexual dysfunction</li>
        </ul>
      </SoftCard>

      {/* Emotional */}
      <SoftCard className="p-6">
        <h4 className="text-lg md:text-xl font-semibold mb-2" style={{ color: COLORS.ink }}>
          Emotional
        </h4>
        <ul className="list-disc pl-5 space-y-1" style={{ color: COLORS.muted }}>
          <li>Anxiety</li>
          <li>Tension</li>
          <li>Irritability</li>
          <li>Depression and moodiness</li>
          <li>Feelings of being overwhelmed</li>
          <li>Restlessness</li>
        </ul>
      </SoftCard>

      {/* Cognitive */}
      <SoftCard className="p-6">
        <h4 className="text-lg md:text-xl font-semibold mb-2" style={{ color: COLORS.ink }}>
          Cognitive
        </h4>
        <ul className="list-disc pl-5 space-y-1" style={{ color: COLORS.muted }}>
          <li>Forgetfulness</li>
          <li>Poor concentration</li>
          <li>Mental blocks</li>
          <li>Difficulty in organising and making decisions</li>
        </ul>
      </SoftCard>

      {/* Behavioural */}
      <SoftCard className="p-6">
        <h4 className="text-lg md:text-xl font-semibold mb-2" style={{ color: COLORS.ink }}>
          Behavioural
        </h4>
        <ul className="list-disc pl-5 space-y-1" style={{ color: COLORS.muted }}>
          <li>Sleep problems</li>
          <li>Crying</li>
          <li>Poor appetite / increased appetite</li>
          <li>Falling ill — colds, coughs</li>
          <li>Withdrawal</li>
          <li>Smoking / drinking excessively</li>
        </ul>
      </SoftCard>
    </div>

    {/* Causes of Stress */}
    <div className="mt-12">
      <SectionHeader title="Causes of Stress" subtitle="External sources that commonly trigger stress." />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[
          "Personal problems",
          "Work problems",
          "Relationship difficulties",
          "Pressure of studies",
          "Health problems",
          "Financial crisis",
          "Unemployment",
          "Losses (e.g., bereavement)",
          "Unexpected news",
          "Daily hassles",
        ].map((cause, i) => (
          <SoftCard key={i} className="p-6 flex items-center justify-center text-center">
            <p className="text-sm md:text-base font-medium" style={{ color: COLORS.muted }}>
              {cause}
            </p>
          </SoftCard>
        ))}
      </div>
    </div>
  </Section>
);


/* --------------------------- Helplines --------------------------- */
const HelpRail: React.FC = () => (
  <Section id="help" className="py-10 md:py-14">
    <SectionHeader title="Helplines" subtitle="Confidential • Kind • Free or low-cost in most places" />
    <div className="grid md:grid-cols-3 gap-6">
      {[
        { country: "Singapore", service: "SOS (Samaritans of Singapore)", num: "1767" },
        { country: "Malaysia", service: "Befrienders KL", num: "03-76272929" },
        { country: "Philippines", service: "HOPELINE", num: "0917-558-4673" },
        { country: "Thailand", service: "Department of Mental Health", num: "1323" },
        { country: "Indonesia", service: "Into The Light Indonesia", num: "021-7888-6950" },
        { country: "Vietnam", service: "Heart 2 Heart", num: "1900-599-088" },
      ].map((h) => (
        <SoftCard key={h.country} className="p-6 flex items-center justify-between">
          <div>
            <p className="font-semibold" style={{ color: COLORS.ink }}>{h.country}</p>
            <p className="text-sm" style={{ color: COLORS.muted }}>{h.service}</p>
          </div>
          <a
            href={`tel:${h.num}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold"
            style={{ background: "#f43f5e" }}
          >
            <PhoneCall className="w-4 h-4" /> {h.num}
          </a>
        </SoftCard>
      ))}
    </div>
  </Section>
);

/* --------------------------- Page --------------------------- */
const Stress: React.FC = () => {
  return (
    <div className="min-h-screen" style={{ background: COLORS.page }}>
      <Hero />
      <WhatTiles />
      <Misconceptions />
      <SelfAssessment />
      <TypesOfStress />
      <StressSymptomsAndCauses />
      <HelpRail />
      <References/> 
      {/* sticky back-to-top */}
      <a
        href="#top"
        className="fixed bottom-6 right-6 px-4 py-3 rounded-full text-white font-semibold"
        style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primary2})`, boxShadow: "0 16px 30px rgba(0,0,0,.18)" }}
      >
        Top ↑
      </a>
    </div>
  );
};

const References: React.FC = () => {
  const items = [
    { 
      title: "WHO – Stress", 
      url: "https://www.who.int/news-room/questions-and-answers/item/stress",
      desc: "World Health Organization fact sheet on depression"
    },
    { 
      title: "HealthHub SG – Stress", 
      url: "https://www.healthhub.sg/health-conditions/stress",
      desc: "Singapore’s national health portal: myths & misconceptions"
    },
   
  ];

  return (
    <Section id="references" className="py-10 md:py-14">
      <SectionHeader title="References" subtitle="Trusted resources for further learning" />
      <div className="grid md:grid-cols-2 gap-5">
        {items.map((ref) => (
          <a key={ref.url} href={ref.url} target="_blank" rel="noopener noreferrer">
            <SoftCard className="p-5 transition-all hover:shadow-lg hover:scale-[1.02]">
              <div className="flex items-start gap-3">
                {/* external link icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0 mt-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 010 5.656L7.05 22.606a4 4 0 11-5.656-5.656l6.778-6.778a4 4 0 015.656 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7h6m0 0v6m0-6L10 18" />
                </svg>
                <div>
                  <p className="font-semibold text-indigo-600 hover:text-indigo-800">{ref.title}</p>
                  <p className="text-sm mt-1" style={{ color: COLORS.muted }}>{ref.desc}</p>
                </div>
              </div>
            </SoftCard>
          </a>
        ))}
      </div>
    </Section>
  );
};

export default Stress;
