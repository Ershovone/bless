import type { GeoProjection } from "d3-geo";
import {
  GRATICULE_LABEL_LATS,
  GRATICULE_LABEL_LONS,
  GRATICULE_LATS,
  GRATICULE_LONS,
  MAP_BOUNDS,
} from "@/constants/map";
import { project } from "@/lib/geo/projection";
import { FONT_FAMILIES } from "@/constants/design";

export function Graticule({ proj }: { proj: GeoProjection }) {
  const { lonMin, lonMax, latMin, latMax } = MAP_BOUNDS;

  return (
    <>
      <g stroke="var(--color-hatch)" strokeWidth="0.3" fill="none" opacity="0.2" strokeDasharray="1 3">
        {GRATICULE_LONS.map((lon) => {
          const a = project(proj, lon, latMin);
          const b = project(proj, lon, latMax);
          return <line key={`lon-${lon}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />;
        })}
        {GRATICULE_LATS.map((lat) => {
          const a = project(proj, lonMin, lat);
          const b = project(proj, lonMax, lat);
          return <line key={`lat-${lat}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />;
        })}
      </g>

      <g
        fontSize="10"
        fontFamily={FONT_FAMILIES.sans}
        fill="var(--color-sepia)"
        opacity="0.6"
        letterSpacing="2"
      >
        {GRATICULE_LABEL_LONS.map((lon) => {
          const p = project(proj, lon, latMax);
          return (
            <text key={`ll-${lon}`} x={p.x} y={14} textAnchor="middle">
              {lon}° E
            </text>
          );
        })}
        {GRATICULE_LABEL_LATS.map((lat) => {
          const p = project(proj, lonMin, lat);
          return (
            <text key={`lt-${lat}`} x={14} y={p.y + 4}>
              {lat}° N
            </text>
          );
        })}
      </g>
    </>
  );
}
