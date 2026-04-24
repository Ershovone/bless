import { feature } from "topojson-client";
import { geoBounds, geoCentroid, type GeoPath, type GeoProjection } from "d3-geo";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { Topology, GeometryCollection as TopoGeometryCollection } from "topojson-specification";
import { MAP_BOUNDS, BBOX_PADDING_DEG } from "@/constants/map";
import type { CountryPath } from "@/types/atlas";

type CountryProps = { name?: string };

export type LoadedWorld = {
  landPath: string;
  countries: CountryPath[];
};

function featureOverlapsBBox(
  f: Feature<Geometry, CountryProps>,
  bbox: [[number, number], [number, number]],
): boolean {
  const b = geoBounds(f);
  return !(
    b[1][0] < bbox[0][0] ||
    b[0][0] > bbox[1][0] ||
    b[1][1] < bbox[0][1] ||
    b[0][1] > bbox[1][1]
  );
}

export async function loadWorld(
  url: string,
  proj: GeoProjection,
  pathGen: GeoPath,
): Promise<LoadedWorld> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load world topology: ${res.status}`);
  const topology = (await res.json()) as Topology<{
    countries: TopoGeometryCollection<CountryProps>;
  }>;

  const land = feature(topology, topology.objects.countries) as unknown as
    | FeatureCollection<Geometry, CountryProps>
    | Feature<Geometry, CountryProps>;

  const features: Feature<Geometry, CountryProps>[] =
    "features" in land ? land.features : [land];

  const { lonMin, lonMax, latMin, latMax } = MAP_BOUNDS;
  const bbox: [[number, number], [number, number]] = [
    [lonMin - BBOX_PADDING_DEG, latMin - BBOX_PADDING_DEG],
    [lonMax + BBOX_PADDING_DEG, latMax + BBOX_PADDING_DEG],
  ];

  const filtered = features.filter((f) => featureOverlapsBBox(f, bbox));

  const landPath = pathGen({ type: "FeatureCollection", features: filtered }) ?? "";

  const countries: CountryPath[] = filtered.map((f) => {
    const [cLon, cLat] = geoCentroid(f);
    const p = proj([cLon, cLat]);
    return {
      name: f.properties?.name ?? null,
      d: pathGen(f) ?? "",
      cx: p ? p[0] : 0,
      cy: p ? p[1] : 0,
    };
  });

  return { landPath, countries };
}
