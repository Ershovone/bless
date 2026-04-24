import type { CSSProperties, ReactNode } from "react";
import { FLEURON_GLYPH } from "@/constants/design";
import { MAP_SIZE } from "@/constants/map";

const DESKTOP_FRAME_HEIGHT_PX = 900;

const CORNER_CLS =
  "pointer-events-none absolute z-3 text-[26px] text-(--color-rust) opacity-60";

const FRAME_STYLE: CSSProperties = {
  boxShadow:
    "0 0 0 8px #e8dcc4, 0 0 0 9px #8b6f47, 0 50px 100px -20px rgba(74,50,30,0.4), inset 0 0 80px rgba(139,111,71,0.15)",
  background: "linear-gradient(135deg, #f0e4ca, #e0d2b4)",
  width: "min(98%, 1800px)",
  marginTop: 20,
  marginBottom: 20,
  ["--map-height" as string]: `${DESKTOP_FRAME_HEIGHT_PX}px`,
  ["--map-aspect" as string]: `${MAP_SIZE.width} / ${MAP_SIZE.height}`,
};

export function AtlasFrame({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative z-1 mx-auto border border-(--color-sepia-light) h-(--map-height) max-md:h-auto max-md:aspect-(--map-aspect)"
      style={FRAME_STYLE}
    >
      <div className="absolute inset-0 overflow-hidden">{children}</div>
      <div className={CORNER_CLS} style={{ top: 20, left: 20 }}>{FLEURON_GLYPH}</div>
      <div className={CORNER_CLS} style={{ top: 20, right: 20 }}>{FLEURON_GLYPH}</div>
      <div className={CORNER_CLS} style={{ bottom: 20, left: 20 }}>{FLEURON_GLYPH}</div>
      <div className={CORNER_CLS} style={{ bottom: 20, right: 20 }}>{FLEURON_GLYPH}</div>
    </div>
  );
}
