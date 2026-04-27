"use client";

import { EXODUS_PHASES } from "@/data/exodus/phases";
import { ROMAN_NUMERALS } from "@/constants/design";
import { useExodusStore } from "@/hooks/useExodusStore";
import { SectionLabel } from "@/components/layout/SectionLabel";

const PHASE_ROMAN = ["I", "II", "III", "IV", "V"];

export function ExodusPhaseTabs() {
  const activeIdx = useExodusStore((s) => s.activePhaseIdx);
  const setActiveIdx = useExodusStore((s) => s.setActivePhaseIdx);

  void ROMAN_NUMERALS;

  return (
    <div className="relative z-[2] mx-auto mb-5 mt-8" style={{ width: "min(96%, 1600px)" }}>
      <SectionLabel className="mb-3 text-center">
        Фазы Исхода · <em>Phases of the Exodus</em>
      </SectionLabel>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {EXODUS_PHASES.map((p, i) => {
          const active = activeIdx === i;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setActiveIdx(i)}
              className={`grid grid-cols-[auto_1fr] items-start gap-x-3 border px-4 py-3.5 text-left transition-all ${
                active
                  ? "border-(--color-ink) bg-(--color-ink) text-(--color-parchment-grad-start) shadow-[0_10px_24px_-6px_rgba(58,40,23,0.5)]"
                  : "border-(--color-sepia-light) bg-(--color-parchment-light)/60 text-(--color-ink)"
              }`}
            >
              <span
                aria-hidden
                className="row-span-2 text-[28px] italic leading-none"
                style={!active ? { color: p.color } : undefined}
              >
                {PHASE_ROMAN[i]}
              </span>
              <span className="text-[15px] font-medium leading-tight">{p.ru}</span>
              <span
                className={`text-[10px] uppercase tracking-[0.1em] ${active ? "opacity-70" : "opacity-60"}`}
              >
                {p.yearsBC}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
