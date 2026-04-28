"use client";

import { useMemo, type ReactNode } from "react";
import type { City, CityId } from "@/types/atlas";
import { buildRoutePath } from "@/lib/geo/bezier";
import { AtlasFrame } from "@/components/atlas/AtlasFrame";
import { MapSvg } from "@/components/atlas/MapSvg";
import { ZoomControls } from "@/components/atlas/ZoomControls";
import { CompassRose } from "@/components/atlas/layers/CompassRose";
import { LandLayer } from "@/components/atlas/layers/LandLayer";
import { MapDefs } from "@/components/atlas/layers/MapDefs";
import { ModernBordersLayer } from "@/components/atlas/layers/ModernBordersLayer";
import { ScaleBar } from "@/components/atlas/layers/ScaleBar";
import { SeaBackground } from "@/components/atlas/layers/SeaBackground";
import { GOSPEL_BOW_FACTOR, GOSPEL_MAP_SIZE } from "@/data/gospel/mapConstants";
import { GOSPEL_LOCATIONS } from "@/data/gospel/locations";
import { GOSPEL_PHASES } from "@/data/gospel/phases";
import { useGospelProjection } from "@/hooks/useGospelProjection";
import { useGospelStore } from "@/hooks/useGospelStore";
import { useWorldTopology } from "@/hooks/useWorldTopology";
import { useZoomPan } from "@/hooks/useZoomPan";
import { GospelGraticule } from "./layers/GospelGraticule";
import { GospelRegionLabels } from "./layers/GospelRegionLabels";
import { GospelRivers } from "./layers/GospelRivers";
import { GospelLocationsLayer } from "./layers/GospelLocationsLayer";
import { GospelRegionsLayer } from "./layers/GospelRegionsLayer";

type GospelAtlasMapVariant = "framed" | "fullscreen";

const FULLSCREEN_WRAPPER_CLS = "absolute inset-0 overflow-hidden";

function FullscreenWrapper({ children }: { children: ReactNode }) {
  return <div className={FULLSCREEN_WRAPPER_CLS}>{children}</div>;
}

const LOCATIONS_AS_CITIES = GOSPEL_LOCATIONS as unknown as Record<CityId, City>;

type PhasePath = {
  phaseIdx: number;
  d: string;
  color: string;
};

export function GospelAtlasMap({
  variant = "framed",
}: {
  variant?: GospelAtlasMapVariant;
} = {}) {
  const activePhaseIdx = useGospelStore((s) => s.activePhaseIdx);
  const modernView = useGospelStore((s) => s.modernView);
  const setZoomDisplay = useGospelStore((s) => s.setZoomDisplay);
  const zoomDisplay = useGospelStore((s) => s.zoomDisplay);

  const { proj, pathGen } = useGospelProjection();
  const { data: world } = useWorldTopology(proj, pathGen);
  const zoomPan = useZoomPan(GOSPEL_MAP_SIZE, setZoomDisplay);

  const phasePaths = useMemo<PhasePath[]>(() => {
    // Каждая фаза начинается с последнего пункта предыдущей — чтобы маршрут
    // не «телепортировался» между фазами (напр., Капернаум → Перея).
    return GOSPEL_PHASES.map((phase, pi) => {
      const prevPhase = pi > 0 ? GOSPEL_PHASES[pi - 1] : null;
      const leadIn = prevPhase
        ? [prevPhase.locations[prevPhase.locations.length - 1]]
        : [];
      const ids = [...leadIn, ...phase.locations] as CityId[];
      if (ids.length < 2) return { phaseIdx: pi, d: "", color: phase.color };
      const d = buildRoutePath(ids, LOCATIONS_AS_CITIES, proj, GOSPEL_BOW_FACTOR);
      return { phaseIdx: pi, d, color: phase.color };
    });
  }, [proj]);

  const activeLocations = useMemo(
    () => new Set(GOSPEL_PHASES[activePhaseIdx].locations),
    [activePhaseIdx],
  );

  const Wrapper = variant === "fullscreen" ? FullscreenWrapper : AtlasFrame;
  const zoomPosition = variant === "fullscreen" ? "bottom-right" : "bottom-left";

  return (
    <Wrapper>
      <MapSvg zoomPan={zoomPan}>
        <MapDefs width={GOSPEL_MAP_SIZE.width} height={GOSPEL_MAP_SIZE.height} />
        <SeaBackground width={GOSPEL_MAP_SIZE.width} height={GOSPEL_MAP_SIZE.height} />
        <GospelGraticule proj={proj} />
        {world && <LandLayer path={world.landPath} />}
        {modernView && world && <ModernBordersLayer countries={world.countries} />}
        <GospelRivers proj={proj} />
        <GospelRegionLabels proj={proj} />
        <CompassRose mapWidth={GOSPEL_MAP_SIZE.width} />
        <ScaleBar
          proj={proj}
          mapWidth={GOSPEL_MAP_SIZE.width}
          mapHeight={GOSPEL_MAP_SIZE.height}
          km={50}
          referenceLat={31.7}
          referenceLon={34.5}
        />
        <GospelRegionsLayer proj={proj} />

        {/* Inactive phase paths — parchment halo + dim ink dash */}
        {phasePaths.map(({ phaseIdx, d }) =>
          d && phaseIdx !== activePhaseIdx ? (
            <g key={`inactive-${phaseIdx}`}>
              <path
                d={d}
                fill="none"
                stroke="var(--color-parchment-light)"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.6"
              />
              <path
                d={d}
                fill="none"
                stroke="var(--color-ink-muted)"
                strokeWidth="1.4"
                strokeDasharray="4 4"
                opacity="0.45"
                strokeLinecap="round"
              />
            </g>
          ) : null,
        )}

        {/* Active phase path — bold solid line */}
        {phasePaths.map(({ phaseIdx, d, color }) =>
          d && phaseIdx === activePhaseIdx ? (
            <g key={`active-${phaseIdx}`}>
              <path
                d={d}
                fill="none"
                stroke="var(--color-parchment-light)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.9"
              />
              <path
                d={d}
                fill="none"
                stroke={color}
                strokeWidth="3.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          ) : null,
        )}

        <GospelLocationsLayer proj={proj} activeLocations={activeLocations} />
      </MapSvg>

      {!world && (
        <div className="absolute inset-0 flex items-center justify-center text-lg italic uppercase tracking-[0.2em] text-(--color-sepia)">
          Carta Sancta — loading…
        </div>
      )}

      <ZoomControls
        onZoomIn={zoomPan.zoomIn}
        onZoomOut={zoomPan.zoomOut}
        onReset={zoomPan.reset}
        position={zoomPosition}
        zoomValue={zoomDisplay}
      />
    </Wrapper>
  );
}
