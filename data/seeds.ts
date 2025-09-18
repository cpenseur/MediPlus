// @/data/seeds.ts
import { format, addDays } from "date-fns";

export type Mood = "great" | "good" | "okay" | "low" | "difficult";

export interface JournalSeedEntry {
  id: string;
  date: string; // yyyy-MM-dd
  title: string;
  content: string;
  mood: Mood;
  tags: string[];
}

export const generateJournalSeedFromSept1 = (): JournalSeedEntry[] => {
  const now = new Date();
  const year = now.getFullYear();
  const start = new Date(year, 8, 1); // September (0-indexed)
  const DAYS = 17;

  const longBodies: string[] = [
    "I woke up already thinking about work, the to-do list stretching further than I wanted. The morning emails were heavy, but I tried to pace myself. Breakfast was rushed—coffee and toast at my desk. A minor conflict over project priorities added tension, but I chose to clarify instead of escalate. The stress sat in my shoulders, yet I ended the day by walking outside for ten minutes. It wasn’t a perfect start, but it was progress.",
    "Work felt relentless today. I let myself focus on only the top three tasks and let the rest wait. Lunch was noodles from the corner shop, eaten while reviewing notes. A colleague’s sharp tone could have derailed me, but I chose to step back and breathe before replying. Stress lingered, but naming it made it lighter. I reminded myself I don’t have to fix everything in one sitting.",
    "Morning meetings stacked one after another. I barely had time for breakfast, just a banana and tea. At work, expectations kept shifting and I caught myself getting frustrated. Instead of pushing through, I paused, stretched, and came back calmer. Dinner was simple—rice and vegetables. Even though stress followed me around, I noticed small reliefs: a coworker’s quick joke, a task finally closed. It was enough to keep moving.",
    "Stress was loud in my body today, especially after a tense call about deadlines. I made a list of what was mine to handle and what could wait, which softened the pressure. Lunch was quick: a sandwich grabbed between meetings. The conflicts weren’t fully solved, but I felt steadier by the evening. Noticing small wins—a report sent out, a message answered—helped remind me that the day wasn’t just heavy.",
    "Work moved like shifting weather—sometimes stormy, sometimes clearing. I practiced pausing before responding to messages, and it actually changed the tone of conversations. Lunch was eaten away from the laptop for once, which felt refreshing. I wrote down one small win at the end of the day and it shifted how I saw my progress. Stress showed up, but I let myself acknowledge it without judgment. That made the evening softer.",
    "Saturday gave me space to step back from work. I let the morning move slowly, with pancakes and coffee at the table instead of my desk. I met a friend for lunch, and we talked more about life than deadlines. Later, I walked through the park and noticed how the air felt lighter without the weight of tasks pressing in. The stress never fully disappears, but giving myself a full day of calm made me feel more grounded.",
    "Sunday was about balance. I tidied the apartment, cooked a simple breakfast, and gave myself permission to rest. Work thoughts still floated in, but I wrote them down for Monday and let them go. I went out for a quiet dinner, enjoying food without screens or rushing. The evening ended with music playing softly and a book in hand. Not every weekend has to be eventful—sometimes restoring energy is the real work.",
    "Monday came fast. I started with a strong coffee and jumped into back-to-back meetings. Stress rose quickly, but I kept pausing before replies, which helped. Lunch was takeout rice and chicken, eaten between calls. A small conflict about task ownership surfaced, and though it rattled me, I kept my tone steady. By evening, I was drained but proud of holding boundaries. The first day back always feels heavy, but I made it through.",
    "I hit a rough patch around midday—unfocused and restless. I stepped away, walked a block, and came back clearer. Perfectionism tried to set the pace, but I kept repeating ‘done is better than perfect.’ Lunch was leftovers, eaten quickly but enough. Stress didn’t vanish, but it loosened its grip. Three true sentences about how the day felt became my journal entry, and honesty felt like relief.",
    "I practiced ending on time. I closed the laptop when I said I would, even though the list wasn’t done. My eyes needed the break, so I stared out the window for a full minute. Food was plain but grounding—soup and bread. At work I tried reducing small frictions, like clearing my desk before the next task. Stress didn’t rule the day; structure did. That’s a shift I want to keep.",
    "I woke up heavier than usual, already dreading the workload. Instead of pushing, I asked: what helps even a little? Coffee, a shower, and sunlight by the window. Lunch was quiet, just rice and fruit. Work still felt daunting, but I kept commitments small and real—emails answered, one meeting done. The stress didn’t disappear, but I stayed with it without giving up. That counts.",
    "Friday tested me with endless small fires to put out. A report bounced back with edits, a meeting ran late, and tempers flared. I ate a quick bowl of noodles at my desk, but it didn’t feel like a break. Still, I noticed how a colleague’s encouragement shifted my mood. By evening, I let the stress drain away by cooking a proper dinner and putting my phone aside. The week ended messy, but I ended it intact.",
    "Saturday was for catching my breath. I let myself sleep in, then had breakfast at a café—pancakes and coffee that tasted better than anything at home. I wandered through a bookstore, flipping through pages with no agenda. Work felt distant for once, and that distance gave me clarity. Dinner was shared with friends, laughter cutting through the stress I’d been carrying. Days like this remind me why rest matters.",
    "Sunday carried a quiet rhythm. I cleaned the kitchen, listened to music, and let myself move slowly. Lunch was a simple soup I made from scratch, which felt comforting. Work emails were there, but I refused to open them. Instead, I watched a movie in the evening and wrote down three things I appreciated about the week. Stress may return tomorrow, but today I chose calm.",
    "Monday pulled me back into the grind. Meetings, reports, and shifting deadlines filled the hours. Breakfast was rushed, just coffee grabbed on the way. Midday brought a conflict over priorities, and though my first instinct was to snap, I steadied my voice. Stress followed me through the day, but I carved out a small break for lunch outside, which helped. Ending the evening with music kept me from carrying the tension into the night.",
    "Evening quiet wrapped around me like a blanket. I lit a candle, turned on soft music, and reflected on the past two weeks of work. What worked: ending on time, naming small wins, and stepping away from the desk for meals. What I’ll adjust: fewer late-night checks, earlier breaks. Work will always bring stress, but I’m learning how to shape my days so they feel kinder. That feels like real progress.",
    "Work filled most of the day with meetings and shifting priorities, and I carried the usual weight of deadlines. Lunch was quick, just a sandwich eaten at my desk, but I reminded myself to slow down with a few deep breaths. By evening, I stepped out to meet a friend, and we ended up talking about our secondary school days. The memories came with laughter and a kind of ease I hadn’t felt all week. Stress was still there in the background, but sharing stories reminded me that life isn’t only about work—it’s also about connection."
  ];

  const moods: Mood[] = ["good", "okay", "great", "low", "difficult"];

  const entries = Array.from({ length: DAYS }).map((_, i) => {
    const d = addDays(start, i);
    const dateStr = format(d, "yyyy-MM-dd");
    const mood = moods[i % moods.length];
    const body = longBodies[i % longBodies.length];
    const title = [
      "Morning Reflections",
      "Small Wins",
      "Evening Wind-down",
      "Checking In",
      "Gentle Reset",
      "Slow & Steady",
      "Breathing Space",
      "Tiny Rituals",
      "Loosening The Knot",
      "Progress With Care",
      "Energy Check",
      "Gratitude Notes",
      "Tending The Space",
      "Let It Be Light",
      "No Comparison",
      "Progress",
      "Met my friend",
    ][i % 17];

    return {
      id: `seed-${dateStr}`,
      date: dateStr,
      title,
      content: body,
      mood,
      tags: ["routine", mood, i % 2 ? "self-care" : "work"],
    };
  });

  return entries;
};
