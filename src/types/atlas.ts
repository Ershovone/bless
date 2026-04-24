export type CityId = string;

export type JourneyNumber = 1 | 2 | 3 | 4;

export type JourneySlug = "first" | "second" | "third" | "fourth";

export type Coordinates = { lon: number; lat: number };

export type City = Coordinates & {
  ru: string;
  en: string;
  note?: string;
};

export type Journey = {
  id: JourneyNumber;
  slug: JourneySlug;
  ru: string;
  en: string;
  years: string;
  acts: string;
  color: string;
  route: CityId[];
  summary: string;
};

export type TimelineEvent = {
  year: number;
  ru: string;
  en: string;
  ref: string;
};

export type CityEvent = {
  year: string;
  ref: string;
  ru: string;
};

export type CityDetail = {
  modern: string;
  events: CityEvent[];
};

export type Epistle = {
  ru: string;
  en: string;
  written: string;
};

export type CompanionId = string;

export type Participation = {
  journeyIdx: number;
  cities: CityId[];
  joinedAt: CityId;
  leftAt: CityId;
};

export type Companion = {
  ru: string;
  en: string;
  glyph: string;
  color: string;
  meta: string;
  note: string;
  participation: Participation[];
};

export type Point = { x: number; y: number };

export type RouteMode = "sea" | "land";

export type LegEstimate = {
  km: number;
  days: number;
  mode: RouteMode;
};

export type RegionTier = "sea" | "prov" | "island";

export type RegionLabel = Coordinates & {
  ru: string;
  size: number;
  letterSpacing: number;
  opacity?: number;
  tier: RegionTier;
};

export type JourneySpan = {
  start: number;
  end: number;
  label: string;
  color: string;
  dashed?: boolean;
};

export type CountryPath = {
  name: string | null;
  d: string;
  cx: number;
  cy: number;
};
