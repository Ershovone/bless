import type { ParsedScriptureRef, RefChapter } from "@/types/bible";
import { getSortedAbbreviations } from "./abbreviations";

const DASH_RE = /[—–]/g;

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Inline-ref segments produced by parseProseRefs. */
export type ProseSegment = string | { refText: string };

let inlineRefRegex: RegExp | null = null;

function getInlineRefRegex(): RegExp {
  if (inlineRefRegex) return inlineRefRegex;
  const abbrevs = getSortedAbbreviations()
    .map(([a]) => escapeRegExp(a))
    .join("|");
  // Book abbrev + separator + chapter[range][:verse[range]][,chapter[:verse[range]]]…
  const spec = "\\d+(?:[-–]\\d+)?(?::\\d+(?:[-–]\\d+)?(?:,\\s?\\d+(?::\\d+(?:[-–]\\d+)?)?)*)?";
  inlineRefRegex = new RegExp(`(?:${abbrevs})[\\s.\u00A0]+${spec}`, "g");
  return inlineRefRegex;
}

/**
 * Find scripture refs embedded in prose text and split into segments
 * suitable for rendering with <ProseWithRefs>.
 */
export function parseProseRefs(text: string): ProseSegment[] {
  const re = new RegExp(getInlineRefRegex().source, "g");
  const result: ProseSegment[] = [];
  let lastIdx = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIdx) result.push(text.slice(lastIdx, m.index));
    result.push({ refText: m[0] });
    lastIdx = m.index + m[0].length;
    if (m[0].length === 0) re.lastIndex++;
  }
  if (lastIdx < text.length) result.push(text.slice(lastIdx));
  return result;
}

function expandVerseRange(spec: string): number[] {
  const trimmed = spec.trim();
  if (!trimmed) return [];
  if (trimmed.includes("-")) {
    const [aStr, bStr] = trimmed.split("-");
    const a = parseInt(aStr.trim(), 10);
    const b = parseInt(bStr.trim(), 10);
    if (Number.isNaN(a) || Number.isNaN(b) || a > b) return [];
    const out: number[] = [];
    for (let v = a; v <= b; v++) out.push(v);
    return out;
  }
  const single = parseInt(trimmed, 10);
  if (Number.isNaN(single)) return [];
  return [single];
}

function mergeChapter(
  acc: RefChapter[],
  ch: number,
  verses: number[],
): void {
  const existing = acc.find((r) => r.ch === ch);
  if (!existing) {
    acc.push({ ch, verses: [...verses] });
    return;
  }
  if (existing.verses.length === 0) return; // already whole-chapter
  if (verses.length === 0) {
    existing.verses = [];
    return;
  }
  const set = new Set(existing.verses);
  for (const v of verses) set.add(v);
  existing.verses = Array.from(set).sort((a, b) => a - b);
}

/**
 * Parse a chapter+verse spec like "14:21-25, 30" or "11:34, 33:16" or "13-14".
 * Comma-separated tokens; bare numbers after a colon-token are treated as
 * verses of the most recently named chapter.
 */
export function parseChapterVerseSpec(spec: string): RefChapter[] {
  const norm = spec.replace(DASH_RE, "-").trim();
  if (!norm) return [];

  const parts = norm.split(",").map((s) => s.trim()).filter(Boolean);
  const result: RefChapter[] = [];
  let currentCh: number | null = null;

  for (const part of parts) {
    if (part.includes(":")) {
      const [chStr, vStr] = part.split(":");
      const ch = parseInt(chStr.trim(), 10);
      if (Number.isNaN(ch)) continue;
      currentCh = ch;
      mergeChapter(result, ch, expandVerseRange(vStr));
    } else if (part.includes("-")) {
      const [aStr, bStr] = part.split("-");
      const a = parseInt(aStr.trim(), 10);
      const b = parseInt(bStr.trim(), 10);
      if (Number.isNaN(a) || Number.isNaN(b)) continue;
      if (currentCh !== null) {
        const verses: number[] = [];
        for (let v = a; v <= b; v++) verses.push(v);
        mergeChapter(result, currentCh, verses);
      } else {
        for (let c = a; c <= b; c++) mergeChapter(result, c, []);
        currentCh = b;
      }
    } else {
      const n = parseInt(part, 10);
      if (Number.isNaN(n)) continue;
      if (currentCh !== null) {
        mergeChapter(result, currentCh, [n]);
      } else {
        mergeChapter(result, n, []);
        currentCh = n;
      }
    }
  }

  return result.sort((a, b) => a.ch - b.ch);
}

/**
 * Parse a Russian scripture reference like "Исх 14:21–31".
 * Cross-book refs ("Исх 19 — Чис 10") fall back to the first book opened
 * at the spec we can extract before the second book name.
 */
export function parseScriptureRef(raw: string): ParsedScriptureRef | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const sortedAbbrev = getSortedAbbreviations();

  for (const [abbrev, bookId] of sortedAbbrev) {
    const re = new RegExp(`^${escapeRegExp(abbrev)}(?:[\\s.\u00A0]+|$)(.*)$`, "i");
    const m = trimmed.match(re);
    if (!m) continue;

    let spec = m[1].trim();
    let crossBook = false;

    // Detect cross-book: another known abbreviation appearing later in the spec.
    for (const [abbrev2] of sortedAbbrev) {
      const idx = spec.search(new RegExp(`\\s${escapeRegExp(abbrev2)}\\s`, "i"));
      if (idx > 0) {
        // Cut at the dash separator before the second book name if present.
        const beforeSecond = spec.slice(0, idx);
        const dashCut = beforeSecond.replace(/[\s—–-]+$/u, "");
        spec = dashCut;
        crossBook = true;
        break;
      }
    }

    const chapters = parseChapterVerseSpec(spec);
    return {
      bookId,
      abbrev,
      chapters,
      raw,
      ...(crossBook ? { crossBook: true } : {}),
    };
  }

  return null;
}
