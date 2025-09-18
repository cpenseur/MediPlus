// MentalHealthResources.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Heart,
  Phone,
  MessageCircle,
  Brain,
  Headphones,
  Wind,
  HelpCircle,
  Users,
  BookOpen,
  Play,
  Pause,
  ListMusic,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/mental-health-hero.svg";
import { Link } from "react-router-dom";

// 🎵 Local audio files
import natureMp3 from "@/assets/nature.mp3";
import meditationMp3 from "@/assets/meditation.mp3";
import binauralMp3 from "@/assets/binaural.mp3";

// 🖼️ Condition images
import depression from "@/assets/depression.png";
import anxiety from "@/assets/anxiety.png";
import panic from "@/assets/panic.png";
import ptsd from "@/assets/ptsd.png";
import stress from "@/assets/stress.png";
import bipolar from "@/assets/bipolar.png";

/* --------------------------- Color System --------------------------- */
const COLORS = {
  bg: "#FFF5EC",
  lilacLight: "#E8EAFF",
  pinkLight: "#FCD4D2",
  pinkDeep: "#F2A8A5",
  sand: "#F4E7E1",
  mint: "#CEE2E0",
  periwinkle: "#C3CBF9",
  primary: "#7A87FA",
  text: "#0f172a",
  textMuted: "#475569",
  teal: "#14b8a6",
  tealDark: "#0f766e",
};

/* --------------------------- Helpers --------------------------- */
const TARGET_SEC = 20 * 60; // 20:00 hard cap

