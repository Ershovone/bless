"use client";

import { useMemo } from "react";
import { TIMELINE } from "@/data/timeline";
import { JOURNEYS } from "@/data/journeys";
import { TIMELINE_SPANS, YEAR_AXIS_TICKS, YEAR_RANGE } from "@/constants/map";
import { journeyIdxForYear, useAtlasStore } from "@/hooks/useAtlasStore";
import { SectionLabel } from "@/components/layout/SectionLabel";

const TRACK_HEIGHT = 110;
const SPAN_TOP = 36;
const SPAN_HEIGHT = 14;
const TICK_TOP = 30;
const TICK_DOT_TOP = 22;
const AXIS_TOP = 72;
const INPUT_TOP = 20;
const INPUT_HEIGHT = 60;

function pctOf(year: number): number {
  return ((year - YEAR_RANGE.start) / (YEAR_RANGE.end - YEAR_RANGE.start)) * 100;
}

function findCurrent(year: number) {
  return [...TIMELINE].reverse().find((ev) => ev.year <= year) ?? null;
}

export function ChronologyScrubber() {
  const scrubYear = useAtlasStore((s) => s.scrubYear);
  const setScrubYear = useAtlasStore((s) => s.setScrubYear);

  const year = scrubYear ?? YEAR_RANGE.end;
  const current = useMemo(() => findCurrent(year), [year]);
  const liveJourney = JOURNEYS[journeyIdxForYear(year)];

  return (
    <div
      className="relative z-[2] mx-auto mb-5 mt-12 px-5 py-7"
      style={{ width: "min(96%, 1600px)" }}
    >
      <SectionLabel className="mb-5 text-center">
        Хронология · <em>Chronology</em>
        <span className="ml-2.5 text-xs normal-case tracking-[0.08em] italic text-(--color-sepia-light)">
          — перетащите бегунок, чтобы пройти сквозь годы служения Павла
        </span>
      </SectionLabel>

      <div className="px-8">
        <div className="relative mt-2.5 mb-5" style={{ height: TRACK_HEIGHT }}>
          {TIMELINE_SPANS.map((s, i) => (
            <div
              key={`span-${i}`}
              className="absolute flex items-center overflow-hidden rounded-sm pl-2"
              style={{
                top: SPAN_TOP,
                height: SPAN_HEIGHT,
                left: `${pctOf(s.start)}%`,
                width: `${pctOf(s.end) - pctOf(s.start)}%`,
                background: s.dashed
                  ? `repeating-linear-gradient(90deg, ${s.color} 0 4px, transparent 4px 8px)`
                  : s.color,
              }}
            >
              <span className="whitespace-nowrap font-sans text-[10px] font-semibold tracking-[0.2em] text-(--color-parchment-light)">
                {s.label}
              </span>
            </div>
          ))}

          {TIMELINE.map((ev, i) => (
            <div key={`tick-${i}`} className="absolute w-0" style={{ top: TICK_TOP, left: `${pctOf(ev.year)}%` }}>
              <div
                className="absolute h-2 w-2 rounded-full transition-transform duration-200"
                style={{
                  top: TICK_DOT_TOP,
                  left: -4,
                  background: ev.year === current?.year ? "var(--color-rust)" : "var(--color-sepia)",
                  transform: ev.year === current?.year ? "scale(1.6)" : "scale(1)",
                }}
              />
            </div>
          ))}

          {YEAR_AXIS_TICKS.map((y) => (
            <div
              key={`axis-${y}`}
              className="absolute -translate-x-1/2 font-sans text-[11px] tracking-[0.1em] text-(--color-sepia-light)"
              style={{ top: AXIS_TOP, left: `${pctOf(y)}%` }}
            >
              {y}
            </div>
          ))}

          <div
            className="pointer-events-none absolute inset-y-0 z-[3] -translate-x-1/2"
            style={{ left: `${pctOf(year)}%` }}
          >
            <div
              className="absolute left-[-0.5px] w-0.5 bg-(--color-rust)"
              style={{ top: INPUT_TOP, bottom: 28, boxShadow: "0 0 0 3px rgba(139,74,43,0.15)" }}
            />
            <div className="absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap bg-(--color-rust) px-2.5 py-1 font-sans text-xs font-semibold tracking-[0.12em] text-(--color-parchment-light)">
              {year} н.э.
            </div>
          </div>

          <input
            type="range"
            min={YEAR_RANGE.start}
            max={YEAR_RANGE.end}
            step={1}
            value={year}
            onChange={(e) => setScrubYear(Number.parseInt(e.target.value, 10))}
            onDoubleClick={() => setScrubYear(null)}
            className="invisible-slider absolute z-[4] w-[calc(100%+12px)] opacity-[0.001]"
            style={{ top: INPUT_TOP, left: -6, right: -6, height: INPUT_HEIGHT }}
          />
        </div>

        {current && (
          <div
            className="mt-1.5 grid items-center gap-6 border border-(--color-sepia-light) bg-(--color-parchment-light)/75 px-6 py-4"
            style={{ gridTemplateColumns: "auto 1fr auto" }}
          >
            <div className="text-[32px] font-medium leading-none text-(--color-ink)">
              {current.year} <span className="text-[11px] tracking-[0.2em]">AD</span>
            </div>
            <div className="leading-tight">
              <div className="text-xl font-medium">{current.ru}</div>
              <em className="text-[13px] text-(--color-sepia)">{current.en}</em>
            </div>
            <div className="text-[15px] font-medium italic text-(--color-rust)">{current.ref}</div>
          </div>
        )}

        <div className="mt-3.5 flex items-center justify-between text-[13px] text-(--color-sepia)">
          <span>
            Путешествие: <strong style={{ color: liveJourney.color }}>{liveJourney.ru}</strong>
          </span>
          <button
            type="button"
            onClick={() => setScrubYear(null)}
            className="border border-(--color-sepia-light) bg-transparent px-3.5 py-1.5 font-serif text-xs tracking-[0.08em] text-(--color-sepia) hover:bg-(--color-parchment-light)"
          >
            ⟲ Сброс
          </button>
        </div>
      </div>
    </div>
  );
}
