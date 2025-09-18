// src/lib/translation.ts

const SEA_LION_ENDPOINT = "/api/sea-lion/chat/completions";
const SEA_LION_KEY = "sk-Y8L5mwaeYGh4PSl2xXDbAA"; // NOTE: client-side keys are not secure

// Stable English snapshot
const originalsMap = new WeakMap<Text, string>();
const trackedNodes: Text[] = [];

let isTranslating = false;
let pending = false;

function normalize(s: string) {
  return s.replace(/\s+/g, " ").trim();
}

/** Collect visible text nodes */
function collectTextNodes(root: Node): Text[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const text = node.textContent?.trim() ?? "";
      if (!text) return NodeFilter.FILTER_REJECT;

      const el = node.parentElement;
      if (!el) return NodeFilter.FILTER_REJECT;

      // Skip dropdowns, tooltips, already-translated nodes
      if (el.closest("[data-i18n-skip='true']")) return NodeFilter.FILTER_REJECT;
      if (el.closest("[data-i18n-translated='true']")) return NodeFilter.FILTER_REJECT;

      const tag = el.tagName.toLowerCase();
      if (["script", "style", "code", "pre", "noscript"].includes(tag))
        return NodeFilter.FILTER_REJECT;

      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden")
        return NodeFilter.FILTER_REJECT;

      return NodeFilter.FILTER_ACCEPT;
    },
  } as any);

  const out: Text[] = [];
  let n: Text | null;
  while ((n = walker.nextNode() as Text | null)) out.push(n);
  return out;
}

