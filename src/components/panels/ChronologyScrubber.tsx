"use client";

import { useMemo } from "react";
import { TIMELINE } from "@/data/timeline";
import { JOURNEYS } from "@/data/journeys";
import { TIMELINE_SPANS, YEAR_AXIS_TICKS, YEAR_RANGE } from "@/constants/map";
import { journeyIdxForYear, useAtlasStore } from "@/hooks/useAtlasStore";
import { SectionLabel } from "@/components/layout/SectionLabel";
import { ScriptureRef } from "@/components/bible/ScriptureRef";

const TRACK_HEIGHT = 96;
const SPAN_TOP = 28;
const SPAN_HEIGHT = 18;
const TICK_TOP = 50;
const AXIS_TOP = 70;
const INPUT_TOP = SPAN_TOP - 4;
const INPUT_HEIGHT = 44;
const TAG_TOP = 0;

function pctOf(year: number): number {
  return ((year - YEAR_RANGE.start) / (YEAR_RANGE.end - YEAR_RANGE.start)) * 100;
}

type ScrubContext =
  | { kind: "tick"; ev: (typeof TIMELINE)[number] }
  | { kind: "span"; span: (typeof TIMELINE_SPANS)[number] }
  | {
      kind: "between";
      prev: (typeof TIMELINE)[number] | null;
      next: (typeof TIMELINE)[number] | null;
    };

function findContext(year: number): ScrubContext {
  const exact = TIMELINE.find((ev) => ev.year === year);
  if (exact) return { kind: "tick", ev: exact };
  const span = TIMELINE_SPANS.find((s) => year >= s.start && year <= s.end);
  if (span) return { kind: "span", span };
  const sorted = [...TIMELINE].sort((a, b) => a.year - b.year);
  const prev = [...sorted].reverse().find((ev) => ev.year < year) ?? null;
  const next = sorted.find((ev) => ev.year > year) ?? null;
  return { kind: "between", prev, next };
}

