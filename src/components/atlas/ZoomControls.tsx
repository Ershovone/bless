"use client";

import { useAtlasStore } from "@/hooks/useAtlasStore";

type ZoomControlsPosition = "bottom-left" | "bottom-right";

type ZoomControlsProps = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  position?: ZoomControlsPosition;
  /** Override the zoom value source — defaults to the Paul store. */
  zoomValue?: number;
};

const BUTTON_CLS =
  "flex h-7 w-8 items-center justify-center border border-(--color-sepia-light) bg-(--color-parchment-light) text-base text-(--color-ink) hover:bg-(--color-parchment-darker) sm:h-8 sm:w-10 sm:text-xl";

const POSITION_CLS: Record<ZoomControlsPosition, string> = {
  "bottom-left": "bottom-3 left-3 sm:bottom-5 sm:left-5",
  "bottom-right": "bottom-3 right-3 sm:bottom-5 sm:right-5",
};

export function ZoomControls({
  onZoomIn,
  onZoomOut,
  onReset,
  position = "bottom-left",
  zoomValue,
}: ZoomControlsProps) {
  const storeZoom = useAtlasStore((s) => s.zoomDisplay);
  const zoom = zoomValue ?? storeZoom;
  return (
    <div
      className={`absolute z-[5] flex flex-col gap-0.5 border border-(--color-sepia-light) bg-(--color-parchment-light)/90 p-1 shadow-[0_4px_12px_rgba(74,50,30,0.25)] sm:gap-1 sm:p-1.5 ${POSITION_CLS[position]}`}
    >
      <button type="button" className={BUTTON_CLS} onClick={onZoomIn} aria-label="Zoom in">
        +
      </button>
      <div className="py-0.5 text-center font-sans text-[9px] tracking-[0.1em] text-(--color-sepia) sm:py-1 sm:text-[10px] sm:tracking-[0.15em]">
        {Math.round(zoom * 100)}%
      </div>
      <button type="button" className={BUTTON_CLS} onClick={onZoomOut} aria-label="Zoom out">
        −
      </button>
      <button
        type="button"
        className={`${BUTTON_CLS} text-[9px] tracking-[0.05em] sm:text-[11px] sm:tracking-[0.1em]`}
        onClick={onReset}
        aria-label="Reset zoom"
      >
        RESET
      </button>
    </div>
  );
}
