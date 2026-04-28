import type { GeoProjection } from "d3-geo";
import { project } from "@/lib/geo/projection";

const RIVER_COLOR = "var(--color-modern-blue)";
const RIVER_OPACITY = 0.65;
const RIVER_WIDTH_MAX = 1.8;
const RIVER_WIDTH_MIN = 0.9;

const LAKE_FILL = "var(--color-modern-blue)";
const LAKE_FILL_OPACITY = 0.22;
const LAKE_STROKE_OPACITY = 0.65;
const LAKE_STROKE_WIDTH = 1.1;

type LonLat = [number, number];

// ── Галилейское море (озеро Геннисаретское) ─────────────────────────────
// Реальный силуэт: ~21 км С–Ю, ~13 км З–В, на юге сужается у выхода Иордана.
const SEA_OF_GALILEE: LonLat[] = [
  [35.605, 32.880], // север (вход Иордана)
  [35.625, 32.875],
  [35.645, 32.860],
  [35.655, 32.835],
  [35.660, 32.805],
  [35.655, 32.770],
  [35.640, 32.738],
  [35.622, 32.718],
  [35.595, 32.708], // юг (выход Иордана)
  [35.575, 32.708],
  [35.555, 32.720],
  [35.540, 32.745],
  [35.530, 32.775],
  [35.528, 32.810],
  [35.535, 32.840],
  [35.555, 32.865],
  [35.580, 32.878],
];

// ── Мёртвое море ────────────────────────────────────────────────────────
// Северный бассейн (~50 км С–Ю), Лисанский полуостров с востока,
// малый южный бассейн. Координаты соответствуют исторической береговой
// линии I века (до пересыхания южного бассейна в XX веке).
const DEAD_SEA: LonLat[] = [
  // Северный край
  [35.470, 31.770],
  [35.510, 31.775],
  [35.555, 31.768],
  [35.585, 31.745],
  // Восточное побережье — север
  [35.595, 31.700],
  [35.595, 31.640],
  [35.585, 31.580],
  [35.575, 31.520],
  [35.565, 31.460],
  // Лисанский полуостров (выступ с востока)
  [35.555, 31.395],
  [35.520, 31.360],
  [35.495, 31.330],
  [35.500, 31.295], // перешеек
  // Восточное побережье — южный бассейн
  [35.520, 31.250],
  [35.520, 31.200],
  [35.510, 31.150],
  [35.490, 31.110],
  [35.460, 31.090],
  // Южный край
  [35.430, 31.090],
  [35.410, 31.115],
  [35.400, 31.155],
  [35.395, 31.205],
  [35.400, 31.255],
  [35.420, 31.295], // западный край южного бассейна
  // Перешеек с запада
  [35.430, 31.330],
  [35.430, 31.395],
  // Западное побережье — север
  [35.425, 31.460],
  [35.420, 31.520],
  [35.415, 31.580],
  [35.410, 31.640],
  [35.415, 31.700],
  [35.430, 31.745],
  [35.445, 31.768],
  [35.470, 31.770],
];

// ── Иордан ──────────────────────────────────────────────────────────────
// Северный участок: от подножия Ермона до Галилейского моря
const JORDAN_UPPER: LonLat[] = [
  [35.692, 33.295],
  [35.680, 33.230],
  [35.660, 33.170],
  [35.640, 33.110],
  [35.625, 33.050],
  [35.610, 32.985],
  [35.605, 32.920],
  [35.605, 32.880], // впадает в Галилейское море
];

// Южный участок: от Галилейского моря до Мёртвого моря, с меандрами.
// Реальный Иордан — один из самых извилистых рек мира: 200 км по руслу
// при 100 км по прямой.
const JORDAN_LOWER: LonLat[] = [
  [35.595, 32.708], // выход из моря
  [35.610, 32.685],
  [35.598, 32.655],
  [35.612, 32.625],
  [35.595, 32.595],
  [35.610, 32.560],
  [35.595, 32.525],
  [35.608, 32.485],
  [35.590, 32.450],
  [35.602, 32.410],
  [35.585, 32.370],
  [35.598, 32.330],
  [35.580, 32.290],
  [35.595, 32.250],
  [35.578, 32.210],
  [35.590, 32.170],
  [35.575, 32.130],
  [35.585, 32.090],
  [35.570, 32.050],
  [35.580, 32.005],
  [35.560, 31.965],
  [35.572, 31.920],
  [35.555, 31.880],
  [35.548, 31.835],
  [35.518, 31.795],
  [35.490, 31.778], // впадает в Мёртвое море
];

function pathFor(proj: GeoProjection, points: LonLat[], closed = false): string {
  if (points.length === 0) return "";
  const segments = points
    .map(([lon, lat], i) => {
      const p = project(proj, lon, lat);
      return `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    })
    .join(" ");
  return closed ? `${segments} Z` : segments;
}

/** Сглаженный путь по Кэтмэлл–Рому: для извилистого Иордана. */
function smoothPath(proj: GeoProjection, points: LonLat[]): string {
  if (points.length < 2) return "";
  const projected = points.map(([lon, lat]) => project(proj, lon, lat));
  const tension = 0.5;
  let d = `M ${projected[0].x.toFixed(1)} ${projected[0].y.toFixed(1)}`;
  for (let i = 0; i < projected.length - 1; i++) {
    const p0 = projected[Math.max(0, i - 1)];
    const p1 = projected[i];
    const p2 = projected[i + 1];
    const p3 = projected[Math.min(projected.length - 1, i + 2)];
    const c1x = p1.x + ((p2.x - p0.x) / 6) * tension;
    const c1y = p1.y + ((p2.y - p0.y) / 6) * tension;
    const c2x = p2.x - ((p3.x - p1.x) / 6) * tension;
    const c2y = p2.y - ((p3.y - p1.y) / 6) * tension;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

export function GospelRivers({ proj }: { proj: GeoProjection }) {
  const galileeD = pathFor(proj, SEA_OF_GALILEE, true);
  const deadSeaD = pathFor(proj, DEAD_SEA, true);
  const jordanUpperD = smoothPath(proj, JORDAN_UPPER);
  const jordanLowerD = smoothPath(proj, JORDAN_LOWER);

  return (
    <g pointerEvents="none">
      {/* Озёра — заливка + береговая линия */}
      <path
        d={galileeD}
        fill={LAKE_FILL}
        fillOpacity={LAKE_FILL_OPACITY}
        stroke={RIVER_COLOR}
        strokeWidth={LAKE_STROKE_WIDTH}
        strokeOpacity={LAKE_STROKE_OPACITY}
        strokeLinejoin="round"
      />
      <path
        d={deadSeaD}
        fill={LAKE_FILL}
        fillOpacity={LAKE_FILL_OPACITY}
        stroke={RIVER_COLOR}
        strokeWidth={LAKE_STROKE_WIDTH}
        strokeOpacity={LAKE_STROKE_OPACITY}
        strokeLinejoin="round"
      />

      {/* Иордан: верхний участок (тоньше) и нижний (чуть шире) */}
      <path
        d={jordanUpperD}
        fill="none"
        stroke={RIVER_COLOR}
        strokeWidth={RIVER_WIDTH_MIN}
        strokeOpacity={RIVER_OPACITY}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={jordanLowerD}
        fill="none"
        stroke={RIVER_COLOR}
        strokeWidth={RIVER_WIDTH_MAX}
        strokeOpacity={RIVER_OPACITY}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}
