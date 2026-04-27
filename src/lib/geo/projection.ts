import { geoMercator, type GeoProjection } from "d3-geo";
import { MAP_BOUNDS, MAP_SIZE } from "@/constants/map";
import type { Point } from "@/types/atlas";

type Bounds = {
  lonMin: number;
  lonMax: number;
  latMin: number;
  latMax: number;
};

type Size = { width: number; height: number };

export function makeProjection(
  bounds: Bounds = MAP_BOUNDS,
  size: Size = MAP_SIZE,
): GeoProjection {
  const { lonMin, lonMax, latMin, latMax } = bounds;
  return geoMercator().fitSize(
    [size.width, size.height],
    {
      type: "Polygon",
      coordinates: [[
        [lonMin, latMin],
        [lonMin, latMax],
        [lonMax, latMax],
        [lonMax, latMin],
        [lonMin, latMin],
      ]],
    },
  );
}

export function project(proj: GeoProjection, lon: number, lat: number): Point {
  const p = proj([lon, lat]);
  if (!p) return { x: 0, y: 0 };
  return { x: p[0], y: p[1] };
}
