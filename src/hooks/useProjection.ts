import { useMemo } from "react";
import { geoPath, type GeoPath, type GeoProjection } from "d3-geo";
import { makeProjection } from "@/lib/geo/projection";

export function useProjection(): { proj: GeoProjection; pathGen: GeoPath } {
  const proj = useMemo(() => makeProjection(), []);
  const pathGen = useMemo(() => geoPath(proj), [proj]);
  return { proj, pathGen };
}
