"use client";

import { GOSPEL_TIMELINE } from "@/data/gospel/timeline";
import { GOSPEL_PHASES } from "@/data/gospel/phases";
import { GOSPEL_LOCATIONS } from "@/data/gospel/locations";
import { useGospelStore } from "@/hooks/useGospelStore";
import { SectionLabel } from "@/components/layout/SectionLabel";
import { ScriptureRef } from "@/components/bible/ScriptureRef";

export function GospelTimelinePanel() {
  const setActiveIdx = useGospelStore((s) => s.setActivePhaseIdx);
  const setSelectedLocation = useGospelStore((s) => s.setSelectedLocation);

  return (
    <div className="relative z-[2] mx-auto my-7" style={{ width: "min(96%, 1300px)" }}>
      <SectionLabel className="mb-3 text-center">
        Хронология · <em>Chronology of the Life of Christ</em>
      </SectionLabel>

      <div className="border border-(--color-sepia-light) bg-(--color-parchment-light)/40 text-left">
        <div
          className="hidden grid-cols-[110px_1fr_140px_140px] border-b border-(--color-sepia-light) px-3 py-3 font-sans text-[10px] uppercase tracking-[0.2em] text-(--color-sepia) sm:grid sm:px-6 sm:py-3.5 sm:text-[11px] sm:tracking-[0.25em]"
        >
          <span>Дата</span>
          <span>Событие</span>
          <span>Место</span>
          <span>Ссылка</span>
        </div>
        {GOSPEL_TIMELINE.map((ev, i) => {
          const phase = GOSPEL_PHASES[ev.phaseIdx];
          const loc = GOSPEL_LOCATIONS[ev.location];
          return (
            <div
              key={i}
              className="grid grid-cols-[1fr_auto] items-baseline gap-x-3 border-b border-dotted border-(--color-sepia-light) px-3 py-3 last:border-b-0 sm:grid-cols-[110px_1fr_140px_140px] sm:px-6 sm:py-4"
            >
              <div className="font-sans text-[12px] tracking-[0.05em] text-(--color-rust) sm:text-[13px]">
                {ev.approxLabel}
              </div>
              <div className="col-span-2 min-w-0 text-[14px] leading-tight sm:col-span-1 sm:text-[15px]">
                <button
                  type="button"
                  onClick={() => setActiveIdx(ev.phaseIdx)}
                  className="block text-left hover:underline"
                  title={`Перейти к фазе: ${phase.ru}`}
                >
                  {ev.ru}
                </button>
                <em className="mt-0.5 block text-[12px] text-(--color-sepia) sm:text-[12px]">
                  {ev.en}
                </em>
              </div>
              {loc ? (
                <button
                  type="button"
                  onClick={() => setSelectedLocation(ev.location)}
                  className="text-right text-[12px] italic text-(--color-sepia) hover:text-(--color-ink) hover:underline sm:text-left sm:text-[13px]"
                >
                  {loc.ru}
                </button>
              ) : (
                <div className="text-right text-[12px] italic text-(--color-sepia-light) sm:text-left">—</div>
              )}
              <div className="text-right text-[12px] italic text-(--color-rust) sm:text-[13px]">
                <ScriptureRef refText={ev.ref} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
