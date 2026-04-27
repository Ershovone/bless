import { useMemo } from "react";
import { geoPath, type GeoPath, type GeoProjection } from "d3-geo";
import { EXODUS_MAP_BOUNDS, EXODUS_MAP_SIZE } from "@/data/exodus/mapConstants";
import { makeProjection } from "@/lib/geo/projection";

export function useExodusProjection(): { proj: GeoProjection; pathGen: GeoPath } {
  const proj = useMemo(() => makeProjection(EXODUS_MAP_BOUNDS, EXODUS_MAP_SIZE), []);
  const pathGen = useMemo(() => geoPath(proj), [proj]);
  return { proj, pathGen };
}
