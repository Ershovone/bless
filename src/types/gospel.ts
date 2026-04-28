export type GospelLocationId = string;

export type GospelLocationConfidence = "known" | "approximate" | "traditional";

export type GospelLocationKind = "city" | "village" | "mountain" | "river" | "sea" | "wilderness" | "site";

export type GospelLocationEvent = {
  ref: string;
  ru: string;
};

export type LabelDir = "N" | "S" | "E" | "W" | "NE" | "NW" | "SE" | "SW";

export type GospelLocation = {
  ru: string;
  en: string;
  lat: number;
  lon: number;
  kind: GospelLocationKind;
  confidence?: GospelLocationConfidence;
  modern?: string;
  significance?: string;
  events?: GospelLocationEvent[];
  /** Куда выносить лейбл относительно точки. По умолчанию — N (сверху). */
  labelDir?: LabelDir;
  /** Короткий вариант подписи на карте, если полное `ru` слишком длинное. */
  shortLabel?: string;
  /** Если true — лейбл не показывается на активной фазе по умолчанию,
   * только при наведении. Снижает шум в плотных кластерах. */
  secondary?: boolean;
};

export type GospelPhaseId =
  | "nativity"
  | "preparation"
  | "early_judea"
  | "galilee"
  | "training"
  | "to_jerusalem"
  | "passion"
  | "resurrection";

export type GospelPhase = {
  id: GospelPhaseId;
  ru: string;
  en: string;
  yearsAD: string;
  description: string;
  acts: string;
  color: string;
  locations: GospelLocationId[];
  keyVerse?: { ref: string; text: string };
};

export type GospelRegionId = string;

export type GospelRegion = {
  id: GospelRegionId;
  ru: string;
  en: string;
  ru_label: string;
  ruler: string;
  description: string;
  refs: string[];
  territory: Array<[number, number]>;
  centroid: [number, number];
  color: string;
};

export type MiracleCategory = "healing" | "nature" | "raising" | "exorcism" | "feeding";

export type Miracle = {
  id: string;
  ru: string;
  en: string;
  category: MiracleCategory;
  location: GospelLocationId | null;
  refs: { mt?: string; mk?: string; lk?: string; jn?: string };
  phaseIdx: number;
  description: string;
};

export type ParableTheme =
  | "kingdom"
  | "mercy"
  | "prayer"
  | "judgment"
  | "discipleship"
  | "watchfulness"
  | "lostness";

export type Parable = {
  id: string;
  ru: string;
  en: string;
  theme: ParableTheme;
  location: GospelLocationId | null;
  refs: { mt?: string; mk?: string; lk?: string };
  phaseIdx: number;
  summary: string;
};

export type Discourse = {
  id: string;
  ru: string;
  en: string;
  ref: string;
  location: GospelLocationId | null;
  phaseIdx: number;
  summary: string;
};

export type IAmSaying = {
  id: string;
  ru: string;
  en: string;
  ref: string;
  meaning: string;
};

export type Beatitude = {
  ru: string;
  en: string;
  promise: string;
};

export type DiscipleId = string;

export type Disciple = {
  id: DiscipleId;
  ru: string;
  en: string;
  alias?: string;
  origin: string;
  callRef: string;
  role: string;
  later: string;
};

export type HolyWeekDay = {
  id: string;
  weekday: string;
  date: string;
  title: string;
  events: Array<{
    location: GospelLocationId | JerusalemPlaceId;
    isJerusalem?: boolean;
    title: string;
    refs: { mt?: string; mk?: string; lk?: string; jn?: string };
    description: string;
  }>;
};

export type JerusalemPlaceId = string;

export type JerusalemPlaceKind = "temple" | "palace" | "garden" | "mountain" | "tomb" | "pool" | "gate" | "execution" | "site";

export type JerusalemPlace = {
  id: JerusalemPlaceId;
  ru: string;
  en: string;
  lat: number;
  lon: number;
  kind: JerusalemPlaceKind;
  ref?: string;
  description: string;
};

export type ResurrectionAppearance = {
  id: string;
  order: number;
  location: GospelLocationId | JerusalemPlaceId | null;
  ru: string;
  refs: { mt?: string; mk?: string; lk?: string; jn?: string; other?: string };
  description: string;
};

export type GospelComparisonRow = {
  ru: string;
  refs: { mt?: string; mk?: string; lk?: string; jn?: string };
};
