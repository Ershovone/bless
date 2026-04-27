import type { BibleBookId } from "@/types/bible";

/**
 * Russian abbreviations → canonical Synodal book IDs.
 * Order matters: longer/more-specific entries appear first so that
 * "1 Цар" matches before "Цар" alone, and "Иис.Нав" before "Нав".
 *
 * Synodal numbering note: книги Царств = 1-4 Цар (Samuel + Kings).
 */
export const RU_BIBLE_ABBREVIATIONS: ReadonlyArray<readonly [string, BibleBookId]> = [
  // Multi-word / compound first
  ["Книга Судей", "JDG"],
  ["Книга Руфи", "RUT"],
  ["Иис.Нав", "JOS"],
  ["Иис. Нав", "JOS"],
  ["1 Цар", "1SA"],
  ["2 Цар", "2SA"],
  ["3 Цар", "1KI"],
  ["4 Цар", "2KI"],
  ["1 Пар", "1CH"],
  ["2 Пар", "2CH"],
  ["1 Кор", "1CO"],
  ["2 Кор", "2CO"],
  ["1 Фес", "1TH"],
  ["2 Фес", "2TH"],
  ["1 Тим", "1TI"],
  ["2 Тим", "2TI"],
  ["1 Пет", "1PE"],
  ["2 Пет", "2PE"],
  ["1 Ин", "1JN"],
  ["2 Ин", "2JN"],
  ["3 Ин", "3JN"],
  ["Песн", "SNG"],
  ["Откр", "REV"],
  ["Плач", "LAM"],
  ["Авд", "OBA"],
  ["Авв", "HAB"],
  ["Аг", "HAG"],
  ["Зах", "ZEC"],
  ["Мал", "MAL"],
  ["Мих", "MIC"],
  ["Наум", "NAM"],
  ["Соф", "ZEP"],
  ["Иоиль", "JOL"],
  ["Ам", "AMO"],
  ["Осия", "HOS"],
  ["Иов", "JOB"],
  ["Притч", "PRO"],
  ["Еккл", "ECC"],
  ["Быт", "GEN"],
  ["Исх", "EXO"],
  ["Лев", "LEV"],
  ["Чис", "NUM"],
  ["Втор", "DEU"],
  ["Руфь", "RUT"],
  ["Суд", "JDG"],
  ["Езд", "EZR"],
  ["Неем", "NEH"],
  ["Есф", "EST"],
  ["Пс", "PSA"],
  ["Ис", "ISA"],
  ["Иер", "JER"],
  ["Иез", "EZK"],
  ["Дан", "DAN"],
  ["Иона", "JON"],
  ["Мф", "MAT"],
  ["Мк", "MRK"],
  ["Лк", "LUK"],
  ["Ин", "JHN"],
  ["Деян", "ACT"],
  ["Рим", "ROM"],
  ["Гал", "GAL"],
  ["Еф", "EPH"],
  ["Флп", "PHP"],
  ["Кол", "COL"],
  ["Тит", "TIT"],
  ["Флм", "PHM"],
  ["Евр", "HEB"],
  ["Иак", "JAS"],
  ["Иуд", "JUD"],
  ["Нав", "JOS"], // fallback if "Иис.Нав" not used
];

const LOOKUP = [...RU_BIBLE_ABBREVIATIONS].sort((a, b) => b[0].length - a[0].length);

export function findBookByAbbreviation(input: string): readonly [string, BibleBookId] | null {
  for (const entry of LOOKUP) {
    if (input === entry[0]) return entry;
  }
  return null;
}

export function getSortedAbbreviations(): typeof LOOKUP {
  return LOOKUP;
}
