import { MAP_SIZE } from "@/constants/map";
import { SEA_GRADIENT_ID, SEA_LINES_ID } from "./MapDefs";

export function SeaBackground() {
  return (
    <>
      <rect width={MAP_SIZE.width} height={MAP_SIZE.height} fill={`url(#${SEA_GRADIENT_ID})`} />
      <rect width={MAP_SIZE.width} height={MAP_SIZE.height} fill={`url(#${SEA_LINES_ID})`} />
    </>
  );
}
