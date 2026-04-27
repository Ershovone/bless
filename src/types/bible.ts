export type BibleBookId =
  | "GEN" | "EXO" | "LEV" | "NUM" | "DEU"
  | "JOS" | "JDG" | "RUT" | "1SA" | "2SA"
  | "1KI" | "2KI" | "1CH" | "2CH" | "EZR"
  | "NEH" | "EST" | "JOB" | "PSA" | "PRO"
  | "ECC" | "SNG" | "ISA" | "JER" | "LAM"
  | "EZK" | "DAN" | "HOS" | "JOL" | "AMO"
  | "OBA" | "JON" | "MIC" | "NAM" | "HAB"
  | "ZEP" | "HAG" | "ZEC" | "MAL"
  | "MAT" | "MRK" | "LUK" | "JHN" | "ACT"
  | "ROM" | "1CO" | "2CO" | "GAL" | "EPH"
  | "PHP" | "COL" | "1TH" | "2TH" | "1TI"
  | "2TI" | "TIT" | "PHM" | "HEB" | "JAS"
  | "1PE" | "2PE" | "1JN" | "2JN" | "3JN"
  | "JUD" | "REV";

export type BibleVerse = { v: number; t: string };

export type BibleChapter = { ch: number; verses: BibleVerse[] };

export type BibleBook = {
  id: BibleBookId;
  ru: string;
  ru_short: string;
  chapters: BibleChapter[];
};

/** A single chapter+verses request in a parsed reference. */
export type RefChapter = {
  ch: number;
  /** Empty array = whole chapter. */
  verses: number[];
};

export type ParsedScriptureRef = {
  bookId: BibleBookId;
  /** The abbreviation/string we matched on, e.g. "Исх". */
  abbrev: string;
  /** List of chapter spans this ref covers. */
  chapters: RefChapter[];
  /** Original raw text. */
  raw: string;
  /** True if the ref crossed multiple books — we open the first book only. */
  crossBook?: boolean;
};
