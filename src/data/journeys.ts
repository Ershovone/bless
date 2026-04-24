import type { Journey } from "@/types/atlas";
import { JOURNEY_COLORS } from "@/constants/design";

export const JOURNEYS: Journey[] = [
  {
    id: 1,
    slug: "first",
    ru: "Первое путешествие",
    en: "First Journey",
    years: "46–48 н.э.",
    acts: "Деян 13–14",
    color: JOURNEY_COLORS[0],
    route: [
      "antioch_syr", "seleucia", "salamis", "paphos", "perga",
      "antioch_pis", "iconium", "lystra", "derbe", "lystra",
      "iconium", "antioch_pis", "perga", "attalia", "antioch_syr",
    ],
    summary: "С Варнавой и Иоанном-Марком. Кипр и внутренняя Малая Азия.",
  },
  {
    id: 2,
    slug: "second",
    ru: "Второе путешествие",
    en: "Second Journey",
    years: "49–52 н.э.",
    acts: "Деян 15:36 – 18:22",
    color: JOURNEY_COLORS[1],
    route: [
      "antioch_syr", "tarsus", "derbe", "lystra", "iconium",
      "antioch_pis", "troas", "neapolis", "philippi", "thessalonica",
      "berea", "athens", "corinth", "cenchreae", "ephesus",
      "caesarea", "jerusalem", "antioch_syr",
    ],
    summary: "С Силой. Пересечение в Европу — Македония и Греция.",
  },
  {
    id: 3,
    slug: "third",
    ru: "Третье путешествие",
    en: "Third Journey",
    years: "53–57 н.э.",
    acts: "Деян 18:23 – 21:17",
    color: JOURNEY_COLORS[2],
    route: [
      "antioch_syr", "tarsus", "derbe", "lystra", "iconium",
      "antioch_pis", "ephesus", "troas", "philippi", "thessalonica",
      "berea", "corinth", "berea", "thessalonica", "philippi",
      "troas", "miletus", "tyre", "ptolemais", "caesarea", "jerusalem",
    ],
    summary: "Три года в Ефесе. Сбор пожертвований для Иерусалима.",
  },
  {
    id: 4,
    slug: "fourth",
    ru: "Путешествие в Рим",
    en: "Journey to Rome",
    years: "59–62 н.э.",
    acts: "Деян 27–28",
    color: JOURNEY_COLORS[3],
    route: [
      "caesarea", "sidon", "myra", "fair_havens", "malta",
      "syracuse", "rhegium", "puteoli", "rome",
    ],
    summary: "Под стражей. Кораблекрушение у Мальты. Дом. арест в Риме.",
  },
];

export const JOURNEY_BY_SLUG = JOURNEYS.reduce<Record<string, Journey>>((acc, j) => {
  acc[j.slug] = j;
  return acc;
}, {});