const formatTime = (sec: number) => {
  if (!isFinite(sec)) return "0:00";
  const clamped = Math.max(0, Math.min(sec, TARGET_SEC));
  const m = Math.floor(clamped / 60);
  const s = Math.floor(clamped % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

/* --------------------------- Small UI helpers --------------------------- */
const SectionTitle: React.FC<{ title: string; subtitle?: string }> = ({
  title,
  subtitle,
}) => (
  <div className="text-center mb-12">
    <h2
      className="text-3xl md:text-4xl font-extrabold mb-3"
      style={{ color: COLORS.text }}
    >
      {title}
    </h2>
    <div
      className="mx-auto mb-4 h-1 w-16 rounded-full"
      style={{
        background: `linear-gradient(90deg,#ffb74d,${COLORS.primary})`,
      }}
    />
    {subtitle && (
      <p
        className="text-base md:text-lg max-w-2xl mx-auto"
        style={{ color: COLORS.textMuted }}
      >
        {subtitle}
      </p>
    )}
  </div>
);

const CardShell: React.FC<
  React.PropsWithChildren<{ className?: string }>
> = ({ className, children }) => (
  <div
    className={`relative rounded-2xl bg-white p-6 flex flex-col ${className ?? ""}`}
    style={{
      border: `2px solid ${COLORS.periwinkle}55`,
      boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
    }}
  >
    <div
      aria-hidden
      className="absolute left-0 right-0 top-0 h-1.5 rounded-t-2xl"
      style={{
        background: "linear-gradient(90deg,#ffb74d,#c084fc,#f472b6)",
      }}
    />
    {children}
  </div>
);

/* --------------------------- Video Popup (for breathing) --------------------------- */
const VideoPopup: React.FC<{
  open: boolean;
  videoId: string;
  onClose: () => void;
}> = ({ open, videoId, onClose }) => {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[120] flex items-center justify-center px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)" }}
    >
      <div
        className="w-full max-w-4xl rounded-2xl overflow-hidden relative"
        style={{ background: "#000", boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 rounded-full px-3 py-1 text-sm font-medium"
          style={{ background: "rgba(255,255,255,0.9)", color: "#111" }}
        >
          Close
        </button>

        <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
          <iframe
            title="Player"
            src={`https://www.youtube.com/embed/kpSkoXRrZnE?autoplay=1&rel=0&modestbranding=1`}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

/* --------------------------- Breathing Modal --------------------------- */
type BreathingMode = "478" | "belly";

const BREATHING_PRESETS: Record<
  BreathingMode,
  {
    title: string;
    inhale: number;
    hold?: number;
    exhale: number;
    note: string;
    videoId: string;
  }
> = {
  "478": {
    title: "4-7-8 Breathing",
    inhale: 4,
    hold: 7,
    exhale: 8,
    note: "Click Start to begin your wellness journey",
    videoId: "kpSkoXRrZnE",
  },
  belly: {
    title: "Belly Breathing",
    inhale: 4,
    exhale: 6,
    note: "Hand on belly. Slow, gentle breaths.",
    videoId: "OXjlR4mXxSk",
  },
};

const BreathingModal: React.FC<{
  open: boolean;
  mode: BreathingMode;
  onClose: () => void;
}> = ({ open, mode, onClose }) => {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] =
    useState<"ready" | "inhale" | "hold" | "exhale">("ready");
  const [count, setCount] = useState<number>(0);
  const [videoOpen, setVideoOpen] = useState(false);
  const timerRef = useRef<number | null>(null);

  const preset = BREATHING_PRESETS[mode];

  const clear = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        clear();
        setRunning(false);
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => () => clear(), []);

  useEffect(() => {
    if (videoOpen) {
      clear();
      setRunning(false);
      setPhase("ready");
      setCount(0);
    }
  }, [videoOpen]);

  const runCycle = () => {
    setPhase("inhale");
    setCount(preset.inhale);
    clear();
    timerRef.current = window.setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          clear();
          if (preset.hold && preset.hold > 0) {
            setPhase("hold");
            setCount(preset.hold);
            timerRef.current = window.setInterval(() => {
              setCount((h) => {
                if (h <= 1) {
                  clear();
                  setPhase("exhale");
                  setCount(preset.exhale);
                  timerRef.current = window.setInterval(() => {
                    setCount((e) => {
                      if (e <= 1) {
                        clear();
                        runCycle();
                        return 0;
                      }
                      return e - 1;
                    });
                  }, 1000);
                  return 0;
                }
                return h - 1;
              });
            }, 1000);
            return 0;
          } else {
            setPhase("exhale");
            setCount(preset.exhale);
            timerRef.current = window.setInterval(() => {
              setCount((e) => {
                if (e <= 1) {
                  clear();
                  runCycle();
                  return 0;
                }
                return e - 1;
              });
            }, 1000);
            return 0;
          }
        }
        return c - 1;
      });
    }, 1000);
  };

  const start = () => {
    if (running) {
      clear();
      setRunning(false);
      setPhase("ready");
      setCount(0);
      return;
    }
    setRunning(true);
    runCycle();
  };

  if (!open) return null;

  const orbScale = phase === "inhale" ? 1.35 : phase === "exhale" ? 0.85 : 1;

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-[100] flex items-center justify-center px-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            clear();
            setRunning(false);
            onClose();
          }
        }}
        style={{ background: "rgba(255,245,236,0.9)", backdropFilter: "blur(10px)" }}
      >
        <div
          className="w-full max-w-xl rounded-3xl p-8 relative"
          style={{
            background: "#fffaf5",
            border: "2px solid rgba(255,183,77,0.25)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.15)",
          }}
        >
          <h3
            className="text-3xl md:text-4xl font-extrabold text-center mb-8"
            style={{ color: COLORS.teal }}
          >
            {preset.title}
          </h3>

          <div className="flex justify-center mb-6">
            <div
              className="flex items-center justify-center rounded-full text-xl md:text-2xl font-semibold select-none"
              style={{
                width: 260,
                height: 260,
                border: `4px solid ${COLORS.teal}`,
                color: COLORS.teal,
                transform: `scale(${orbScale})`,
                transition: "transform 1s ease-in-out, background 0.6s ease",
                background:
                  phase === "inhale"
                    ? "rgba(20,184,166,0.08)"
                    : phase === "exhale"
                    ? "rgba(20,184,166,0.03)"
                    : "transparent",
              }}
            >
              {phase === "ready" ? "Ready?" : count || ""}
            </div>
          </div>

          <p
            className="text-center text-lg md:text-xl mb-8"
            style={{ color: COLORS.textMuted }}
          >
            {phase === "ready"
              ? preset.note
              : phase === "inhale"
              ? "Gently inhale through your nose"
              : phase === "hold"
              ? "Hold softly"
              : "Slowly exhale and release tension"}
          </p>

          <div className="flex justify-center gap-3 flex-wrap">
            <Button
              onClick={start}
              className="rounded-full px-8"
              style={{
                background: running ? "transparent" : COLORS.teal,
                border: `2px solid ${COLORS.teal}`,
                color: running ? COLORS.teal : "#fff",
              }}
            >
              {running ? "Stop" : "Start"}
            </Button>

            <Button
              variant="outline"
              onClick={() => setVideoOpen(true)}
              className="rounded-full px-8"
              style={{
                background: "transparent",
                border: `2px solid ${COLORS.primary}`,
                color: COLORS.primary,
              }}
            >
              Visualization
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                clear();
                setRunning(false);
                onClose();
              }}
              className="rounded-full px-8"
              style={{
                background: "transparent",
                border: "2px solid rgba(255,183,77,0.45)",
                color: COLORS.text,
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </div>

      <VideoPopup
        open={videoOpen}
        videoId={preset.videoId}
        onClose={() => setVideoOpen(false)}
      />
    </>
  );
};

