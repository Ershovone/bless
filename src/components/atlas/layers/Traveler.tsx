"use client";

import type { GeoProjection } from "d3-geo";
import { useMemo } from "react";
import { CITIES } from "@/data/cities";
import { useAtlasStore } from "@/hooks/useAtlasStore";
import { interpolateRoute } from "@/lib/geo/bezier";
import type { CityId } from "@/types/atlas";

type TravelerProps = {
  route: CityId[];
  proj: GeoProjection;
};

export function Traveler({ route, proj }: TravelerProps) {
  const playing = useAtlasStore((s) => s.playing);
  const playT = useAtlasStore((s) => s.playT);

  const position = useMemo(
    () => interpolateRoute(route, CITIES, proj, playT),
    [route, proj, playT],
  );

  if (!playing) return null;

  return (
    <g transform={`translate(${position.x}, ${position.y})`} style={{ pointerEvents: "none" }}>
      <circle r="8" fill="var(--color-rust)" opacity="0.3" />
      <circle r="4" fill="var(--color-amber)" stroke="var(--color-ink)" strokeWidth="1" />
    </g>
  );
}
