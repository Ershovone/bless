import type { ExodusPhase } from "@/types/exodus";
import { COLORS } from "@/constants/design";

export const EXODUS_PHASES: ExodusPhase[] = [
  {
    id: "escape",
    ru: "Бегство из Египта",
    en: "Escape from Egypt",
    yearsBC: "~1446 до Р.Х.",
    acts: "Исх 12–15",
    color: COLORS.rust,
    description:
      "Десять казней. Пасха. Ночной выход из Раамсеса. Чудесный переход через Чермное море и гибель войска фараона.",
    stations: ["rameses", "succoth", "etham", "pi_hahiroth"],
  },
  {
    id: "to_sinai",
    ru: "Путь к Синаю",
    en: "Journey to Sinai",
    yearsBC: "1446 до Р.Х. · 3 месяца",
    acts: "Исх 15–18",
    color: COLORS.amber,
    description:
      "Горькая вода Мерры, оазис Елима, манна и перепела в пустыне Син, вода из скалы и битва с Амалекитянами в Рефидиме.",
    stations: ["marah", "elim", "sin_wilderness", "dophkah", "rephidim"],
  },
  {
    id: "law",
    ru: "У горы Закона",
    en: "At the Mountain",
    yearsBC: "1446–1445 до Р.Х. · ~11 месяцев",
    acts: "Исх 19 — Чис 10",
    color: COLORS.sand,
    description:
      "Богоявление на Синае. Десять Заповедей и Закон. Скиния и священство. Золотой телец. Скрижали обновлены.",
    stations: ["sinai"],
  },
  {
    id: "wandering",
    ru: "38 лет странствия",
    en: "38 Years of Wandering",
    yearsBC: "1445–1407 до Р.Х.",
    acts: "Чис 11–20",
    color: COLORS.sepia,
    description:
      "Соглядатаи приносят дурную весть. Поколение, вышедшее из Египта, осуждено умереть в пустыне. Кадес-Варни — главная база.",
    stations: ["kibroth_hattaavah", "hazeroth", "ezion_geber", "kadesh_barnea"],
  },
  {
    id: "to_promised",
    ru: "К Земле Обетованной",
    en: "To the Promised Land",
    yearsBC: "1407–1406 до Р.Х.",
    acts: "Чис 20 — Втор 34",
    color: COLORS.modernBlue,
    description:
      "Смерть Аарона на Горе Ор. Медный змей. Победа над Сигоном и Огом. С Горы Нево Моисей видит Землю и умирает. Иисус Навин ведёт народ через Иордан.",
    stations: [
      "mt_hor",
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
