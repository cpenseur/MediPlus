import React, { useState } from "react";
import {
  ShieldAlert,
  AlarmClock,
  Eye,
  Moon,
  Brain,
  HeartPulse,
  Users,
  Flower2,
  NotebookPen,
  HelpCircle,
  Activity,
  PhoneCall,
  Info,
  ArrowRight,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ptsd from "@/assets/ptsd.png";

/* Theme / Atoms copied from Anxiety.tsx for consistency */
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
                Understanding <span className="md:block">PTSD</span>
              </h1>
              <p className="mt-3 md:mt-4 text-base md:text-lg leading-relaxed" style={{color:COLORS.muted}}>
                Post-traumatic stress can follow frightening events. Skills and support can reduce symptoms and restore safety.
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
                  src={ptsd}
                  alt="PTSD illustration"
                  className="mx-auto w-full max-w-[420px] h-auto object-contain rounded-xl"
                />
              </div>
              <div className="p-4 border-t" style={{borderColor:COLORS.border}}>
                <div className="flex items-center gap-2 text-sm" style={{color:COLORS.muted}}>
                  <Activity className="w-4 h-4" style={{color:"#10b981"}}/> Healing is possible with support and practice.
                </div>
              </div>
            </SoftCard>
          </div>
        </div>
      </SoftCard>
    </Section>
  </div>
);

