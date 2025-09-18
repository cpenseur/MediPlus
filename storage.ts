// src/lib/storage.ts
export const LS_KEYS = {
    JOURNAL: "mediplus_journal_entries",
    MOOD: "mediplus_mood_entries",
  } as const;
  
  export function loadJSON<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  }
  
  export function saveJSON<T>(key: string, value: T) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore quota or private mode errors
    }
  }
  