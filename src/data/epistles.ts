import type { CityId, Epistle } from "@/types/atlas";

export const EPISTLES: Record<CityId, Epistle[]> = {
  rome: [{ ru: "Послание к Римлянам", en: "Romans", written: "~57 в Коринфе" }],
  corinth: [
    { ru: "1-е к Коринфянам", en: "1 Corinthians", written: "~55 в Ефесе" },
    { ru: "2-е к Коринфянам", en: "2 Corinthians", written: "~56 в Македонии" },
  ],
  ephesus: [{ ru: "Послание к Ефесянам", en: "Ephesians", written: "~62 в Риме" }],
  philippi: [{ ru: "Послание к Филиппийцам", en: "Philippians", written: "~62 в Риме" }],
  thessalonica: [
    { ru: "1-е к Фессалоникийцам", en: "1 Thessalonians", written: "~51 в Коринфе" },
    { ru: "2-е к Фессалоникийцам", en: "2 Thessalonians", written: "~51 в Коринфе" },
  ],
};
