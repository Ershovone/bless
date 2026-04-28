import type { GeoProjection } from "d3-geo";
import { GOSPEL_MAP_BOUNDS } from "@/data/gospel/mapConstants";
import { project } from "@/lib/geo/projection";
import { FONT_FAMILIES } from "@/constants/design";

const LON_TICKS = [31, 32, 33, 34, 35, 36, 37];
const LAT_TICKS = [30, 31, 32, 33, 34];

export function GospelGraticule({ proj }: { proj: GeoProjection }) {
  const { lonMin, lonMax, latMin, latMax } = GOSPEL_MAP_BOUNDS;

  return (
    <>
      <g
        stroke="var(--color-hatch)"
        strokeWidth="0.3"
        fill="none"
        opacity="0.18"
        strokeDasharray="1 3"
      >
        {LON_TICKS.map((lon) => {
          const a = project(proj, lon, latMin);
          const b = project(proj, lon, latMax);
          return <line key={`lon-${lon}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />;
        })}
        {LAT_TICKS.map((lat) => {
          const a = project(proj, lonMin, lat);
          const b = project(proj, lonMax, lat);
          return <line key={`lat-${lat}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />;
        })}
      </g>

      <g
        fontSize="10"
        fontFamily={FONT_FAMILIES.sans}
        fill="var(--color-sepia)"
        opacity="0.55"
        letterSpacing="2"
      >
        {LON_TICKS.map((lon) => {
          const p = project(proj, lon, latMax);
          return (
            <text key={`ll-${lon}`} x={p.x} y={14} textAnchor="middle">
              {lon}° E
            </text>
          );
        })}
        {LAT_TICKS.map((lat) => {
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
