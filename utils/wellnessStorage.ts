// src/utils/wellnessStorage.ts
import { format } from "date-fns";

export type DatedEntry = { date: string } & Record<string, any>;

const KEYS = {
  mood: "mood_entries",
  journal: "journal_entries",
};

export const STORAGE_KEYS = KEYS;

/** Safe read */
export function readEntries(key: string): DatedEntry[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/** Safe write */
export function writeEntries(key: string, entries: DatedEntry[]) {
  localStorage.setItem(key, JSON.stringify(entries));
  // Optional event for cross-tab listeners
  window.dispatchEvent(new CustomEvent("wellness:entries-updated", { detail: { key } }));
}

/** Append newest entry (at top) */
export function addEntry(key: string, entry: DatedEntry) {
  const entries = readEntries(key);
  const next = [entry, ...entries];
  writeEntries(key, next);
  return next;
}

/** Return set of unique ISO days */
export function uniqueDaySet(entries: DatedEntry[]): Set<string> {
  const s = new Set<string>();
  for (const e of entries) if (typeof e.date === "string") s.add(e.date);
  return s;
}

/** Consecutive-day streak up to today */
export function computeStreak(dates: Set<string>, today = new Date()): number {
  let streak = 0;
  let cur = new Date(today);
  while (dates.has(format(cur, "yyyy-MM-dd"))) {
    streak += 1;
    cur.setDate(cur.getDate() - 1);
  }
  return streak;
}

/** Ensure entry has today’s ISO date if missing */
export function withTodayDate<T extends Record<string, any>>(entry: T, dt = new Date()): T & { date: string } {
  const iso = format(dt, "yyyy-MM-dd");
  return { ...entry, date: entry.date || iso };
}

// ===================== SEEDERS (DATE-DRIVEN) =====================
import { addDays, differenceInCalendarDays } from "date-fns";

// Local pickers (no external deps)
const EMOTIONS = [
  "joyful","content","peaceful","optimistic","grateful",
  "neutral","tired","stressed","anxious","worried","frustrated","sad",
] as const;
const JOURNAL_MOODS = ["great","good","okay","low","difficult"] as const;
const SAMPLE_NOTES = [
  "Felt calm after a short walk",
  "Energy dipped post-lunch",
  "Better after talking to a friend",
  "Slept late, a bit groggy",
  "Work felt intense today",
  "Did a 5-min breathing session",
];
const SAMPLE_TITLES = ["Morning Reflection","Small Wins","Tough Moment","Evening Wind-down","Gratitude Check-in"];
const SAMPLE_BODIES = [
  "Wrote one thing that made me smile. Felt lighter after.",
  "Work was heavy, but breathing helped. I slowed down and continued.",
  "Called a friend. Connection helped me reset perspective.",
  "Short walk + tea. Mood improved a notch.",
  "Three gratitudes: sleep, music, kind text from a friend.",
];
const TAGS = ["routine","gratitude","work","breathing","friends","calm"] as const;

function pick<T>(arr: readonly T[], i: number) { return arr[i % arr.length]; }

type SeedMode = "both" | "alternate" | "mood-only" | "journal-only";

/**
 * Seed consecutive entries so streaks begin at `startISO`.
 * By default, fills **every day** from start → today (inclusive) for BOTH mood and journal.
 *
 * @param startISO "YYYY-MM-DD" (e.g. "2025-09-01")
 * @param options  { includeToday?: boolean; mode?: SeedMode }
 *   - includeToday (default true): if false, seeds up to yesterday
 *   - mode:
 *       "both" (default)        → mood + journal every day
 *       "alternate"             → mood on even offsets, journal on odd
 *       "mood-only" / "journal-only"
 */
export function seedStreakFrom(
  startISO: string,
  options?: { includeToday?: boolean; mode?: SeedMode }
) {
  const includeToday = options?.includeToday ?? true;
  const mode: SeedMode = options?.mode ?? "both";

  const start = new Date(startISO + "T00:00:00");
  if (isNaN(start.getTime())) throw new Error("seedStreakFrom: invalid startISO");

  const today = new Date();
  const end = includeToday ? today : addDays(today, -1);
  const days = differenceInCalendarDays(end, start) + 1;
  if (days <= 0) return { daysSeeded: 0 };

  // Load existing
  const mood = readEntries(STORAGE_KEYS.mood);
  const journal = readEntries(STORAGE_KEYS.journal);

  // Index by id for easy upsert/dedupe
  const moodById = new Map<string, any>(mood.map(e => [String(e.id ?? Math.random()), e]));
  const journalById = new Map<string, any>(journal.map(e => [String(e.id ?? Math.random()), e]));

  for (let i = 0; i < days; i++) {
    const d = addDays(start, i);
    const iso = format(d, "yyyy-MM-dd");

    const doMood = mode === "both" || mode === "mood-only" || (mode === "alternate" && i % 2 === 0);
    const doJournal = mode === "both" || mode === "journal-only" || (mode === "alternate" && i % 2 === 1);

    if (doMood) {
      const hour = 8 + (i % 10);
      const minute = (i * 7) % 60;
      const time = `${String(hour).padStart(2,"0")}:${String(minute).padStart(2,"0")}`;
      const id = `m-${iso}`;

      moodById.set(id, {
        id,
        emotion: pick(EMOTIONS, i),
        date: iso,
        time,
        notes: pick(SAMPLE_NOTES, i),
        triggers: ["work","sleep","exercise"].filter((_, k) => (i + k) % 2 === 0),
      });
    }

    if (doJournal) {
      const id = `j-${iso}`;
      journalById.set(id, {
        id,
        date: iso,
        title: pick(SAMPLE_TITLES, i),
        content: pick(SAMPLE_BODIES, i),
        mood: pick(JOURNAL_MOODS, i),
        tags: [pick(TAGS, i), "demo"],
      });
    }
  }

  const moodNext = Array.from(moodById.values()).sort((a: any, b: any) => (a.date > b.date ? -1 : 1));
  const journalNext = Array.from(journalById.values()).sort((a: any, b: any) => (a.date > b.date ? -1 : 1));

  writeEntries(STORAGE_KEYS.mood, moodNext);
  writeEntries(STORAGE_KEYS.journal, journalNext);

  // Fire update event so UI can react if listening
  window.dispatchEvent(new CustomEvent("wellness:seeded", { detail: { startISO, includeToday, mode } }));

  return { daysSeeded: days };
}

/** Quick reset */
export function clearWellnessData() {
  localStorage.removeItem(STORAGE_KEYS.mood);
  localStorage.removeItem(STORAGE_KEYS.journal);
}