export function ChronologyScrubber() {
  const scrubYear = useAtlasStore((s) => s.scrubYear);
  const setScrubYear = useAtlasStore((s) => s.setScrubYear);

  const year = scrubYear ?? YEAR_RANGE.end;
  const context = useMemo(() => findContext(year), [year]);
  const highlightTickYear =
    context.kind === "tick" ? context.ev.year : null;
  const liveJourney = JOURNEYS[journeyIdxForYear(year)];

  return (
    <div
      className="relative z-[2] mx-auto mb-5 mt-6 px-3 py-4 sm:mt-12 sm:px-5 sm:py-7"
      style={{ width: "min(96%, 1600px)" }}
    >
      <SectionLabel className="mb-4 text-center sm:mb-5">
        Хронология · <em>Chronology</em>
        <span className="ml-2 hidden text-xs normal-case italic tracking-[0.08em] text-(--color-sepia-light) sm:inline">
          — перетащите бегунок, чтобы пройти сквозь годы служения Павла
        </span>
      </SectionLabel>

      <div className="px-2 sm:px-8">
        <div className="relative mt-2.5 mb-3" style={{ height: TRACK_HEIGHT }}>
          {/* Background rail under the spans for visual continuity */}
          <div
            className="absolute inset-x-0 rounded-sm bg-(--color-sepia-light)/15"
            style={{ top: SPAN_TOP + 6, height: 6 }}
          />

          {/* Phase spans — bigger, more readable. Hide labels that won't fit. */}
          {TIMELINE_SPANS.map((s, i) => {
            const yearSpan = s.end - s.start;
            const labelFits = yearSpan >= 3 || s.label.length <= 2;
            return (
              <div
                key={`span-${i}`}
                title={`${s.label} · ${s.start}–${s.end} н.э.`}
                className="absolute flex items-center justify-center overflow-hidden rounded-sm"
                style={{
                  top: SPAN_TOP,
                  height: SPAN_HEIGHT,
                  left: `${pctOf(s.start)}%`,
                  width: `${pctOf(s.end) - pctOf(s.start)}%`,
                  background: s.color,
                }}
              >
                {labelFits && (
                  <span className="whitespace-nowrap font-sans text-[10px] font-semibold tracking-[0.18em] text-(--color-parchment-light)">
                    {s.label}
                  </span>
                )}
              </div>
            );
          })}

          {/* Event tick dots — slightly larger, current highlighted */}
          {TIMELINE.map((ev, i) => {
            const isCurrent = ev.year === highlightTickYear;
            return (
              <div
                key={`tick-${i}`}
                className="absolute -translate-x-1/2 rounded-full transition-all"
                style={{
                  top: TICK_TOP,
                  left: `${pctOf(ev.year)}%`,
                  width: isCurrent ? 12 : 8,
                  height: isCurrent ? 12 : 8,
                  marginTop: isCurrent ? -2 : 0,
                  background: isCurrent ? "var(--color-rust)" : "var(--color-sepia)",
                  boxShadow: isCurrent
                    ? "0 0 0 3px rgba(139,74,43,0.18)"
                    : undefined,
                }}
                title={`${ev.year} AD · ${ev.ru}`}
              />
            );
          })}

          {/* Year axis labels under track */}
          {YEAR_AXIS_TICKS.map((y) => (
            <div
              key={`axis-${y}`}
              className="absolute -translate-x-1/2 font-sans text-[11px] tracking-[0.1em] text-(--color-sepia-light)"
              style={{ top: AXIS_TOP, left: `${pctOf(y)}%` }}
            >
              {y}
            </div>
          ))}

          {/* Year tag + vertical guide + thumb knob — visible, positioned at current year */}
          <div
            className="pointer-events-none absolute z-[3] -translate-x-1/2"
            style={{ left: `${pctOf(year)}%`, top: TAG_TOP }}
          >
            <div className="absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap rounded-sm bg-(--color-rust) px-2.5 py-1 font-sans text-xs font-semibold tracking-[0.12em] text-(--color-parchment-light) shadow-[0_4px_12px_rgba(139,74,43,0.35)]">
              {year} н.э.
            </div>
            <div
              className="absolute -left-px h-9 w-0.5 bg-(--color-rust)/70"
              style={{ top: 22 }}
            />
            <div
              className="absolute h-5 w-5 -translate-x-1/2 rounded-full border-2 border-(--color-parchment-light) bg-(--color-rust) shadow-[0_3px_8px_rgba(139,74,43,0.45)]"
              style={{ top: TICK_TOP - 4, left: 0 }}
            />
          </div>

          {/* Invisible slider — captures pointer events across the whole track */}
          <input
            type="range"
            min={YEAR_RANGE.start}
            max={YEAR_RANGE.end}
            step={1}
            value={year}
            onChange={(e) => setScrubYear(Number.parseInt(e.target.value, 10))}
            onDoubleClick={() => setScrubYear(null)}
            aria-label="Год служения Павла"
            className="invisible-slider absolute z-[4] w-[calc(100%+12px)] opacity-[0.001]"
            style={{ top: INPUT_TOP, left: -6, right: -6, height: INPUT_HEIGHT }}
          />
        </div>

        {/* Context card — switches by what's true at current year */}
        {context.kind === "tick" && (
          <div className="border border-(--color-sepia-light) bg-(--color-parchment-light)/75 px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-medium leading-none text-(--color-ink) sm:text-[32px]">
                  {context.ev.year}
                </span>
                <span className="font-sans text-[10px] tracking-[0.2em] text-(--color-rust) sm:text-[11px]">
                  AD
                </span>
              </div>
              <div className="shrink-0 whitespace-nowrap text-sm font-medium italic text-(--color-rust) sm:text-[15px]">
                <ScriptureRef refText={context.ev.ref} />
              </div>
            </div>
            <div className="mt-2 leading-tight">
              <div className="text-base font-medium text-(--color-ink) sm:text-xl">
                {context.ev.ru}
              </div>
              <em className="mt-0.5 block text-[12px] text-(--color-sepia) sm:text-[13px]">
                {context.ev.en}
              </em>
            </div>
          </div>
        )}

        {context.kind === "span" && (
          <div className="border border-(--color-sepia-light) bg-(--color-parchment-light)/60 px-4 py-3 sm:px-6 sm:py-4">
            <div className="font-sans text-[10px] uppercase tracking-[0.25em] text-(--color-sepia)">
              Период · {context.span.start}–{context.span.end} н.э.
            </div>
            <div className="mt-1.5 text-base font-medium leading-tight text-(--color-ink) sm:text-xl">
              {context.span.label}
            </div>
            <em className="mt-1 block text-[12px] text-(--color-sepia) sm:text-[13px]">
              На этот год нет конкретного события — продолжается{" "}
              {context.span.label.toLowerCase()}.
            </em>
          </div>
        )}

        {context.kind === "between" && (
          <div className="border border-dashed border-(--color-sepia-light)/70 bg-(--color-parchment-light)/40 px-4 py-3 sm:px-6 sm:py-4">
            <div className="font-sans text-[10px] uppercase tracking-[0.25em] text-(--color-sepia)">
              Между событиями · {year} н.э.
            </div>
            <div className="mt-1 text-[13px] italic leading-snug text-(--color-sepia) sm:text-[14px]">
              На этот год нет датированного события в Писании.
            </div>
            <div className="mt-2 grid gap-2 text-[13px] text-(--color-ink-muted) sm:grid-cols-2 sm:text-[14px]">
              {context.prev && (
                <div>
                  <div className="font-sans text-[10px] uppercase tracking-[0.18em] text-(--color-sepia-light)">
                    Предыдущее ({context.prev.year} AD)
                  </div>
                  <button
                    type="button"
                    onClick={() => setScrubYear(context.prev!.year)}
                    className="mt-0.5 block text-left underline decoration-(--color-sepia-light)/40 decoration-dotted underline-offset-2 hover:text-(--color-ink)"
                  >
                    {context.prev.ru}
                  </button>
                </div>
              )}
              {context.next && (
                <div>
                  <div className="font-sans text-[10px] uppercase tracking-[0.18em] text-(--color-sepia-light)">
                    Следующее ({context.next.year} AD)
                  </div>
                  <button
                    type="button"
                    onClick={() => setScrubYear(context.next!.year)}
                    className="mt-0.5 block text-left underline decoration-(--color-sepia-light)/40 decoration-dotted underline-offset-2 hover:text-(--color-ink)"
                  >
                    {context.next.ru}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-3.5 flex items-center justify-between gap-3 text-[12px] text-(--color-sepia) sm:text-[13px]">
          <span className="min-w-0 truncate">
            Путешествие: <strong style={{ color: liveJourney.color }}>{liveJourney.ru}</strong>
          </span>
          <button
            type="button"
            onClick={() => setScrubYear(null)}
            className="shrink-0 border border-(--color-sepia-light) bg-transparent px-3 py-1 font-serif text-xs tracking-[0.08em] text-(--color-sepia) hover:bg-(--color-parchment-light)"
          >
            ⟲ Сброс
          </button>
        </div>
      </div>
    </div>
  );
}
