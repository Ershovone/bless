"use client";

import type { ReactNode } from "react";
import type { ZoomPanState } from "@/hooks/useZoomPan";

type MapSvgProps = {
  zoomPan: ZoomPanState;
  children: ReactNode;
};

export function MapSvg({ zoomPan, children }: MapSvgProps) {
  const { viewBox, svgRef, dragging, onMouseDown, onMouseMove, onMouseUp, onMouseLeave } = zoomPan;
  return (
    <svg
      ref={svgRef}
      viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
      preserveAspectRatio="xMidYMid slice"
      className="block h-full w-full"
      style={{ cursor: dragging ? "grabbing" : "grab", touchAction: "none" }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </svg>
  );
}
