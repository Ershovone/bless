"use client";

import { useState } from "react";
import { HOLY_WEEK } from "@/data/gospel/holyWeek";
import { GOSPEL_LOCATIONS } from "@/data/gospel/locations";
import { JERUSALEM_PLACES } from "@/data/gospel/jerusalemPlaces";
import { SectionLabel } from "@/components/layout/SectionLabel";
import { ScriptureRef } from "@/components/bible/ScriptureRef";
import { ProseWithRefs } from "@/components/bible/ProseWithRefs";

function locName(id: string): string {
  if (id in JERUSALEM_PLACES) return JERUSALEM_PLACES[id].ru;
  if (id in GOSPEL_LOCATIONS) return GOSPEL_LOCATIONS[id].ru;
  return id;
}

const DAY_TINT: string[] = [
  "#c9843d",  // Воскр. Вход
  "#a85e16",  // Понед.
  "#8b6f47",  // Втор.
  "#6b5a3a",  // Среда
  "#7a2d1f",  // Чет/Пятн ночь
  "#5a3a1a",  // Пятн.
  "#5a4426",  // Суббота
  "#d4a574",  // Воскр. Воскресение
];

export function HolyWeekPanel() {
  const [openDay, setOpenDay] = useState<string | null>(HOLY_WEEK[0].id);

  return (
    <div className="relative z-[2] mx-auto my-8" style={{ width: "min(96%, 1400px)" }}>
      <SectionLabel className="mb-4 text-center">
        Семь дней — Страстная неделя · <em>Passion Week, Day by Day</em>
      </SectionLabel>

      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 lg:grid-cols-8">
        {HOLY_WEEK.map((d, i) => {
          const isOpen = openDay === d.id;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => setOpenDay(isOpen ? null : d.id)}
              className={`flex flex-col items-start gap-0.5 border px-3 py-2.5 text-left transition-all ${
                isOpen
                  ? "border-(--color-ink) bg-(--color-ink) text-(--color-parchment-grad-start)"
                  : "border-(--color-sepia-light) bg-(--color-parchment-light)/55 text-(--color-ink) hover:bg-(--color-parchment-light)"
              }`}
              style={!isOpen ? { borderLeftColor: DAY_TINT[i], borderLeftWidth: 4 } : undefined}
            >
              <span className="font-sans text-[10px] uppercase tracking-[0.18em] opacity-80">
                {d.weekday}
              </span>
              <span className="text-[11px] italic opacity-70">{d.date}</span>
              <span className="mt-0.5 text-[13px] font-medium leading-tight sm:text-[14px]">
                {d.title}
              </span>
            </button>
          );
        })}
      </div>

      {openDay && (() => {
        const day = HOLY_WEEK.find((d) => d.id === openDay)!;
        const dayIdx = HOLY_WEEK.findIndex((d) => d.id === openDay);
        return (
          <div
            className="mt-4 border border-(--color-sepia-light) bg-(--color-parchment-light)/70 px-5 py-5 sm:px-7 sm:py-6"
            style={{ borderTopColor: DAY_TINT[dayIdx], borderTopWidth: 4 }}
          >
            <div className="mb-4 flex items-baseline justify-between gap-3 border-b border-(--color-sepia-light)/50 pb-3">
              <div>
                <div className="font-sans text-[10px] uppercase tracking-[0.25em] text-(--color-rust)">
                  {day.weekday} · {day.date}
                </div>
                <h3 className="m-0 mt-0.5 text-[24px] font-medium leading-tight sm:text-[28px]">
                  {day.title}
                </h3>
              </div>
            </div>

            <div className="space-y-5">
              {day.events.map((ev, i) => {
                const refs = [ev.refs.mt, ev.refs.mk, ev.refs.lk, ev.refs.jn].filter(Boolean) as string[];
                return (
                  <div key={i} className="border-l-2 border-(--color-rust)/40 pl-4">
                    <div className="mb-1 flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                      <h4 className="m-0 text-[16px] font-medium leading-tight sm:text-[17px]">
                        {ev.title}
                      </h4>
                      <span className="text-[11px] italic text-(--color-sepia)">
                        ☖ {locName(ev.location)}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[14px] leading-[1.6] text-(--color-ink-muted) sm:text-[15px]">
                      <ProseWithRefs text={ev.description} />
                    </p>
                    {refs.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-x-2 gap-y-0.5 text-[11px] italic text-(--color-rust)">
                        {refs.map((r, j) => (
                          <ScriptureRef key={j} refText={r} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
