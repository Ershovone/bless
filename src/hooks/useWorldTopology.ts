"use client";

import { useEffect, useState } from "react";
import type { GeoPath, GeoProjection } from "d3-geo";
import { loadWorld, type LoadedWorld } from "@/lib/topojson/loadWorld";
import { getAssetUrl } from "@/lib/seo/paths";

const WORLD_URL = getAssetUrl("/data/countries-50m.json");

export function useWorldTopology(proj: GeoProjection, pathGen: GeoPath) {
  const [data, setData] = useState<LoadedWorld | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadWorld(WORLD_URL, proj, pathGen)
      .then((w) => {
        if (!cancelled) setData(w);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      });
    return () => {
      cancelled = true;
    };
  }, [proj, pathGen]);

  return { data, error };
}
