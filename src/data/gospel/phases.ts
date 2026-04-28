import type { GospelPhase } from "@/types/gospel";

const PHASE_COLORS = {
  nativity: "#c9843d",       // amber — звезда над Вифлеемом
  preparation: "#5a7a9a",    // slate — воды Иордана
  early_judea: "#7d8443",    // olive — раннее служение
  galilee: "#3a6a8a",        // blue-slate — море Галилейское
  training: "#a85e16",       // bronze — обучение Двенадцати
  to_jerusalem: "#8b4a2b",   // rust — путь к страданиям
  passion: "#7a2d1f",        // dark blood-red — Голгофа
  resurrection: "#d4a574",   // sand-gold — рассвет Воскресения
} as const;

export const GOSPEL_PHASES: GospelPhase[] = [
  {
    id: "nativity",
    ru: "Рождество и младенчество",
    en: "Nativity & Childhood",
    yearsAD: "≈ 5 до н.э. — 8 н.э.",
    acts: "Мф 1–2 · Лк 1–2",
    color: PHASE_COLORS.nativity,
    description:
      "Благовещение в Назарете. Перепись приводит Иосифа и Марию в Вифлеем — там рождается Иисус. Поклонение пастухов и волхвов. Бегство в Египет от Ирода. Возвращение в Назарет, где Отрок возрастает «в премудрости и возрасте, и в любви у Бога и человеков».",
    locations: [
      "nazareth",
      "ein_karem",
      "bethlehem",
      "jerusalem",
      "egypt",
    ],
    keyVerse: {
      ref: "Лк 2:11",
      text: "Ибо ныне родился вам в городе Давидовом Спаситель, Который есть Христос Господь.",
    },
  },
  {
    id: "preparation",
    ru: "Подготовка к служению",
    en: "Preparation",
    yearsAD: "≈ 27 н.э.",
    acts: "Мф 3–4 · Мк 1 · Лк 3–4 · Ин 1",
    color: PHASE_COLORS.preparation,
    description:
      "Иоанн Креститель проповедует в пустыне и крестит в Иордане. Иисус приходит к нему — Дух нисходит как голубь, голос с небес: «Сей есть Сын Мой возлюбленный». Затем — сорок дней поста и искушения в пустыне. Возвращение к Иоанну: «Вот Агнец Божий».",
    locations: [
      "bethabara",
      "jordan_river",
      "judean_wilderness",
      "mt_temptation",
    ],
    keyVerse: {
      ref: "Ин 1:29",
      text: "Вот Агнец Божий, Который берёт на Себя грех мира.",
    },
  },
  {
    id: "early_judea",
    ru: "Раннее служение",
    en: "Early Ministry",
    yearsAD: "27–28 н.э.",
    acts: "Ин 2–4",
    color: PHASE_COLORS.early_judea,
    description:
      "Первое чудо в Кане Галилейской — вода превращена в вино. Первое очищение Храма в Иерусалиме. Ночная беседа с Никодимом — рождение свыше. Через Самарию — встреча с самарянкой у колодца Иакова. Возвращение в Галилею.",
    locations: [
      "cana",
      "jerusalem",
      "sychar",
      "mt_gerizim",
      "capernaum",
    ],
    keyVerse: {
      ref: "Ин 3:16",
      text: "Ибо так возлюбил Бог мир, что отдал Сына Своего Единородного, дабы всякий верующий в Него не погиб, но имел жизнь вечную.",
    },
  },
  {
    id: "galilee",
    ru: "Галилейское служение",
    en: "Galilean Ministry",
    yearsAD: "28–29 н.э.",
    acts: "Мф 4–15 · Мк 1–7 · Лк 4–9 · Ин 6",
    color: PHASE_COLORS.galilee,
    description:
      "Иисус поселяется в Капернауме. Призваны Двенадцать. Нагорная проповедь. Множество исцелений и изгнаний бесов. Притчи о Царстве. Хождение по водам, насыщение пяти тысяч, укрощение бури. Иудеи и язычники приходят со всех сторон.",
    locations: [
      "capernaum",
      "bethsaida",
      "chorazin",
      "magdala",
      "tabgha",
      "mount_beatitudes",
      "sea_of_galilee",
      "nain",
      "cana",
      "nazareth",
      "gergesa",
    ],
    keyVerse: {
      ref: "Мк 1:15",
      text: "Исполнилось время и приблизилось Царствие Божие: покайтесь и веруйте в Евангелие.",
    },
  },
  {
    id: "training",
    ru: "Обучение Двенадцати",
    en: "Training the Twelve",
    yearsAD: "29 н.э.",
    acts: "Мф 16–18 · Мк 7–9 · Лк 9",
    color: PHASE_COLORS.training,
    description:
      "Иисус удаляется с учениками в окрестности Тира и Сидона, потом в Десятиградие, потом в Кесарию Филиппову. Там — исповедание Петра: «Ты — Христос, Сын Бога Живого». Преображение на горе. Иисус впервые открыто говорит о Своих страданиях, смерти и воскресении.",
    locations: [
      "tyre",
      "sidon",
      "decapolis",
      "caesarea_philippi",
      "mt_hermon",
      "mt_tabor",
      "capernaum",
    ],
    keyVerse: {
      ref: "Мф 16:24",
      text: "Если кто хочет идти за Мною, отвергнись себя, и возьми крест свой, и следуй за Мною.",
    },
  },
  {
    id: "to_jerusalem",
    ru: "Путь в Иерусалим",
    en: "Journey to Jerusalem",
    yearsAD: "29–30 н.э.",
    acts: "Мф 19–20 · Мк 10 · Лк 9:51 — 19:27 · Ин 11",
    color: PHASE_COLORS.to_jerusalem,
    description:
      "«Когда же приближались дни взятия Его от мира, Он восхотел идти в Иерусалим». Учение в Перее. Притчи о блудном сыне, добром самарянине, богаче и Лазаре. Воскрешение Лазаря в Вифании. Исцеление Вартимея у Иерихона. Закхей-мытарь.",
    locations: [
      "perea",
      "jericho",
      "bethany",
      "jerusalem",
    ],
    keyVerse: {
      ref: "Лк 19:10",
      text: "Ибо Сын Человеческий пришёл взыскать и спасти погибшее.",
    },
  },
  {
    id: "passion",
    ru: "Страстная неделя",
    en: "Passion Week",
    yearsAD: "Нисан 30 н.э.",
    acts: "Мф 21–27 · Мк 11–15 · Лк 19–23 · Ин 12–19",
    color: PHASE_COLORS.passion,
    description:
      "Семь дней от входа в Иерусалим до Великой Субботы. Очищение Храма. Тайная Вечеря в горнице. Гефсимания и взятие под стражу. Суды у Анны, Каиафы, Пилата и Ирода. Распятие на Голгофе. Погребение в новой гробнице. Подробности — на отдельной странице.",
    locations: [
      "bethany",
      "bethphage",
      "mt_olives",
      "jerusalem",
    ],
    keyVerse: {
      ref: "Ин 19:30",
      text: "Совершилось! И, преклонив главу, предал дух.",
    },
  },
  {
    id: "resurrection",
    ru: "Воскресение и Вознесение",
    en: "Resurrection & Ascension",
    yearsAD: "30 н.э. — 40 дней",
    acts: "Мф 28 · Мк 16 · Лк 24 · Ин 20–21 · Деян 1",
    color: PHASE_COLORS.resurrection,
    description:
      "В первый день недели гробница пуста. Воскресший Иисус является Марии Магдалине, женщинам, ученикам в горнице, двум на пути в Эммаус, семи у моря Тивериадского, более 500 братьям одновременно. Сорок дней Он являлся им, говоря о Царствии Божием. На Елеонской горе — Великое поручение и Вознесение.",
    locations: [
      "jerusalem",
      "emmaus",
      "bethany",
      "mt_olives",
      "sea_of_galilee",
      "tabgha",
      "capernaum",
    ],
    keyVerse: {
      ref: "Мф 28:18–20",
      text: "Дана Мне всякая власть на небе и на земле. Итак идите, научите все народы… И се, Я с вами во все дни до скончания века.",
    },
  },
];

export const GOSPEL_PHASES_BY_ID: Record<string, GospelPhase> = GOSPEL_PHASES.reduce<
  Record<string, GospelPhase>
>((acc, p) => {
  acc[p.id] = p;
  return acc;
}, {});
