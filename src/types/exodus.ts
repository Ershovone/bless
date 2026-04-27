export type ExodusStationId = string;

export type ExodusStationEvent = {
  ref: string;
  ru: string;
};

export type ExodusStation = {
  ru: string;
  en: string;
  lat: number;
  lon: number;
  numbersRef?: string;
  exodusRef?: string;
  modern?: string;
  significance?: string;
  events?: ExodusStationEvent[];
};

export type ExodusPhaseId = "escape" | "to_sinai" | "law" | "wandering" | "to_promised";

export type ExodusPhase = {
  id: ExodusPhaseId;
  ru: string;
  en: string;
  yearsBC: string;
  description: string;
  stations: ExodusStationId[];
  acts: string;
  color: string;
};

export type PlagueId = string;

export type Plague = {
  id: PlagueId;
  numeral: string;
  ru: string;
  en: string;
  ref: string;
  glyph: string;
  description: string;
};

export type PeopleId = string;

export type People = {
  id: PeopleId;
  ru: string;
  en: string;
  ru_label: string;
  origin: string;
  description: string;
  refs: string[];
  territory: Array<[number, number]>;
  centroid: [number, number];
  color: string;
};
