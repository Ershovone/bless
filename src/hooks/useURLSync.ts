"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAtlasStore } from "./useAtlasStore";

const PARAM_CITY = "city";
const PARAM_YEAR = "year";

export function useURLSync(): void {
  const router = useRouter();
  const params = useSearchParams();

  const selectedCity = useAtlasStore((s) => s.selectedCity);
  const scrubYear = useAtlasStore((s) => s.scrubYear);
  const setSelectedCity = useAtlasStore((s) => s.setSelectedCity);
  const setScrubYear = useAtlasStore((s) => s.setScrubYear);

  // Hydrate from URL on first mount.
  useEffect(() => {
    const city = params.get(PARAM_CITY);
    const year = params.get(PARAM_YEAR);
    if (city) setSelectedCity(city);
    if (year) {
      const y = Number.parseInt(year, 10);
      if (!Number.isNaN(y)) setScrubYear(y);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Write back.
  useEffect(() => {
    const next = new URLSearchParams(params.toString());
    if (selectedCity) next.set(PARAM_CITY, selectedCity);
    else next.delete(PARAM_CITY);
    if (scrubYear !== null) next.set(PARAM_YEAR, String(scrubYear));
    else next.delete(PARAM_YEAR);

    const qs = next.toString();
    const url = qs ? `?${qs}` : window.location.pathname;
    router.replace(url, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCity, scrubYear]);
}
