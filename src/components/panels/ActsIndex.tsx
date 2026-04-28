"use client";

import { JOURNEYS } from "@/data/journeys";
import { TIMELINE } from "@/data/timeline";
import { ROMAN_NUMERALS } from "@/constants/design";
import { useAtlasStore } from "@/hooks/useAtlasStore";
import { Ornament } from "@/components/layout/Ornament";
import { ScriptureRef } from "@/components/bible/ScriptureRef";

export function ActsIndex() {
  const activeJ = useAtlasStore((s) => s.activeJ);
  const setActiveJ = useAtlasStore((s) => s.setActiveJ);

  return (
    <section
      className="relative z-[2] mx-auto mb-5 mt-8 border-t border-(--color-sepia-light) px-3 pb-5 pt-6 text-center sm:mt-14 sm:px-5 sm:pt-10"
      style={{ width: "min(96%, 1500px)" }}
    >
      <Ornament />
      <h2 className="mx-0 mb-1 mt-4 text-3xl font-normal leading-tight sm:text-[42px] sm:leading-[1.05]">
        Ссылки на главы Деяний
        <em className="mt-1 block text-[15px] italic tracking-[0.06em] text-(--color-sepia) sm:text-[18px]">
          The Book of Acts · Chapter Index
        </em>
      </h2>

      <div className="mt-9 grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-4">
        {JOURNEYS.map((j, i) => {
          const active = activeJ === i;
          return (
            <button
              key={j.id}
              type="button"
              onClick={() => setActiveJ(i)}
              className={`cursor-pointer border border-(--color-sepia-light) px-5 py-5 text-left transition-all ${
                active
                  ? "border-(--color-ink) bg-(--color-ink) text-(--color-parchment-grad-start) shadow-[0_14px_28px_-8px_rgba(58,40,23,0.5)]"
                  : "bg-(--color-parchment-light)/60 text-(--color-ink)"
              }`}
            >
              <div className="text-[32px] italic leading-none text-(--color-rust)">
                {ROMAN_NUMERALS[i]}
              </div>
              <div className="my-3 h-[3px] w-12" style={{ background: j.color }} />
              <div className="text-xl font-medium leading-[1.15]">{j.ru}</div>
              <div className="mt-0.5 text-[13px] italic opacity-75">{j.en}</div>
              <div className="mt-4 text-lg font-medium">
                <ScriptureRef refText={j.acts} />
              </div>
              <div className="mt-1 font-sans text-[11px] uppercase tracking-[0.18em] opacity-70">
                {j.years}
              </div>
              <div className="mt-3 border-t border-dotted border-current pt-2.5 text-xs italic opacity-70">
                {j.route.length} остановок · {j.route.length} stops
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 border border-(--color-sepia-light) bg-(--color-parchment-light)/40 text-left sm:mt-10">
        <div
          className="hidden grid-cols-[80px_1fr_110px] border-b border-(--color-sepia-light) px-3 py-3 font-sans text-[10px] uppercase tracking-[0.2em] text-(--color-sepia) sm:grid sm:grid-cols-[110px_1fr_140px] sm:px-6 sm:py-3.5 sm:text-[11px] sm:tracking-[0.25em]"
        >
          <span>События · Events</span>
          <span>&nbsp;</span>
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
