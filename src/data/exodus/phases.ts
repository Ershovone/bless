import type { ExodusPhase } from "@/types/exodus";

const PHASE_COLORS = {
  escape: "#b8362e",       // bold red — drama of escape
  to_sinai: "#d96d2c",     // warm orange — desert sun
  law: "#a85e16",          // deep amber-bronze — gravity of Law
  wandering: "#5a4426",    // deep umber — long weary years
  to_promised: "#2c6d8e",  // blue — fulfilment / Jordan
} as const;

export const EXODUS_PHASES: ExodusPhase[] = [
  {
    id: "escape",
    ru: "Бегство из Египта",
    en: "Escape from Egypt",
    yearsBC: "~1446 до Р.Х.",
    acts: "Исх 12–15 · Чис 33:3–8",
    color: PHASE_COLORS.escape,
    description:
      "Десять казней. Пасха. Ночной выход из Раамсеса. Чудесный переход через Чермное море и гибель войска фараона.",
    stations: ["rameses", "succoth", "etham", "pi_hahiroth"],
  },
  {
    id: "to_sinai",
    ru: "Путь к Синаю",
    en: "Journey to Sinai",
    yearsBC: "1446 до Р.Х. · 3 месяца",
    acts: "Исх 15–18 · Чис 33:8–14",
    color: PHASE_COLORS.to_sinai,
    description:
      "Горькая вода Мерры, оазис Елима, стоянка у моря, манна и перепела в пустыне Син, вода из скалы и битва с Амалекитянами в Рефидиме.",
    stations: [
      "marah",
      "elim",
      "by_red_sea",
      "sin_wilderness",
      "dophkah",
      "alush",
      "rephidim",
    ],
  },
  {
    id: "law",
    ru: "У горы Закона",
    en: "At the Mountain",
    yearsBC: "1446–1445 до Р.Х. · ~11 месяцев",
    acts: "Исх 19 — Чис 10 · Чис 33:15",
    color: PHASE_COLORS.law,
    description:
      "Богоявление на Синае. Десять Заповедей и Закон. Скиния и священство. Золотой телец. Скрижали обновлены.",
    stations: ["sinai"],
  },
  {
    id: "wandering",
    ru: "38 лет странствия",
    en: "38 Years of Wandering",
    yearsBC: "1445–1407 до Р.Х.",
    acts: "Чис 11–20 · Чис 33:16–36",
    color: PHASE_COLORS.wandering,
    description:
      "Соглядатаи приносят дурную весть. Поколение, вышедшее из Египта, осуждено умереть в пустыне. Двадцать одна стоянка через Синай и Негев — большинство мест неизвестны точно. Возвращение в Кадес-Варни в год 40-й.",
    stations: [
      "kibroth_hattaavah",
      "hazeroth",
      "rithmah",
      "rimmon_perez",
      "libnah",
      "rissah",
      "kehelathah",
      "mt_shapher",
      "haradah",
      "makheloth",
      "tahath",
      "tarah",
      "mithcah",
      "hashmonah",
      "moseroth",
      "bene_jaakan",
      "hor_haggidgad",
      "jotbathah",
      "abronah",
      "ezion_geber",
      "kadesh_barnea",
    ],
  },
  {
    id: "to_promised",
    ru: "К Земле Обетованной",
    en: "To the Promised Land",
    yearsBC: "1407–1406 до Р.Х.",
    acts: "Чис 20 — Втор 34 · Чис 33:37–49",
    color: PHASE_COLORS.to_promised,
    description:
      "Смерть Аарона на Горе Ор. Медный змей в Пуноне. Победа над Сигоном и Огом. С Горы Нево Моисей видит Землю и умирает. Иисус Навин ведёт народ через Иордан.",
    stations: [
      "mt_hor",
      "zalmonah",
      "punon",
      "oboth",
      "iye_abarim",
      "dibon_gad",
      "almon_diblathaim",
      "mt_nebo",
      "plains_of_moab",
    ],
  },
];

export const EXODUS_FULL_ROUTE: string[] = EXODUS_PHASES.flatMap((p) => p.stations);
