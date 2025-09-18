import React from "react";
import { motion } from "framer-motion"; // npm i framer-motion

// --- Your palette (fixed 'CEE2E0') ---
const colors = {
  indigo50: "#E8EAFF",
  sand50: "#FFE5B2",
  blush50: "#FCD4D2",
  blush300: "#F2A8A5",
  cream50: "#F4E7E1",
  mint50: "#CEE2E0",
  indigo200: "#C3CBF9",
  indigo500: "#7A87FA",
  ink: "#13151A",
};

function GradientText({
  children,
  from,
  to,
  className = "",
}: {
  children: React.ReactNode;
  from: string;
  to: string;
  className?: string;
}) {
  return (
    <span
      className={`bg-clip-text text-transparent ${className}`}
      style={{ backgroundImage: `linear-gradient(90deg, ${from}, ${to})` }}
    >
      {children}
    </span>
  );
}


// Choose ONE color to cover everything BELOW the first section
const afterHeroBackground = colors.cream50; // change here if you want a different single color

const Section: React.FC<React.PropsWithChildren<{ id?: string; className?: string; style?: React.CSSProperties }>> = ({
  id,
  className,
  style,
  children,
}) => (
  <section id={id} className={`w-full ${className || ""}`} style={style}>
    {children}
  </section>
);

const Container: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className, children }) => (
  <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className || ""}`}>{children}</div>
);

export default function MentalHealthLanding() {
  return (
    <main className="w-full text-gray-900">
      {/* ====== HERO (your image background) ====== */}
      <Section id="home" className="relative flex min-h-[92vh] items-center justify-center text-center">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/src/assets/Home.jpg')" }} // replace with your image
        />
        <div className="absolute inset-0 bg-black/40" /> {/* dark overlay for contrast */}

        <div className="absolute inset-x-0 top-10 md:top-40 z-10">
          <Container className="relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-10xl font-extrabold leading-tight text-white md:text-7xl"
            >
              You are not alone.
              <br />
              <span className="block mt-3 text-indigo-200">Your mental health matters.</span>
            </motion.h1>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1 }} className="mt-12 md:mt-16 lg:mt-10">
            <a
              href="#features"
              className="
                rounded-xl px-8 py-4 text-lg font-semibold text-white
                shadow-lg transition hover:-translate-y-1
                border backdrop-blur-md
                hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white/40
              "
              style={{ background: "rgba(255,255,255,0.14)", borderColor: "rgba(255,255,255,0.35)" }}
            >
              Explore Features
            </a>
            </motion.div>
          </Container>
        </div>
      </Section>

      {/* ====== Everything below hero uses ONE color background ====== */}
      <div style={{ backgroundColor: afterHeroBackground }}>
        {/* ====== MID STAT / AWARENESS (UPGRADED) ====== */}
        
          <Section id="about" className="py-20">
            {/* Looser left margin: wider container + smaller left padding */}
            <Container className="max-w-screen-xl pl-3 pr-6 sm:pl-4 sm:pr-8 lg:pl-6 lg:pr-10">
              <div className="grid items-center gap-8 md:grid-cols-12">
                {/* Text side */}
                <motion.div
                  className="md:col-span-7 md:col-start-1"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Gradient only on this heading */}
                  <h2 className="font-black leading-[1.05] text-4xl sm:text-5xl md:text-6xl"  style={{ color: colors.indigo500 }}>
                      DID YOU KNOW?
                  </h2>

                  {/* Stat + highlight (no gradient on numbers) */}
                  <div className="mt-4">
                    <p className="text-2xl md:text-3xl font-extrabold" style={{ color: colors.ink }}>
                      About 260 millionpeople in Southeast Asia — roughly{" "}
                      <span className="font-black text-3xl sm:text-4xl md:text-5xl" style={{ color: colors.indigo500 }}>1 in 7</span> — live with a mental health condition.
                    </p>

                    {/* Your original motivational copy (kept) */}
                    <p className="mt-4 text-base md:text-lg text-gray-800">
                      You are not alone. It’s okay to ask for support. Small steps matter: check in with your mood,
                      write how you feel, and learn simple ways to cope. <strong>Take the first step today.</strong>
                    </p>
                  </div>

                  {/* Subtle link back to features */}
                  <a
                    href="#features"
                    className="mt-7 inline-flex items-center justify-center rounded-xl border px-6 py-3 text-sm font-semibold backdrop-blur-md transition hover:-translate-y-0.5 hover:shadow"
                    style={{ background: "rgba(255,255,255,0.18)", borderColor: "rgba(0,0,0,0.12)", color: colors.ink }}
                  >
                    Explore how we can help →
                  </a>
                </motion.div>

                {/* Image side (cover + center) */}
                <div
                  className="md:col-span-5 h-64 md:h-[28rem] rounded-2xl bg-cover bg-center relative overflow-hidden"
                  style={{ backgroundImage: "url('/src/assets/secondhome.png')" }}  
                >
                </div>
              </div>
            </Container>
          </Section>



        {/* FEATURES (colorful pills) */}
        <Section id="features" className="py-20">
          <Container>
            <div className="text-center">
              <h3 className="text-4xl font-extrabold sm:text-5xl" style={{ color: colors.ink }}>
                WHAT YOU CAN DO HERE
              </h3>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-800">Four simple tools to help you reflect, track, and grow.</p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <FeaturePill
                title="Log In"
                desc="Your personal safe space. Continue where you left off."
                bg={colors.indigo200}
                fg={colors.indigo500}
                link="/login"
                cta="Sign in →"
              />
              <FeaturePill
                title="Mood Tracker"
                desc="Quick daily check-ins. Notice patterns and triggers."
                bg={colors.blush50}
                fg={colors.ink}
                link="/moodtracker"
                cta="Track my mood →"
              />
              <FeaturePill
                title="Journaling"
                desc="Write freely with optional prompts. Save or export anytime."
                bg={colors.sand50}
                fg={colors.ink}
                link="/journal"
                cta="Start journaling →"
              />
              <FeaturePill
                title="Resources"
                desc="Coping tips, helplines, and trusted reads."
                bg={colors.mint50}
                fg={colors.ink}
                link="/resources"
                cta="Explore resources →"
              />
            </div>
          </Container>
        </Section>

        {/* FINAL PHRASE */}
        <Section className="py-20 text-center">
          <Container>
            <h2 className="text-3xl font-extrabold sm:text-4xl md:text-4xl" style={{ color: colors.indigo500 }}>
              Healing takes time, and asking for help is a courageous step.
            </h2>
          </Container>
        </Section>
      </div>
    </main>
  );
}

/** Colorful pill-style feature */
function FeaturePill({
  title,
  desc,
  bg,
  fg,
  link,
  cta,
}: {
  title: string;
  desc: string;
  bg: string;
  fg: string;
  link: string;
  cta: string;
}) {
  return (
    <div
      className="rounded-3xl p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
      style={{ background: bg }}
    >
      <div
        className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
        style={{ background: "#ffffffaa", color: fg }}
      >
        {title}
      </div>
      <h4 className="mt-3 text-2xl font-bold" style={{ color: colors.ink }}>
        {title}
      </h4>
      <p className="mt-2 text-sm text-gray-800">{desc}</p>
      <a href={link} className="mt-4 inline-block text-sm font-semibold" style={{ color: colors.ink }}>
        {cta}
      </a>
    </div>
  );
}
