"use client";

import type { ReactNode } from "react";
import type { ZoomPanState } from "@/hooks/useZoomPan";

type MapSvgProps = {
  zoomPan: ZoomPanState;
  children: ReactNode;
};

export function MapSvg({ zoomPan, children }: MapSvgProps) {
  const { initialViewBox, svgRef, dragging, onMouseDown, onMouseMove, onMouseUp, onMouseLeave } = zoomPan;
  return (
    <svg
      ref={svgRef}
      viewBox={`${initialViewBox.x} ${initialViewBox.y} ${initialViewBox.w} ${initialViewBox.h}`}
      preserveAspectRatio="xMidYMid slice"
      className="atlas-svg block h-full w-full"
      style={{ cursor: dragging ? "grabbing" : "grab", willChange: "transform", contain: "paint" }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </svg>
  );
}
