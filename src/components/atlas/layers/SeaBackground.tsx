import { MAP_SIZE } from "@/constants/map";
import { SEA_GRADIENT_ID } from "./MapDefs";

type SeaBackgroundProps = {
  width?: number;
  height?: number;
};

export function SeaBackground({
  width = MAP_SIZE.width,
  height = MAP_SIZE.height,
}: SeaBackgroundProps = {}) {
  return <rect width={width} height={height} fill={`url(#${SEA_GRADIENT_ID})`} />;
}
