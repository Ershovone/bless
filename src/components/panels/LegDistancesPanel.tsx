"use client";

import { CITIES } from "@/data/cities";
import { JOURNEYS } from "@/data/journeys";
import { aggregateJourney, estimateLeg } from "@/lib/routes/estimateLeg";
import { useAtlasStore } from "@/hooks/useAtlasStore";
import { SectionLabel } from "@/components/layout/SectionLabel";
import type { RouteMode } from "@/types/atlas";

const SEA_GLYPH = "⚓";
const LAND_GLYPH = "⛰";
const SEA_LINE_BG = "repeating-linear-gradient(90deg, #3a6a8a 0 4px, transparent 4px 8px)";
const LAND_LINE_BG = "#8b5a2b";

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
      className="relative z-[2] mx-auto my-3.5 border border-(--color-sepia-light) bg-(--color-parchment-light)/55 px-7 py-5"
      style={{ width: "min(96%, 1200px)" }}
    >
      <SectionLabel className="mb-1.5">
        Расстояния пути · <em>Leg-by-Leg Distances</em>
      </SectionLabel>
      <div className="mb-4 text-[15px] italic text-(--color-sepia)">
        Всего ≈ {totalKm.toLocaleString("ru-RU")} км · ≈ {Math.round(totalDays)} дней в пути (без учёта стоянок)
      </div>
      <div className="grid gap-y-2 gap-x-7 sm:grid-cols-2">
        {journey.route.slice(0, -1).map((id, i) => {
          const leg = estimateLeg(id, journey.route[i + 1], CITIES);
          return (
            <div
              key={i}
              className="grid items-center gap-2 text-sm"
              style={{ gridTemplateColumns: "minmax(110px, 1fr) minmax(130px, 1.2fr) minmax(110px, 1fr)" }}
            >
              <div className="flex flex-col items-end text-right leading-tight">
                <span className="text-[15px] font-medium text-(--color-ink)">{CITIES[id].en}</span>
                <span className="mt-0.5 text-[11px] italic tracking-[0.08em]" style={{ color: modeColor(leg.mode) }}>
                  {modeGlyph(leg.mode)} {modeLabel(leg.mode)}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className="mb-0.5 h-0.5 w-full opacity-70"
                  style={{ background: leg.mode === "sea" ? SEA_LINE_BG : LAND_LINE_BG }}
                />
                <div className="flex flex-col items-center font-sans">
                  <div className="text-xs font-semibold tracking-[0.05em] text-(--color-ink)">
                    {leg.km.toLocaleString("ru-RU")} км
                  </div>
                  <div className="font-serif text-[10px] italic text-(--color-sepia-light)">
                    ≈ {formatDays(leg.days)} дн.
                  </div>
                </div>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[15px] font-medium text-(--color-ink)">
                  {CITIES[journey.route[i + 1]].en}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
