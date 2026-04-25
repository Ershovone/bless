"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAtlasStore } from "./useAtlasStore";
import { BASE_PATH } from "@/lib/seo/paths";

const PARAM_CITY = "city";
const PARAM_YEAR = "year";

function stripBasePath(pathname: string): string {
  if (BASE_PATH && pathname.startsWith(BASE_PATH)) {
    return pathname.slice(BASE_PATH.length) || "/";
  }
  return pathname || "/";
}

export function useURLSync(): void {
  const router = useRouter();
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

  // Write store changes back to URL — but only when something actually differs.
  useEffect(() => {
    if (!hydratedRef.current) return;
    const next = new URLSearchParams();
    if (selectedCity) next.set(PARAM_CITY, selectedCity);
    if (scrubYear !== null) next.set(PARAM_YEAR, String(scrubYear));
    const target = next.toString();
    if (target === params.toString()) return;

    const path = stripBasePath(window.location.pathname);
    router.replace(target ? `${path}?${target}` : path, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCity, scrubYear]);
}
