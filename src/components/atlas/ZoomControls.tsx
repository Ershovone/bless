"use client";

import { useAtlasStore } from "@/hooks/useAtlasStore";

type ZoomControlsPosition = "bottom-left" | "bottom-right";

type ZoomControlsProps = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  position?: ZoomControlsPosition;
};

const BUTTON_CLS =
  "flex h-8 w-10 items-center justify-center border border-(--color-sepia-light) bg-(--color-parchment-light) text-xl text-(--color-ink) hover:bg-(--color-parchment-darker)";

const POSITION_CLS: Record<ZoomControlsPosition, string> = {
  "bottom-left": "bottom-5 left-5",
  "bottom-right": "bottom-5 right-5",
};

export function ZoomControls({
  onZoomIn,
  onZoomOut,
  onReset,
  position = "bottom-left",
}: ZoomControlsProps) {
  const zoom = useAtlasStore((s) => s.zoomDisplay);
  return (
    <div
      className={`absolute z-[5] flex flex-col gap-1 border border-(--color-sepia-light) bg-(--color-parchment-light)/90 p-1.5 shadow-[0_4px_12px_rgba(74,50,30,0.25)] ${POSITION_CLS[position]}`}
    >
      <button type="button" className={BUTTON_CLS} onClick={onZoomIn} aria-label="Zoom in">
        +
      </button>
      <div className="py-1 text-center font-sans text-[10px] tracking-[0.15em] text-(--color-sepia)">
        {Math.round(zoom * 100)}%
      </div>
      <button type="button" className={BUTTON_CLS} onClick={onZoomOut} aria-label="Zoom out">
        −
      </button>
      <button
        type="button"
        className={`${BUTTON_CLS} text-[11px] tracking-[0.1em]`}
        onClick={onReset}
        aria-label="Reset zoom"
      >
        RESET
      </button>
    </div>
  );
}
