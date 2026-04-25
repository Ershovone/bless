import { create } from "zustand";
import type { CityId, CompanionId } from "@/types/atlas";
import { JOURNEYS } from "@/data/journeys";
import { JOURNEY_YEAR_RANGES, YEAR_RANGE, ZOOM } from "@/constants/map";

export function journeyIdxForYear(year: number): number {
  for (const range of JOURNEY_YEAR_RANGES) {
    if (year <= range.maxYear) return range.journeyIdx;
  }
  return JOURNEYS.length - 1;
}

type AtlasState = {
  activeJ: number;
  selectedCity: CityId | null;
  selectedCompanion: CompanionId | null;
  modernView: boolean;
  hoverCity: CityId | null;
  scrubYear: number | null;
  playing: boolean;
  playT: number;
  zoomDisplay: number;

  setActiveJ: (i: number) => void;
  setSelectedCity: (id: CityId | null) => void;
  setSelectedCompanion: (id: CompanionId | null) => void;
  toggleCompanion: (id: CompanionId) => void;
  setModernView: (v: boolean) => void;
  toggleModernView: () => void;
  setHoverCity: (id: CityId | null) => void;
  setScrubYear: (y: number | null) => void;
  setPlaying: (p: boolean) => void;
  setPlayT: (t: number) => void;
  setZoomDisplay: (z: number) => void;
  resetPlayback: () => void;
};

export const useAtlasStore = create<AtlasState>((set, get) => ({
  activeJ: 0,
  selectedCity: null,
  selectedCompanion: null,
  modernView: false,
  hoverCity: null,
  scrubYear: null,
  playing: false,
  playT: 1,
  zoomDisplay: ZOOM.min,

  setActiveJ: (i) => {
    if (i === get().activeJ) return;
    set({ activeJ: i, playT: 1, playing: false, selectedCompanion: null });
  },
  setSelectedCity: (id) => set({ selectedCity: id }),
  setSelectedCompanion: (id) => set({ selectedCompanion: id }),
  toggleCompanion: (id) =>
    set((s) => ({ selectedCompanion: s.selectedCompanion === id ? null : id })),
  setModernView: (v) => set({ modernView: v }),
  toggleModernView: () => set((s) => ({ modernView: !s.modernView })),
  setHoverCity: (id) => set({ hoverCity: id }),
  setScrubYear: (y) => {
    if (y === null) {
      set({ scrubYear: null });
      return;
    }
    const clamped = Math.max(YEAR_RANGE.start, Math.min(YEAR_RANGE.end, y));
    const ji = journeyIdxForYear(clamped);
    set((s) => ({
      scrubYear: clamped,
      activeJ: ji !== s.activeJ ? ji : s.activeJ,
      playT: ji !== s.activeJ ? 1 : s.playT,
      playing: ji !== s.activeJ ? false : s.playing,
      selectedCompanion: ji !== s.activeJ ? null : s.selectedCompanion,
    }));
  },
  setPlaying: (p) => set({ playing: p }),
  setPlayT: (t) => set({ playT: t }),
  setZoomDisplay: (z) => set({ zoomDisplay: z }),
  resetPlayback: () => set({ playT: 1, playing: false }),
}));
