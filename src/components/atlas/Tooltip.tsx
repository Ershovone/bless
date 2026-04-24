"use client";

import type { GeoProjection } from "d3-geo";
import { CITIES } from "@/data/cities";
import { MAP_SIZE } from "@/constants/map";
import { project } from "@/lib/geo/projection";
import { useAtlasStore } from "@/hooks/useAtlasStore";

const Y_SCALE = 0.55;
const Y_OFFSET = 0.22;

export function Tooltip({ proj }: { proj: GeoProjection }) {
  const hoverCity = useAtlasStore((s) => s.hoverCity);
  if (!hoverCity || !CITIES[hoverCity]) return null;
  const city = CITIES[hoverCity];
  const p = project(proj, city.lon, city.lat);

  return (
    <div
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[110%] border border-(--color-sepia-light) bg-(--color-parchment-light) px-4 py-3 text-center shadow-[0_8px_24px_rgba(74,50,30,0.35)]"
      style={{
        left: `${(p.x / MAP_SIZE.width) * 100}%`,
        top: `${((p.y / MAP_SIZE.height) * Y_SCALE + Y_OFFSET) * 100}%`,
        minWidth: 160,
      }}
    >
      <div className="mb-1 font-sans text-[9px] tracking-[0.3em] text-(--color-rust)">
        CIVITAS · ГОРОД
      </div>
      <div className="text-lg font-medium">{city.ru}</div>
      <div className="text-[13px] italic text-(--color-sepia)">{city.en}</div>
      {city.note && (
        <div className="mt-2 border-t border-dotted border-(--color-sepia-light) pt-2 text-xs text-(--color-ink-muted)">
          {city.note}
        </div>
      )}
      <div className="mt-2 font-sans text-[10px] tracking-[0.08em] text-(--color-sepia-light)">
        {city.lat.toFixed(1)}°N · {city.lon.toFixed(1)}°E
      </div>
    </div>
  );
}
