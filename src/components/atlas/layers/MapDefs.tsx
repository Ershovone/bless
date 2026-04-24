import { MAP_SIZE } from "@/constants/map";

export const MAP_CLIP_ID = "mapClip";
export const HATCH_PATTERN_ID = "hatchLand";
export const SEA_GRADIENT_ID = "seaGrad";
export const SEA_LINES_ID = "seaLines";
export const INK_BLEED_FILTER_ID = "inkBleed";

export function MapDefs() {
  return (
    <defs>
      <pattern
        id={HATCH_PATTERN_ID}
        width="4"
        height="4"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(45)"
      >
        <line x1="0" y1="0" x2="0" y2="4" stroke="var(--color-hatch)" strokeWidth="0.4" opacity="0.3" />
      </pattern>

      <radialGradient id={SEA_GRADIENT_ID} cx="0.5" cy="0.5" r="0.75">
        <stop offset="0" stopColor="#d4c19a" stopOpacity="0.18" />
        <stop offset="1" stopColor="var(--color-hatch)" stopOpacity="0.08" />
      </radialGradient>

      <filter id={INK_BLEED_FILTER_ID} x="-5%" y="-5%" width="110%" height="110%">
        <feGaussianBlur stdDeviation="0.6" />
      </filter>

      <pattern id={SEA_LINES_ID} width="40" height="10" patternUnits="userSpaceOnUse">
        <path
          d="M 0,5 Q 10,3 20,5 T 40,5"
          stroke="var(--color-hatch)"
          strokeWidth="0.3"
          fill="none"
          opacity="0.15"
        />
      </pattern>

      <clipPath id={MAP_CLIP_ID}>
        <rect width={MAP_SIZE.width} height={MAP_SIZE.height} />
      </clipPath>
    </defs>
  );
}
