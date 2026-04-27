import { create } from "zustand";
import type { ParsedScriptureRef } from "@/types/bible";

type BibleReaderState = {
  currentRef: ParsedScriptureRef | null;
  open: (ref: ParsedScriptureRef) => void;
  close: () => void;
};

export const useBibleStore = create<BibleReaderState>((set) => ({
  currentRef: null,
  open: (ref) => set({ currentRef: ref }),
  close: () => set({ currentRef: null }),
}));
