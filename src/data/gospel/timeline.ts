export type GospelTimelineEvent = {
  yearAD: number;          // approximate; negative = до н.э.
  approxLabel: string;     // отображаемая метка
  ru: string;
  en: string;
  ref: string;
  location: string;
  phaseIdx: number;
};

export const GOSPEL_TIMELINE: GospelTimelineEvent[] = [
  // ── Phase 0: Рождество и младенчество ─────────────────────────────────
  { yearAD: -5, approxLabel: "≈ 6–5 до н.э.", ru: "Благовещение Захарии о рождении Иоанна Крестителя", en: "Annunciation to Zechariah", ref: "Лк 1:5–25", location: "jerusalem", phaseIdx: 0 },
  { yearAD: -5, approxLabel: "≈ 6–5 до н.э.", ru: "Благовещение Деве Марии в Назарете", en: "Annunciation to Mary", ref: "Лк 1:26–38", location: "nazareth", phaseIdx: 0 },
  { yearAD: -5, approxLabel: "≈ 6–5 до н.э.", ru: "Мария посещает Елисавету; Магнификат", en: "Visit to Elizabeth; Magnificat", ref: "Лк 1:39–56", location: "ein_karem", phaseIdx: 0 },
  { yearAD: -5, approxLabel: "≈ 5 до н.э.", ru: "Рождение Иоанна Крестителя", en: "Birth of John the Baptist", ref: "Лк 1:57–80", location: "ein_karem", phaseIdx: 0 },
  { yearAD: -5, approxLabel: "≈ 5–4 до н.э.", ru: "Рождество Иисуса Христа в Вифлееме", en: "Birth of Jesus Christ", ref: "Лк 2:1–7", location: "bethlehem", phaseIdx: 0 },
  { yearAD: -5, approxLabel: "≈ 5–4 до н.э.", ru: "Поклонение пастухов", en: "Adoration of the Shepherds", ref: "Лк 2:8–20", location: "bethlehem", phaseIdx: 0 },
  { yearAD: -4, approxLabel: "8-й день", ru: "Обрезание; имя Иисус", en: "Circumcision and naming", ref: "Лк 2:21", location: "bethlehem", phaseIdx: 0 },
  { yearAD: -4, approxLabel: "40-й день", ru: "Принесение Младенца в Храм; пророчества Симеона и Анны", en: "Presentation in the Temple", ref: "Лк 2:22–38", location: "jerusalem", phaseIdx: 0 },
  { yearAD: -4, approxLabel: "≈ 4 до н.э.", ru: "Поклонение волхвов с Востока", en: "Visit of the Magi", ref: "Мф 2:1–12", location: "bethlehem", phaseIdx: 0 },
  { yearAD: -4, approxLabel: "≈ 4 до н.э.", ru: "Бегство в Египет; избиение младенцев Иродом", en: "Flight into Egypt", ref: "Мф 2:13–18", location: "egypt", phaseIdx: 0 },
  { yearAD: -3, approxLabel: "≈ 4–3 до н.э.", ru: "Возвращение в Назарет", en: "Return to Nazareth", ref: "Мф 2:19–23", location: "nazareth", phaseIdx: 0 },
  { yearAD: 8, approxLabel: "12 лет", ru: "Иисус в Храме среди учителей", en: "Boy Jesus in the Temple", ref: "Лк 2:41–52", location: "jerusalem", phaseIdx: 0 },

  // ── Phase 1: Подготовка ───────────────────────────────────────────────
  { yearAD: 27, approxLabel: "≈ 27", ru: "Проповедь Иоанна Крестителя в пустыне", en: "John's preaching", ref: "Мф 3:1–12", location: "judean_wilderness", phaseIdx: 1 },
  { yearAD: 27, approxLabel: "≈ 27", ru: "Крещение Иисуса Христа в Иордане", en: "Baptism of Jesus", ref: "Мф 3:13–17", location: "bethabara", phaseIdx: 1 },
  { yearAD: 27, approxLabel: "≈ 27", ru: "Сорокадневное искушение в пустыне", en: "Temptation in the wilderness", ref: "Мф 4:1–11", location: "judean_wilderness", phaseIdx: 1 },
  { yearAD: 27, approxLabel: "≈ 27", ru: "Иоанн указывает на Агнца Божия; первые ученики", en: "First disciples", ref: "Ин 1:29–51", location: "bethabara", phaseIdx: 1 },

  // ── Phase 2: Раннее служение ──────────────────────────────────────────
  { yearAD: 27, approxLabel: "≈ 27", ru: "Первое чудо: вода в вино в Кане", en: "Wedding at Cana", ref: "Ин 2:1–11", location: "cana", phaseIdx: 2 },
  { yearAD: 27, approxLabel: "Пасха ≈ 27", ru: "Первое очищение Храма", en: "First cleansing of the Temple", ref: "Ин 2:13–22", location: "jerusalem", phaseIdx: 2 },
  { yearAD: 27, approxLabel: "≈ 27", ru: "Беседа с Никодимом ночью", en: "Discourse with Nicodemus", ref: "Ин 3:1–21", location: "jerusalem", phaseIdx: 2 },
  { yearAD: 28, approxLabel: "≈ 28", ru: "Беседа с самарянкой у колодца Иакова", en: "Samaritan woman at the well", ref: "Ин 4:1–42", location: "sychar", phaseIdx: 2 },
  { yearAD: 28, approxLabel: "≈ 28", ru: "Исцеление сына царедворца — второе знамение", en: "Healing the official's son", ref: "Ин 4:46–54", location: "cana", phaseIdx: 2 },

  // ── Phase 3: Галилейское служение ─────────────────────────────────────
  { yearAD: 28, approxLabel: "≈ 28", ru: "Иисус оставляет Назарет и поселяется в Капернауме", en: "Move to Capernaum", ref: "Мф 4:12–17", location: "capernaum", phaseIdx: 3 },
  { yearAD: 28, approxLabel: "≈ 28", ru: "Призвание Петра, Андрея, Иакова и Иоанна", en: "Call of the four fishermen", ref: "Мф 4:18–22", location: "sea_of_galilee", phaseIdx: 3 },
  { yearAD: 28, approxLabel: "≈ 28", ru: "Чудесный лов рыбы", en: "Miraculous catch of fish", ref: "Лк 5:1–11", location: "sea_of_galilee", phaseIdx: 3 },
  { yearAD: 28, approxLabel: "≈ 28", ru: "Призвание Матфея-мытаря", en: "Call of Matthew", ref: "Мф 9:9", location: "capernaum", phaseIdx: 3 },
  { yearAD: 28, approxLabel: "≈ 28", ru: "Избрание Двенадцати на горе", en: "Choosing of the Twelve", ref: "Лк 6:12–16", location: "mount_beatitudes", phaseIdx: 3 },
  { yearAD: 28, approxLabel: "≈ 28", ru: "Нагорная проповедь", en: "Sermon on the Mount", ref: "Мф 5–7", location: "mount_beatitudes", phaseIdx: 3 },
  { yearAD: 28, approxLabel: "≈ 28", ru: "Исцеление слуги сотника", en: "Centurion's servant", ref: "Мф 8:5–13", location: "capernaum", phaseIdx: 3 },
  { yearAD: 28, approxLabel: "≈ 28", ru: "Воскрешение сына вдовы", en: "Widow's son raised", ref: "Лк 7:11–17", location: "nain", phaseIdx: 3 },
  { yearAD: 28, approxLabel: "≈ 28", ru: "Притчи о Царстве Божием", en: "Parables of the Kingdom", ref: "Мф 13", location: "sea_of_galilee", phaseIdx: 3 },
  { yearAD: 28, approxLabel: "≈ 28", ru: "Укрощение бури на Галилейском море", en: "Calming the storm", ref: "Мк 4:35–41", location: "sea_of_galilee", phaseIdx: 3 },
  { yearAD: 28, approxLabel: "≈ 28", ru: "Исцеление Гадаринского бесноватого", en: "Gerasene demoniac", ref: "Мк 5:1–20", location: "gergesa", phaseIdx: 3 },
  { yearAD: 28, approxLabel: "≈ 28", ru: "Воскрешение дочери Иаира; кровоточивая исцелена", en: "Jairus's daughter raised", ref: "Мк 5:21–43", location: "capernaum", phaseIdx: 3 },
  { yearAD: 29, approxLabel: "≈ 29", ru: "Усекновение главы Иоанна Крестителя", en: "Beheading of John the Baptist", ref: "Мк 6:14–29", location: "perea", phaseIdx: 3 },
  { yearAD: 29, approxLabel: "≈ 29", ru: "Насыщение пяти тысяч", en: "Feeding of the 5 000", ref: "Мф 14:13–21", location: "bethsaida", phaseIdx: 3 },
  { yearAD: 29, approxLabel: "≈ 29", ru: "Хождение по водам", en: "Walking on water", ref: "Мф 14:22–33", location: "sea_of_galilee", phaseIdx: 3 },
  { yearAD: 29, approxLabel: "≈ 29", ru: "Беседа о хлебе жизни в синагоге Капернаума", en: "Bread of Life discourse", ref: "Ин 6:24–71", location: "capernaum", phaseIdx: 3 },

  // ── Phase 4: Обучение Двенадцати ─────────────────────────────────────
  { yearAD: 29, approxLabel: "≈ 29", ru: "Дочь сирофиникиянки исцелена", en: "Syrophoenician woman", ref: "Мф 15:21–28", location: "tyre", phaseIdx: 4 },
  { yearAD: 29, approxLabel: "≈ 29", ru: "Исцеление глухого косноязычного", en: "Healing the deaf-mute", ref: "Мк 7:31–37", location: "decapolis", phaseIdx: 4 },
  { yearAD: 29, approxLabel: "≈ 29", ru: "Насыщение четырёх тысяч", en: "Feeding of the 4 000", ref: "Мк 8:1–10", location: "decapolis", phaseIdx: 4 },
  { yearAD: 29, approxLabel: "≈ 29", ru: "Исповедание Петра: «Ты — Христос»", en: "Peter's confession", ref: "Мф 16:13–20", location: "caesarea_philippi", phaseIdx: 4 },
  { yearAD: 29, approxLabel: "≈ 29", ru: "Преображение Господне", en: "Transfiguration", ref: "Мф 17:1–8", location: "mt_hermon", phaseIdx: 4 },

  // ── Phase 5: Путь в Иерусалим ─────────────────────────────────────────
  { yearAD: 29, approxLabel: "Кущи ≈ 29", ru: "Учение в Храме на празднике Кущей", en: "Teaching at the Feast of Tabernacles", ref: "Ин 7", location: "jerusalem", phaseIdx: 5 },
  { yearAD: 29, approxLabel: "≈ 29", ru: "Жена, взятая в прелюбодеянии", en: "Woman caught in adultery", ref: "Ин 8:1–11", location: "jerusalem", phaseIdx: 5 },
  { yearAD: 29, approxLabel: "≈ 29", ru: "Исцеление слепорождённого", en: "Man born blind", ref: "Ин 9", location: "jerusalem", phaseIdx: 5 },
  { yearAD: 29, approxLabel: "Обновление ≈ 29", ru: "«Я и Отец — одно»", en: "I and the Father are one", ref: "Ин 10:22–39", location: "jerusalem", phaseIdx: 5 },
  { yearAD: 30, approxLabel: "≈ 30", ru: "Воскрешение Лазаря", en: "Raising of Lazarus", ref: "Ин 11:1–44", location: "bethany", phaseIdx: 5 },
  { yearAD: 30, approxLabel: "≈ 30", ru: "Притча о блудном сыне", en: "Parable of the Prodigal Son", ref: "Лк 15:11–32", location: "perea", phaseIdx: 5 },
  { yearAD: 30, approxLabel: "≈ 30", ru: "Исцеление слепого Вартимея", en: "Blind Bartimaeus", ref: "Мк 10:46–52", location: "jericho", phaseIdx: 5 },
  { yearAD: 30, approxLabel: "≈ 30", ru: "Закхей-мытарь принимает Иисуса", en: "Zacchaeus the tax collector", ref: "Лк 19:1–10", location: "jericho", phaseIdx: 5 },

  // ── Phase 6: Страстная неделя ────────────────────────────────────────
  { yearAD: 30, approxLabel: "Воскр. 9 Нисана", ru: "Помазание в Вифании", en: "Anointing at Bethany", ref: "Ин 12:1–8", location: "bethany", phaseIdx: 6 },
  { yearAD: 30, approxLabel: "Воскр. 10 Нисана", ru: "Торжественный вход в Иерусалим", en: "Triumphal Entry", ref: "Мф 21:1–11", location: "jerusalem", phaseIdx: 6 },
  { yearAD: 30, approxLabel: "Понед. 11 Нисана", ru: "Очищение Храма; проклятие смоковницы", en: "Cleansing the Temple", ref: "Мк 11:12–19", location: "jerusalem", phaseIdx: 6 },
  { yearAD: 30, approxLabel: "Втор. 12 Нисана", ru: "Эсхатологическая беседа на Елеоне", en: "Olivet Discourse", ref: "Мф 24–25", location: "mt_olives", phaseIdx: 6 },
  { yearAD: 30, approxLabel: "Четв. 13 Нисана", ru: "Тайная Вечеря в горнице", en: "The Last Supper", ref: "Лк 22:14–38", location: "jerusalem", phaseIdx: 6 },
  { yearAD: 30, approxLabel: "Четв.-Пятн.", ru: "Гефсиманская молитва; взятие под стражу", en: "Gethsemane and arrest", ref: "Мф 26:36–56", location: "mt_olives", phaseIdx: 6 },
  { yearAD: 30, approxLabel: "Пятн. 14 Нисана", ru: "Распятие на Голгофе", en: "Crucifixion at Golgotha", ref: "Лк 23:33–46", location: "jerusalem", phaseIdx: 6 },
  { yearAD: 30, approxLabel: "Пятн. 14 Нисана", ru: "Погребение в новой гробнице", en: "Burial in the new tomb", ref: "Ин 19:38–42", location: "jerusalem", phaseIdx: 6 },

  // ── Phase 7: Воскресение и Вознесение ────────────────────────────────
  { yearAD: 30, approxLabel: "Воскр. 16 Нисана", ru: "Воскресение Иисуса Христа", en: "Resurrection of Christ", ref: "Мф 28:1–10", location: "jerusalem", phaseIdx: 7 },
  { yearAD: 30, approxLabel: "Воскр. 16 Нисана", ru: "Явление двум на пути в Эммаус", en: "On the road to Emmaus", ref: "Лк 24:13–35", location: "emmaus", phaseIdx: 7 },
  { yearAD: 30, approxLabel: "Воскр. 16 Нисана", ru: "Явление десяти ученикам в горнице", en: "Appearance to the Ten", ref: "Лк 24:36–49", location: "jerusalem", phaseIdx: 7 },
  { yearAD: 30, approxLabel: "+8 дней", ru: "Явление Фоме: «Господь мой и Бог мой»", en: "Appearance to Thomas", ref: "Ин 20:24–29", location: "jerusalem", phaseIdx: 7 },
  { yearAD: 30, approxLabel: "≈ 30 дней", ru: "Явление семи у моря Тивериадского; чудесный лов", en: "Appearance by the Sea", ref: "Ин 21:1–14", location: "tabgha", phaseIdx: 7 },
  { yearAD: 30, approxLabel: "Галилея", ru: "Великое поручение на горе в Галилее", en: "Great Commission", ref: "Мф 28:16–20", location: "sea_of_galilee", phaseIdx: 7 },
  { yearAD: 30, approxLabel: "40-й день", ru: "Вознесение Господне", en: "Ascension", ref: "Лк 24:50–53", location: "mt_olives", phaseIdx: 7 },
];