/* --------------------------- 20-min Audio Bubble (stutter-free) --------------------------- */
type AudioBubbleProps = {
  id: string;
  title: string;
  src: string;
  activeId: string | null;
  onRequestPlay: (id: string) => void;
  onRequestStop: (id: string) => void;
};

const AudioBubble: React.FC<AudioBubbleProps> = ({
  id,
  title,
  src,
  activeId,
  onRequestPlay,
  onRequestStop,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // wall-clock 20-min timer for UI only
  const [elapsed, setElapsed] = useState<number>(0);
  const startTsRef = useRef<number | null>(null);
  const tickRef = useRef<number | null>(null);

  const isActive = activeId === id;

  const startTicking = () => {
    if (tickRef.current) return;
    const tick = () => {
      if (startTsRef.current == null) return;
      const now = Date.now();
      const sec = (now - startTsRef.current) / 1000;
      setElapsed(sec);
      if (sec >= TARGET_SEC) {
        stopAll(true);
        return;
      }
      tickRef.current = window.setTimeout(tick, 250) as unknown as number;
    };
    tickRef.current = window.setTimeout(tick, 250) as unknown as number;
  };

  const stopTicking = () => {
    if (tickRef.current) {
      window.clearTimeout(tickRef.current as unknown as number);
      tickRef.current = null;
    }
  };

  const stopAll = (reset = false) => {
    stopTicking();
    const a = audioRef.current;
    if (a) a.pause();
    startTsRef.current = null;
    if (reset) setElapsed(0);
    onRequestStop(id);
  };

  // Let the browser loop seamlessly
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.loop = true;
  }, []);

  // ⬇️ Start/stop playback WITHOUT chasing currentTime every 250ms
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    if (isActive) {
      // establish wall-clock start if needed
      if (startTsRef.current == null) {
        startTsRef.current = Date.now() - elapsed * 1000;
      }

      // one-time sync to the right place in the underlying track
      const syncOnce = () => {
        const d = Math.max(1, a.duration || 1);
        // use wall clock to decide where we are inside the short file
        const elapsedSinceStart =
          startTsRef.current != null
            ? (Date.now() - startTsRef.current) / 1000
            : elapsed;
        const pos = (elapsedSinceStart % d) || 0;
        a.currentTime = Math.min(pos, Math.max(0, d - 0.05));
        a.play().catch(() => {});
      };

      if (a.readyState >= 1) {
        syncOnce();
      } else {
        const once = () => {
          a.removeEventListener("loadedmetadata", once);
          syncOnce();
        };
        a.addEventListener("loadedmetadata", once);
      }

      startTicking(); // UI timer only
    } else {
      a.pause();
      stopTicking();
      startTsRef.current = null;
    }
  }, [isActive]); // <-- important: not depending on 'elapsed'

  const toggle = () => {
    if (isActive) {
      stopAll(false);
    } else {
      onRequestPlay(id);
    }
  };

  // Seek only when the user drags the slider
  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value); // 0..100
    const desired = (val / 100) * TARGET_SEC;
    setElapsed(desired);
    startTsRef.current = Date.now() - desired * 1000;

    const a = audioRef.current;
    if (a) {
      const setPos = () => {
        const d = Math.max(1, a.duration || 1);
        const pos = (desired % d) || 0;
        a.currentTime = Math.min(pos, Math.max(0, d - 0.05));
      };
      if (a.readyState >= 1) setPos();
      else {
        const once = () => {
          a.removeEventListener("loadedmetadata", once);
          setPos();
        };
        a.addEventListener("loadedmetadata", once);
      }
    }
  };

  const progress = (elapsed / TARGET_SEC) * 100;

  return (
    <div
      className="w-full rounded-2xl px-4 py-3 flex items-center gap-3"
      style={{
        background: "linear-gradient(180deg, #fafaff, #ffffff)",
        border: `1.5px solid ${COLORS.periwinkle}`,
        boxShadow: "0 10px 18px rgba(195,203,249,0.25)",
      }}
    >
      <button
        aria-label={isActive ? "Pause" : "Play"}
        onClick={toggle}
        className="shrink-0 h-10 w-10 rounded-full flex items-center justify-center"
        style={{
          background: isActive
            ? `linear-gradient(135deg, ${COLORS.primary}, #9aa3ff)`
            : `${COLORS.lilacLight}`,
          color: isActive ? "#fff" : COLORS.primary,
          boxShadow: isActive ? "0 8px 18px rgba(122,135,250,0.35)" : "none",
        }}
      >
        {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
      </button>

      <div className="flex-1 min-w-0">
        <div
          className="text-sm font-semibold truncate"
          style={{ color: COLORS.text }}
        >
          {title}
        </div>
        <div className="flex items-center gap-3">
          <input
            type="range"
            value={progress}
            onChange={onSeek}
            className="w-full accent-indigo-500"
          />
          <div
            className="text-xs tabular-nums whitespace-nowrap"
            style={{ color: COLORS.textMuted }}
          >
            {formatTime(elapsed)} / {formatTime(TARGET_SEC)}
          </div>
        </div>
      </div>

      {/* hidden audio element */}
      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  );
};

