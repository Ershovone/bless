"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useAtlasStore } from "./useAtlasStore";

const PARAM_CITY = "city";
const PARAM_YEAR = "year";

export function useURLSync(): void {
  const params = useSearchParams();
  const hydratedRef = useRef(false);

  const selectedCity = useAtlasStore((s) => s.selectedCity);
  const scrubYear = useAtlasStore((s) => s.scrubYear);
  const setSelectedCity = useAtlasStore((s) => s.setSelectedCity);
  const setScrubYear = useAtlasStore((s) => s.setScrubYear);

  // Hydrate store from URL on first mount.
  useEffect(() => {
    const city = params.get(PARAM_CITY);
    const year = params.get(PARAM_YEAR);
    if (city) setSelectedCity(city);
    if (year) {
      const y = Number.parseInt(year, 10);
      if (!Number.isNaN(y)) setScrubYear(y);
    }
    hydratedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Write store changes back to URL via history.replaceState — bypasses Next's
  // router so it never tries to scroll, refetch, or remount route segments.
  useEffect(() => {
    if (!hydratedRef.current) return;
    const next = new URLSearchParams();
    if (selectedCity) next.set(PARAM_CITY, selectedCity);
    if (scrubYear !== null) next.set(PARAM_YEAR, String(scrubYear));
    const target = next.toString();
    if (target === params.toString()) return;

    const path = window.location.pathname;
    const url = target ? `${path}?${target}` : path;
    window.history.replaceState(window.history.state, "", url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCity, scrubYear]);
}
