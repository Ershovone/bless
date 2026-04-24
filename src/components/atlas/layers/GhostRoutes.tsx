import type { GeoProjection } from "d3-geo";
import { buildRoutePath } from "@/lib/geo/bezier";
import { CITIES } from "@/data/cities";
import { JOURNEYS } from "@/data/journeys";

type GhostRoutesProps = {
  activeJ: number;
  proj: GeoProjection;
};

export function GhostRoutes({ activeJ, proj }: GhostRoutesProps) {
  return (
    <>
      {JOURNEYS.map((j, idx) =>
        idx === activeJ ? null : (
          <path
            key={`ghost-${j.id}`}
            d={buildRoutePath(j.route, CITIES, proj)}
            fill="none"
            stroke="var(--color-sepia)"
            strokeWidth="1"
            strokeDasharray="2 3"
            opacity="0.2"
          />
        ),
      )}
    </>
  );
}
