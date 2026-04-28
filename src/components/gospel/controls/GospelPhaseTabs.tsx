"use client";

import { GOSPEL_PHASES } from "@/data/gospel/phases";
import { useGospelStore } from "@/hooks/useGospelStore";
import { SectionLabel } from "@/components/layout/SectionLabel";

const PHASE_NUMERAL = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

export function GospelPhaseTabs() {
  const activeIdx = useGospelStore((s) => s.activePhaseIdx);
  const setActiveIdx = useGospelStore((s) => s.setActivePhaseIdx);

  return (
    <div className="relative z-[2] mx-auto mb-5 mt-8" style={{ width: "min(96%, 1700px)" }}>
      <SectionLabel className="mb-3 text-center">
        Восемь периодов жизни Иисуса Христа · <em>Eight Phases of Christ&apos;s Ministry</em>
      </SectionLabel>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-8">
        {GOSPEL_PHASES.map((p, i) => {
          const active = activeIdx === i;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setActiveIdx(i)}
              className={`grid grid-cols-[auto_1fr] items-start gap-x-3 border px-3.5 py-3 text-left transition-all ${
                active
                  ? "border-(--color-ink) bg-(--color-ink) text-(--color-parchment-grad-start) shadow-[0_10px_24px_-6px_rgba(58,40,23,0.5)]"
                  : "border-(--color-sepia-light) bg-(--color-parchment-light)/60 text-(--color-ink)"
              }`}
            >
              <span
                aria-hidden
                className="row-span-2 text-[24px] italic leading-none"
                style={!active ? { color: p.color } : undefined}
              >
                {PHASE_NUMERAL[i]}
              </span>
              <span className="text-[14px] font-medium leading-tight">{p.ru}</span>
              <span
                className={`text-[10px] uppercase tracking-[0.08em] ${active ? "opacity-70" : "opacity-60"}`}
              >
                {p.yearsAD}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
