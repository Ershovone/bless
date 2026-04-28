import { useMemo } from "react";
import { geoPath, type GeoPath, type GeoProjection } from "d3-geo";
import {
  GOSPEL_MAP_BOUNDS,
  GOSPEL_MAP_SIZE,
  JERUSALEM_MAP_BOUNDS,
  JERUSALEM_MAP_SIZE,
} from "@/data/gospel/mapConstants";
import { makeProjection } from "@/lib/geo/projection";

export function useGospelProjection(): { proj: GeoProjection; pathGen: GeoPath } {
  const proj = useMemo(() => makeProjection(GOSPEL_MAP_BOUNDS, GOSPEL_MAP_SIZE), []);
  const pathGen = useMemo(() => geoPath(proj), [proj]);
  return { proj, pathGen };
}

export function useJerusalemProjection(): { proj: GeoProjection; pathGen: GeoPath } {
  const proj = useMemo(() => makeProjection(JERUSALEM_MAP_BOUNDS, JERUSALEM_MAP_SIZE), []);
  const pathGen = useMemo(() => geoPath(proj), [proj]);
  return { proj, pathGen };
}
