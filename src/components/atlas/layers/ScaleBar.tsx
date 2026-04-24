import type { GeoProjection } from "d3-geo";
import { MAP_SIZE, SCALE_BAR_KM } from "@/constants/map";
import { project } from "@/lib/geo/projection";
import { FONT_FAMILIES } from "@/constants/design";

const REFERENCE_LAT = 35;
const REFERENCE_LON = 30;
const KM_PER_LON_DEG = 111;

const OFFSET_X = 220;
const OFFSET_Y = 40;

export function ScaleBar({ proj }: { proj: GeoProjection }) {
  const a = project(proj, REFERENCE_LON, REFERENCE_LAT);
  const lonPerKm = 1 / KM_PER_LON_DEG / Math.cos((REFERENCE_LAT * Math.PI) / 180);
  const b = project(proj, REFERENCE_LON + SCALE_BAR_KM * lonPerKm, REFERENCE_LAT);
  const w = Math.abs(b.x - a.x);

  return (
    <g transform={`translate(${MAP_SIZE.width - OFFSET_X}, ${MAP_SIZE.height - OFFSET_Y})`}>
      <rect x="0" y="0" width={w / 2} height="4" fill="var(--color-sepia)" />
      <rect x={w / 2} y="0" width={w / 2} height="4" fill="none" stroke="var(--color-sepia)" strokeWidth="0.8" />
      <text x={w / 2} y="-6" fontSize="10" textAnchor="middle" fill="var(--color-sepia)" fontFamily={FONT_FAMILIES.sans} letterSpacing="1">
        {SCALE_BAR_KM} km
      </text>
      <text x="0" y="16" fontSize="9" fill="var(--color-sepia)" fontFamily={FONT_FAMILIES.sans}>
        0
      </text>
      <text x={w} y="16" fontSize="9" fill="var(--color-sepia)" fontFamily={FONT_FAMILIES.sans} textAnchor="end">
        {SCALE_BAR_KM}
      </text>
    </g>
  );
}
