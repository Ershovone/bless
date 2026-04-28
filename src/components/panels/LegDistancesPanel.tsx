"use client";

import { Fragment } from "react";
import { CITIES } from "@/data/cities";
import { JOURNEYS } from "@/data/journeys";
import { aggregateJourney, estimateLeg } from "@/lib/routes/estimateLeg";
import { useAtlasStore } from "@/hooks/useAtlasStore";
import { SectionLabel } from "@/components/layout/SectionLabel";
import type { RouteMode } from "@/types/atlas";

const SEA_GLYPH = "⚓";
const LAND_GLYPH = "⛰";

function modeLabel(mode: RouteMode): string {
  return mode === "sea" ? "морем" : "сушей";
}

function modeGlyph(mode: RouteMode): string {
  return mode === "sea" ? SEA_GLYPH : LAND_GLYPH;
}

function modeColor(mode: RouteMode): string {
  return mode === "sea" ? "var(--color-modern-blue)" : "var(--color-rust)";
}

function formatDays(days: number): string {
  return days < 1 ? "< 1" : String(Math.round(days));
}

export function LegDistancesPanel() {
  const activeJ = useAtlasStore((s) => s.activeJ);
  const journey = JOURNEYS[activeJ];
  const { totalKm, totalDays } = aggregateJourney(journey.route, CITIES);

  return (
    <div
      className="relative z-[2] mx-auto my-3.5 border border-(--color-sepia-light) bg-(--color-parchment-light)/55 px-4 py-4 sm:px-7 sm:py-5"
      style={{ width: "min(96%, 1200px)" }}
    >
      <SectionLabel className="mb-1.5">
        Расстояния пути · <em>Leg-by-Leg Distances</em>
      </SectionLabel>
      <div className="mb-4 text-[14px] italic text-(--color-sepia) sm:text-[15px]">
        Всего ≈ {totalKm.toLocaleString("ru-RU")} км · ≈ {Math.round(totalDays)} дней в пути (без учёта стоянок)
      </div>

      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2.5">
        {journey.route.map((id, i) => {
          const city = CITIES[id];
          const isLast = i === journey.route.length - 1;
          const leg = isLast ? null : estimateLeg(id, journey.route[i + 1], CITIES);
          return (
            <Fragment key={`${id}-${i}`}>
              <span className="inline-flex flex-col items-center rounded-sm border border-(--color-sepia-light) bg-(--color-parchment-light)/75 px-2.5 py-1 leading-tight">
                <span className="whitespace-nowrap text-[13px] font-medium text-(--color-ink) sm:text-[14px]">
                  {city.en}
                </span>
                <span className="whitespace-nowrap text-[10px] italic text-(--color-sepia) sm:text-[11px]">
                  {city.ru}
                </span>
              </span>
              {leg && (
                <span
                  className="inline-flex items-center gap-1 whitespace-nowrap font-sans text-[11px] sm:text-[12px]"
                  style={{ color: modeColor(leg.mode) }}
                  title={`${leg.km} км · ≈ ${formatDays(leg.days)} дн. · ${modeLabel(leg.mode)}`}
                >
                  <span aria-hidden>{modeGlyph(leg.mode)}</span>
                  <span className="font-semibold">{leg.km.toLocaleString("ru-RU")} км</span>
                  <span className="opacity-60">·</span>
                  <span className="font-serif italic opacity-80">
                    ≈ {formatDays(leg.days)} дн.
                  </span>
                  <span aria-hidden className="text-[14px] leading-none opacity-70">→</span>
                </span>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
