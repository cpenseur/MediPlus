import React, { useState } from "react";
import {
  Sun,
  Moon,
  Zap,
  BatteryLow,
  Brain,
  Calendar,
  Users,
  NotebookPen,
  HelpCircle,
  Activity,
  PhoneCall,
  Info,
  ArrowRight,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import bipolar from "@/assets/bipolar.png";

const COLORS={page:"#F7F9FF",card:"#F1F4FF",ink:"#0F1A2A",muted:"#55627A",primary:"#4F46E5",primary2:"#7C3AED",primarySoft:"rgba(79,70,229,0.12)",border:"rgba(79,70,229,0.22)",white:"#ffffff",shadow:"0 16px 40px rgba(23,23,55,.10)"};
const Section:React.FC<React.PropsWithChildren<{id?:string;className?:string}>>=({id,className,children})=>(<section id={id} className={`max-w-6xl mx-auto px-4 ${className??""}`}>{children}</section>);
const SectionHeader:React.FC<{title:string;subtitle?:string}>=({title,subtitle})=>(
  <div className="text-center mb-8 md:mb-10">
    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3" style={{color:COLORS.ink}}>{title}</h2>
    <div className="mx-auto mb-3 h-[10px] w-24 rounded-full blur-[1px]" style={{background:`linear-gradient(90deg, ${COLORS.primary}, ${COLORS.primary2})`}}/>
    {subtitle&&<p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{color:COLORS.muted}}>{subtitle}</p>}
  </div>
);
const SoftCard:React.FC<React.PropsWithChildren<{className?:string}>>=({className,children})=>(
  <div className={`rounded-2xl bg-white ${className??""}`} style={{boxShadow:COLORS.shadow,border:`1px solid ${COLORS.border}`}}>{children}</div>
);
const FeatureRow:React.FC<{icon:React.ElementType;title:string;blurb:string}>=({icon:Icon,title,blurb})=>(
  <SoftCard className="p-5 sm:p-6">
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl shrink-0" style={{background:COLORS.primarySoft,border:`1px solid ${COLORS.border}`}}>
        <Icon className="h-6 w-6" style={{color:COLORS.primary}}/>
      </div>
      <div><h4 className="text-lg md:text-xl font-semibold mb-1" style={{color:COLORS.ink}}>{title}</h4>
        <p className="text-sm md:text-base leading-relaxed" style={{color:COLORS.muted}}>{blurb}</p></div>
    </div>
  </SoftCard>
);

/* Hero */
const Hero:React.FC=()=>(
  <div className="relative overflow-hidden" id="top">
    <div className="absolute inset-0 -z-10 opacity-70 pointer-events-none">
      <div className="absolute -top-24 -left-24 w-[40rem] h-[40rem] rounded-full blur-3xl" style={{background:"radial-gradient(circle at 30% 30%, #C7D2FE, transparent 60%)"}}/>
      <div className="absolute -bottom-32 -right-24 w-[42rem] h-[42rem] rounded-full blur-3xl" style={{background:"radial-gradient(circle at 70% 70%, #E9D5FF, transparent 60%)"}}/>
    </div>
    <Section className="py-8 md:py-12">
      <SoftCard className="overflow-hidden">
        <div className="p-6 md:p-10" style={{background:COLORS.card}}>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-[32px] leading-tight md:text-[44px] md:leading-[1.1] font-extrabold tracking-tight mt-3" style={{color:COLORS.ink}}>
                Understanding <span className="md:block">Bipolar Disorder</span>
              </h1>
              <p className="mt-3 md:mt-4 text-base md:text-lg leading-relaxed" style={{color:COLORS.muted}}>
                Bipolar involves mood episodes—highs (mania/hypomania) and lows (depression). Treatment and routines help stability.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                <a href="#what"><Button size="lg" className="px-6 py-6 md:px-7 md:py-6 rounded-2xl text-base md:text-lg font-semibold"
                  style={{background:COLORS.primary,color:COLORS.white,boxShadow:"0 14px 30px rgba(79,70,229,0.35)"}}>Start exploring <ArrowRight className="w-4 h-4 ml-2"/></Button></a>
                <a href="#check-in"><Button size="lg" className="px-6 py-6 md:px-7 md:py-6 rounded-2xl text-base md:text-lg font-semibold"
                  style={{background:COLORS.primary2,color:COLORS.white,boxShadow:"0 14px 30px rgba(124,58,237,0.35)"}}>Try self-check <Wand2 className="w-4 h-4 ml-2"/></Button></a>
                <a href="#help"><Button variant="outline" className="px-6 py-6 md:px-7 md:py-6 rounded-2xl text-base md:text-lg font-semibold"
                  style={{borderColor:COLORS.primary,color:COLORS.primary}}>Get help now</Button></a>
              </div>
            </div>
            <SoftCard className="p-0 overflow-hidden">
              <div className="p-5 md:p-6">
                <img
                  src={bipolar}
                  alt="bipolar illustration"
                  className="mx-auto w-full max-w-[420px] h-auto object-contain rounded-xl"
                />
              </div>
              <div className="p-4 border-t" style={{borderColor:COLORS.border}}>
                <div className="flex items-center gap-2 text-sm" style={{color:COLORS.muted}}>
                  <Activity className="w-4 h-4" style={{color:"#10b981"}}/> Stability is buildable with the right plan.
                </div>
              </div>
            </SoftCard>
          </div>
        </div>
      </SoftCard>
    </Section>
  </div>
);

