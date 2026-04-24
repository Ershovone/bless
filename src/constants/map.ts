import type { CityId, JourneySpan } from "@/types/atlas";
import { COLORS, JOURNEY_COLORS } from "./design";

export const MAP_BOUNDS = {
  lonMin: 11,
  lonMax: 45,
  latMin: 30,
  latMax: 43,
} as const;

export const MAP_SIZE = {
  width: 1700,
  height: 820,
} as const;

export const BOW_FACTOR = 0.07;

export const PLAY_DURATION_MS = 6500;

export const ZOOM = {
  min: 1,
  max: 6,
  step: 1.3,
  wheelDelta: 0.15,
} as const;

export const TRAVEL = {
  seaKmPerDay: 90,
  landKmPerDay: 28,
  bothPortsMinKm: 120,
  seaFallbackKm: 400,
} as const;

export const PORT_CITIES: ReadonlySet<CityId> = new Set<CityId>([
  "seleucia", "salamis", "paphos", "attalia", "neapolis", "cenchreae",
  "ephesus", "miletus", "tyre", "ptolemais", "sidon", "caesarea",
  "myra", "fair_havens", "malta", "syracuse", "rhegium", "puteoli", "troas",
]);

export const YEAR_RANGE = { start: 32, end: 64 } as const;

export const YEAR_AXIS_TICKS = [33, 40, 45, 50, 55, 60, 64] as const;

export const BBOX_PADDING_DEG = 2;

export const BEZ_ARC_SAMPLES = 20;

export const SCALE_BAR_KM = 500;

export const EARTH_RADIUS_KM = 6371;

export const GRATICULE_LONS = [15, 20, 25, 30, 35, 40, 45] as const;
export const GRATICULE_LATS = [30, 35, 40] as const;

export const GRATICULE_LABEL_LONS = [15, 20, 25, 30, 35, 40] as const;
export const GRATICULE_LABEL_LATS = [30, 35, 40] as const;

export const JOURNEY_YEAR_RANGES: Array<{ maxYear: number; journeyIdx: number }> = [
  { maxYear: 48, journeyIdx: 0 },
  { maxYear: 52, journeyIdx: 1 },
  { maxYear: 57, journeyIdx: 2 },
  { maxYear: Infinity, journeyIdx: 3 },
];

export const TIMELINE_SPANS: JourneySpan[] = [
  { start: 33, end: 34, label: "Обращение", color: COLORS.sepia, dashed: true },
  { start: 46, end: 48, label: "I", color: JOURNEY_COLORS[0] },
  { start: 49, end: 52, label: "II", color: JOURNEY_COLORS[1] },
  { start: 53, end: 57, label: "III", color: JOURNEY_COLORS[2] },
  { start: 57, end: 59, label: "В Кесарии", color: COLORS.sepia, dashed: true },
  { start: 59, end: 62, label: "IV", color: JOURNEY_COLORS[3] },
  { start: 62, end: 64, label: "Рим", color: COLORS.ink, dashed: true },
];
