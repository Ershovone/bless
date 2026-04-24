import type { GeoProjection } from "d3-geo";
import type { Companion } from "@/types/atlas";
import { buildRoutePath } from "@/lib/geo/bezier";
import { CITIES } from "@/data/cities";

type CompanionRouteProps = {
  companion: Companion;
  activeJ: number;
  proj: GeoProjection;
};

export function CompanionRoute({ companion, activeJ, proj }: CompanionRouteProps) {
  const part = companion.participation.find((p) => p.journeyIdx === activeJ);
  if (!part) return null;
  return (
    <path
      d={buildRoutePath(part.cities, CITIES, proj)}
      fill="none"
      stroke={companion.color}
      strokeWidth="4"
      strokeLinecap="round"
      opacity="0.65"
    />
  );
}
