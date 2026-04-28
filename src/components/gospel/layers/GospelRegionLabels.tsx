import type { GeoProjection } from "d3-geo";
import { project } from "@/lib/geo/projection";
import { FONT_FAMILIES } from "@/constants/design";

type RegionLabel = {
  ru: string;
  lat: number;
  lon: number;
  size: number;
  letterSpacing: number;
  opacity?: number;
  italic?: boolean;
};

const REGIONS: RegionLabel[] = [
  { ru: "СРЕДИЗЕМНОЕ МОРЕ", lat: 32.9, lon: 33.1, size: 16, letterSpacing: 6, opacity: 0.5 },
  { ru: "оз. Галилейское", lat: 32.79, lon: 35.62, size: 8, letterSpacing: 1, opacity: 0.7, italic: true },
  { ru: "МЁРТВОЕ МОРЕ", lat: 31.45, lon: 35.51, size: 8, letterSpacing: 2, opacity: 0.7, italic: true },
  { ru: "р. Иордан", lat: 32.30, lon: 35.46, size: 8, letterSpacing: 1, opacity: 0.65, italic: true },
];

export function GospelRegionLabels({ proj }: { proj: GeoProjection }) {
  return (
    <g pointerEvents="none">
      {REGIONS.map((r, i) => {
        const p = project(proj, r.lon, r.lat);
        return (
          <text
            key={i}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            fontFamily={FONT_FAMILIES.serif}
            fontStyle={r.italic ? "italic" : "normal"}
            fontSize={r.size}
            letterSpacing={r.letterSpacing}
            fill="var(--color-sepia)"
            opacity={r.opacity ?? 0.5}
            style={{
              paintOrder: "stroke",
              stroke: "var(--color-parchment)",
              strokeWidth: 3,
              strokeLinejoin: "round",
            }}
          >
            {r.ru}
          </text>
        );
      })}
    </g>
  );
}
