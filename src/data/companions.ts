import type { Companion, CompanionId } from "@/types/atlas";

export const COMPANIONS: Record<CompanionId, Companion> = {
  barnabas: {
    ru: "Варнава",
    en: "Barnabas",
    glyph: "B",
    color: "#b8863d",
    meta: "Кипрянин, левит • Деян 4:36",
    note: "Ввёл Савла к апостолам; вместе основали миссию в Антиохии; разошлись из-за Марка.",
    participation: [
      {
        journeyIdx: 0,
        cities: ["antioch_syr", "seleucia", "salamis", "paphos", "perga", "antioch_pis", "iconium", "lystra", "derbe", "attalia"],
        joinedAt: "antioch_syr",
        leftAt: "antioch_syr",
      },
    ],
  },
  john_mark: {
    ru: "Иоанн Марк",
    en: "John Mark",
    glyph: "M",
    color: "#9a6b3a",
    meta: "Автор Евангелия от Марка",
    note: "Служитель в первом путешествии; оставил Павла в Перге (Деян 13:13). Позже — сотрудник (Кол 4:10).",
    participation: [
      {
        journeyIdx: 0,
        cities: ["antioch_syr", "seleucia", "salamis", "paphos", "perga"],
        joinedAt: "antioch_syr",
        leftAt: "perga",
      },
    ],
  },
  silas: {
    ru: "Сила",
    en: "Silas",
    glyph: "S",
    color: "#8a5a7a",
    meta: "Пророк из Иерусалима • Деян 15:32",
    note: "Избран вместо Варнавы после размолвки. В темнице Филипп пел псалмы вместе с Павлом.",
    participation: [
      {
        journeyIdx: 1,
        cities: ["antioch_syr", "tarsus", "derbe", "lystra", "iconium", "antioch_pis", "troas", "neapolis", "philippi", "thessalonica", "berea", "athens", "corinth", "cenchreae", "ephesus", "caesarea", "jerusalem", "antioch_syr"],
        joinedAt: "antioch_syr",
        leftAt: "corinth",
      },
    ],
  },
  timothy: {
    ru: "Тимофей",
    en: "Timothy",
    glyph: "T",
    color: "#6b7a8a",
    meta: "Сын гречанина и иудейки • Деян 16:1",
    note: "Присоединился в Листре. Спутник на всех остальных путешествиях. Адресат пастырских посланий.",
    participation: [
      {
        journeyIdx: 1,
        cities: ["lystra", "iconium", "antioch_pis", "troas", "neapolis", "philippi", "thessalonica", "berea", "athens", "corinth", "cenchreae", "ephesus", "caesarea", "jerusalem", "antioch_syr"],
        joinedAt: "lystra",
        leftAt: "antioch_syr",
      },
      {
        journeyIdx: 2,
        cities: ["antioch_syr", "tarsus", "derbe", "lystra", "iconium", "antioch_pis", "ephesus", "troas", "philippi", "thessalonica", "berea", "corinth", "berea", "thessalonica", "philippi", "troas", "miletus", "tyre", "ptolemais", "caesarea", "jerusalem"],
        joinedAt: "antioch_syr",
        leftAt: "jerusalem",
      },
    ],
  },
  luke: {
    ru: "Лука",
    en: "Luke",
    glyph: "L",
    color: "#5a7a5a",
    meta: "Врач возлюбленный • Кол 4:14",
    note: "Автор Деяний — с этого момента текст переходит на «мы». Врач Павла; остался с ним до конца.",
    participation: [
      {
        journeyIdx: 1,
        cities: ["troas", "neapolis", "philippi"],
        joinedAt: "troas",
        leftAt: "philippi",
      },
      {
        journeyIdx: 2,
        cities: ["philippi", "troas", "miletus", "tyre", "ptolemais", "caesarea", "jerusalem"],
        joinedAt: "philippi",
        leftAt: "jerusalem",
      },
      {
        journeyIdx: 3,
        cities: ["caesarea", "sidon", "myra", "fair_havens", "malta", "syracuse", "rhegium", "puteoli", "rome"],
        joinedAt: "caesarea",
        leftAt: "rome",
      },
    ],
  },
  priscilla_aquila: {
    ru: "Акила и Прискилла",
    en: "Aquila & Priscilla",
    glyph: "A",
    color: "#a87a5a",
    meta: "Супруги-миссионеры • Деян 18:2",
    note: "Приняли Павла в Коринфе (делатели палаток); позже наставили Аполлоса в Ефесе.",
    participation: [
      {
        journeyIdx: 1,
        cities: ["corinth", "cenchreae", "ephesus"],
        joinedAt: "corinth",
        leftAt: "ephesus",
      },
    ],
  },
};