/* What is Bipolar */
const WhatTiles:React.FC=()=>{
  const tiles=[{emoji:"☀️",title:"Highs (mania/hypomania)",blurb:"Elevated/irritable mood, less sleep, fast thoughts/speech, risky actions."},
               {emoji:"🌧️",title:"Lows (depression)",blurb:"Low energy, sadness, loss of interest, sleep/appetite changes."},
               {emoji:"📈",title:"Patterns",blurb:"Episodes over days–weeks. Tracking helps you spot early signs."}];
  return (
    <Section id="what" className="py-10 md:py-14">
      <SectionHeader title="What is bipolar disorder?" subtitle="We all go through mood swings, especially when life gets tough. However, there are moments when these mood shifts become more intense and stick around, significantly affecting our daily routines. In such instances, it may be a sign that we’re dealing with bipolar disorder.

When we catch these signs and seek help early, it becomes possible to better manage the extreme mood swings and intense emotions we may experience. After all, we’re in this together, and reaching out for support can help us cope better."/>
      <div className="grid md:grid-cols-3 gap-5">
        {tiles.map(t=>(
          <SoftCard key={t.title} className="p-6">
            <div className="text-5xl mb-3">{t.emoji}</div>
            <h4 className="text-lg font-semibold" style={{color:COLORS.ink}}>{t.title}</h4>
            <p className="mt-1" style={{color:COLORS.muted}}>{t.blurb}</p>
          </SoftCard>
        ))}
      </div>
    </Section>
  );
};

