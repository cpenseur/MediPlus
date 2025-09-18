// src/pages/Panic.tsx
import React, { useState } from "react";
import {
  Brain,
  Wind,
  Activity,
  HelpCircle,
  ArrowRight,
  Wand2,
  PhoneCall,
  Info,
  Users,
  Flower2,
  Dumbbell,
  Moon,
  BatteryLow,
  NotebookPen,
  Utensils,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import panicImg from "@/assets/panic.png";

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
                Understanding <span className="md:block">Panic Attacks</span>
              </h1>
              <p className="mt-3 md:mt-4 text-base md:text-lg leading-relaxed" style={{ color: COLORS.muted }}>
                A panic attack is a sudden wave of intense fear and body sensations that peaks quickly.
                It feels dangerous—but it’s not harmful by itself. Learn how to ride the wave and reduce future attacks.
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
                <a href="#grounding">
                  <Button
                    size="lg"
                    className="px-6 py-6 md:px-7 md:py-6 rounded-2xl text-base md:text-lg font-semibold"
                    style={{ background: COLORS.primary2, color: COLORS.white, boxShadow: "0 14px 30px rgba(124,58,237,0.35)" }}
                  >
                    Try grounding <Wand2 className="w-4 h-4 ml-2" />
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
                  src={panicImg}
                  alt="Panic attack—racing heart & breath illustration"
                  className="mx-auto w-full max-w-[420px] h-auto object-contain rounded-xl"
                />
              </div>
              <div className="p-4 border-t" style={{ borderColor: COLORS.border }}>
                <div className="flex items-center gap-2 text-sm" style={{ color: COLORS.muted }}>
                  <Activity className="w-4 h-4" style={{ color: "#10b981" }} />
                  You can learn skills to ride out attacks and reduce their frequency.
                </div>
              </div>
            </SoftCard>
          </div>
        </div>
      </SoftCard>
    </Section>
  </div>
);

