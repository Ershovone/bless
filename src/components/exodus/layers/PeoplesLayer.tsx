"use client";

import { useMemo } from "react";
import type { GeoProjection } from "d3-geo";
import { EXODUS_PEOPLES } from "@/data/exodus/peoples";
import type { PeopleId } from "@/types/exodus";
import { FONT_FAMILIES } from "@/constants/design";
import { project } from "@/lib/geo/projection";
import { useExodusStore } from "@/hooks/useExodusStore";

type ProjectedPeople = {
  id: PeopleId;
  ru_label: string;
  polygonD: string;
  labelX: number;
  labelY: number;
  labelSize: number;
  color: string;
};

const LABEL_BASE_SIZE = 13;
const POLY_FILL_OPACITY = 0.22;
const POLY_FILL_OPACITY_HOVER = 0.42;
const POLY_STROKE_OPACITY = 0.75;

export function PeoplesLayer({ proj }: { proj: GeoProjection }) {
  const showPeoples = useExodusStore((s) => s.showPeoples);
  const selected = useExodusStore((s) => s.selectedPeople);
  const setSelected = useExodusStore((s) => s.setSelectedPeople);

  const projected = useMemo<ProjectedPeople[]>(() => {
    return EXODUS_PEOPLES.map((p) => {
      const pts = p.territory.map(([lon, lat]) => project(proj, lon, lat));
      const d =
        pts.length === 0
          ? ""
          : `M ${pts.map((pt) => `${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`).join(" L ")} Z`;
      const labelP = project(proj, p.centroid[0], p.centroid[1]);
      return {
        id: p.id,
        ru_label: p.ru_label,
        polygonD: d,
        labelX: labelP.x,
        labelY: labelP.y,
        labelSize: LABEL_BASE_SIZE,
        color: p.color,
      };
    });
  }, [proj]);

  if (!showPeoples) return null;

  return (
    <g>
      {projected.map((p) => {
        const isSelected = selected === p.id;
        return (
          <path
            key={`fill-${p.id}`}
            d={p.polygonD}
            fill={p.color}
            fillOpacity={isSelected ? POLY_FILL_OPACITY_HOVER : POLY_FILL_OPACITY}
            stroke={p.color}
            strokeOpacity={POLY_STROKE_OPACITY}
            strokeWidth={isSelected ? 2.4 : 1.4}
            strokeDasharray={isSelected ? undefined : "3 3"}
            onClick={(e) => {
              e.stopPropagation();
              setSelected(p.id);
            }}
            style={{ cursor: "pointer", transition: "fill-opacity 160ms ease" }}
          />
        );
      })}
      {projected.map((p) => (
        <text
          key={`lbl-${p.id}`}
          x={p.labelX}
          y={p.labelY}
          textAnchor="middle"
          fontFamily={FONT_FAMILIES.serif}
          fontSize={p.labelSize}
          letterSpacing={4}
          fill="var(--color-ink-muted)"
          opacity={selected === p.id ? 1 : 0.7}
          style={{
            pointerEvents: "none",
            paintOrder: "stroke",
            stroke: "var(--color-parchment)",
            strokeWidth: 3.5,
            strokeLinejoin: "round",
          }}
        >
          {p.ru_label}
        </text>
      ))}
    </g>
  );
}
