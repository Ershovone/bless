import { MAP_SIZE } from "@/constants/map";
import { FONT_FAMILIES } from "@/constants/design";

const OFFSET_X = 80;
const OFFSET_Y = 80;

type CompassRoseProps = {
  mapWidth?: number;
};

export function CompassRose({ mapWidth = MAP_SIZE.width }: CompassRoseProps = {}) {
  return (
    <g transform={`translate(${mapWidth - OFFSET_X}, ${OFFSET_Y})`} opacity="0.7">
      <circle r="34" fill="rgba(253,244,224,0.5)" stroke="var(--color-sepia)" strokeWidth="0.8" />
      <circle r="24" fill="none" stroke="var(--color-sepia)" strokeWidth="0.5" />
      <path d="M 0,-28 L 4,0 L 0,28 L -4,0 Z" fill="var(--color-rust)" />
      <path d="M -28,0 L 0,4 L 28,0 L 0,-4 Z" fill="none" stroke="var(--color-sepia)" strokeWidth="1" />
      <text textAnchor="middle" y="-38" fontSize="11" fill="var(--color-sepia)" fontFamily={FONT_FAMILIES.serif} fontStyle="italic">
        Septentrio
      </text>
      <text textAnchor="middle" y="46" fontSize="9" fill="var(--color-sepia)" fontFamily={FONT_FAMILIES.serif} fontStyle="italic" opacity="0.7">
        Meridies
      </text>
    </g>
  );
}
