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
import { EXODUS_MAP_SIZE, EXODUS_BOW_FACTOR } from "@/data/exodus/mapConstants";
import { EXODUS_PHASES } from "@/data/exodus/phases";
import { EXODUS_STATIONS } from "@/data/exodus/stations";
import { useExodusProjection } from "@/hooks/useExodusProjection";
import { useExodusStore } from "@/hooks/useExodusStore";
import { useWorldTopology } from "@/hooks/useWorldTopology";
import { useZoomPan } from "@/hooks/useZoomPan";
import { ExodusGraticule } from "./layers/ExodusGraticule";
import { ExodusRegionLabels } from "./layers/ExodusRegionLabels";
import { ExodusRivers } from "./layers/ExodusRivers";
import { ExodusStationsLayer } from "./layers/ExodusStationsLayer";
import { PeoplesLayer } from "./layers/PeoplesLayer";

type ExodusAtlasMapVariant = "framed" | "fullscreen";

const FULLSCREEN_WRAPPER_CLS = "absolute inset-0 overflow-hidden";

function FullscreenWrapper({ children }: { children: ReactNode }) {
  return <div className={FULLSCREEN_WRAPPER_CLS}>{children}</div>;
}

const STATIONS_AS_CITIES = EXODUS_STATIONS as unknown as Record<CityId, City>;

type PhasePath = {
  phaseIdx: number;
  d: string;
  color: string;
};

export function ExodusAtlasMap({
  variant = "framed",
}: {
  variant?: ExodusAtlasMapVariant;
} = {}) {
  const activePhaseIdx = useExodusStore((s) => s.activePhaseIdx);
  const modernView = useExodusStore((s) => s.modernView);
  const setZoomDisplay = useExodusStore((s) => s.setZoomDisplay);
  const zoomDisplay = useExodusStore((s) => s.zoomDisplay);

  const { proj, pathGen } = useExodusProjection();
  const { data: world } = useWorldTopology(proj, pathGen);
  const zoomPan = useZoomPan(EXODUS_MAP_SIZE, setZoomDisplay);

  const phasePaths = useMemo<PhasePath[]>(() => {
    return EXODUS_PHASES.map((phase, pi) => {
      const prevPhase = pi > 0 ? EXODUS_PHASES[pi - 1] : null;
      const leadIn = prevPhase
        ? [prevPhase.stations[prevPhase.stations.length - 1]]
        : [];
      const ids = [...leadIn, ...phase.stations] as CityId[];
      if (ids.length < 2) return { phaseIdx: pi, d: "", color: phase.color };
      const d = buildRoutePath(ids, STATIONS_AS_CITIES, proj, EXODUS_BOW_FACTOR);
      return { phaseIdx: pi, d, color: phase.color };
    });
  }, [proj]);

  const activeStations = useMemo(
    () => new Set(EXODUS_PHASES[activePhaseIdx].stations),
    [activePhaseIdx],
  );

  const Wrapper = variant === "fullscreen" ? FullscreenWrapper : AtlasFrame;
  const zoomPosition = variant === "fullscreen" ? "bottom-right" : "bottom-left";

  return (
    <Wrapper>
      <MapSvg zoomPan={zoomPan}>
        <MapDefs width={EXODUS_MAP_SIZE.width} height={EXODUS_MAP_SIZE.height} />
        <SeaBackground width={EXODUS_MAP_SIZE.width} height={EXODUS_MAP_SIZE.height} />
        <ExodusGraticule proj={proj} />
        {world && <LandLayer path={world.landPath} />}
        {modernView && world && <ModernBordersLayer countries={world.countries} />}
        <ExodusRivers proj={proj} />
        <ExodusRegionLabels proj={proj} />
        <CompassRose mapWidth={EXODUS_MAP_SIZE.width} />
        <ScaleBar
          proj={proj}
          mapWidth={EXODUS_MAP_SIZE.width}
          mapHeight={EXODUS_MAP_SIZE.height}
          km={200}
          referenceLat={30}
          referenceLon={32}
        />
        <PeoplesLayer proj={proj} />

        {/* Inactive phase paths — parchment halo + dim ink dash so they read on territory fills */}
        {phasePaths.map(({ phaseIdx, d }) =>
          d && phaseIdx !== activePhaseIdx ? (
            <g key={`inactive-${phaseIdx}`}>
              <path
                d={d}
                fill="none"
                stroke="var(--color-parchment-light)"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.7"
              />
              <path
                d={d}
                fill="none"
                stroke="var(--color-ink-muted)"
                strokeWidth="1.6"
                strokeDasharray="4 4"
                opacity="0.65"
                strokeLinecap="round"
              />
            </g>
          ) : null,
        )}

        {/* Active phase path — bold solid line lifted by parchment halo */}
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
                opacity="0.85"
              />
              <path
                d={d}
                fill="none"
                stroke={color}
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          ) : null,
        )}

        <ExodusStationsLayer proj={proj} activeStations={activeStations} />
      </MapSvg>

      {!world && (
        <div className="absolute inset-0 flex items-center justify-center text-lg italic uppercase tracking-[0.2em] text-(--color-sepia)">
          Carta Geographica — loading…
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