/* What is PTSD */
const WhatTiles:React.FC=()=>{
  const tiles=[{emoji:"🛡️",title:"After danger",blurb:"A strong alarm system that stays on after trauma."},
               {emoji:"🔁",title:"Re-experiencing",blurb:"Intrusive memories, nightmares, flashbacks."},
               {emoji:"🚪",title:"Avoidance & arousal",blurb:"Avoid reminders; feel on edge or easily startled."}];
  return (
    <Section id="what" className="py-10 md:py-14">
      <SectionHeader title="What is PTSD?" subtitle="A trauma-related stress response that can be treated.Trauma is an emotional stress that overwhelms our abilities to cope, which has lasting effects on our nervous system, brain and body. We experience trauma after witnessing or facing a distressing event or a series of events, such as accidents (e.g. road traffic, workplace), physical or sexual assaults, child abuse, family violence, bullying, war or natural disaster."/>
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

/* Self-Assessment: brief PCL-style (8 items, 0–4) */
type PChoice=0|1|2|3|4;
const PCL8=[
  "Unwanted memories or images of the event",
  "Nightmares related to the event",
  "Sudden feeling as if the event were happening again (flashbacks)",
  "Avoiding thoughts, feelings, or reminders of the event",
  "Feeling distant or cut off from people",
  "Trouble concentrating",
  "Super alert, watchful, or easily startled",
  "Feeling irritable or having angry outbursts",
];
const PCHOICES:{label:string;value:PChoice}[]=[
  {label:"Not at all",value:0},
  {label:"A little bit",value:1},
  {label:"Moderately",value:2},
  {label:"Quite a bit",value:3},
  {label:"Extremely",value:4},
];
const sev=(score:number)=> score<=8?{label:"Minimal",color:"#10b981",bar:15}
  :score<=16?{label:"Mild",color:"#22c55e",bar:35}
  :score<=24?{label:"Moderate",color:"#eab308",bar:60}
  :{label:"Elevated",color:"#ef4444",bar:85};

const SelfAssessment:React.FC=()=>{
  const [answers,setAnswers]=useState<(PChoice|null)[]>(Array(PCL8.length).fill(null));
  const [step,setStep]=useState(0);
  const [done,setDone]=useState(false);
  const progress=Math.round((step/PCL8.length)*100);
  const score=answers.reduce((s,a)=>s+(a??0),0);
  const severity=sev(score);
  const next=()=> step<PCL8.length-1?setStep(step+1):setDone(true);
  const prev=()=> setStep(s=>Math.max(0,s-1));
  const reset=()=>{setAnswers(Array(PCL8.length).fill(null));setStep(0);setDone(false);};

  return (
    <Section id="check-in" className="py-10 md:py-14">
      <SectionHeader title="Gentle Self-Check" subtitle="A short PTSD symptom check (last month). Not diagnostic."/>
      <SoftCard className="p-0 overflow-hidden">
        <div className="p-5 border-b" style={{borderColor:COLORS.border}}>
          <div className="flex items-center justify-between text-sm" style={{color:COLORS.muted}}>
            <span>Question {Math.min(step+1,PCL8.length)} / {PCL8.length}</span><span>{progress}%</span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-200 overflow-hidden">
            <div className="h-full transition-all duration-500" style={{width:`${progress}%`,background:`linear-gradient(90deg, ${COLORS.primary}, ${COLORS.primary2})`}}/>
          </div>
        </div>
        <div className="p-5 md:p-8">
          {!done?(
            <>
              <div className="rounded-2xl p-5 border" style={{borderColor:COLORS.border}}>
                <p className="text-xl font-bold mb-3" style={{color:COLORS.ink}}>{PCL8[step]}</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {PCHOICES.map(c=>{
                    const active=answers[step]===c.value;
                    return (
                      <button key={c.value} onClick={()=>{const n=[...answers];n[step]=c.value;setAnswers(n);}}
                        className="group text-left rounded-xl p-4 border transition-all"
                        style={{borderColor:active?COLORS.primary:COLORS.border,background:active?COLORS.primarySoft:"#fff",color:active?COLORS.ink:COLORS.muted}}>
                        <div className="font-semibold">{c.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="outline" onClick={prev} className="rounded-xl" style={{borderColor:COLORS.primary,color:COLORS.primary}} disabled={step===0}>Back</Button>
                <Button onClick={next} className="rounded-xl" style={{background:answers[step]!==null?COLORS.primary:"#c7d2fe",color:"#fff"}} disabled={answers[step]===null}>
                  {step<PCL8.length-1?"Next":"See results"}
                </Button>
                <Button variant="outline" onClick={reset} className="rounded-xl" style={{borderColor:COLORS.border,color:COLORS.muted}}>Reset</Button>
              </div>
            </>
          ):(
            <div className="rounded-2xl p-5 border" style={{borderColor:COLORS.border}}>
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5" style={{color:COLORS.primary}}/>
                <div>
                  <p className="font-bold text-lg" style={{color:COLORS.ink}}>Result: <span style={{color:severity.color}}>{severity.label}</span></p>
                  <div className="mt-4 h-3 w-full rounded-full bg-gray-200 overflow-hidden">
                    <div className="h-full transition-all" style={{width:`${severity.bar}%`,background:"linear-gradient(90deg,#10b981,#eab308,#ef4444)"}}/>
                  </div>
                  <p className="text-sm mt-4" style={{color:COLORS.muted}}>
                    Consider trauma-informed therapies like TF-CBT or EMDR. If you feel unsafe, reach out now.
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
        If you’re in immediate danger, please use the helplines below or local emergency services right now.
      </p>
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
    { emoji: "🧍", myth: "PTSD happens only to soldiers.", fact: "Any frightening/overwhelming event (e.g., accidents, assault, disasters) can trigger PTSD." },
    { emoji: "⏳", myth: "If it doesn’t show up right away, it’s not PTSD.", fact: "Symptoms can appear weeks or months after the event." },
    { emoji: "💬", myth: "Talking about trauma makes it worse.", fact: "Safe, paced processing reduces symptoms over time." },
    { emoji: "🧠", myth: "PTSD means I’m broken forever.", fact: "Recovery is common with therapy, skills, and support." },
    { emoji: "🥱", myth: "Avoiding reminders is the only way to cope.", fact: "Gentle, guided exposure helps the alarm system relearn safety." },
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

/* ---------- Types (Tabbed) ---------- */
const TypesOfPTSD: React.FC = () => {
  type Key = "ptsd" | "cptsd" | "dissoc";
  const [tab, setTab] = useState<Key>("ptsd");

  const DATA: Record<Key, { title: string; body: string; video?: string }> = {
    ptsd: {
      title: "Post-traumatic Stress Disorder",
      body: "Re-experiencing, avoidance, negative mood/cognition shifts, and hyperarousal lasting >1 month after trauma.",
      video: "hzSx4rMyVjI",
    },
    cptsd: {
      title: "Complex Post-traumatic Stress Disorder",
      body: "Often from prolonged/repeated trauma. Adds difficulties in self-concept, emotion regulation, and relationships.",
      video: "qHDhY56NWJo",
    },
    dissoc: {
      title: "Specifier: With Dissociative Symptoms",
      body: "Depersonalization/derealization during episodes. Recognizing it guides grounding-first approaches.",
      video: "XF2zeOdE5GY",
    },  
  };

  return (
    <Section className="py-10 md:py-14">
      <SectionHeader title="Types and Specifiers" subtitle="These labels guide treatment choices; your experience is what matters." />
      <div className="grid md:grid-cols-[260px,1fr] gap-6">
        <div className="space-y-3">
          {([{k:"ptsd",label:"PTSD"},{k:"cptsd",label:"Complex PTSD"},{k:"dissoc",label:"Dissociative specifier"}] as {k:Key;label:string}[])
            .map(({ k, label }) => {
              const active = tab === k;
              return (
                <button key={k} onClick={() => setTab(k)} className="w-full text-left px-4 py-3 rounded-xl font-semibold"
                  style={{
                    background: active ? "linear-gradient(90deg,#e0e7ff,#ede9fe)" : "#fff",
                    border: `2px solid ${active ? "#c7d2fe" : "#e5e7eb"}`,
                    color: active ? COLORS.ink : COLORS.muted,
                  }}>
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

/* Symptoms & Coping */
const SymptomsAndCoping:React.FC=()=>(
  <Section id="symptoms" className="py-10 md:py-14">
    <SectionHeader title="Common Signs & Symptoms" subtitle="Patterns vary; your experience is valid."/>
    <div className="grid gap-4 md:gap-5">
      <FeatureRow icon={Eye} title="Intrusions" blurb="Memories, nightmares, flashbacks."/>
      <FeatureRow icon={AlarmClock} title="Avoidance" blurb="Steering away from reminders of the trauma."/>
      <FeatureRow icon={ShieldAlert} title="Negative mood/cognition" blurb="Guilt, shame, numbness, self-blame."/>
      <FeatureRow icon={HeartPulse} title="Arousal" blurb="Irritable, hyper-alert, poor sleep or concentration."/>
    </div>

    <div className="rounded-3xl p-6 md:p-10 mt-10" style={{background:"rgba(79,70,229,0.06)",border:`1px solid ${COLORS.border}`,boxShadow:COLORS.shadow}}>
      <SectionHeader title="Coping strategies" subtitle="Practice builds safety signals."/>
      <div className="grid gap-4 md:gap-5 md:grid-cols-2">
        <FeatureRow icon={Flower2} title="Grounding" blurb="Name 5 things you see, 4 feel, 3 hear, 2 smell, 1 taste."/>
        <FeatureRow icon={NotebookPen} title="Trauma-safe journaling" blurb="Short entries; stop if overwhelmed. Pair with soothing."/>
        <FeatureRow icon={Users} title="Support" blurb="Connect with trusted people or peer groups."/>
        <FeatureRow icon={Moon} title="Sleep hygiene" blurb="Wind-down routine, dark/cool room, reduce late screens."/>
      </div>
    </div>
  </Section>
);

/* --------------------------- PTSD Signs, Symptoms & Self-Management --------------------------- */
const PTSDSection: React.FC = () => (
  <Section id="ptsd" className="py-10 md:py-14">
    {/* Title + accent underline */}
    <div className="text-center mb-8 md:mb-10">
      <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight" style={{ color: COLORS.ink }}>
        Signs and Symptoms of Post-Traumatic Stress
      </h2>
      <div
        className="mx-auto mt-3 h-[8px] w-44 rounded-full"
        style={{
          background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.primary2})`,
          boxShadow: "0 6px 18px rgba(79,70,229,0.35)",
        }}
      />
      <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto" style={{ color: COLORS.muted }}>
        PTSD can affect how you think, feel, and behave. Here are the main groups of symptoms and helpful coping
        strategies.
      </p>
    </div>

    {/* Symptom boxes */}
    <div className="grid gap-6 md:grid-cols-2">
      {/* Re-experiencing */}
      <SoftCard className="p-0">
        <div className="p-6 md:p-7">
          <h3 className="text-2xl font-semibold mb-2" style={{ color: COLORS.ink }}>1) Re-experiencing</h3>
          <p style={{ color: COLORS.muted }}>
            Reliving the traumatic event through intrusive memories, nightmares, or physical reactions.
          </p>
        </div>
        <div className="border-t" style={{ borderColor: COLORS.border }} />
        <ul className="p-6 pt-4 list-disc pl-6 space-y-2" style={{ color: COLORS.muted }}>
          <li>Flashbacks — feeling like it’s happening now</li>
          <li>Recurring intrusive memories or nightmares</li>
          <li>Distressing thoughts/images of the event</li>
          <li>Physical reactions (sweating, racing heart, trembling)</li>
        </ul>
      </SoftCard>

      {/* Avoidance */}
      <SoftCard className="p-0">
        <div className="p-6 md:p-7">
          <h3 className="text-2xl font-semibold mb-2" style={{ color: COLORS.ink }}>2) Avoidance</h3>
          <p style={{ color: COLORS.muted }}>
            Steering clear of reminders, places, people, or conversations linked to the trauma.
          </p>
        </div>
        <div className="border-t" style={{ borderColor: COLORS.border }} />
        <ul className="p-6 pt-4 list-disc pl-6 space-y-2" style={{ color: COLORS.muted }}>
          <li>Avoiding places, events, or objects tied to trauma</li>
          <li>Keeping constantly busy</li>
          <li>Feeling detached from body; memory gaps</li>
          <li>Numbing feelings or using substances to cope</li>
        </ul>
      </SoftCard>

      {/* Negative mood & thoughts */}
      <SoftCard className="p-0">
        <div className="p-6 md:p-7">
          <h3 className="text-2xl font-semibold mb-2" style={{ color: COLORS.ink }}>3) Negative Mood & Thoughts</h3>
          <p style={{ color: COLORS.muted }}>
            Trauma may change how you see yourself, others, and the world.
          </p>
        </div>
        <div className="border-t" style={{ borderColor: COLORS.border }} />
        <ul className="p-6 pt-4 list-disc pl-6 space-y-2" style={{ color: COLORS.muted }}>
          <li>Self-blame or blaming others</li>
          <li>Strong negative emotions (anger, fear, shame, guilt)</li>
          <li>Beliefs like “no one can be trusted” or “the world is unsafe”</li>
          <li>Loss of interest in usual activities</li>
          <li>Inability to feel positive emotions</li>
        </ul>
      </SoftCard>

      {/* Reactivity */}
      <SoftCard className="p-0">
        <div className="p-6 md:p-7">
          <h3 className="text-2xl font-semibold mb-2" style={{ color: COLORS.ink }}>4) Reactivity</h3>
          <p style={{ color: COLORS.muted }}>
            Always on edge or scanning for danger, leading to sleep, focus, or anger problems.
          </p>
        </div>
        <div className="border-t" style={{ borderColor: COLORS.border }} />
        <ul className="p-6 pt-4 list-disc pl-6 space-y-2" style={{ color: COLORS.muted }}>
          <li>Easily startled or hyper-vigilant</li>
          <li>Poor concentration</li>
          <li>Sleep difficulties</li>
          <li>Irritability, angry outbursts, reckless behaviour</li>
        </ul>
      </SoftCard>
    </div>

    {/* Self-management tips */}
    <div className="mt-12">
      <SectionHeader title="Self-Management Tips" subtitle="Practical strategies to support recovery" />
      <div className="grid gap-6 md:grid-cols-2">
        {[
          { title: "Re-establish Safety & Routine", desc: "Attend to health, nutrition, exercise, sleep, and keep regular routines." },
          { title: "Self-Regulation Strategies", desc: "Learn ways to manage anxiety and hyper-arousal, e.g., calming activities." },
          { title: "Grounding with 5 Senses", desc: "Use sight, touch, smell, taste, and hearing to bring yourself back to the present." },
          { title: "Relaxation Techniques", desc: "Try outdoor walks, hobbies, singing, or mindful breathing." },
          { title: "Connect with a Safe Person", desc: "Share and seek comfort from trusted friends or family." },
          { title: "Diaphragmatic Breathing", desc: "Slow, deep breaths signal safety to body and mind." },
        ].map((tip, i) => (
          <SoftCard key={i} className="p-6">
            <h4 className="text-xl font-semibold mb-2" style={{ color: COLORS.ink }}>{tip.title}</h4>
            <p style={{ color: COLORS.muted }}>{tip.desc}</p>
          </SoftCard>
        ))}
      </div>
    </div>

    <p className="mt-6 text-sm text-center" style={{ color: COLORS.muted }}>
      If symptoms persist beyond 4 weeks, are very distressing, or interfere with daily life, seek professional help.
    </p>
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
const PTSD:React.FC=()=>(
  <div className="min-h-screen" style={{background:COLORS.page}}>
      <Hero />
      <WhatTiles />
      <Misconceptions />
      <SelfAssessment />
      <TypesOfPTSD />
      <PTSDSection/>
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
      title: "WHO – PTSD", 
      url: "https://www.who.int/news-room/fact-sheets/detail/post-traumatic-stress-disorder",
      desc: "World Health Organization fact sheet on PTSD"
    },
    { 
      title: "HealthHub SG – PTSD", 
      url: "https://www.healthhub.sg/support-and-tools/support-and-care-programmes/post-trauma-support",
      desc: "Singapore’s national health portal: PTSD"
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

export default PTSD;
