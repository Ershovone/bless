"use client";

import { useMemo } from "react";
import type { GeoProjection } from "d3-geo";
import type { City, CityId } from "@/types/atlas";
import { CITIES } from "@/data/cities";
import { EPISTLES } from "@/data/epistles";
import { LABEL_OFFSETS } from "@/constants/labels";
import { FONT_FAMILIES } from "@/constants/design";
import { project } from "@/lib/geo/projection";
import { useAtlasStore } from "@/hooks/useAtlasStore";
import { EpistleIcon } from "./EpistleIcon";

type ProjectedCity = City & { id: CityId; x: number; y: number };

const DEFAULT_OFFSET_ON_ROUTE = { dx: 0, dy: -14 };
const DEFAULT_OFFSET_OFF_ROUTE = { dx: 0, dy: -8 };
const ANCHOR_THRESHOLD = 5;

function labelAnchor(dx: number): "start" | "middle" | "end" {
  if (dx < -ANCHOR_THRESHOLD) return "end";
  if (dx > ANCHOR_THRESHOLD) return "start";
  return "middle";
}

type CitiesLayerProps = {
  proj: GeoProjection;
  route: CityId[];
};

export function CitiesLayer({ proj, route }: CitiesLayerProps) {
  const hoverCity = useAtlasStore((s) => s.hoverCity);
  const setHoverCity = useAtlasStore((s) => s.setHoverCity);
  const setSelectedCity = useAtlasStore((s) => s.setSelectedCity);

  const visibleCities = useMemo<ProjectedCity[]>(
    () =>
      Object.keys(CITIES).map((id) => ({
        id,
        ...CITIES[id],
        ...project(proj, CITIES[id].lon, CITIES[id].lat),
      })),
    [proj],
  );

  const routeStart = route[0];
  const routeEnd = route[route.length - 1];
  const routeSet = useMemo(() => new Set(route), [route]);

  return (
    <>
      {visibleCities.map((c) => {
        const inRoute = routeSet.has(c.id);
        const isStart = routeStart === c.id;
        const isEnd = routeEnd === c.id;
        const isEndpoint = isStart || isEnd;
        const isHovered = hoverCity === c.id;
        const hasEpistle = Boolean(EPISTLES[c.id]);
        const offset = LABEL_OFFSETS[c.id] ?? (inRoute ? DEFAULT_OFFSET_ON_ROUTE : DEFAULT_OFFSET_OFF_ROUTE);

        return (
          <g
            key={c.id}
            transform={`translate(${c.x}, ${c.y})`}
            onMouseEnter={() => setHoverCity(c.id)}
            onMouseLeave={() => setHoverCity(null)}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCity(c.id);
            }}
            style={{ cursor: "pointer" }}
          >
            <circle r="16" fill="transparent" />

            {inRoute && isEndpoint ? (
              <g>
                <circle r="7" fill="var(--color-rust)" />
                <circle r="11" fill="none" stroke="var(--color-rust)" strokeWidth="1" />
                <path
                  d="M 0,-15 L 0,-8 M -15,0 L -8,0 M 15,0 L 8,0 M 0,15 L 0,8"
                  stroke="var(--color-rust)"
                  strokeWidth="1"
                />
              </g>
            ) : inRoute ? (
              <>
                <circle r={isHovered ? 5 : 3.5} fill="var(--color-ink)" />
                <circle
                  r={isHovered ? 8 : 5.5}
                  fill="none"
                  stroke="var(--color-rust)"
                  strokeWidth="0.8"
                  opacity="0.6"
                />
              </>
            ) : (
              <>
                <circle r={isHovered ? 4 : 2.5} fill="var(--color-sepia-light)" opacity={isHovered ? 0.9 : 0.6} />
                {isHovered && <circle r="6" fill="none" stroke="var(--color-sepia-light)" strokeWidth="0.7" opacity="0.6" />}
              </>
            )}

            {hasEpistle && <EpistleIcon />}

            <text
              x={offset.dx}
              y={offset.dy}
              textAnchor={labelAnchor(offset.dx)}
              fontSize={inRoute ? (isEndpoint ? 16 : 13) : 10}
              fontFamily={FONT_FAMILIES.serif}
              fontStyle="italic"
              fontWeight={isEndpoint ? 500 : 400}
              fill={inRoute ? "var(--color-ink)" : "var(--color-sepia)"}
              opacity={inRoute ? 1 : 0.55}
              style={{
                pointerEvents: "none",
                paintOrder: "stroke",
                stroke: "var(--color-parchment)",
                strokeWidth: 3.5,
                strokeLinejoin: "round",
              }}
            >
              {c.en}
            </text>
          </g>
        );
      })}
    </>
  );
}