function safeParseJSONArray(raw: string): string[] {
  if (!raw) return [];

  let cleaned = raw.trim().replace(/^```json/i, "").replace(/```$/, "").trim();

  try {
    const arr = JSON.parse(cleaned);
    if (Array.isArray(arr)) return arr;
  } catch {}

  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");
  if (start !== -1 && end > start) {
    try {
      const arr = JSON.parse(cleaned.slice(start, end + 1));
      if (Array.isArray(arr)) return arr;
    } catch {}
  }

  if (cleaned.includes('"')) {
    const matches = cleaned.match(/"([^"]+)"/g);
    if (matches) return matches.map((m) => m.replace(/"/g, ""));
  }

  console.warn("[i18n] failed to parse translations");
  return [];
}

/** Fetch translations from SEA-LION */
async function fetchTranslations(items: string[], target: string, strict = false): Promise<string[]> {
  const system = {
    role: "system",
    content: strict
      ? `Translate each string in the JSON array into ${target} language.
Rules:
- Output MUST be a valid JSON array of exactly ${items.length} strings.
- Preserve order, punctuation, numbers, emojis, brand names.
- No commentary, no code fences, no text outside JSON.`
      : `Translate short UI strings into ${target} language.
Keep numbers, punctuation, emojis, and brand names intact.
Return ONLY a JSON array of strings, same length and order.`,
  };

  const user = { role: "user", content: JSON.stringify(items) };

  const res = await fetch(SEA_LION_ENDPOINT, {
    method: "POST",
    headers: {
      accept: "application/json",
      authorization: `Bearer ${SEA_LION_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "aisingapore/Gemma-SEA-LION-v4-27B-IT",
      temperature: 0,
      max_completion_tokens: 800, // prevent truncation for Tamil etc
      messages: [system, user],
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.error("[i18n] SEA-LION error", res.status, errText);
    throw new Error(`SEA-LION ${res.status}`);
  }

  const data = await res.json();
  const raw = data?.choices?.[0]?.message?.content ?? "";
  return safeParseJSONArray(raw);
}

/** Align translations so one failed string doesn’t break whole chunk */
function alignTranslations(chunk: string[], part: string[]): string[] {
  const aligned: string[] = [];
  for (let i = 0; i < chunk.length; i++) {
    aligned.push(part[i] || chunk[i]);
  }
  return aligned;
}

/** Sequential chunked translation but apply at the end */
async function translateInChunks(
  items: string[],
  target: string,
  chunkSize = 25,
  delayMs = 6000
) {
  const results: string[] = [];

  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    let part: string[] = [];

    try {
      part = await fetchTranslations(chunk, target);
      if (part.length !== chunk.length) {
        console.warn("[i18n] misaligned length, retrying strict mode");
        part = await fetchTranslations(chunk, target, true);
      }
      part = alignTranslations(chunk, part);
    } catch (e) {
      console.error("[i18n] chunk failed", e);
      part = chunk;
    }

    results.push(...part);

    if (i + chunkSize < items.length) {
      await new Promise((r) => setTimeout(r, delayMs)); // throttle → 10 rpm
    }
  }

  return results;
}

export async function translatePage(target: string) {
  if (!target || target === "en") return;

  if (isTranslating) {
    pending = true;
    return;
  }
  isTranslating = true;

  try {
    const roots = [
      document.querySelector("nav"),
      document.querySelector("header"),
      document.querySelector("main"),
      document.getElementById("root"),
      document.body,
      ...document.querySelectorAll(".dropdown-menu, .tooltip, .modal, .popup"),
    ].filter(Boolean) as Element[];

    const nodes = Array.from(new Set(roots.flatMap((r) => collectTextNodes(r))));
    if (!nodes.length) {
      console.warn("[i18n] no nodes to translate");
      return;
    }

    // Snapshot originals once
    for (const n of nodes) {
      if (!originalsMap.has(n)) {
        originalsMap.set(n, n.textContent || "");
        trackedNodes.push(n);
      }
    }

    const originals = nodes.map((n) => originalsMap.get(n) || "");
    const normalized = originals.map(normalize);

    const firstSeen: Record<string, string> = {};
    for (const s of originals) {
      const k = normalize(s);
      if (!(k in firstSeen)) firstSeen[k] = s;
    }

    const uniqueNorm = Array.from(new Set(normalized));
    const payload = uniqueNorm.map((k) => firstSeen[k] ?? k);

    // 🚀 Translate all unique strings, apply once at end
    const translated = await translateInChunks(payload, target);

    const map: Record<string, string> = {};
    uniqueNorm.forEach((k, i) => (map[k] = translated[i]));

    nodes.forEach((n, i) => {
      const norm = normalized[i];
      const t = map[norm];
      if (t && t !== n.textContent) {
        n.textContent = t;
        n.parentElement?.setAttribute("data-i18n-translated", "true");
      }
    });

    console.info("[i18n] applied translations", {
      totalNodes: nodes.length,
      uniqueStrings: uniqueNorm.length,
    });
  } finally {
    isTranslating = false;
    if (pending) {
      pending = false;
      setTimeout(() => {
        const lang = localStorage.getItem("lang") || "en";
        if (lang !== "en") translatePage(lang);
      }, 500);
    }
  }
}

/** User selects a language */
export async function applyLanguage(lang: string) {
  localStorage.setItem("lang", lang);
  document.documentElement.setAttribute("lang", lang);

  // Restore English baseline
  for (const node of trackedNodes) {
    const original = originalsMap.get(node);
    if (original != null) {
      node.textContent = original;
      node.parentElement?.removeAttribute("data-i18n-translated");
    }
  }

  if (lang === "en") {
    console.info("[i18n] restored English");
    return;
  }

  await translatePage(lang);
  await waitForTranslationComplete();
}

function waitForTranslationComplete(): Promise<void> {
  return new Promise((resolve) => {
    const check = () => {
      if (!isTranslating) resolve();
      else setTimeout(check, 200);
    };
    check();
  });
}

/** Start translation observer */
export function initTranslation() {
  const lang = localStorage.getItem("lang") || "en";
  document.documentElement.setAttribute("lang", lang);

  if (lang !== "en") {
    translatePage(lang).catch((e) => console.error("[i18n] initial translate failed:", e));
  }

  const observer = new MutationObserver((mutations) => {
    const current = localStorage.getItem("lang") || "en";
    if (current === "en") return;

    let needsTranslation = false;

    for (const m of mutations) {
      // New nodes appended
      if (m.type === "childList") {
        if (
          Array.from(m.addedNodes).some(
            (n) =>
              n.nodeType === Node.TEXT_NODE &&
              !(n.parentElement?.hasAttribute("data-i18n-translated"))
          )
        ) {
          needsTranslation = true;
        }
      }

      // Text changed in place
      if (m.type === "characterData") {
        const el = (m.target as Text).parentElement;
        if (el && !el.hasAttribute("data-i18n-translated")) {
          needsTranslation = true;
        }
      }

      // Visibility toggles (hidden → visible, dropdowns, popups)
      if (m.type === "attributes") {
        if (
          m.attributeName === "style" ||
          m.attributeName === "class" ||
          m.attributeName?.startsWith("aria-")
        ) {
          needsTranslation = true;
        }
      }
    }

    if (needsTranslation) {
      console.info("[i18n] observer caught updates, re-translating");
      translatePage(current).catch((e) =>
        console.error("[i18n] observer translate failed:", e)
      );
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ["style", "class", "aria-expanded", "aria-hidden"],
  });

  // 🔥 Defensive re-run after button clicks (e.g., quiz step buttons)
  document.body.addEventListener("click", () => {
    const current = localStorage.getItem("lang") || "en";
    if (current !== "en") {
      setTimeout(() => translatePage(current), 300);
    }
  });

  // 🔥 Defensive re-run on modal open (Bootstrap example; adjust if using other libs)
  document.addEventListener("shown.bs.modal", () => {
    const current = localStorage.getItem("lang") || "en";
    if (current !== "en") translatePage(current);
  });

  return observer;
}


// Force re-translate on navigation (history API, back/forward, or pushState)
function patchNavigation() {
  const origPush = history.pushState;
  const origReplace = history.replaceState;

  function handleNav() {
    const lang = localStorage.getItem("lang") || "en";
    if (lang !== "en") {
      console.info("[i18n] navigation detected, re-translating page");
      translatePage(lang).catch((e) => console.error("[i18n] nav translate failed:", e));
    }
  }

  history.pushState = function (...args) {
    const ret = origPush.apply(this, args as any);
    handleNav();
    return ret;
  };

  history.replaceState = function (...args) {
    const ret = origReplace.apply(this, args as any);
    handleNav();
    return ret;
  };

  window.addEventListener("popstate", handleNav);
}

patchNavigation();
