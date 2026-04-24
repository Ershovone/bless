"use client";

import { JOURNEYS } from "@/data/journeys";
import { ROMAN_NUMERALS } from "@/constants/design";
import { useAtlasStore } from "@/hooks/useAtlasStore";
import { SectionLabel } from "@/components/layout/SectionLabel";

export function JourneyTabs() {
  const activeJ = useAtlasStore((s) => s.activeJ);
  const setActiveJ = useAtlasStore((s) => s.setActiveJ);

  return (
    <div className="relative z-[2] mx-auto mb-5 mt-8" style={{ width: "min(96%, 1600px)" }}>
      <SectionLabel className="mb-3 text-center">
        Выберите путешествие · <em>Select journey</em>
      </SectionLabel>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
        {JOURNEYS.map((j, i) => {
          const active = activeJ === i;
          return (
            <button
              key={j.id}
              type="button"
              onClick={() => setActiveJ(i)}
              className={`grid grid-cols-[auto_1fr] items-center gap-x-3.5 border border-(--color-sepia-light) px-4 py-3.5 text-left transition-all ${
                active
                  ? "border-(--color-ink) bg-(--color-ink) text-(--color-parchment-grad-start) shadow-[0_10px_24px_-6px_rgba(58,40,23,0.5)]"
                  : "bg-(--color-parchment-light)/60 text-(--color-ink)"
              }`}
            >
              <span className="row-span-2 text-[34px] italic">{ROMAN_NUMERALS[i]}</span>
              <span className="text-[17px] font-semibold">{j.ru}</span>
              <span className="text-xs uppercase tracking-[0.1em] opacity-70">{j.years}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
