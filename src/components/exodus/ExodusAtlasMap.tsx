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
import { EXODUS_PHASES, EXODUS_FULL_ROUTE } from "@/data/exodus/phases";
import { EXODUS_STATIONS, EXODUS_STATION_ORDER } from "@/data/exodus/stations";
import { useExodusProjection } from "@/hooks/useExodusProjection";
import { useExodusStore } from "@/hooks/useExodusStore";
import { useWorldTopology } from "@/hooks/useWorldTopology";
import { useZoomPan } from "@/hooks/useZoomPan";
import { ExodusActiveRoute } from "./layers/ExodusActiveRoute";
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
const FULL_ROUTE_IDS = EXODUS_FULL_ROUTE as CityId[];

export function ExodusAtlasMap({
  variant = "framed",
}: {
  variant?: ExodusAtlasMapVariant;
} = {}) {
  const activePhaseIdx = useExodusStore((s) => s.activePhaseIdx);
  const modernView = useExodusStore((s) => s.modernView);
  const setZoomDisplay = useExodusStore((s) => s.setZoomDisplay);

  const { proj, pathGen } = useExodusProjection();
  const { data: world } = useWorldTopology(proj, pathGen);
  const zoomPan = useZoomPan(EXODUS_MAP_SIZE, setZoomDisplay);

  const phase = EXODUS_PHASES[activePhaseIdx];

  const fullRouteD = useMemo(
    () => buildRoutePath(FULL_ROUTE_IDS, STATIONS_AS_CITIES, proj, EXODUS_BOW_FACTOR),
    [proj],
  );

  const phaseRouteD = useMemo(
    () =>
      buildRoutePath(
        phase.stations as CityId[],
        STATIONS_AS_CITIES,
        proj,
        EXODUS_BOW_FACTOR,
      ),
    [phase, proj],
  );

  const activeStations = useMemo(
    () => new Set(phase.stations),
    [phase],
  );

  const Wrapper = variant === "fullscreen" ? FullscreenWrapper : AtlasFrame;
  const zoomPosition = variant === "fullscreen" ? "bottom-right" : "bottom-left";

  void EXODUS_STATION_ORDER;

  return (
    <Wrapper>
      <MapSvg zoomPan={zoomPan}>
        <MapDefs />
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

        {/* Faint full route always visible — context */}
        <path
          d={fullRouteD}
          fill="none"
          stroke="var(--color-sepia-light)"
          strokeWidth="1"
          strokeDasharray="2 4"
          opacity="0.5"
        />

        {/* Active phase route */}
        <ExodusActiveRoute d={phaseRouteD} color={phase.color} />

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
      />
    </Wrapper>
  );
}
