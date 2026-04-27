import { create } from "zustand";
import { EXODUS_PHASES } from "@/data/exodus/phases";
import type { ExodusPhaseId, ExodusStationId, PeopleId } from "@/types/exodus";
import { ZOOM } from "@/constants/map";

type ExodusState = {
  activePhaseIdx: number;
  selectedStation: ExodusStationId | null;
  hoverStation: ExodusStationId | null;
  selectedPeople: PeopleId | null;
  showPeoples: boolean;
  modernView: boolean;
  zoomDisplay: number;

  setActivePhaseIdx: (i: number) => void;
  setActivePhaseById: (id: ExodusPhaseId) => void;
  setSelectedStation: (id: ExodusStationId | null) => void;
  setHoverStation: (id: ExodusStationId | null) => void;
  setSelectedPeople: (id: PeopleId | null) => void;
  setShowPeoples: (v: boolean) => void;
  toggleShowPeoples: () => void;
  setModernView: (v: boolean) => void;
  toggleModernView: () => void;
  setZoomDisplay: (z: number) => void;
};

export const useExodusStore = create<ExodusState>((set) => ({
  activePhaseIdx: 0,
  selectedStation: null,
  hoverStation: null,
  selectedPeople: null,
  showPeoples: true,
  modernView: false,
  zoomDisplay: ZOOM.min,

  setActivePhaseIdx: (i) => set({ activePhaseIdx: i }),
  setActivePhaseById: (id) => {
    const idx = EXODUS_PHASES.findIndex((p) => p.id === id);
    if (idx >= 0) set({ activePhaseIdx: idx });
  },
  setSelectedStation: (id) => set({ selectedStation: id }),
  setHoverStation: (id) => set({ hoverStation: id }),
  setSelectedPeople: (id) => set({ selectedPeople: id }),
  setShowPeoples: (v) => set({ showPeoples: v }),
  toggleShowPeoples: () => set((s) => ({ showPeoples: !s.showPeoples })),
  setModernView: (v) => set({ modernView: v }),
  toggleModernView: () => set((s) => ({ modernView: !s.modernView })),
  setZoomDisplay: (z) => set({ zoomDisplay: z }),
}));
