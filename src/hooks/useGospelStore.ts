import { create } from "zustand";
import { GOSPEL_PHASES } from "@/data/gospel/phases";
import type { GospelLocationId, GospelPhaseId, GospelRegionId, DiscipleId } from "@/types/gospel";
import { ZOOM } from "@/constants/map";

type GospelState = {
  activePhaseIdx: number;
  selectedLocation: GospelLocationId | null;
  hoverLocation: GospelLocationId | null;
  selectedRegion: GospelRegionId | null;
  selectedDisciple: DiscipleId | null;
  showRegions: boolean;
  modernView: boolean;
  zoomDisplay: number;

  setActivePhaseIdx: (i: number) => void;
  setActivePhaseById: (id: GospelPhaseId) => void;
  setSelectedLocation: (id: GospelLocationId | null) => void;
  setHoverLocation: (id: GospelLocationId | null) => void;
  setSelectedRegion: (id: GospelRegionId | null) => void;
  setSelectedDisciple: (id: DiscipleId | null) => void;
  setShowRegions: (v: boolean) => void;
  toggleShowRegions: () => void;
  setModernView: (v: boolean) => void;
  toggleModernView: () => void;
  setZoomDisplay: (z: number) => void;
};

export const useGospelStore = create<GospelState>((set) => ({
  activePhaseIdx: 0,
  selectedLocation: null,
  hoverLocation: null,
  selectedRegion: null,
  selectedDisciple: null,
  showRegions: true,
  modernView: false,
  zoomDisplay: ZOOM.min,

  setActivePhaseIdx: (i) => set({ activePhaseIdx: i }),
  setActivePhaseById: (id) => {
    const idx = GOSPEL_PHASES.findIndex((p) => p.id === id);
    if (idx >= 0) set({ activePhaseIdx: idx });
  },
  setSelectedLocation: (id) => set({ selectedLocation: id }),
  setHoverLocation: (id) => set({ hoverLocation: id }),
  setSelectedRegion: (id) => set({ selectedRegion: id }),
  setSelectedDisciple: (id) => set({ selectedDisciple: id }),
  setShowRegions: (v) => set({ showRegions: v }),
  toggleShowRegions: () => set((s) => ({ showRegions: !s.showRegions })),
  setModernView: (v) => set({ modernView: v }),
  toggleModernView: () => set((s) => ({ modernView: !s.modernView })),
  setZoomDisplay: (z) => set({ zoomDisplay: z }),
}));
