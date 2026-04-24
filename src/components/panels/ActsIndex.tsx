"use client";

import { JOURNEYS } from "@/data/journeys";
import { TIMELINE } from "@/data/timeline";
import { ROMAN_NUMERALS } from "@/constants/design";
import { useAtlasStore } from "@/hooks/useAtlasStore";
import { Ornament } from "@/components/layout/Ornament";

export function ActsIndex() {
  const activeJ = useAtlasStore((s) => s.activeJ);
  const setActiveJ = useAtlasStore((s) => s.setActiveJ);

  return (
    <section
      className="relative z-[2] mx-auto mb-5 mt-14 border-t border-(--color-sepia-light) px-5 pb-5 pt-10 text-center"
      style={{ width: "min(96%, 1500px)" }}
    >
      <Ornament />
      <h2 className="mx-0 mb-1 mt-4 text-[42px] font-normal leading-[1.05]">
        Ссылки на главы Деяний
        <em className="mt-1 block text-[18px] italic tracking-[0.06em] text-(--color-sepia)">
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
              <div className="mt-4 text-lg font-medium">{j.acts}</div>
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

      <div className="mt-10 border border-(--color-sepia-light) bg-(--color-parchment-light)/40 text-left">
        <div
          className="grid border-b border-(--color-sepia-light) px-6 py-3.5 font-sans text-[11px] uppercase tracking-[0.25em] text-(--color-sepia)"
          style={{ gridTemplateColumns: "110px 1fr 140px" }}
        >
          <span>События · Events</span>
          <span>&nbsp;</span>
          <span>Глава · Chapter</span>
        </div>
        {TIMELINE.map((ev, i) => (
          <div
            key={i}
            className="grid items-baseline border-b border-dotted border-(--color-sepia-light) px-6 py-4.5"
            style={{ gridTemplateColumns: "110px 1fr 140px" }}
          >
            <div className="text-[26px] font-medium text-(--color-ink)">
              {ev.year}
              <span className="ml-1.5 font-sans text-[11px] tracking-[0.18em] text-(--color-rust)">AD</span>
            </div>
            <div className="text-[17px] leading-tight">
              <div>{ev.ru}</div>
              <em className="mt-0.5 block text-[13px] text-(--color-sepia)">{ev.en}</em>
            </div>
            <div className="text-right text-base font-medium italic text-(--color-rust)">{ev.ref}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