/* Self-Assessment: short hypomania screen (7 yes/no). Educational only. */
const Q=[
  "Periods of unusually high energy or euphoria",
  "Need much less sleep without feeling tired",
  "Talking more or faster than usual",
  "Racing thoughts or easily distracted",
  "Doing many activities at once / goal-directed",
  "Risky behavior (spending, driving, sex, investments)",
  "Others say you’re unusually energized or irritable",
];
const SelfAssessment:React.FC=()=>{
  const [answers,setAnswers]=useState<(0|1|null)[]>(Array(Q.length).fill(null));
  const [step,setStep]=useState(0);
  const [done,setDone]=useState(false);
  const progress=Math.round((step/Q.length)*100);
  const score=answers.reduce((s,a)=>s+(a??0),0);
  const sev= score<=2?{label:"Low likelihood",color:"#10b981",bar:20}
           : score<=4?{label:"Watchful",color:"#eab308",bar:55}
           : {label:"Elevated signals",color:"#ef4444",bar:85};
  const next=()=> step<Q.length-1?setStep(step+1):setDone(true);
  const prev=()=> setStep(s=>Math.max(0,s-1));
  const reset=()=>{setAnswers(Array(Q.length).fill(null));setStep(0);setDone(false);};

  return (
    <Section id="check-in" className="py-10 md:py-14">
      <SectionHeader title="Gentle Self-Check" subtitle="A brief yes/no screen for hypomanic features. Not diagnostic."/>
      <SoftCard className="p-0 overflow-hidden">
        <div className="p-5 border-b" style={{borderColor:COLORS.border}}>
          <div className="flex items-center justify-between text-sm" style={{color:COLORS.muted}}>
            <span>Question {Math.min(step+1,Q.length)} / {Q.length}</span><span>{progress}%</span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-200 overflow-hidden">
            <div className="h-full transition-all duration-500" style={{width:`${progress}%`,background:`linear-gradient(90deg, ${COLORS.primary}, ${COLORS.primary2})`}}/>
          </div>
        </div>
        <div className="p-5 md:p-8">
          {!done?(
            <>
              <div className="rounded-2xl p-5 border" style={{borderColor:COLORS.border}}>
                <p className="text-xl font-bold mb-3" style={{color:COLORS.ink}}>{Q[step]}</p>
                <div className="grid grid-cols-2 gap-3">
                  {["No","Yes"].map((label,idx)=>{
                    const val=(idx as 0|1);
                    const active=answers[step]===val;
                    return (
                      <button key={label} onClick={()=>{const n=[...answers];n[step]=val;setAnswers(n);}}
                        className="group text-center rounded-xl p-4 border transition-all"
                        style={{borderColor:active?COLORS.primary:COLORS.border,background:active?COLORS.primarySoft:"#fff",color:active?COLORS.ink:COLORS.muted}}>
                        <div className="font-semibold">{label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="outline" onClick={prev} className="rounded-xl" style={{borderColor:COLORS.primary,color:COLORS.primary}} disabled={step===0}>Back</Button>
                <Button onClick={next} className="rounded-xl" style={{background:answers[step]!==null?COLORS.primary:"#c7d2fe",color:"#fff"}} disabled={answers[step]===null}>
                  {step<Q.length-1?"Next":"See results"}
                </Button>
                <Button variant="outline" onClick={reset} className="rounded-xl" style={{borderColor:COLORS.border,color:COLORS.muted}}>Reset</Button>
              </div>
            </>
          ):(
            <div className="rounded-2xl p-5 border" style={{borderColor:COLORS.border}}>
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5" style={{color:COLORS.primary}}/>
                <div>
                  <p className="font-bold text-lg" style={{color:COLORS.ink}}>Result: <span style={{color:sev.color}}>{sev.label}</span></p>
                  <div className="mt-4 h-3 w-full rounded-full bg-gray-200 overflow-hidden">
                    <div className="h-full transition-all" style={{width:`${sev.bar}%`,background:"linear-gradient(90deg,#10b981,#eab308,#ef4444)"}}/>
                  </div>
                  <p className="text-sm mt-4" style={{color:COLORS.muted}}>
                    If you’ve had distinct highs and lows affecting daily life, consider a professional assessment. Effective treatments exist.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a href="#help"><Button className="rounded-xl" style={{background:COLORS.primary,color:"#fff"}}>See helplines & support</Button></a>
                    <Button variant="outline" className="rounded-xl" onClick={reset} style={{borderColor:COLORS.primary,color:COLORS.primary}}>Take again</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </SoftCard>
      <p className="mt-3 text-xs text-center" style={{color:COLORS.muted}}>
        If you’re in immediate danger or feel unsafe, please use the helplines below or local emergency services.
      </p>
    </Section>
  );
};

/* ---------- FlipCard + Myths (re-usable) ---------- */
const FlipCard: React.FC<{ front: React.ReactNode; back: React.ReactNode }> = ({ front, back }) => (
  <div className="[perspective:1200px]">
    <div className="relative h-56 w-full transition-transform duration-500 [transform-style:preserve-3d] group hover:[transform:rotateY(180deg)]">
      <div className="absolute inset-0 [backface-visibility:hidden]">
        <SoftCard className="h-full flex items-center justify-center text-center p-6">{front}</SoftCard>
      </div>
      <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
        <SoftCard className="h-full flex items-center justify-center text-center bg-gradient-to-br from-indigo-50 to-violet-50 p-6">
          {back}
        </SoftCard>
      </div>
    </div>
  </div>
);

/* ---------- Myths vs Facts (Bipolar) ---------- */
const Misconceptions: React.FC = () => {
  const items = [
    { emoji: "↕️", myth: "Bipolar is just mood swings.", fact: "It involves distinct episodes (mania/hypomania and depression) lasting days–weeks." },
    { emoji: "💼", myth: "People with bipolar can’t work or study.", fact: "With treatment, routines, and support, many do well in school and careers." },
    { emoji: "💊", myth: "Medication alone fixes everything.", fact: "Best outcomes come from a plan: meds + therapy + sleep/structure + support." },
    { emoji: "⚠️", myth: "Hypomania is always productive and good.", fact: "It can impair judgment/sleep and may escalate; early signs need action." },
    { emoji: "🧬", myth: "It’s a personality flaw.", fact: "It’s a medical condition influenced by biology, stress, and environment." },
  { emoji: "👨‍👩‍👧‍👦", myth: "People with bipolar can’t have stable relationships.", fact: "Many maintain strong relationships with understanding, communication, and treatment." },

  ];
  return (
    <Section className="py-10 md:py-14">
      <SectionHeader title="Myths vs Facts" subtitle="Hover (or tap) each card to reveal the fact." />
      <div className="grid md:grid-cols-3 gap-5">
        {items.map((it, i) => (
          <FlipCard
            key={i}
            front={<div className="flex flex-col items-center justify-center h-full">
              <div className="text-6xl mb-3">{it.emoji}</div>
              <p className="font-semibold text-center" style={{ color: COLORS.ink }}>{it.myth}</p>
            </div>}
            back={<div className="flex flex-col items-center justify-center h-full p-4">
              <p className="text-sm md:text-base text-center" style={{ color: COLORS.muted }}>{it.fact}</p>
            </div>}
          />
        ))}
      </div>
    </Section>
  );
};

/* ---------- Types (Tabbed) ---------- */
const TypesOfBipolar: React.FC = () => {
  type Key = "bp1" | "bp2" | "cyclo" | "specifiers";
  const [tab, setTab] = useState<Key>("bp1");

    const DATA: Record<Key, { title: string; body: string; video?: string }> = {
    bp1: {
      title: "Bipolar I",
      body: "At least one manic episode (often with depression episodes). Mania = ≥1 week of elevated/irritable mood + energy with impairment.",
      video: "Dsc0C8kmXMs",
    },
    bp2: {
      title: "Bipolar II",
      body: "Hypomanic episodes (less intense than mania) and depression episodes. No history of full mania.",
      video: "MUyS9oTJ9Wc",
    },
    cyclo: {
      title: "Cyclothymia",
      body: "Years (2+ adults) of numerous hypomanic symptoms and depressive symptoms not meeting full episode criteria.",
      video: "DFVhzT9qbiI",
    },
    specifiers: {
      title: "Specifiers",
      body: "Specifiers you may hear, With mixed features, with rapid cycling, seasonal pattern, peripartum onset — these guide treatment planning.",
      video: "ehbYPhf9HWo",
    },    
  };

  return (
    <Section className="py-10 md:py-14">
      <SectionHeader title="Types of Bipolar Conditions" subtitle="Different patterns, shared goal: stable, meaningful daily life." />
      <div className="grid md:grid-cols-[260px,1fr] gap-6">
        <div className="space-y-3">
          {([
            { k: "bp1", label: "Bipolar I" },
            { k: "bp2", label: "Bipolar II" },
            { k: "cyclo", label: "Cyclothymia" },
            { k: "specifiers", label: "Common specifiers" },
          ] as { k: Key; label: string }[]).map(({ k, label }) => {
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

/* --------------------------- Causes of Bipolar Disorder (box style) --------------------------- */
const BipolarCausesBoxes: React.FC = () => (
  <Section id="bipolar-causes" className="py-10 md:py-14">
    {/* Title + accent underline */}
    <div className="text-center mb-8 md:mb-10">
      <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight" style={{ color: COLORS.ink }}>
        Causes of Bipolar Disorder
      </h2>
      <div
        className="mx-auto mt-3 h-[8px] w-44 rounded-full"
        style={{
          background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.primary2})`,
          boxShadow: "0 6px 18px rgba(79,70,229,0.35)",
        }}
      />
      <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto" style={{ color: COLORS.muted }}>
        While the exact cause isn’t fully known, bipolar disorder usually arises from a mix of genetic,
        psychological, and environmental factors.
      </p>
    </div>

    <div className="grid gap-6 md:grid-cols-2">
      {/* Family History */}
      <SoftCard className="p-0">
        <div className="p-6 md:p-7">
          <div className="flex items-start gap-4">
            <div className="text-4xl leading-none">🧬</div>
            <div>
              <h3 className="text-2xl font-semibold" style={{ color: COLORS.ink }}>Family History</h3>
              <p className="mt-2 text-base md:text-lg" style={{ color: COLORS.muted }}>
                Bipolar disorder can run in families and raises likelihood of developing it.
              </p>
            </div>
          </div>
        </div>
        <div className="border-t" style={{ borderColor: COLORS.border }} />
        <ul className="p-6 md:p-7 list-disc pl-6 space-y-2 text-base md:text-lg" style={{ color: COLORS.muted }}>
          <li>Having a relative with bipolar increases risk.</li>
          <li>Most people in affected families will not develop it.</li>
        </ul>
      </SoftCard>

      {/* Chemical imbalances in brain */}
      <SoftCard className="p-0">
        <div className="p-6 md:p-7">
          <div className="flex items-start gap-4">
            <div className="text-4xl leading-none">🧠</div>
            <div>
              <h3 className="text-2xl font-semibold" style={{ color: COLORS.ink }}>
                Chemical Imbalances in Brain
              </h3>
              <p className="mt-2 text-base md:text-lg" style={{ color: COLORS.muted }}>
                Differences in brain chemicals/circuits can affect mood control.
              </p>
            </div>
          </div>
        </div>
        <div className="border-t" style={{ borderColor: COLORS.border }} />
        <ul className="p-6 md:p-7 list-disc pl-6 space-y-2 text-base md:text-lg" style={{ color: COLORS.muted }}>
          <li>Imbalances (e.g., serotonin, dopamine) can contribute.</li>
          <li>Mood disturbance may also occur with some medicines or alcohol.</li>
        </ul>
      </SoftCard>

      {/* Certain personality traits */}
      <SoftCard className="p-0">
        <div className="p-6 md:p-7">
          <div className="flex items-start gap-4">
            <div className="text-4xl leading-none">👤</div>
            <div>
              <h3 className="text-2xl font-semibold" style={{ color: COLORS.ink }}>
                Certain Personality Traits
              </h3>
              <p className="mt-2 text-base md:text-lg" style={{ color: COLORS.muted }}>
                Some traits are linked with higher vulnerability.
              </p>
            </div>
          </div>
        </div>
        <div className="border-t" style={{ borderColor: COLORS.border }} />
        <ul className="p-6 md:p-7 list-disc pl-6 space-y-2 text-base md:text-lg" style={{ color: COLORS.muted }}>
          <li>Neuroticism (frequent/intense negative emotions).</li>
          <li>Aggressiveness or impulsivity.</li>
        </ul>
      </SoftCard>

      {/* Traumatic or stressful life events */}
      <SoftCard className="p-0">
        <div className="p-6 md:p-7">
          <div className="flex items-start gap-4">
            <div className="text-4xl leading-none">⚠️</div>
            <div>
              <h3 className="text-2xl font-semibold" style={{ color: COLORS.ink }}>
                Traumatic or Stressful Life Events
              </h3>
              <p className="mt-2 text-base md:text-lg" style={{ color: COLORS.muted }}>
                Stress can precipitate or worsen mood episodes.
              </p>
            </div>
          </div>
        </div>
        <div className="border-t" style={{ borderColor: COLORS.border }} />
        <ul className="p-6 md:p-7 list-disc pl-6 space-y-2 text-base md:text-lg" style={{ color: COLORS.muted }}>
          <li>Childhood trauma; major changes like divorce or bereavement.</li>
          <li>Work/financial pressures; sleep disruption and substance use as triggers.</li>
        </ul>
      </SoftCard>

      {/* Social isolation */}
      <SoftCard className="p-0 md:col-span-2">
        <div className="p-6 md:p-7">
          <div className="flex items-start gap-4">
            <div className="text-4xl leading-none">🧍‍♂️</div>
            <div>
              <h3 className="text-2xl font-semibold" style={{ color: COLORS.ink }}>Social Isolation</h3>
              <p className="mt-2 text-base md:text-lg" style={{ color: COLORS.muted }}>
                Loneliness can increase likelihood of mood disorders and intensify symptoms.
              </p>
            </div>
          </div>
        </div>
        <div className="border-t" style={{ borderColor: COLORS.border }} />
        <ul className="p-6 md:p-7 list-disc pl-6 space-y-2 text-base md:text-lg" style={{ color: COLORS.muted }}>
          <li>Isolation raises risk for depression and bipolar symptoms.</li>
          <li>Persistent symptoms can also heighten feelings of loneliness.</li>
        </ul>
      </SoftCard>
    </div>
  </Section>
);

/* --------------------------- Diagnosis of Bipolar Disorder --------------------------- */
const DiagnosisBipolar: React.FC = () => (
  <Section id="diagnosis" className="py-10 md:py-14">
    <SectionHeader
      title="Diagnosis of Bipolar Disorder"
      subtitle="How healthcare professionals identify and assess the condition"
    />

    <div className="grid gap-6 md:grid-cols-2">
      {/* Medical Evaluation */}
      <SoftCard className="p-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl">🩺</div>
          <div>
            <h3 className="text-xl font-semibold" style={{ color: COLORS.ink }}>
              Medical Evaluation
            </h3>
            <p className="mt-2 text-base" style={{ color: COLORS.muted }}>
              A doctor conducts a physical exam and lab tests to rule out other
              conditions (such as thyroid issues) that can mimic bipolar symptoms.
            </p>
          </div>
        </div>
      </SoftCard>

      {/* Psychiatric Assessment */}
      <SoftCard className="p-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl">🧠</div>
          <div>
            <h3 className="text-xl font-semibold" style={{ color: COLORS.ink }}>
              Psychiatric Assessment
            </h3>
            <p className="mt-2 text-base" style={{ color: COLORS.muted }}>
              A mental health professional evaluates mood, behavior, and thought
              patterns. Questionnaires and structured interviews are often used.
            </p>
          </div>
        </div>
      </SoftCard>

      {/* Mood Charting */}
      <SoftCard className="p-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl">📊</div>
          <div>
            <h3 className="text-xl font-semibold" style={{ color: COLORS.ink }}>
              Mood Charting
            </h3>
            <p className="mt-2 text-base" style={{ color: COLORS.muted }}>
              Tracking daily moods, sleep, and activities over weeks helps reveal
              patterns of highs and lows that define bipolar disorder.
            </p>
          </div>
        </div>
      </SoftCard>

      {/* Diagnostic Criteria */}
      <SoftCard className="p-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl">📖</div>
          <div>
            <h3 className="text-xl font-semibold" style={{ color: COLORS.ink }}>
              Diagnostic Criteria
            </h3>
            <p className="mt-2 text-base" style={{ color: COLORS.muted }}>
              Doctors use DSM-5 criteria: at least one manic/hypomanic episode and,
              in many cases, major depressive episodes lasting days to weeks.
            </p>
          </div>
        </div>
      </SoftCard>
    </div>
  </Section>
);




/* Symptoms & Coping */
const SymptomsAndCoping:React.FC=()=>(
  <Section id="symptoms" className="py-10 md:py-14">
    <SectionHeader title="Common Signs & Symptoms" subtitle="Episodes vary by person."/>
    <div className="grid gap-4 md:gap-5">
      <FeatureRow icon={Sun} title="Mania/hypomania episode" blurb="High energy, less sleep, fast thoughts, impulsivity."/>
      <FeatureRow icon={Moon} title="Depressive episode" blurb="Low mood, fatigue, loss of interest, sleep/appetite change."/>
      <FeatureRow icon={Zap} title="Rapid shifts" blurb="Some people notice quicker mood changes."/>
    </div>

    <div className="rounded-3xl p-6 md:p-10 mt-10" style={{background:"rgba(79,70,229,0.06)",border:`1px solid ${COLORS.border}`,boxShadow:COLORS.shadow}}>
      <SectionHeader title="Stability supports" subtitle="Build routines that protect your baseline."/>
      <div className="grid gap-4 md:gap-5 md:grid-cols-2">
        <FeatureRow icon={Calendar} title="Regular routine" blurb="Consistent sleep/wake, meals, activity."/>
        <FeatureRow icon={NotebookPen} title="Mood tracking" blurb="Record sleep, energy, triggers, early signs."/>
        <FeatureRow icon={BatteryLow} title="Sleep protection" blurb="Prioritize sleep—vital for mood stability."/>
        <FeatureRow icon={Users} title="Care team" blurb="Supportive people; consider therapy/medical care." />
      </div>
    </div>
  </Section>
);

/* Helplines */
const HelpRail:React.FC=()=>(
  <Section id="help" className="py-10 md:py-14">
    <SectionHeader title="Helplines" subtitle="Confidential • Kind • Free or low-cost in most places"/>
    <div className="grid md:grid-cols-3 gap-6">
      {[
        { country:"Singapore", service:"SOS (Samaritans of Singapore)", num:"1767"},
        { country:"Malaysia", service:"Befrienders KL", num:"03-76272929"},
        { country:"Philippines", service:"HOPELINE", num:"0917-558-4673"},
        { country:"Thailand", service:"Department of Mental Health", num:"1323"},
        { country:"Indonesia", service:"Into The Light Indonesia", num:"021-7888-6950"},
        { country:"Vietnam", service:"Heart 2 Heart", num:"1900-599-088"},
      ].map(h=>(
        <SoftCard key={h.country} className="p-6 flex items-center justify-between">
          <div><p className="font-semibold" style={{color:COLORS.ink}}>{h.country}</p>
            <p className="text-sm" style={{color:COLORS.muted}}>{h.service}</p></div>
          <a href={`tel:${h.num}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold" style={{background:"#f43f5e"}}>
            <PhoneCall className="w-4 h-4"/> {h.num}
          </a>
        </SoftCard>
      ))}
    </div>
  </Section>
);

/* Page */
const Bipolar:React.FC=()=>(
  <div className="min-h-screen" style={{background:COLORS.page}}>
      <Hero />
      <WhatTiles />
      <Misconceptions />
      <SelfAssessment />
      <TypesOfBipolar />
      <BipolarCausesBoxes/>
      <DiagnosisBipolar/>
      <SymptomsAndCoping />
      <HelpRail />
      <References/>       
    <a href="#top" className="fixed bottom-6 right-6 px-4 py-3 rounded-full text-white font-semibold"
       style={{background:`linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primary2})`,boxShadow:"0 16px 30px rgba(0,0,0,.18)"}}>Top ↑</a>
  </div>
);

const References: React.FC = () => {
  const items = [
    { 
      title: "WHO - Bipolar", 
      url: "https://www.who.int/news-room/fact-sheets/detail/bipolar-disorder",
      desc: "World Health Organization fact sheet on Bipolar"
    },
    { 
      title: "HealthHub SG – Bipolar", 
      url: "https://www.healthhub.sg/programmes/mindsg/caring-for-ourselves/understanding-bipolar-disorder-adults?utm_source=google&utm_medium=paid-search&utm_campaign=fy25mhao&utm_content=understanding_bipolar_disorder&gad_source=1#home",
      desc: "Singapore’s national health portal: Understanding Bipolar"
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

export default Bipolar;
