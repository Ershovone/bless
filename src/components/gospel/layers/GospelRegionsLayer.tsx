"use client";

import { useMemo } from "react";
import type { GeoProjection } from "d3-geo";
import { GOSPEL_REGIONS } from "@/data/gospel/regions";
import type { GospelRegionId } from "@/types/gospel";
import { FONT_FAMILIES } from "@/constants/design";
import { project } from "@/lib/geo/projection";
import { useGospelStore } from "@/hooks/useGospelStore";

type ProjectedRegion = {
  id: GospelRegionId;
  ru_label: string;
  polygonD: string;
  labelX: number;
  labelY: number;
  color: string;
};

const LABEL_BASE_SIZE = 12;
const POLY_FILL_OPACITY = 0.18;
const POLY_FILL_OPACITY_HOVER = 0.38;
const POLY_STROKE_OPACITY = 0.7;

export function GospelRegionsLayer({ proj }: { proj: GeoProjection }) {
  const showRegions = useGospelStore((s) => s.showRegions);
  const selected = useGospelStore((s) => s.selectedRegion);
  const setSelected = useGospelStore((s) => s.setSelectedRegion);

  const projected = useMemo<ProjectedRegion[]>(() => {
    return GOSPEL_REGIONS.map((r) => {
      const pts = r.territory.map(([lon, lat]) => project(proj, lon, lat));
      const d =
        pts.length === 0
          ? ""
          : `M ${pts.map((pt) => `${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`).join(" L ")} Z`;
      const labelP = project(proj, r.centroid[0], r.centroid[1]);
      return {
        id: r.id,
        ru_label: r.ru_label,
        polygonD: d,
        labelX: labelP.x,
        labelY: labelP.y,
        color: r.color,
      };
    });
  }, [proj]);

  if (!showRegions) return null;

  return (
    <g>
      {projected.map((r) => {
        const isSelected = selected === r.id;
        return (
          <path
            key={`fill-${r.id}`}
            d={r.polygonD}
            fill={r.color}
            fillOpacity={isSelected ? POLY_FILL_OPACITY_HOVER : POLY_FILL_OPACITY}
            stroke={r.color}
            strokeOpacity={POLY_STROKE_OPACITY}
            strokeWidth={isSelected ? 2.4 : 1.2}
            strokeDasharray={isSelected ? undefined : "3 3"}
            onClick={(e) => {
              e.stopPropagation();
              setSelected(r.id);
            }}
            style={{ cursor: "pointer", transition: "fill-opacity 160ms ease" }}
          />
        );
      })}
      {projected.map((r) => (
        <text
          key={`lbl-${r.id}`}
          x={r.labelX}
          y={r.labelY}
          textAnchor="middle"
          fontFamily={FONT_FAMILIES.serif}
          fontSize={LABEL_BASE_SIZE}
          letterSpacing={4}
          fill="var(--color-ink-muted)"
          opacity={selected === r.id ? 1 : 0.7}
          style={{
            pointerEvents: "none",
            paintOrder: "stroke",
            stroke: "var(--color-parchment)",
            strokeWidth: 3.5,
            strokeLinejoin: "round",
          }}
        >
          {r.ru_label}
        </text>
      ))}
    </g>
  );
}