/* --------------------------- Tiles: What is a panic attack? --------------------------- */
const WhatTiles: React.FC = () => {
  const tiles = [
    { emoji: "⚡", title: "Sudden surge", blurb: "Intense fear + body signals (heart, breath, dizziness) that rise fast and then fall." },
    { emoji: "🧠", title: "False alarm", blurb: "Your threat system fires when there’s no real danger. Scary—yet not dangerous." },
    { emoji: "🛠️", title: "Treatable", blurb: "Skills, gradual exposure, and support help attacks become rarer and less intense." },
  ];
  return (
    <Section id="what" className="py-10 md:py-14">
      <SectionHeader title="What is a panic attack?" subtitle="Panic (or severe anxiety) that occasionally happens when we encounter a stressful or serious event with drastic outcomes is normal. However, when a person has severe, recurrent panic attacks which cause significant impairment to his life, he may be suffering from panic disorder." />
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

/* --------------------------- Self-Assessment (last 2 weeks) --------------------------- */
type Choice = 0 | 1 | 2 | 3;
const PANIC_QUESTIONS: string[] = [
  "Racing or pounding heartbeat",
  "Shortness of breath or feeling smothered",
  "Chest tightness or pain",
  "Dizziness, lightheadedness, or unsteadiness",
  "Nausea, stomach upset, or chills/heat",
  "Tingling or numbness in hands/face",
  "Sudden fear of losing control or “going crazy”",
  "Sudden fear of dying during episodes",
  "Avoided places/situations because of fear of panic",
  "Worry about having another attack",
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
  if (score <= 22) return { label: "High", color: "#f97316", bar: 80 };
  return { label: "Very high", color: "#ef4444", bar: 95 };
};

const SelfAssessment: React.FC = () => {
  const [answers, setAnswers] = useState<(Choice | null)[]>(Array(PANIC_QUESTIONS.length).fill(null));
  const [step, setStep] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const progress = Math.round((step / PANIC_QUESTIONS.length) * 100);
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
    if (step < PANIC_QUESTIONS.length - 1) setStep(step + 1);
    else setShowResult(true);
  };
  const prev = () => setStep((s) => Math.max(0, s - 1));
  const reset = () => {
    setAnswers(Array(PANIC_QUESTIONS.length).fill(null));
    setStep(0);
    setShowResult(false);
  };

  return (
    <Section id="check-in" className="py-10 md:py-14">
      <SectionHeader
        title="Panic Symptoms Self-Check"
        subtitle="About the last 2 weeks. Not a diagnosis—just a gentle snapshot to guide next steps."
      />
      <SoftCard className="p-0 overflow-hidden">
        {/* progress */}
        <div className="p-5 border-b" style={{ borderColor: COLORS.border }}>
          <div className="flex items-center justify-between text-sm" style={{ color: COLORS.muted }}>
            <span>Question {Math.min(step + 1, PANIC_QUESTIONS.length)} / {PANIC_QUESTIONS.length}</span>
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
                  {PANIC_QUESTIONS[step]}
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
                  {step < PANIC_QUESTIONS.length - 1 ? "Next" : "See results"}
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
                    If attacks are frequent or you’re avoiding life because of fear of panic, consider talking with a professional.
                    If you’re in immediate danger or thinking of harming yourself, use the helplines below or emergency services now.
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
    </Section>
  );
};

/* ---------- FlipCard + Myths ---------- */
const FlipCard: React.FC<{ front: React.ReactNode; back: React.ReactNode }> = ({ front, back }) => (
  <div className="[perspective:1200px]">
    <div className="relative h-56 w-full transition-transform duration-500 [transform-style:preserve-3d] group hover:[transform:rotateY(180deg)]">
      <div className="absolute inset-0 [backface-visibility:hidden]"><SoftCard className="h-full flex items-center justify-center text-center p-6">{front}</SoftCard></div>
      <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
        <SoftCard className="h-full flex items-center justify-center text-center bg-gradient-to-br from-indigo-50 to-violet-50 p-6">{back}</SoftCard>
      </div>
    </div>
  </div>
);

const Misconceptions: React.FC = () => {
  const items = [
    { emoji: "❤️", myth: "A panic attack means I’m having a heart attack.", fact: "It feels intense, but panic symptoms are a false alarm and not dangerous by themselves. Checkups rule out medical causes." },
    { emoji: "⚡", myth: "I must escape or it will get worse.", fact: "Staying, breathing, and letting the wave pass teaches your brain it’s safe." },
    { emoji: "🔁", myth: "Once they start, they never stop.", fact: "Panic peaks and falls within minutes. Skills shorten and soften the wave." },
    { emoji: "☕", myth: "Caffeine helps me focus during panic.", fact: "It can amplify the same sensations (racing heart, jitters). Reducing it helps many people." },
    { emoji: "🧱", myth: "I should avoid all triggers forever.", fact: "Gentle, planned exposure between attacks rebuilds confidence." },
    { emoji: "🧘", myth: "Breathing exercises don’t help panic.", fact: "Slow, steady breathing calms the body’s alarm system and reduces panic symptoms." },
 
  ];
  return (
    <Section className="py-10 md:py-14">
      <SectionHeader title="Myths vs Facts" subtitle="Hover (or tap) each card to reveal the fact." />
      <div className="grid md:grid-cols-3 gap-5">
        {items.map((it, i) => (
          <FlipCard
            key={i}
            front={<div className="flex flex-col items-center justify-center h-full"><div className="text-6xl mb-3">{it.emoji}</div><p className="font-semibold text-center" style={{ color: COLORS.ink }}>{it.myth}</p></div>}
            back={<div className="flex flex-col items-center justify-center h-full p-4"><p className="text-sm md:text-base text-center" style={{ color: COLORS.muted }}>{it.fact}</p></div>}
          />
        ))}
      </div>
    </Section>
  );
};

/* --------------------------- Grounding Toolkit --------------------------- */
const GroundingToolkit: React.FC = () => (
  <Section id="grounding" className="py-10 md:py-14">
    <SectionHeader title="During-an-attack: Quick tools" subtitle="These help your body signal ‘I’m safe’ so the wave can pass." />
    <div className="grid md:grid-cols-2 gap-5">
      <FeatureRow
        icon={Wind}
        title="Paced breathing (4–6)"
        blurb="Inhale through nose 4s, slow exhale through mouth 6s. 1–3 minutes. Longer exhales calm the system."
      />
      <FeatureRow
        icon={Flower2}
        title="5–4–3–2–1 grounding"
        blurb="Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste. Keep eyes open if dizzy."
      />
      <FeatureRow
        icon={Users}
        title="Co-regulate"
        blurb="Call/message someone safe. Ask them to breathe with you slowly for 60–120 seconds."
      />
      <FeatureRow
        icon={AlertTriangle}
        title="Name it"
        blurb="Say: “This is a panic wave. It feels awful, not dangerous. It will pass.” Then return to slow breathing."
      />
    </div>

    <div className="mt-6 rounded-2xl p-5 border" style={{ borderColor: COLORS.border }}>
      <p className="text-sm" style={{ color: COLORS.muted }}>
        Tip: Avoid breath-holding or rapid over-breathing. Sit upright, feet on floor, loosen tight clothing, sip water.
      </p>
    </div>
  </Section>
);

/* --------------------------- Understanding & Skills (Tabbed) --------------------------- */
const SkillsTabs: React.FC = () => {
  type Key = "during" | "between" | "seek";
  const [tab, setTab] = useState<Key>("during");

  const DATA: Record<Key, { title: string; body: string; video?: string }> = {
    during: {
      title: "During an attack",
      body:
        "Focus on body-down tools: paced breathing, grounding, labeling the wave, and letting it crest and fall. Resisting or escaping can teach your brain that the sensations themselves are dangerous.",
      video: "WGG7MGgptxE", // placeholder – replace with your chosen video ID
        
    },
    between: {
      title: "Between attacks",
      body:
        "Build tolerance gradually. Track caffeine, sleep, and stress. Try graded exposure: intentionally bring on mild sensations (e.g., light jogging, spinning) while breathing calmly to retrain safety.Learn the 5-4-3-2-1 Methond.",
      video: "30VMIEmA114",
    },
    seek: {
      title: "When to seek help",
      body:
        "If attacks are frequent, you’re avoiding important places, or you worry constantly about the next attack, CBT with exposure works well. Medical checkups can rule out other causes of similar sensations.",
      video: "kmOu30OWW2k",
    },
  };

  return (
    <Section className="py-10 md:py-14">
      <SectionHeader title="What helps most" subtitle="Right-now tools, long-term skills, and when to get extra support." />
      <div className="grid md:grid-cols-[260px,1fr] gap-6">
        <div className="space-y-3">
          {(
            [
              { k: "during", label: "During an attack" },
              { k: "between", label: "Between attacks" },
              { k: "seek", label: "When to seek help" },
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
                  title="Panic management"
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

/* --------------------------- Symptoms & Coping --------------------------- */
const SymptomsAndCoping: React.FC = () => (
  <Section id="symptoms" className="py-10 md:py-14">
    <SectionHeader
      title="Common Signs & Symptoms"
      subtitle="They feel scary, but they’re a false alarm from your nervous system."
    />
    <div className="grid gap-4 md:gap-5">
      <FeatureRow icon={Wind} title="Shortness of breath" blurb="Breath feels stuck, shallow, or too fast." />
      <FeatureRow icon={AlertTriangle} title="Recurrent/unexpected attacks" blurb="Getting a panic attack regularly or suddenly." />
      <FeatureRow icon={AlertTriangle} title="Surge of fear" blurb="Intense dread—‘something bad will happen now. Worry about the implications of the attack or its consequences (for example, losing control, having a heart attack and “going crazy”)." />
      <FeatureRow icon={BatteryLow} title="Shaky, hot/cold, numb" blurb="Adrenaline sensations, tingling in hands/face. Cold sweats." />
      <FeatureRow icon={Moon} title="After-crash fatigue" blurb="Tired and foggy once the wave passes." />
      <FeatureRow icon={Brain} title="Fear of fear" blurb="Worry about the next attack; avoiding triggers." />
    </div>

    <div
      className="rounded-3xl p-6 md:p-10 mt-10"
      style={{ background: "rgba(79,70,229,0.06)", border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow }}
    >
      <SectionHeader title="Gentle coping strategies" subtitle="Practice between attacks to make waves smaller." />
      <div className="grid gap-4 md:gap-5 md:grid-cols-2">
        <FeatureRow icon={Wind} title="Paced breathing (4–6)" blurb="Longer, slower exhales calm the alarm." />
        <FeatureRow icon={Dumbbell} title="Micro-movement" blurb="Walk 2–5 mins or stretch to discharge adrenaline." />
        <FeatureRow icon={NotebookPen} title="Trigger log" blurb="Note where/when attacks happen; plan tiny exposures." />
        <FeatureRow icon={Utensils} title="Reduce caffeine" blurb="Coffee/energy drinks can mimic panic sensations." />
        <FeatureRow icon={Users} title="Support" blurb="Share a plan with a trusted person to call/text during waves." />
        <FeatureRow icon={Flower2} title="Body scan / PMR" blurb="Progressive muscle relaxation or 60-second body scan." />
      </div>
    </div>
  </Section>
);

/* --------------------------- Treatment for Panic Disorder --------------------------- */
import { HeartPulse, Pill, BookOpen, CheckCircle2} from "lucide-react";

const PanicTreatment: React.FC = () => (
  <Section id="panic-treatment" className="py-10 md:py-14">
    <SectionHeader
      title="How to Treat Panic Disorder"
      subtitle="Early assessment helps. Psychotherapy, medicine, and practical supports work best together. Treatment plans and medication should be provided by a doctor. Do not self diagnose or self medicate."
    />

    {/* Overview */}
    <SoftCard className="p-6 mb-6">
      <div className="flex items-start gap-3">
        <Info className="w-6 h-6" style={{ color: COLORS.primary }} />
        <div>
          <p className="text-sm md:text-base" style={{ color: COLORS.muted }}>
            Without help, panic attacks can occur several times a week or even daily, sometimes for months or
            years—especially when agoraphobia develops. People may have periods of full or partial remission
            (fewer or no attacks) between flare-ups. Early assessment and treatment are essential.
          </p>
        </div>
      </div>
    </SoftCard>

    <div className="grid gap-5 md:grid-cols-2">
      {/* Psychotherapy */}
      <SoftCard className="p-0">
        <div className="p-6 flex items-start gap-3">
          <Brain className="w-6 h-6" style={{ color: COLORS.primary }} />
          <div>
            <h4 className="text-lg md:text-xl font-semibold" style={{ color: COLORS.ink }}>
              Psychotherapy
            </h4>
            <p className="mt-1 text-sm md:text-base" style={{ color: COLORS.muted }}>
              First-line care that teaches skills to reduce fear and prevent escalation.
            </p>
          </div>
        </div>
        <div className="border-t" style={{ borderColor: COLORS.border }} />
        <ul className="p-6 pt-4 list-disc pl-6 space-y-1.5" style={{ color: COLORS.muted }}>
          <li>
            <strong>CBT (Cognitive Behavioural Therapy):</strong> identifies and reshapes automatic
            thoughts/beliefs linked to panic; includes interoceptive and situational exposure.
          </li>
          <li>
            <strong>IPT / Psychodynamic therapy:</strong> addresses relationship patterns and past conflicts that
            keep symptoms going.
          </li>
          <li>
            <strong>Relaxation & breathing skills:</strong> used to stop or prevent symptoms from escalating.
          </li>
        </ul>
      </SoftCard>

      {/* Medication */}
      <SoftCard className="p-0">
        <div className="p-6 flex items-start gap-3">
          <Pill className="w-6 h-6" style={{ color: COLORS.primary }} />
          <div>
            <h4 className="text-lg md:text-xl font-semibold" style={{ color: COLORS.ink }}>
              Medication
            </h4>
            <p className="mt-1 text-sm md:text-base" style={{ color: COLORS.muted }}>
              Can reduce panic and treat co-existing anxiety/depressive symptoms.
            </p>
          </div>
        </div>
        <div className="border-t" style={{ borderColor: COLORS.border }} />
        <ul className="p-6 pt-4 list-disc pl-6 space-y-1.5" style={{ color: COLORS.muted }}>
          <li>
            <strong>Antidepressants (e.g., SSRIs/SNRIs):</strong> help correct brain-chemistry imbalances linked
            to panic symptoms.
          </li>
          <li>Choice and dosing are individualized by a clinician; allow time for effect and review side-effects.</li>
        </ul>
      </SoftCard>

      {/* Combined care */}
      <SoftCard className="p-0">
        <div className="p-6 flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6" style={{ color: COLORS.primary }} />
          <div>
            <h4 className="text-lg md:text-xl font-semibold" style={{ color: COLORS.ink }}>
              Combined Treatment
            </h4>
            <p className="mt-1 text-sm md:text-base" style={{ color: COLORS.muted }}>
              Therapy + medication often gives the best results.
            </p>
          </div>
        </div>
        <div className="border-t" style={{ borderColor: COLORS.border }} />
        <ul className="p-6 pt-4 list-disc pl-6 space-y-1.5" style={{ color: COLORS.muted }}>
          <li>Many notice meaningful improvement within about 6–8 weeks.</li>
          <li>Therapy can boost medication effect, help when meds alone aren’t enough, and lower relapse risk.</li>
          <li>Screen and treat related issues (e.g., depression, alcohol/tranquiliser misuse) to support recovery.</li>
        </ul>
      </SoftCard>

      {/* Other support */}
      <SoftCard className="p-0">
        <div className="p-6 flex items-start gap-3">
          <Users className="w-6 h-6" style={{ color: COLORS.primary }} />
          <div>
            <h4 className="text-lg md:text-xl font-semibold" style={{ color: COLORS.ink }}>
              Other Support
            </h4>
            <p className="mt-1 text-sm md:text-base" style={{ color: COLORS.muted }}>
              Practical resources that make everyday coping easier.
            </p>
          </div>
        </div>
        <div className="border-t" style={{ borderColor: COLORS.border }} />
        <ul className="p-6 pt-4 list-disc pl-6 space-y-1.5" style={{ color: COLORS.muted }}>
          <li>Self-help and peer groups; local helplines and reputable websites.</li>
          <li>Healthy routines: stress management, regular activity, balanced diet, sleep, and reduced caffeine.</li>
          <li>Build awareness of personal triggers and early-warning signs between attacks.</li>
        </ul>
      </SoftCard>
    </div>

    {/* Helpful note */}
    <div className="mt-6">
      <SoftCard className="p-5">
        <div className="flex items-start gap-3">
          <HeartPulse className="w-5 h-5" style={{ color: "#10b981" }} />
          <p className="text-sm md:text-base" style={{ color: COLORS.muted }}>
            If symptoms are severe, frequent, or limit daily life, seek a professional assessment. Early help
            improves outcomes.
          </p>
        </div>
      </SoftCard>
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
const Panic: React.FC = () => {
  return (
    <div className="min-h-screen" style={{ background: COLORS.page }}>
      <Hero />
      <WhatTiles />
      <Misconceptions />      
      <SelfAssessment />
      <GroundingToolkit />
      <SkillsTabs />
      <SymptomsAndCoping />
      <PanicTreatment />

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
      title: "WHO – Panic Disorder", 
      url: "https://applications.emro.who.int/docs/WHOEMMNH233E-eng.pdf",
      desc: "World Health Organization fact sheet on Panic Disorder"
    },
    { 
      title: "HealthHub SG – Panic Disorder", 
      url: "https://www.healthhub.sg/health-conditions/panic-disorder-symptoms-management",
      desc: "Singapore’s national health portal: Panic Disorder"
    },
    { 
      title: "National Institute of Mental Health", 
      url: "https://www.nimh.nih.gov/health/publications/panic-disorder-when-fear-overwhelms",
      desc: "Detailed breakdown on Panic Disorder"
    },
    { 
      title: "Institute of Mental Health - Singapore", 
      url: "https://www.imh.com.sg/Mental-Health-Resources/Conditions-and-Challenges/Pages/Panic-Disorder.aspx",
      desc: "Singapore's Mental Health Institute Resource and Details"
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

export default Panic;
