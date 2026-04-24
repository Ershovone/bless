import type { GeoProjection } from "d3-geo";
import type { City, CityId, Point } from "@/types/atlas";
import { BEZ_ARC_SAMPLES, BOW_FACTOR } from "@/constants/map";
import { project } from "./projection";

type BezSegment = {
  a: Point;
  b: Point;
  cx: number;
  cy: number;
  arc: number;
};

function perpendicularControl(a: Point, b: Point, bow: number): { cx: number; cy: number } {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  return {
    cx: mx + nx * len * bow,
    cy: my + ny * len * bow,
  };
}

function quadratic(a: Point, cx: number, cy: number, b: Point, t: number): Point {
  const omu = 1 - t;
  return {
    x: omu * omu * a.x + 2 * omu * t * cx + t * t * b.x,
    y: omu * omu * a.y + 2 * omu * t * cy + t * t * b.y,
  };
}

export function buildRoutePath(
  cityIds: CityId[],
  cities: Record<CityId, City>,
  proj: GeoProjection,
  bow: number = BOW_FACTOR,
): string {
  if (cityIds.length < 2) return "";
  let d = "";
  for (let i = 0; i < cityIds.length - 1; i++) {
    const a = project(proj, cities[cityIds[i]].lon, cities[cityIds[i]].lat);
    const b = project(proj, cities[cityIds[i + 1]].lon, cities[cityIds[i + 1]].lat);
    if (i === 0) d += `M${a.x},${a.y} `;
    const { cx, cy } = perpendicularControl(a, b, bow);
    d += `Q${cx},${cy} ${b.x},${b.y} `;
  }
  return d.trimEnd();
}

export function bezSegments(
  cityIds: CityId[],
  cities: Record<CityId, City>,
  proj: GeoProjection,
  bow: number = BOW_FACTOR,
): BezSegment[] {
  const segs: BezSegment[] = [];
  for (let i = 0; i < cityIds.length - 1; i++) {
    const a = project(proj, cities[cityIds[i]].lon, cities[cityIds[i]].lat);
    const b = project(proj, cities[cityIds[i + 1]].lon, cities[cityIds[i + 1]].lat);
    const { cx, cy } = perpendicularControl(a, b, bow);

    let arc = 0;
    let prev: Point = a;
    for (let s = 1; s <= BEZ_ARC_SAMPLES; s++) {
      const u = s / BEZ_ARC_SAMPLES;
      const p = quadratic(a, cx, cy, b, u);
      arc += Math.hypot(p.x - prev.x, p.y - prev.y);
      prev = p;
    }
    segs.push({ a, b, cx, cy, arc });
  }
  return segs;
}

export function interpolateRoute(
  cityIds: CityId[],
  cities: Record<CityId, City>,
  proj: GeoProjection,
  t: number,
  bow: number = BOW_FACTOR,
): Point {
  if (cityIds.length < 2) {
    const first = cities[cityIds[0]];
    return project(proj, first.lon, first.lat);
  }
  const segs = bezSegments(cityIds, cities, proj, bow);
  const total = segs.reduce((sum, seg) => sum + seg.arc, 0);
  const target = t * total;

  let acc = 0;
  for (const seg of segs) {
    if (acc + seg.arc >= target) {
      const u = (target - acc) / seg.arc;
      return quadratic(seg.a, seg.cx, seg.cy, seg.b, u);
    }
    acc += seg.arc;
  }
  return segs[segs.length - 1].b;
}
