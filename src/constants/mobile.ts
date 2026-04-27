export const MOBILE_HEADER_HEIGHT = 56;
export const MOBILE_DOCK_HEIGHT = 60;
export const MOBILE_SHEET_MAX_HEIGHT_VH = 60;
export const MOBILE_SHEET_TRANSITION_MS = 220;

export const MOBILE_SHEET_TABS = [
  { id: "route", ru: "Маршрут", en: "Route" },
  { id: "companions", ru: "Спутники", en: "Companions" },
  { id: "chronology", ru: "Хронология", en: "Timeline" },
  { id: "acts", ru: "Деяния", en: "Acts" },
] as const;

export type MobileSheetTabId = (typeof MOBILE_SHEET_TABS)[number]["id"];