/* --------------------------- Page --------------------------- */

// Shared type + routes for condition pages
type ConditionKey = "anxiety" | "depression" | "panic" | "stress" | "bipolar" | "ptsd";

const CONDITION_ROUTES: Record<ConditionKey, string> = {
  anxiety: "/anxiety",
  depression: "/depression",
  panic: "/panic",
  stress: "/stress",
  bipolar: "/bipolar",
  ptsd: "/ptsd",
};

const MentalHealthResources: React.FC = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<BreathingMode>("478");

  // single-player control for audio bubbles
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Hardcoded playlist links (open in new tab)
  const playlistLinks: Record<string, string> = {
    nature: "https://www.youtube.com/watch?v=KJwYBJMSbPI",
    meditation: "https://www.youtube.com/watch?v=DRFHklnN-SM",
    binaural: "https://www.youtube.com/watch?v=n4YghVcjbpw",
  };

  const sections = [
    { id: "overview", label: "Understanding", emoji: "🧠", icon: Brain },
    { id: "conditions", label: "Conditions", emoji: "📄", icon: HelpCircle },
    { id: "breathing", label: "Breathing", emoji: "💨", icon: Wind },
    { id: "music", label: "Music", emoji: "🎵", icon: Headphones },
    { id: "crisis", label: "Crisis Support", emoji: "🆘", icon: Phone },
    { id: "services", label: "Services", emoji: "📋", icon: HelpCircle },
  ];

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // highlight nav
  const observer = useRef<IntersectionObserver | null>(null);
  const sectionIds = useMemo(() => sections.map((s) => s.id), []);
  useEffect(() => {
    const opts: IntersectionObserverInit = {
      root: null,
      rootMargin: "0px 0px -60% 0px",
      threshold: 0.1,
    };
    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.isIntersecting && setActiveSection(e.target.id));
    }, opts);
    sectionIds.forEach((id) => {
      const node = document.getElementById(id);
      if (node) observer.current?.observe(node);
    });
    return () => observer.current?.disconnect();
  }, [sectionIds]);

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: COLORS.bg }}>
      {/* bubbles */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: `
            radial-gradient(300px 300px at 8% 15%, ${COLORS.lilacLight}66 0%, transparent 60%),
            radial-gradient(380px 380px at 75% 25%, ${COLORS.periwinkle}55 0%, transparent 65%),
            radial-gradient(420px 420px at 18% 70%, ${COLORS.mint}66 0%, transparent 65%),
            radial-gradient(360px 360px at 88% 80%, ${COLORS.pinkLight}66 0%, transparent 60%)
          `,
          opacity: 0.9,
        }}
      />

      {/* Hero */}
      <section className="relative pt-8 pb-14 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1 text-center lg:text-left">
              <div
                className="inline-flex items-center gap-2 px-5 py-2 mb-6 rounded-full"
                style={{
                  background: "rgba(255,183,77,0.15)",
                  border: "2px solid rgba(255,183,77,0.35)",
                  boxShadow: "0 10px 30px rgba(255,183,77,0.25)",
                }}
              >
                <span className="text-sm font-semibold" style={{ color: "#b45309" }}>
                  ✨ Your Mental Wellness Journey Starts Here
                </span>
              </div>

              <h1
                className="text-[40px] md:text-[64px] font-extrabold leading-[1.05] mb-4"
                style={{ color: COLORS.text }}
              >
                Mental Health{" "}
                <span
                  className="block md:inline text-transparent bg-clip-text"
                  style={{
                    backgroundImage: `linear-gradient(90deg, ${COLORS.periwinkle}, ${COLORS.primary})`,
                  }}
                >
                  Resources
                </span>
              </h1>

              <p
                className="text-lg md:text-2xl mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0"
                style={{ color: COLORS.textMuted }}
              >
                Your mental health matters. Seeking help is a sign of{" "}
                <span style={{ color: COLORS.primary, fontWeight: 800 }}>strength</span>, not weakness.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="text-lg px-8 py-4 rounded-2xl"
                  style={{
                    backgroundColor: COLORS.primary,
                    color: "#fff",
                    boxShadow: "0 14px 28px rgba(122,135,250,0.35)",
                  }}
                  onClick={() => scrollToSection("overview")}
                >
                  Explore Resources
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-4 rounded-2xl border-2"
                  style={{ borderColor: COLORS.primary, color: COLORS.primary, background: "transparent" }}
                  onClick={() => scrollToSection("crisis")}
                >
                  Get Help Now
                </Button>
              </div>
            </div>

            <div className="flex-1">
              <img
                src={heroImage}
                alt="Mental health support illustration"
                className="w-full h-auto rounded-3xl object-cover"
                style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.15)" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sticky nav pills */}
      <section
        className="sticky top-0 z-50 backdrop-blur border-y"
        style={{ backgroundColor: `${COLORS.bg}E6`, borderColor: "rgba(255,183,77,0.25)" }}
      >
        <div className="w-full">
          <div
            className="flex gap-2 py-3 overflow-x-auto md:overflow-visible whitespace-nowrap md:whitespace-normal justify-start md:justify-center [-ms-overflow-style:none] [scrollbar-width:none] -mx-4 px-4 md:mx-auto"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {[
              { id: "overview", label: "Understanding", emoji: "🧠" },
              { id: "conditions", label: "Conditions", emoji: "📄" },
              { id: "breathing", label: "Breathing", emoji: "💨" },
              { id: "music", label: "Music", emoji: "🎵" },
              { id: "services", label: "Services", emoji: "📋" },
              { id: "crisis", label: "Crisis Support", emoji: "🆘" },
            ].map((s) => {
              const active = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200"
                  style={{
                    background: active ? COLORS.primary : "rgba(255,183,77,0.12)",
                    color: active ? "#fff" : COLORS.textMuted,
                    border: `2px solid ${active ? COLORS.primary : "rgba(255,183,77,0.35)"}`,
                    boxShadow: active ? "0 10px 24px rgba(122,135,250,0.35)" : "0 6px 16px rgba(0,0,0,0.05)",
                  }}
                >
                  <span className="mr-1">{s.emoji}</span>
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        {/* Understanding */}
        <section id="overview">
          <SectionTitle
            title="Understanding Mental Health"
            subtitle="Mental health affects how we think, feel, and act. It's the foundation of our overall well-being."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: "What is Mental Health?",
                text: "Emotional, psychological, and social well-being. It affects how we handle stress, relate to others, and make life choices.",
              },
              {
                icon: Brain,
                title: "You're Not Alone",
                text: "1 in 4 people in Southeast Asia experience mental health challenges. Seeking help is a courageous step.",
              },
              {
                icon: Heart,
                title: "Cultural Understanding",
                text: "Support that honors our cultural values, strengthens family bonds, and builds stronger community connections.",
              },
            ].map((b, i) => {
              const Icon = b.icon;
              return (
                <CardShell key={i}>
                  <div className="text-left">
                    <div
                      className="mb-4 inline-flex items-center justify-center rounded-2xl p-3"
                      style={{
                        background: `${COLORS.lilacLight}`,
                        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                      }}
                    >
                      <Icon className="w-7 h-7" style={{ color: COLORS.primary }} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: COLORS.text }}>
                      {b.title}
                    </h3>
                    <p style={{ color: COLORS.textMuted }}>{b.text}</p>
                  </div>
                </CardShell>
              );
            })}
          </div>
        </section>

        {/* Conditions */}
        <section id="conditions">
          <SectionTitle
            title="Mental Health Conditions & Resources"
            subtitle="Learn about common conditions and explore resources for support, healing, and recovery."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CONDITION_CARDS.map((c) => (
              <CardShell key={c.key} className="items-center text-center">
                {/* Title + blurb */}
                <div className="px-2">
                  <h3
                    className="text-2xl font-extrabold mb-3"
                    style={{ color: COLORS.text }}
                  >
                    {c.title}
                  </h3>
                  <p
                    className="text-base leading-relaxed mb-6 max-w-[34ch] mx-auto"
                    style={{ color: COLORS.textMuted }}
                  >
                    {c.blurb}
                  </p>
                </div>

                {/* Image */}
                <div className="w-full h-52 flex items-center justify-center mb-6">
                  <img
                    src={c.img}
                    alt={c.title}
                    className="max-h-full max-w-[260px] object-contain"
                  />
                </div>

                {/* Button */}
                <div className="mt-auto w-full flex items-center justify-center gap-4">
                  <Link to={CONDITION_ROUTES[c.key]}>
                    <Button
                      size="lg"
                      className="rounded-xl min-w-[160px] justify-center"
                      style={{ background: COLORS.primary, color: "#fff" }}
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
              </CardShell>
            ))}
          </div>
        </section>

        {/* Breathing */}
        <section id="breathing">
          <SectionTitle
            title="Breathing Exercises"
            subtitle="Simple yet powerful techniques you can do anywhere to manage anxiety and stress in the moment."
          />
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                key: "478" as BreathingMode,
                title: "4-7-8 Breathing",
                desc: "Inhale for 4, hold for 7, exhale for 8. This technique calms your nervous system and promotes better sleep.",
                tags: ["Reduces anxiety", "Promotes sleep"],
              },
              {
                key: "belly" as BreathingMode,
                title: "Belly Breathing",
                desc: "Hand on belly, breathe slowly and deeply so your hand rises like gentle ocean waves.",
                tags: ["Activates relaxation", "Natural healing"],
              },
            ].map((b, i) => (
              <CardShell key={i}>
                <div className="flex items-start gap-4">
                  <div
                    className="rounded-2xl p-3"
                    style={{
                      background: "linear-gradient(135deg,#22c55e,#14b8a6)",
                      boxShadow: "0 10px 30px rgba(20,184,166,0.25)",
                    }}
                  >
                    <Wind className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2" style={{ color: COLORS.text }}>
                      {b.title}
                    </h3>
                    <p className="mb-6" style={{ color: COLORS.textMuted }}>
                      {b.desc}
                    </p>

                    {/* simple circle preview */}
                    <div className="mb-6 flex justify-start">
                      <div
                        className="flex h-24 w-24 items-center justify-center rounded-full text-sm font-semibold"
                        style={{ border: `3px solid ${COLORS.teal}`, color: COLORS.teal }}
                      >
                        Breathe
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap mb-4">
                      {b.tags.map((t) => (
                        <span
                          key={t}
                          className="text-sm px-3 py-1 rounded-full"
                          style={{
                            background: "rgba(20,184,166,0.08)",
                            border: "1px solid rgba(20,184,166,0.25)",
                            color: COLORS.tealDark,
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <Button
                        size="sm"
                        className="rounded-xl px-5"
                        style={{
                          background: COLORS.primary,
                          color: "#fff",
                          boxShadow: "0 10px 18px rgba(122,135,250,0.35)",
                        }}
                        onClick={() => {
                          setModalMode(b.key);
                          setModalOpen(true);
                        }}
                      >
                        Try Now
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl px-5 border-2"
                        style={{ borderColor: COLORS.primary, color: COLORS.primary }}
                        onClick={() => {
                          setModalMode(b.key);
                          setModalOpen(true);
                        }}
                      >
                        Visualization
                      </Button>
                    </div>
                  </div>
                </div>
              </CardShell>
            ))}
          </div>
        </section>

        {/* Music */}
        <section id="music">
          <SectionTitle
            title="Calming Music & Sounds"
            subtitle="Tap Listen to play inside the card (one at a time), or open the full YouTube playlist."
          />
          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {[
              {
                id: "nature",
                title: "Nature Sounds",
                desc:
                  "Rain drops, ocean waves, forest whispers, and beautiful bird songs to transport you to tranquil places.",
                src: natureMp3,
              },
              {
                id: "meditation",
                title: "Meditation Music",
                desc:
                  "Gentle instrumental music crafted for mindfulness, meditation, and deep spiritual connection.",
                src: meditationMp3,
              },
              {
                id: "binaural",
                title: "Binaural Beats",
                desc:
                  "Sound frequencies designed to enhance relaxation, focus, and mental clarity.",
                src: binauralMp3,
              },
            ].map((m) => (
              <CardShell key={m.id} className="h-full">
                <div
                  className="inline-flex items-center justify-center rounded-2xl p-3 mb-3"
                  style={{
                    background: "linear-gradient(135deg,#f472b6,#a78bfa)",
                    boxShadow: "0 10px 30px rgba(244,114,182,0.25)",
                  }}
                >
                  <Headphones className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-semibold mb-2" style={{ color: COLORS.text }}>
                  {m.title}
                </h3>

                <p className="mb-5 min-h-[72px]" style={{ color: COLORS.textMuted }}>
                  {m.desc}
                </p>

                <AudioBubble
                  id={m.id}
                  title="Listen"
                  src={m.src}
                  activeId={playingId}
                  onRequestPlay={(id) => setPlayingId(id)}
                  onRequestStop={() => setPlayingId(null)}
                />

                <div className="mt-auto pt-4">
                  <Button
                    asChild
                    size="sm"
                    className="rounded-xl px-4"
                    style={{ background: COLORS.primary, color: "#fff" }}
                  >
                    <a href={playlistLinks[m.id]} target="_blank" rel="noopener noreferrer">
                      <ListMusic className="w-4 h-4 mr-2" />
                      Open playlist
                    </a>
                  </Button>
                </div>
              </CardShell>
            ))}
          </div>
        </section>

        {/* Services */}
        <section id="services">
          <SectionTitle
            title="Free & Low-Cost Services"
            subtitle="Mental health support doesn't have to be expensive. These community resources offer help at little to no cost."
          />
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Users,
                title: "Community Health Clinics",
                desc: "Government-subsidized mental health services across SEA.",
                chips: ["In-person", "Varies by location"],
              },
              {
                icon: BookOpen,
                title: "University Counseling",
                desc: "Free or low-cost counseling for students and sometimes the community.",
                chips: ["In-person/Online", "Academic year"],
              },
              {
                icon: Heart,
                title: "Community Support",
                desc: "Temple, mosque, church counseling and community support groups.",
                chips: ["In-person", "Ongoing"],
              },
              {
                icon: MessageCircle,
                title: "Online Peer Support",
                desc: "WhatsApp, Telegram, and Facebook groups led by peers.",
                chips: ["Online", "24/7"],
              },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <CardShell key={i}>
                  <Icon className="w-7 h-7 mb-3" style={{ color: COLORS.primary }} />
                  <h3 className="text-xl font-semibold mb-2" style={{ color: COLORS.text }}>
                    {s.title}
                  </h3>
                  <p className="mb-4" style={{ color: COLORS.textMuted }}>
                    {s.desc}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {s.chips.map((c) => (
                      <span
                        key={c}
                        className="text-sm px-3 py-1 rounded-full"
                        style={{
                          border: `1.5px solid ${COLORS.periwinkle}`,
                          color: COLORS.primary,
                          background: `${COLORS.lilacLight}55`,
                        }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </CardShell>
              );
            })}
          </div>
        </section>

        {/* Crisis */}
        <section id="crisis">
          <div
            className="rounded-3xl p-8 md:p-10"
            style={{
              background: "linear-gradient(135deg, rgba(239,68,68,0.05), rgba(220,38,38,0.03))",
              border: "2px solid rgba(239,68,68,0.15)",
              boxShadow: "0 10px 40px rgba(239,68,68,0.1)",
            }}
          >
            <SectionTitle
              title="Crisis Support Hotlines"
              subtitle="If you're in crisis or having thoughts of self-harm, please reach out immediately. These services are confidential and caring. You matter. ❤️"
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  country: "Singapore",
                  service: "Samaritans of Singapore",
                  number: "1767",
                  hours: "24/7",
                  languages: ["English", "Mandarin"],
                },
                {
                  country: "Malaysia",
                  service: "Befrienders KL",
                  number: "03-76272929",
                  hours: "24/7",
                  languages: ["English", "Bahasa Malaysia", "Mandarin", "Tamil"],
                },
                {
                  country: "Philippines",
                  service: "HOPELINE",
                  number: "0917-558-4673",
                  hours: "24/7",
                  languages: ["English", "Filipino"],
                },
                {
                  country: "Thailand",
                  service: "Department of Mental Health",
                  number: "1323",
                  hours: "24/7",
                  languages: ["Thai", "English"],
                },
                {
                  country: "Indonesia",
                  service: "Into The Light Indonesia",
                  number: "021-7888-6950",
                  hours: "24/7",
                  languages: ["Bahasa Indonesia", "English"],
                },
                {
                  country: "Vietnam",
                  service: "Heart 2 Heart",
                  number: "1900-599-088",
                  hours: "18:00-22:00",
                  languages: ["Vietnamese", "English"],
                },
              ].map((c, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white p-6"
                  style={{ border: "2px solid #fecaca", boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}
                >
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold" style={{ color: COLORS.text }}>
                        {c.country}
                      </h3>
                      <p className="font-medium" style={{ color: "#b91c1c" }}>
                        {c.service}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" style={{ color: "#ef4444" }} />
                      <a href={`tel:${c.number}`} className="font-mono text-lg font-semibold">
                        {c.number}
                      </a>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="rounded-full" style={{ borderColor: "#fecaca", color: "#b91c1c" }}>
                        {c.hours}
                      </Badge>
                    </div>
                    <div className="text-sm" style={{ color: COLORS.textMuted }}>
                      <strong>Languages:</strong> {c.languages.join(", ")}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <h3 className="text-2xl md:text-3xl font-extrabold mb-4" style={{ color: COLORS.primary }}>
                You Are Not Alone
              </h3>
              <p className="max-w-2xl mx-auto italic" style={{ color: COLORS.textMuted }}>
                “Taking care of your mental health is not selfish. It's essential.”
              </p>
              <div className="text-2xl mt-4">💛✨🌸</div>
            </div>
          </div>
        </section>
      </div>

      {/* Floating SOS */}
      <button
        aria-label="Open Crisis Section"
        onClick={() => scrollToSection("crisis")}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full text-white text-sm font-bold"
        style={{
          background: "linear-gradient(135deg,#ef4444,#dc2626)",
          boxShadow: "0 14px 36px rgba(239,68,68,0.35)",
        }}
      >
        SOS
      </button>

      {/* Breathing Modal */}
      <BreathingModal
        open={modalOpen}
        mode={modalMode}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

/** ----------------------- Condition cards data ----------------------- */
const CONDITION_CARDS: Array<{
  key: ConditionKey;
  title: string;
  blurb: string;
  img: string;
}> = [
  {
    key: "anxiety",
    title: "Anxiety Disorders",
    blurb:
      "Excessive worry, fear, or nervousness that interferes with daily activities including GAD, social anxiety, and phobias.",
    img: anxiety,
  },
  {
    key: "depression",
    title: "Depression",
    blurb:
      "Persistent feelings of sadness, hopelessness, or loss of interest that affect daily functioning.",
    img: depression,
  },
  {
    key: "panic",
    title: "Panic Disorder",
    blurb:
      "Sudden episodes of intense fear or discomfort that peak within minutes, often with physical symptoms.",
    img: panic,
  },
  {
    key: "stress",
    title: "Stress Management",
    blurb:
      "Healthy ways to cope with life pressures, work demands, and relationship challenges.",
    img: stress,
  },
  {
    key: "bipolar",
    title: "Bipolar Disorder",
    blurb:
      "Extreme mood swings including highs (mania) and lows (depression) that affect energy and activity.",
    img: bipolar,
  },
  {
    key: "ptsd",
    title: "PTSD & Trauma",
    blurb:
      "Triggered by experiencing or witnessing a terrifying event, with lasting emotional effects.",
    img: ptsd,
  },
];

export default MentalHealthResources;
