import { useMemo } from "react";
import type { GeoProjection } from "d3-geo";
import { REGION_LABELS } from "@/constants/labels";
import { project } from "@/lib/geo/projection";
import { FONT_FAMILIES } from "@/constants/design";

type ProjectedRegion = (typeof REGION_LABELS)[number] & { x: number; y: number };

const DEFAULT_SEA_OPACITY = 0.35;
const DEFAULT_PROV_OPACITY = 0.6;
const SEA_STROKE_WIDTH = 0;
const TEXT_STROKE_WIDTH = 2.5;

export function RegionLabels({ proj }: { proj: GeoProjection }) {
  const regions = useMemo<ProjectedRegion[]>(
    () => REGION_LABELS.map((r) => ({ ...r, ...project(proj, r.lon, r.lat) })),
    [proj],
  );

  return (
    <g fontFamily={FONT_FAMILIES.serif} style={{ pointerEvents: "none" }}>
      {regions.map((r, i) => {
        const isSea = r.tier === "sea";
        const fallbackOpacity = isSea ? DEFAULT_SEA_OPACITY : DEFAULT_PROV_OPACITY;
        return (
          <text
            key={`region-${i}`}
            x={r.x}
            y={r.y}
            textAnchor="middle"
            fontSize={r.size}
            letterSpacing={r.letterSpacing}
            opacity={r.opacity ?? fallbackOpacity}
            fontStyle={isSea ? "italic" : "normal"}
            fontWeight={isSea ? 400 : 500}
            fill={isSea ? "var(--color-sepia)" : "var(--color-ink-muted)"}
            style={{
              paintOrder: "stroke",
              stroke: "var(--color-parchment)",
              strokeWidth: isSea ? SEA_STROKE_WIDTH : TEXT_STROKE_WIDTH,
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
