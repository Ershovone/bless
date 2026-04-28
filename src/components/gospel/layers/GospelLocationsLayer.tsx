"use client";

import { useMemo } from "react";
import type { GeoProjection } from "d3-geo";
import { GOSPEL_LOCATIONS, GOSPEL_LOCATION_IDS } from "@/data/gospel/locations";
import type { GospelLocationId, GospelLocationKind, LabelDir } from "@/types/gospel";
import { FONT_FAMILIES } from "@/constants/design";
import { project } from "@/lib/geo/projection";
import { useGospelStore } from "@/hooks/useGospelStore";

type ProjectedLocation = {
  id: GospelLocationId;
  ru: string;
  shortLabel?: string;
  en: string;
  x: number;
  y: number;
  kind: GospelLocationKind;
  isMountain: boolean;
  labelDir: LabelDir;
  secondary: boolean;
};

type LabelOffset = {
  dx: number;
  dy: number;
  anchor: "start" | "middle" | "end";
};

const LABEL_OFFSETS: Record<LabelDir, LabelOffset> = {
  N:  { dx: 0,  dy: -8,  anchor: "middle" },
  S:  { dx: 0,  dy: 13,  anchor: "middle" },
  E:  { dx: 7,  dy: 3,   anchor: "start" },
  W:  { dx: -7, dy: 3,   anchor: "end" },
  NE: { dx: 6,  dy: -5,  anchor: "start" },
  NW: { dx: -6, dy: -5,  anchor: "end" },
  SE: { dx: 6,  dy: 10,  anchor: "start" },
  SW: { dx: -6, dy: 10,  anchor: "end" },
};

type GospelLocationsLayerProps = {
  proj: GeoProjection;
  activeLocations: Set<GospelLocationId>;
};

export function GospelLocationsLayer({ proj, activeLocations }: GospelLocationsLayerProps) {
  const hover = useGospelStore((s) => s.hoverLocation);
  const setHover = useGospelStore((s) => s.setHoverLocation);
  const setSelected = useGospelStore((s) => s.setSelectedLocation);

  const projected = useMemo<ProjectedLocation[]>(
    () =>
      GOSPEL_LOCATION_IDS.map((id) => {
        const l = GOSPEL_LOCATIONS[id];
        const p = project(proj, l.lon, l.lat);
        return {
          id,
          ru: l.ru,
          shortLabel: l.shortLabel,
          en: l.en,
          x: p.x,
          y: p.y,
          kind: l.kind,
          isMountain: l.kind === "mountain",
          labelDir: l.labelDir ?? "N",
          secondary: l.secondary ?? false,
        };
      }),
    [proj],
  );

  return (
    <>
      {projected.map((c) => {
        const inActive = activeLocations.has(c.id);
        const isHovered = hover === c.id;
        const showLabel = isHovered || (inActive && !c.secondary);
        const offset = LABEL_OFFSETS[c.labelDir];
        const labelText = c.shortLabel ?? c.ru;

        return (
          <g
            key={c.id}
            transform={`translate(${c.x}, ${c.y})`}
            onMouseEnter={() => setHover(c.id)}
            onMouseLeave={() => setHover(null)}
            onClick={(e) => {
              e.stopPropagation();
              setSelected(c.id);
            }}
            style={{ cursor: "pointer" }}
          >
            <circle r="12" fill="transparent" />

            {c.isMountain ? (
              <g>
                <polygon
                  points={`0,${inActive ? -5 : -3.5} ${inActive ? 4.5 : 3},${inActive ? 3 : 2} ${inActive ? -4.5 : -3},${inActive ? 3 : 2}`}
                  fill={inActive ? "var(--color-rust)" : "var(--color-sepia-light)"}
                  fillOpacity={inActive ? 1 : 0.7}
                  stroke={inActive ? "var(--color-rust)" : "none"}
                  strokeWidth={0.8}
                />
              </g>
            ) : inActive ? (
              <>
                <circle r={isHovered ? 3.6 : 2.8} fill="var(--color-ink)" />
                <circle
                  r={isHovered ? 5.8 : 4.4}
                  fill="none"
                  stroke="var(--color-rust)"
                  strokeWidth="0.7"
                  opacity="0.7"
                />
              </>
            ) : (
              <>
                <circle
                  r={isHovered ? 3 : 1.8}
                  fill="var(--color-sepia-light)"
                  opacity={isHovered ? 0.9 : 0.55}
                />
                {isHovered && (
                  <circle
                    r="4.5"
                    fill="none"
                    stroke="var(--color-sepia-light)"
                    strokeWidth="0.6"
                    opacity="0.6"
                  />
                )}
              </>
            )}

            {showLabel && (
              <text
                x={offset.dx}
                y={offset.dy}
                textAnchor={offset.anchor}
                fontSize={inActive ? 10 : 8.5}
                fontFamily={FONT_FAMILIES.serif}
                fontStyle="italic"
                fontWeight={inActive ? 500 : 400}
                fill={inActive ? "var(--color-ink)" : "var(--color-sepia)"}
                opacity={inActive ? 1 : 0.7}
                style={{
                  pointerEvents: "none",
                  paintOrder: "stroke",
                  stroke: "var(--color-parchment)",
                  strokeWidth: 2.8,
                  strokeLinejoin: "round",
                }}
              >
                {labelText}
              </text>
            )}
          </g>
        );
      })}
    </>
  );
}
