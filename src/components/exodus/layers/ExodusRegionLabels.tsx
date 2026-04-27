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
  { ru: "СРЕДИЗЕМНОЕ МОРЕ", lat: 32.5, lon: 32.5, size: 16, letterSpacing: 6, opacity: 0.5 },
  { ru: "ЧЕРМНОЕ МОРЕ", lat: 28.5, lon: 33.0, size: 12, letterSpacing: 5, opacity: 0.55, italic: true },
  { ru: "ЗАЛИВ АКАБА", lat: 28.8, lon: 35.0, size: 9, letterSpacing: 3, opacity: 0.5, italic: true },
  { ru: "СИНАЙ", lat: 29.5, lon: 33.7, size: 18, letterSpacing: 8, opacity: 0.45 },
  { ru: "ПУСТЫНЯ ФАРАН", lat: 30.0, lon: 34.5, size: 11, letterSpacing: 4, opacity: 0.4 },
  { ru: "ЕГИПЕТ", lat: 29.5, lon: 30.5, size: 22, letterSpacing: 10, opacity: 0.4 },
  { ru: "АРАВИЯ", lat: 28.0, lon: 36.5, size: 18, letterSpacing: 8, opacity: 0.4 },
  { ru: "ХАНААН", lat: 32.2, lon: 35.0, size: 16, letterSpacing: 6, opacity: 0.45 },
  { ru: "МЁРТВОЕ МОРЕ", lat: 31.4, lon: 35.45, size: 8, letterSpacing: 2, opacity: 0.6, italic: true },
  { ru: "р. Иордан", lat: 31.95, lon: 35.55, size: 8, letterSpacing: 1, opacity: 0.55, italic: true },
  { ru: "р. Нил", lat: 28.0, lon: 31.5, size: 9, letterSpacing: 1, opacity: 0.5, italic: true },
];

export function ExodusRegionLabels({ proj }: { proj: GeoProjection }) {
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
