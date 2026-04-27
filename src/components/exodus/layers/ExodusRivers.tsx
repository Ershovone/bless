import type { GeoProjection } from "d3-geo";
import { project } from "@/lib/geo/projection";

const RIVER_COLOR = "var(--color-modern-blue)";
const RIVER_OPACITY = 0.5;
const RIVER_WIDTH = 1.4;

const LAKE_FILL = "var(--color-modern-blue)";
const LAKE_FILL_OPACITY = 0.15;
const LAKE_STROKE_OPACITY = 0.5;

type LonLat = [number, number];

const JORDAN_PATH: LonLat[] = [
  [35.7, 33.25],
  [35.65, 33.0],
  [35.6, 32.88],
  [35.59, 32.7],
  [35.55, 32.45],
  [35.55, 32.2],
  [35.52, 31.95],
  [35.55, 31.7],
  [35.5, 31.5],
];

const NILE_MAIN: LonLat[] = [
  [32.5, 24.5],
  [32.7, 25.5],
  [32.7, 26.5],
  [32.4, 27.5],
  [31.9, 28.5],
  [31.4, 29.5],
  [31.2, 30.0],
  [31.3, 30.5],
];

const NILE_BRANCH_W: LonLat[] = [
  [31.3, 30.5],
  [30.5, 30.9],
  [30.0, 31.4],
];

const NILE_BRANCH_E: LonLat[] = [
  [31.3, 30.5],
  [31.7, 31.0],
  [32.0, 31.4],
];

type Lake = {
  lon: number;
  lat: number;
  rxKm: number;
  ryKm: number;
};

const SEA_OF_GALILEE: Lake = { lon: 35.59, lat: 32.82, rxKm: 0.07, ryKm: 0.11 };
const DEAD_SEA: Lake = { lon: 35.5, lat: 31.5, rxKm: 0.08, ryKm: 0.42 };

function pathFor(proj: GeoProjection, points: LonLat[]): string {
  if (points.length === 0) return "";
  return points
    .map(([lon, lat], i) => {
      const p = project(proj, lon, lat);
      return `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    })
    .join(" ");
}

function lakeRadii(proj: GeoProjection, lake: Lake): { cx: number; cy: number; rx: number; ry: number } {
  const c = project(proj, lake.lon, lake.lat);
  const ex = project(proj, lake.lon + lake.rxKm, lake.lat);
  const ey = project(proj, lake.lon, lake.lat - lake.ryKm);
  return {
    cx: c.x,
    cy: c.y,
    rx: Math.abs(ex.x - c.x),
    ry: Math.abs(ey.y - c.y),
  };
}

export function ExodusRivers({ proj }: { proj: GeoProjection }) {
  const jordanD = pathFor(proj, JORDAN_PATH);
  const nileD = pathFor(proj, NILE_MAIN);
  const nileWD = pathFor(proj, NILE_BRANCH_W);
  const nileED = pathFor(proj, NILE_BRANCH_E);
  const galilee = lakeRadii(proj, SEA_OF_GALILEE);
  const deadSea = lakeRadii(proj, DEAD_SEA);

  return (
    <g pointerEvents="none">
      <ellipse
        cx={galilee.cx}
        cy={galilee.cy}
        rx={galilee.rx}
        ry={galilee.ry}
        fill={LAKE_FILL}
        fillOpacity={LAKE_FILL_OPACITY}
        stroke={RIVER_COLOR}
        strokeWidth={1}
        strokeOpacity={LAKE_STROKE_OPACITY}
      />
      <ellipse
        cx={deadSea.cx}
        cy={deadSea.cy}
        rx={deadSea.rx}
        ry={deadSea.ry}
        fill={LAKE_FILL}
        fillOpacity={LAKE_FILL_OPACITY}
        stroke={RIVER_COLOR}
        strokeWidth={1}
        strokeOpacity={LAKE_STROKE_OPACITY}
      />
      <path
        d={jordanD}
        fill="none"
        stroke={RIVER_COLOR}
        strokeWidth={RIVER_WIDTH}
        strokeOpacity={RIVER_OPACITY}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={nileD}
        fill="none"
        stroke={RIVER_COLOR}
        strokeWidth={RIVER_WIDTH}
        strokeOpacity={RIVER_OPACITY}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={nileWD}
        fill="none"
        stroke={RIVER_COLOR}
        strokeWidth={RIVER_WIDTH * 0.8}
        strokeOpacity={RIVER_OPACITY * 0.85}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={nileED}
        fill="none"
        stroke={RIVER_COLOR}
        strokeWidth={RIVER_WIDTH * 0.8}
        strokeOpacity={RIVER_OPACITY * 0.85}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}
