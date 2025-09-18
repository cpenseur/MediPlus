import React, { useState } from "react";
import {
  AlertTriangle,
  Brain,
  Wind,
  HeartPulse,
  Moon,
  Activity,
  HelpCircle,
  Users,
  Flower2,
  NotebookPen,
  Utensils,
  Dumbbell,
  PhoneCall,
  Info,
  ArrowRight,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import anxiety from "@/assets/anxiety.png";

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
const Section: React.FC<React.PropsWithChildren<{ id?: string; className?: string }>> = ({ id, className, children }) => (
  <section id={id} className={`max-w-6xl mx-auto px-4 ${className ?? ""}`}>{children}</section>
);

const SectionHeader: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="text-center mb-8 md:mb-10">
    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3" style={{ color: COLORS.ink }}>{title}</h2>
    <div className="mx-auto mb-3 h-[10px] w-24 rounded-full blur-[1px]"
         style={{ background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.primary2})` }} />
    {subtitle && <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: COLORS.muted }}>{subtitle}</p>}
  </div>
);

const SoftCard: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className, children }) => (
  <div className={`rounded-2xl bg-white ${className ?? ""}`} style={{ boxShadow: COLORS.shadow, border: `1px solid ${COLORS.border}` }}>
    {children}
  </div>
);

const FeatureRow: React.FC<{ icon: React.ElementType; title: string; blurb: string }> = ({ icon: Icon, title, blurb }) => (
  <SoftCard className="p-5 sm:p-6">
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl shrink-0"
           style={{ background: COLORS.primarySoft, border: `1px solid ${COLORS.border}` }}>
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
    <div className="absolute inset-0 -z-10 opacity-70 pointer-events-none">
      <div className="absolute -top-24 -left-24 w-[40rem] h-[40rem] rounded-full blur-3xl"
           style={{ background: "radial-gradient(circle at 30% 30%, #C7D2FE, transparent 60%)" }} />
      <div className="absolute -bottom-32 -right-24 w-[42rem] h-[42rem] rounded-full blur-3xl"
           style={{ background: "radial-gradient(circle at 70% 70%, #E9D5FF, transparent 60%)" }} />
    </div>

    <Section className="py-8 md:py-12">
      <SoftCard className="overflow-hidden">
        <div className="p-6 md:p-10" style={{ background: COLORS.card }}>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-[32px] leading-tight md:text-[44px] md:leading-[1.1] font-extrabold tracking-tight mt-3" style={{ color: COLORS.ink }}>
                Understanding <span className="md:block">Anxiety</span>
              </h1>
              <p className="mt-3 md:mt-4 text-base md:text-lg leading-relaxed" style={{ color: COLORS.muted }}>
                Anxiety is common and treatable. Learn what’s happening in your body and mind—and small steps that help today.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                <a href="#what">
                  <Button size="lg" className="px-6 py-6 md:px-7 md:py-6 rounded-2xl text-base md:text-lg font-semibold"
                          style={{ background: COLORS.primary, color: COLORS.white, boxShadow: "0 14px 30px rgba(79,70,229,0.35)" }}>
                    Start exploring <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
                <a href="#check-in">
                  <Button size="lg" className="px-6 py-6 md:px-7 md:py-6 rounded-2xl text-base md:text-lg font-semibold"
                          style={{ background: COLORS.primary2, color: COLORS.white, boxShadow: "0 14px 30px rgba(124,58,237,0.35)" }}>
                    Try self-check <Wand2 className="w-4 h-4 ml-2" />
                  </Button>
                </a>
                <a href="#help">
                  <Button variant="outline" className="px-6 py-6 md:px-7 md:py-6 rounded-2xl text-base md:text-lg font-semibold"
                          style={{ borderColor: COLORS.primary, color: COLORS.primary }}>
                    Get help now
                  </Button>
                </a>
              </div>
            </div>

            <SoftCard className="p-0 overflow-hidden">
              <div className="p-5 md:p-6">
                <img
                  src={anxiety}
                  alt="anxiety illustration"
                  className="mx-auto w-full max-w-[420px] h-auto object-contain rounded-xl"
                />
              </div>                
              <div className="p-4 border-t" style={{ borderColor: COLORS.border }}>
                <div className="flex items-center gap-2 text-sm" style={{ color: COLORS.muted }}>
                  <Activity className="w-4 h-4" style={{ color: "#10b981" }} />
                  You’re not alone—support and recovery are absolutely possible.
                </div>
              </div>
            </SoftCard>
          </div>
        </div>
      </SoftCard>
    </Section>
  </div>
);

/* --------------------------- What is anxiety? --------------------------- */
const WhatTiles: React.FC = () => {
  const tiles = [
    { emoji: "⚡", title: "Body alarm", blurb: "Racing heart, tense muscles—your threat system firing even when danger isn’t present." },
    { emoji: "🧠", title: "Thinking loops", blurb: "Worry spirals, ‘what-ifs’, difficulty switching off." },
    { emoji: "🌊", title: "Waves not lines", blurb: "Comes in waves; skills help you ride them rather than fight them." },
  ];
  return (
    <Section id="what" className="py-10 md:py-14">
      <SectionHeader title="What is anxiety?" subtitle="Anxiety and fear are common emotions. But, while fear is a normal response to a perceived threat, anxiety is an unwarranted or inappropriate fear or response to a vague or ill-defined threat.

Anxiety can be a normal or an appropriate emotion when dealing with day-to-day stresses or problems. However, when anxiety is persistent, excessive and irrational, this may affect the way a person leads his life. When this happens, the anxiety becomes an abnormal condition or disorder." />
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

/* --------------------------- Self-Assessment (GAD-7 style) --------------------------- */
type Choice = 0 | 1 | 2 | 3;
const GAD7_QUESTIONS: string[] = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it’s hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid as if something awful might happen",
];
const CHOICES: { label: string; value: Choice; helper: string; emoji: string }[] = [
  { label: "Not at all", value: 0, helper: "0 days", emoji: "🙂" },
  { label: "Several days", value: 1, helper: "1–7 days", emoji: "😕" },
  { label: "More than half", value: 2, helper: "8–11 days", emoji: "😟" },
  { label: "Nearly every day", value: 3, helper: "12–14 days", emoji: "😣" },
];
const severityFromScore = (score: number) => {
  if (score <= 4) return { label: "Minimal", color: "#10b981", bar: 15 };
  if (score <= 9) return { label: "Mild", color: "#22c55e", bar: 35 };
  if (score <= 14) return { label: "Moderate", color: "#eab308", bar: 60 };
  return { label: "Severe", color: "#ef4444", bar: 90 };
};

const SelfAssessment: React.FC = () => {
  const [answers, setAnswers] = useState<(Choice | null)[]>(Array(GAD7_QUESTIONS.length).fill(null));
  const [step, setStep] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const progress = Math.round((step / GAD7_QUESTIONS.length) * 100);
  const score = answers.reduce((s, a) => s + (a ?? 0), 0);
  const severity = severityFromScore(score);

  const next = () => (step < GAD7_QUESTIONS.length - 1 ? setStep(step + 1) : setShowResult(true));
  const prev = () => setStep((s) => Math.max(0, s - 1));
  const reset = () => {
    setAnswers(Array(GAD7_QUESTIONS.length).fill(null));
    setStep(0);
    setShowResult(false);
  };

  return (
    <Section id="check-in" className="py-10 md:py-14">
      <SectionHeader title="Gentle Self-Check" subtitle="This short quiz looks at common signs of Generalized Anxiety Disorder (GAD) over the past 2 weeks. 
It’s just for reflection and awareness — not a diagnosis."/>
      <SoftCard className="p-0 overflow-hidden">
        <div className="p-5 border-b" style={{ borderColor: COLORS.border }}>
          <div className="flex items-center justify-between text-sm" style={{ color: COLORS.muted }}>
            <span>Question {Math.min(step + 1, GAD7_QUESTIONS.length)} / {GAD7_QUESTIONS.length}</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-200 overflow-hidden">
            <div className="h-full transition-all duration-500"
                 style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.primary2})` }} />
          </div>
        </div>

        <div className="p-5 md:p-8">
          {!showResult ? (
            <>
              <div className="rounded-2xl p-5 border" style={{ borderColor: COLORS.border }}>
                <p className="text-xl font-bold mb-3" style={{ color: COLORS.ink }}>{GAD7_QUESTIONS[step]}</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {CHOICES.map((c) => {
                    const active = answers[step] === c.value;
                    return (
                      <button key={c.value} onClick={() => {
                        const next = [...answers]; next[step] = c.value; setAnswers(next);
                      }} className="group text-left rounded-xl p-4 border transition-all"
                        style={{
                          borderColor: active ? COLORS.primary : COLORS.border,
                          background: active ? COLORS.primarySoft : "#fff",
                          color: active ? COLORS.ink : COLORS.muted,
                        }}>
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
                <Button variant="outline" onClick={prev} className="rounded-xl"
                        style={{ borderColor: COLORS.primary, color: COLORS.primary }} disabled={step === 0}>
                  Back
                </Button>
                <Button onClick={next} className="rounded-xl"
                        style={{ background: answers[step] !== null ? COLORS.primary : "#c7d2fe", color: "#fff" }}
                        disabled={answers[step] === null}>
                  {step < GAD7_QUESTIONS.length - 1 ? "Next" : "See results"}
                </Button>
                <Button variant="outline" onClick={reset} className="rounded-xl"
                        style={{ borderColor: COLORS.border, color: COLORS.muted }}>
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
                    <div className="h-full transition-all"
                         style={{ width: `${severity.bar}%`, background: "linear-gradient(90deg,#10b981,#eab308,#ef4444)" }} />
                  </div>
                  <p className="text-sm mt-4" style={{ color: COLORS.muted }}>
                    This tool can’t diagnose. If your score is moderate or higher—or you feel overwhelmed—consider reaching out.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a href="#help"><Button className="rounded-xl" style={{ background: COLORS.primary, color: "#fff" }}>
                      See helplines & support</Button></a>
                    <Button variant="outline" className="rounded-xl" onClick={reset}
                            style={{ borderColor: COLORS.primary, color: COLORS.primary }}>
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
        If you’re in immediate danger or feel unable to keep yourself safe, please use the helplines below or local emergency services now.
      </p>
    </Section>
  );
};

/* ---------- FlipCard + Myths ---------- */
const FlipCard: React.FC<{ front: React.ReactNode; back: React.ReactNode }> = ({ front, back }) => (
  <div className="[perspective:1200px]">
    <div className="relative h-56 w-full transition-transform duration-500 [transform-style:preserve-3d] hover:[transform:rotateY(180deg)]">
      <div className="absolute inset-0 [backface-visibility:hidden]">
        <SoftCard className="h-full flex items-center justify-center text-center p-6">{front}</SoftCard>
      </div>
      <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
        <SoftCard className="h-full flex items-center justify-center text-center bg-gradient-to-br from-indigo-50 to-violet-50 p-6">{back}</SoftCard>
      </div>
    </div>
  </div>
);

const Misconceptions: React.FC = () => {
  const items = [
    { emoji: "🌀", myth: "Anxiety means something is wrong with me.", fact: "It’s a normal alarm system that can become over-sensitive—and it’s treatable." },
    { emoji: "⏱️", myth: "It will be like this forever.", fact: "Skills, therapy, and lifestyle changes can calm the system over time." },
    { emoji: "💪", myth: "I should just toughen up.", fact: "Anxiety isn’t weakness; it’s physiology + thoughts. Tools re-train both." },
    { emoji: "🗣️", myth: "Talking about it makes it worse.", fact: "Naming sensations and thoughts reduces fear and avoidance." },
    { emoji: "🥤", myth: "Caffeine helps me push through.", fact: "It can mimic panic sensations. Tracking intake often helps." },
    // NEW card to fill the bottom-right slot:
    { emoji: "💊", myth: "Medication is the only fix.", fact: "Many improve with Cognitive Behavioural Therapy and skills; medication helps some, but it’s not the only path." },
  ];
  return (
    <Section className="py-10 md:py-14">
      <SectionHeader title="Myths vs Facts" subtitle="Hover (or tap) each card to reveal the fact." />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {items.map((it, i) => (
          <FlipCard
            key={i}
            front={
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-6xl mb-3">{it.emoji}</div>
                <p className="font-semibold text-center" style={{ color: COLORS.ink }}>
                  {it.myth}
                </p>
              </div>
            }
            back={
              <div className="flex flex-col items-center justify-center h-full p-4">
                <p className="text-sm md:text-base text-center" style={{ color: COLORS.muted }}>
                  {it.fact}
                </p>
              </div>
            }
          />
        ))}
      </div>
    </Section>
  );
};


/* ---------- Types (Tabbed) ---------- */
const TypesOfAnxiety: React.FC = () => {
  type Key = "gad" | "sad" | "panic" | "phobia";
  const [tab, setTab] = useState<Key>("gad");

  const DATA: Record<Key, { title: string; body: string; video?: string }> = {
    gad: {
      title: "Generalized Anxiety (GAD)",
      body: "Excessive worry most days for months with restlessness, tension, sleep/focus issues.",
      video: "9mPwQTiMSj8",
    },
    sad: {
      title: "Social Anxiety",
      body: "Intense fear of judgment/embarrassment in social or performance situations; strong avoidance.",
      video: "QLjPrNe63kk",
    },
    panic: {
      title: "Panic Disorder",
      body: "Unexpected panic attacks + fear/avoidance of future attacks.",
      video: "YxELZyA2bJs",
    },
    phobia: {
      title: "Specific Phobias",
      body: "Intense fear of particular objects/situations (e.g., flying, needles, heights) with avoidance.",
      video: "PCOg2G797ek",
    },    
  };

  return (
    <Section className="py-10 md:py-14">
      <SectionHeader title="Types of Anxiety Conditions" subtitle="Knowing the pattern guides the most helpful tools." />
      <div className="grid md:grid-cols-[260px,1fr] gap-6">
        <div className="space-y-3">
          {([{k:"gad",label:"GAD"},{k:"sad",label:"Social Anxiety"},{k:"panic",label:"Panic Disorder"},{k:"phobia",label:"Specific Phobias"}] as {k:Key;label:string}[]).map(({ k, label })=>{
            const active = tab === k;
            return (
              <button key={k} onClick={()=>setTab(k)}
                className="w-full text-left px-4 py-3 rounded-xl font-semibold"
                style={{ background: active ? "linear-gradient(90deg,#e0e7ff,#ede9fe)" : "#fff",
                         border: `2px solid ${active ? "#c7d2fe" : "#e5e7eb"}`, color: active ? COLORS.ink : COLORS.muted }}>
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
                  title="Understanding depression"
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
    <SectionHeader title="Common Signs & Symptoms" subtitle="Knowing patterns helps you respond skillfully." />
    <div className="grid gap-4 md:gap-5">
      <FeatureRow icon={AlertTriangle} title="Excessive worry" blurb="What-ifs that feel hard to stop." />
      <FeatureRow icon={AlertTriangle} title="Apprehension" blurb="Apprehensive to participate on simple activities" />
      <FeatureRow icon={HeartPulse} title="Physical tension" blurb="Muscle tension, Pounding heart (palpitations), Difficulty breathing" />
      <FeatureRow icon={Moon} title="Sleep disruption" blurb="Trouble falling or staying asleep." />
      <FeatureRow icon={Brain} title="Focus issues" blurb="Hard to concentrate or switch tasks." />
      <FeatureRow icon={Brain} title="Repeated Negative thoughts" blurb="Constant negative thoughts" />
    </div>

    <div className="rounded-3xl p-6 md:p-10 mt-10"
         style={{ background: "rgba(79,70,229,0.06)", border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow }}>
      <SectionHeader title="Coping skills you can try today" subtitle="Tiny, repeatable actions calm the system." />
      <div className="grid gap-4 md:gap-5 md:grid-cols-2">
        <FeatureRow icon={Wind} title="Box breathing" blurb="4-in, 4-hold, 4-out, 4-hold for 1–3 minutes." />
        <FeatureRow icon={Flower2} title="Grounding 5-4-3-2-1" blurb="Name things you see, feel, hear, smell, taste." />
        <FeatureRow icon={Users} title="Co-regulate" blurb="Text or call someone safe; share a worry." />
        <FeatureRow icon={NotebookPen} title="Worry window" blurb="Park worries to a 15-min slot; list, then close." />
        <FeatureRow icon={Utensils} title="Gentle care" blurb="Hydrate; steady snacks; limit caffeine spikes." />
        <FeatureRow icon={Dumbbell} title="Move lightly" blurb="Walk, stretch, or shake out tension." />
      </div>
    </div>
  </Section>
);

/* --------------------------- Treatment --------------------------- */
/* --------------------------- Treatment --------------------------- */
const Treatment: React.FC = () => (
  <Section id="treatment" className="py-10 md:py-14">
    <SectionHeader 
      title="Treatments for Anxiety Disorder" 
      subtitle="Effective options include therapy, medication, and healthy lifestyle strategies. Treatment plans and medication prescription should be provided by a licensed doctor. Do not self diagnose or self treat! " 
    />
    <div className="grid gap-5 md:grid-cols-2">
      <FeatureRow 
        icon={HelpCircle} 
        title="Medication & Psychotherapy" 
        blurb="Benzodiazepines and antidepressants can ease symptoms. When combined with therapies such as Cognitive Behaviour Theraphy or exposure therapy, they reduce relapse and improve long-term control." 
      />
      <FeatureRow 
        icon={Brain} 
        title="Early Treatment Matters" 
        blurb="Anxiety disorders respond well when identified early. Addressing symptoms promptly helps restore daily functioning and prevents worsening." 
      />
      <FeatureRow 
        icon={Activity} 
        title="Lifestyle Adjustments" 
        blurb="Recognize personal triggers and practice relaxation, exercise, and balanced routines. Small lifestyle changes can reduce stress and improve emotional well-being." 
      />
      <FeatureRow 
        icon={Users} 
        title="Holistic Recovery" 
        blurb="Combining medical care, psychological support, and healthy coping strategies gives the best chance of recovery and resilience." 
      />
    </div>
  </Section>
);




/* --------------------------- Helplines --------------------------- */
const HelpRail: React.FC = () => (
  <Section id="help" className="py-10 md:py-14">
    <SectionHeader title="Helplines" subtitle="Confidential • Kind • Free or low-cost in most places" />
    <div className="grid md:grid-cols-3 gap-6">
      {[
      { country: "Singapore", service: "Institute of Mental Health", num: "6389 2200" },
{ country: "Malaysia", service: "Befrienders KL (24-h emotional support)", num: "03-7627-2929" },
{ country: "Philippines", service: "National Center for Mental Health Crisis Hotline", num: "1553" },
{ country: "Thailand", service: "Samaritans of Thailand", num: "02-713-6793" },
{ country: "Indonesia", service: "Befrienders Indonesia", num: "+62-21-7884-0727" },
{ country: "Vietnam", service: "Vietnam Association for Mental Health", num: "024-3825-0299" },

      ].map((h) => (
        <SoftCard key={h.country} className="p-6 flex items-center justify-between">
          <div>
            <p className="font-semibold" style={{ color: COLORS.ink }}>{h.country}</p>
            <p className="text-sm" style={{ color: COLORS.muted }}>{h.service}</p>
          </div>
          <a href={`tel:${h.num}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold"
             style={{ background: "#f43f5e" }}>
            <PhoneCall className="w-4 h-4" /> {h.num}
          </a>
        </SoftCard>
      ))}
    </div>
  </Section>
);

/* --------------------------- Page --------------------------- */
const Anxiety: React.FC = () => {
  return (
    <div className="min-h-screen" style={{ background: COLORS.page }}>
      <Hero />
      <WhatTiles />
      <Misconceptions />
      <SelfAssessment />
      <TypesOfAnxiety />
      <SymptomsAndCoping />
      <Treatment /> 
      <HelpRail />
      <References/>       
      <a href="#top" className="fixed bottom-6 right-6 px-4 py-3 rounded-full text-white font-semibold"
         style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primary2})`, boxShadow: "0 16px 30px rgba(0,0,0,.18)" }}>
        Top ↑
      </a>
    </div>
  );
};

const References: React.FC = () => {
  const items = [
    { 
      title: "WHO – Anxiety", 
      url: "https://www.who.int/news-room/fact-sheets/detail/anxiety-disorders",
      desc: "World Health Organization fact sheet on anxiety-disorders"
    },
    { 
      title: "HealthHub SG – Anxiety", 
      url: "https://www.healthhub.sg/health-conditions/generalised-anxiety-disorder",
      desc: "There are many types of anxiety disorder. Learn their symptoms, so you can better seek treatment."
    },
    { 
      title: "National Institute of Mental Health - Anxiety", 
      url: "https://www.nimh.nih.gov/health/topics/anxiety-disorders",
      desc: "Information and research on anxiety"
    },
    { 
      title: "American Psychological Association - Anxiety", 
      url: "https://www.apa.org/topics/anxiety",
      desc: "More Resources for anxiety from APA"
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

export default Anxiety;
