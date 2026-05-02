"use client";

import { TIMELINE } from "@/data/timeline";
import { SectionLabel } from "@/components/layout/SectionLabel";
import { ScriptureRef } from "@/components/bible/ScriptureRef";

export function ActsIndex() {
  return (
    <section
      className="relative z-[2] mx-auto my-5"
      style={{ width: "min(96%, 1500px)" }}
    >
      <SectionLabel className="mb-3">
        Ссылки на главы Деяний · <em>The Book of Acts · Chapter Index</em>
      </SectionLabel>

      <div className="border border-(--color-sepia-light) bg-(--color-parchment-light)/40 text-left">
        <div className="hidden grid-cols-[80px_1fr_110px] border-b border-(--color-sepia-light) px-3 py-3 font-sans text-[10px] uppercase tracking-[0.2em] text-(--color-sepia) sm:grid sm:grid-cols-[110px_1fr_140px] sm:px-6 sm:py-3.5 sm:text-[11px] sm:tracking-[0.25em]">
          <span>Год · Year</span>
          <span>Событие · Event</span>
          <span>Глава · Chapter</span>
        </div>
        {TIMELINE.map((ev, i) => (
          <div
            key={i}
            className="grid grid-cols-[68px_1fr_auto] items-baseline gap-x-3 border-b border-dotted border-(--color-sepia-light) px-3 py-3 last:border-b-0 sm:grid-cols-[110px_1fr_140px] sm:px-6 sm:py-4.5"
          >
            <div className="text-xl font-medium text-(--color-ink) sm:text-[26px]">
              {ev.year}
              <span className="ml-1 font-sans text-[10px] tracking-[0.15em] text-(--color-rust) sm:ml-1.5 sm:text-[11px] sm:tracking-[0.18em]">
                AD
              </span>
            </div>
            <div className="min-w-0 text-[15px] leading-tight sm:text-[17px]">
              <div>{ev.ru}</div>
              <em className="mt-0.5 block text-[12px] text-(--color-sepia) sm:text-[13px]">
                {ev.en}
              </em>
            </div>
            <div className="text-right text-sm font-medium italic text-(--color-rust) sm:text-base">
              <ScriptureRef refText={ev.ref} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
