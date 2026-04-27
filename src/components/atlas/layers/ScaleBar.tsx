import type { GeoProjection } from "d3-geo";
import { MAP_SIZE, SCALE_BAR_KM } from "@/constants/map";
import { project } from "@/lib/geo/projection";
import { FONT_FAMILIES } from "@/constants/design";

const KM_PER_LON_DEG = 111;

const OFFSET_X = 220;
const OFFSET_Y = 40;

type ScaleBarProps = {
  proj: GeoProjection;
  mapWidth?: number;
  mapHeight?: number;
  km?: number;
  referenceLat?: number;
  referenceLon?: number;
};

export function ScaleBar({
  proj,
  mapWidth = MAP_SIZE.width,
  mapHeight = MAP_SIZE.height,
  km = SCALE_BAR_KM,
  referenceLat = 35,
  referenceLon = 30,
}: ScaleBarProps) {
  const a = project(proj, referenceLon, referenceLat);
  const lonPerKm = 1 / KM_PER_LON_DEG / Math.cos((referenceLat * Math.PI) / 180);
  const b = project(proj, referenceLon + km * lonPerKm, referenceLat);
  const w = Math.abs(b.x - a.x);

  return (
    <g transform={`translate(${mapWidth - OFFSET_X}, ${mapHeight - OFFSET_Y})`}>
      <rect x="0" y="0" width={w / 2} height="4" fill="var(--color-sepia)" />
      <rect
        x={w / 2}
        y="0"
        width={w / 2}
        height="4"
        fill="none"
        stroke="var(--color-sepia)"
        strokeWidth="0.8"
      />
      <text
        x={w / 2}
        y="-6"
        fontSize="10"
        textAnchor="middle"
        fill="var(--color-sepia)"
        fontFamily={FONT_FAMILIES.sans}
        letterSpacing="1"
      >
        {km} km
      </text>
      <text x="0" y="16" fontSize="9" fill="var(--color-sepia)" fontFamily={FONT_FAMILIES.sans}>
        0
      </text>
      <text
        x={w}
        y="16"
        fontSize="9"
        fill="var(--color-sepia)"
        fontFamily={FONT_FAMILIES.sans}
        textAnchor="end"
      >
        {km}
      </text>
    </g>
  );
}
