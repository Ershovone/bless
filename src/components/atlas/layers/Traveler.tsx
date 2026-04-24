import type { Point } from "@/types/atlas";

export function Traveler({ position }: { position: Point }) {
  return (
    <g transform={`translate(${position.x}, ${position.y})`} style={{ pointerEvents: "none" }}>
      <circle r="8" fill="var(--color-rust)" opacity="0.3" />
      <circle r="4" fill="var(--color-amber)" stroke="var(--color-ink)" strokeWidth="1" />
    </g>
  );
}
