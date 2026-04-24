import type { City, CityId, LegEstimate } from "@/types/atlas";
import { PORT_CITIES, TRAVEL } from "@/constants/map";
import { haversineKm } from "@/lib/geo/haversine";

export function estimateLeg(
  idA: CityId,
  idB: CityId,
  cities: Record<CityId, City>,
): LegEstimate {
  const a = cities[idA];
  const b = cities[idB];
  const km = haversineKm(a.lon, a.lat, b.lon, b.lat);

  const bothPorts = PORT_CITIES.has(idA) && PORT_CITIES.has(idB);
  const mode =
    bothPorts && km > TRAVEL.bothPortsMinKm
      ? "sea"
      : km > TRAVEL.seaFallbackKm
        ? "sea"
        : "land";

  const speed = mode === "sea" ? TRAVEL.seaKmPerDay : TRAVEL.landKmPerDay;
  const days = km / speed;

  return { km: Math.round(km), days, mode };
}

export function aggregateJourney(
  route: CityId[],
  cities: Record<CityId, City>,
): { totalKm: number; totalDays: number } {
  let totalKm = 0;
  let totalDays = 0;
  for (let i = 0; i < route.length - 1; i++) {
    const leg = estimateLeg(route[i], route[i + 1], cities);
    totalKm += leg.km;
    totalDays += leg.days;
  }
  return { totalKm, totalDays };
}
