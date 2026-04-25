"use client";

import { useMemo } from "react";
import { buildRoutePath, interpolateRoute } from "@/lib/geo/bezier";
import { CITIES } from "@/data/cities";
import { COMPANIONS } from "@/data/companions";
import { JOURNEYS } from "@/data/journeys";
import { useAtlasStore } from "@/hooks/useAtlasStore";
import { usePlayback } from "@/hooks/usePlayback";
import { useProjection } from "@/hooks/useProjection";
import { useWorldTopology } from "@/hooks/useWorldTopology";
import { useZoomPan } from "@/hooks/useZoomPan";
import { AtlasFrame } from "./AtlasFrame";
import { MapSvg } from "./MapSvg";
import { Tooltip } from "./Tooltip";
import { ZoomControls } from "./ZoomControls";
import { ActiveRoute } from "./layers/ActiveRoute";
import { CitiesLayer } from "./layers/CitiesLayer";
import { CompanionRoute } from "./layers/CompanionRoute";
import { CompassRose } from "./layers/CompassRose";
import { GhostRoutes } from "./layers/GhostRoutes";
import { Graticule } from "./layers/Graticule";
import { LandLayer } from "./layers/LandLayer";
import { MapDefs } from "./layers/MapDefs";
import { ModernBordersLayer } from "./layers/ModernBordersLayer";
import { RegionLabels } from "./layers/RegionLabels";
import { ScaleBar } from "./layers/ScaleBar";
import { SeaBackground } from "./layers/SeaBackground";
import { Traveler } from "./layers/Traveler";

export function AtlasMap() {
  const activeJ = useAtlasStore((s) => s.activeJ);
  const modernView = useAtlasStore((s) => s.modernView);
  const playing = useAtlasStore((s) => s.playing);
  const playT = useAtlasStore((s) => s.playT);
  const selectedCompanion = useAtlasStore((s) => s.selectedCompanion);

  usePlayback();

  const { proj, pathGen } = useProjection();
  const { data: world } = useWorldTopology(proj, pathGen);
  const zoomPan = useZoomPan();

  const journey = JOURNEYS[activeJ];
  const routePathD = useMemo(
    () => buildRoutePath(journey.route, CITIES, proj),
    [journey, proj],
  );

  const travelerPos = useMemo(
    () => interpolateRoute(journey.route, CITIES, proj, playT),
    [journey, proj, playT],
  );

  const companion = selectedCompanion ? COMPANIONS[selectedCompanion] : null;

  return (
    <AtlasFrame>
      <MapSvg zoomPan={zoomPan}>
        <MapDefs />
        <SeaBackground />
        <Graticule proj={proj} />
        {world && <LandLayer path={world.landPath} />}
        {modernView && world && <ModernBordersLayer countries={world.countries} />}
        <RegionLabels proj={proj} />
        <CompassRose />
        <ScaleBar proj={proj} />
        <GhostRoutes activeJ={activeJ} proj={proj} />
        <ActiveRoute d={routePathD} playing={playing} playT={playT} />
        {companion && <CompanionRoute companion={companion} activeJ={activeJ} proj={proj} />}
        {playing && <Traveler position={travelerPos} />}
        <CitiesLayer proj={proj} route={journey.route} />
      </MapSvg>

      <Tooltip proj={proj} />

      {!world && (
        <div className="absolute inset-0 flex items-center justify-center text-lg italic uppercase tracking-[0.2em] text-(--color-sepia)">
          Carta Geographica — loading…
        </div>
      )}

      <ZoomControls
        zoom={zoomPan.zoomDisplay}
        onZoomIn={zoomPan.zoomIn}
        onZoomOut={zoomPan.zoomOut}
        onReset={zoomPan.reset}
      />
    </AtlasFrame>
  );
}
