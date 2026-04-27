"use client";

import { useMemo } from "react";
import type { GeoProjection } from "d3-geo";
import { EXODUS_STATIONS, EXODUS_STATION_ORDER } from "@/data/exodus/stations";
import type { ExodusStationConfidence, ExodusStationId } from "@/types/exodus";
import { FONT_FAMILIES } from "@/constants/design";
import { project } from "@/lib/geo/projection";
import { useExodusStore } from "@/hooks/useExodusStore";

type ProjectedStation = {
  id: ExodusStationId;
  ru: string;
  en: string;
  x: number;
  y: number;
  isStart: boolean;
  isEnd: boolean;
  confidence: ExodusStationConfidence;
};

type ExodusStationsLayerProps = {
  proj: GeoProjection;
  activeStations: Set<ExodusStationId>;
};

const LABEL_OFFSET_Y_ON = -14;
const LABEL_OFFSET_Y_OFF = -10;

export function ExodusStationsLayer({ proj, activeStations }: ExodusStationsLayerProps) {
  const hover = useExodusStore((s) => s.hoverStation);
  const setHover = useExodusStore((s) => s.setHoverStation);
  const setSelected = useExodusStore((s) => s.setSelectedStation);

  const projected = useMemo<ProjectedStation[]>(
    () =>
      EXODUS_STATION_ORDER.map((id, i) => {
        const s = EXODUS_STATIONS[id];
        const p = project(proj, s.lon, s.lat);
        return {
          id,
          ru: s.ru,
          en: s.en,
          x: p.x,
          y: p.y,
          isStart: i === 0,
          isEnd: i === EXODUS_STATION_ORDER.length - 1,
          confidence: s.confidence ?? "approximate",
        };
      }),
    [proj],
  );

  return (
    <>
      {projected.map((c) => {
        const inActive = activeStations.has(c.id);
        const isHovered = hover === c.id;
        const isEndpoint = c.isStart || c.isEnd;
        const isKnown = c.confidence === "known";
        const showLabel = isKnown || (inActive && (isEndpoint || isHovered));

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
            <circle r="14" fill="transparent" />

            {inActive && isEndpoint && isKnown ? (
              <g>
                <circle r="7" fill="var(--color-rust)" />
                <circle r="11" fill="none" stroke="var(--color-rust)" strokeWidth="1" />
                <path
                  d="M 0,-15 L 0,-8 M -15,0 L -8,0 M 15,0 L 8,0 M 0,15 L 0,8"
                  stroke="var(--color-rust)"
                  strokeWidth="1"
                />
              </g>
            ) : inActive && isKnown ? (
              <>
                <circle r={isHovered ? 5 : 3.8} fill="var(--color-ink)" />
                <circle
                  r={isHovered ? 8 : 6}
                  fill="none"
                  stroke="var(--color-rust)"
                  strokeWidth="0.8"
                  opacity="0.6"
                />
              </>
            ) : inActive && !isKnown ? (
              <>
                <circle r={isHovered ? 3.5 : 2.2} fill="var(--color-rust)" opacity="0.85" />
                {isHovered && (
                  <circle
                    r="6"
                    fill="none"
                    stroke="var(--color-rust)"
                    strokeWidth="0.6"
                    opacity="0.5"
                  />
                )}
              </>
            ) : isKnown ? (
              <>
                <circle
                  r={isHovered ? 4 : 2.8}
                  fill="var(--color-sepia-light)"
                  opacity={isHovered ? 0.9 : 0.65}
                />
                {isHovered && (
                  <circle
                    r="6"
                    fill="none"
                    stroke="var(--color-sepia-light)"
                    strokeWidth="0.7"
                    opacity="0.6"
                  />
                )}
              </>
            ) : (
              <>
                <circle
                  r={isHovered ? 2.8 : 1.4}
                  fill="var(--color-sepia-light)"
                  opacity={isHovered ? 0.85 : 0.45}
                />
                {isHovered && (
                  <circle
                    r="5"
                    fill="none"
                    stroke="var(--color-sepia-light)"
                    strokeWidth="0.5"
                    opacity="0.5"
                  />
                )}
              </>
            )}

            {showLabel && (
              <text
                y={inActive ? LABEL_OFFSET_Y_ON : LABEL_OFFSET_Y_OFF}
                textAnchor="middle"
                fontSize={inActive ? (isEndpoint ? 14 : 11) : 9}
                fontFamily={FONT_FAMILIES.serif}
                fontStyle="italic"
                fontWeight={isEndpoint ? 500 : 400}
                fill={inActive ? "var(--color-ink)" : "var(--color-sepia)"}
                opacity={inActive ? 1 : 0.55}
                style={{
                  pointerEvents: "none",
                  paintOrder: "stroke",
                  stroke: "var(--color-parchment)",
                  strokeWidth: 3.5,
                  strokeLinejoin: "round",
                }}
              >
                {c.ru}
              </text>
            )}
          </g>
        );
      })}
    </>
  );
}
