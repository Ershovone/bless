import type { Companion, CompanionId } from "@/types/atlas";

export const COMPANIONS: Record<CompanionId, Companion> = {
  barnabas: {
    ru: "Варнава",
    en: "Barnabas",
    glyph: "B",
    color: "#b8863d",
    meta: "Кипрянин, левит • Деян 4:36",
    note: "Ввёл Савла к апостолам (Деян 9:27); вместе основали миссию в Антиохии. После размолвки из-за Марка взял его и отплыл на Кипр (Деян 15:39).",
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
    meta: "Автор Евангелия от Марка; племянник Варнавы • Кол 4:10",
    note: "Служитель в 1-м путешествии; оставил Павла в Перге (Деян 13:13). Позже примирились — Павел просит привести его: «он мне нужен для служения» (2 Тим 4:11).",
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
    meta: "Пророк из Иерусалима, римский гражданин • Деян 15:32; 16:37",
    note: "В посланиях именуется Силуаном (1 Фес 1:1; 1 Пет 5:12). Избран вместо Варнавы. В филиппийской темнице пел псалмы вместе с Павлом — землетрясение освободило узы (Деян 16:25–26).",
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
    note: "Присоединился в Листре. Молодой (1 Тим 4:12), научен в вере матерью Евникой и бабкой Лоидой (2 Тим 1:5). Спутник 2-го и 3-го путешествий; адресат двух пастырских посланий.",
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
    meta: "Врач возлюбленный, евангелист • Кол 4:14",
    note: "Автор Евангелия от Луки и Деяний апостолов. С его присоединением в Троаде повествование переходит на «мы» (Деян 16:10). Единственный, кто оставался с Павлом к концу (2 Тим 4:11).",
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
    meta: "Супруги-миссионеры, делатели палаток • Деян 18:2–3",
    note: "Иудеи, изгнанные из Рима указом Клавдия. Приняли Павла в Коринфе; позже в Ефесе точнее объяснили путь Господень Аполлосу (Деян 18:26). Принимали церковь в своём доме (Рим 16:3–5).",
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
