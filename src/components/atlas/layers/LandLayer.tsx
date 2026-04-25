import { HATCH_PATTERN_ID, MAP_CLIP_ID } from "./MapDefs";

export function LandLayer({ path }: { path: string }) {
  return (
    <g clipPath={`url(#${MAP_CLIP_ID})`}>
      <path
        d={path}
        fill="var(--color-land-fill)"
        stroke="var(--color-land-stroke)"
        strokeWidth="1.2"
        opacity="0.9"
      />
      <path
        d={path}
        fill={`url(#${HATCH_PATTERN_ID})`}
        opacity="0.6"
        style={{ pointerEvents: "none" }}
      />
      <path
        d={path}
        fill="none"
        stroke="var(--color-coast-emphasis)"
        strokeWidth="0.6"
        opacity="0.7"
      />
    </g>
  );
}
