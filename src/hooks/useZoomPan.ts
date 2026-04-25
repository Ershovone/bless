"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MAP_SIZE, ZOOM } from "@/constants/map";
import { useAtlasStore } from "./useAtlasStore";

type DragState = { sx: number; sy: number; px: number; py: number; z: number };
type PinchState = { startDist: number; startZoom: number };

const TAP_MAX_MOVE_PX = 8;

function clampZoom(z: number): number {
  return Math.max(ZOOM.min, Math.min(ZOOM.max, z));
}

type ViewBox = { x: number; y: number; w: number; h: number };

export type ZoomPanState = {
  initialViewBox: ViewBox;
  zoomIn: () => void;
  zoomOut: () => void;
  reset: () => void;
  onMouseDown: React.MouseEventHandler<SVGSVGElement>;
  onMouseMove: React.MouseEventHandler<SVGSVGElement>;
  onMouseUp: React.MouseEventHandler<SVGSVGElement>;
  onMouseLeave: React.MouseEventHandler<SVGSVGElement>;
  dragging: boolean;
  svgRef: React.RefObject<SVGSVGElement | null>;
};

// Effective viewBox region actually rendered into the container under
// preserveAspectRatio="xMidYMid slice". When container aspect != viewBox
// aspect, the slice axis is centered and the off-axis part is hidden.
function effectiveSliceSize(vbW: number, vbH: number, container: { width: number; height: number }): { evisW: number; evisH: number } {
  const vbAspect = vbW / vbH;
  const cAspect = container.width / container.height;
  if (cAspect < vbAspect) return { evisW: vbH * cAspect, evisH: vbH };
  return { evisW: vbW, evisH: vbW / cAspect };
}

function viewBoxFor(
  zoom: number,
  pan: { x: number; y: number },
  container: { width: number; height: number } | null,
): ViewBox {
  const { width, height } = MAP_SIZE;
  const w = width / zoom;
  const h = height / zoom;
  const cx = width / 2 + pan.x;
  const cy = height / 2 + pan.y;
  const evis = container ? effectiveSliceSize(w, h, container) : { evisW: w, evisH: h };
  const minX = (evis.evisW - w) / 2;
  const maxX = width - (w + evis.evisW) / 2;
  const minY = (evis.evisH - h) / 2;
  const maxY = height - (h + evis.evisH) / 2;
  const x = Math.max(minX, Math.min(maxX, cx - w / 2));
  const y = Math.max(minY, Math.min(maxY, cy - h / 2));
  return { x, y, w, h };
}

function applyViewBox(el: SVGSVGElement, vb: ViewBox): void {
  el.setAttribute("viewBox", `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
}

function pointInMapCoords(
  el: Element,
  clientX: number,
  clientY: number,
  zoom: number,
  pan: { x: number; y: number },
): { mx: number; my: number; ptX: number; ptY: number } {
  const rect = el.getBoundingClientRect();
  const mx = (clientX - rect.left) / rect.width;
  const my = (clientY - rect.top) / rect.height;
  const vb = viewBoxFor(zoom, pan, rect);
  const { evisW, evisH } = effectiveSliceSize(vb.w, vb.h, rect);
  const visX = vb.x + (vb.w - evisW) / 2;
  const visY = vb.y + (vb.h - evisH) / 2;
  return { mx, my, ptX: visX + mx * evisW, ptY: visY + my * evisH };
}

function panForZoomAround(
  ptX: number,
  ptY: number,
  mx: number,
  my: number,
  nextZoom: number,
): { x: number; y: number } {
  const w = MAP_SIZE.width / nextZoom;
  const h = MAP_SIZE.height / nextZoom;
  const newCx = ptX - (mx - 0.5) * w;
  const newCy = ptY - (my - 0.5) * h;
  return { x: newCx - MAP_SIZE.width / 2, y: newCy - MAP_SIZE.height / 2 };
}

function touchDistance(t1: Touch, t2: Touch): number {
  return Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
}

function touchMidpoint(t1: Touch, t2: Touch): { x: number; y: number } {
  return { x: (t1.clientX + t2.clientX) / 2, y: (t1.clientY + t2.clientY) / 2 };
}

export function useZoomPan(): ZoomPanState {
  const [dragging, setDragging] = useState(false);

  const zoomRef = useRef<number>(ZOOM.min);
  const panRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragRef = useRef<DragState | null>(null);
  const pinchRef = useRef<PinchState | null>(null);
  const touchMovedRef = useRef<boolean>(false);
  const rafRef = useRef<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const flushView = useCallback((): void => {
    const el = svgRef.current;
    if (!el) return;
    applyViewBox(el, viewBoxFor(zoomRef.current, panRef.current, el.getBoundingClientRect()));
  }, []);

  const scheduleDisplaySync = useCallback((): void => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      useAtlasStore.getState().setZoomDisplay(zoomRef.current);
    });
  }, []);

  const setZoomPan = useCallback(
    (zoom: number, pan: { x: number; y: number }): void => {
      zoomRef.current = zoom;
      panRef.current = pan;
      flushView();
      scheduleDisplaySync();
    },
    [flushView, scheduleDisplaySync],
  );

  // Wheel + touch listeners (non-passive so we can call preventDefault).
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;

    const zoomAround = (clientX: number, clientY: number, nextZoom: number): void => {
      const z0 = zoomRef.current;
      if (nextZoom === z0) return;
      const { mx, my, ptX, ptY } = pointInMapCoords(el, clientX, clientY, z0, panRef.current);
      const nextPan = panForZoomAround(ptX, ptY, mx, my, nextZoom);
      setZoomPan(nextZoom, nextPan);
    };

    const onWheel = (e: WheelEvent): void => {
      e.preventDefault();
      const delta = -Math.sign(e.deltaY) * ZOOM.wheelDelta;
      zoomAround(e.clientX, e.clientY, clampZoom(zoomRef.current * (1 + delta)));
    };

    const onTouchStart = (e: TouchEvent): void => {
      touchMovedRef.current = false;
      if (e.touches.length === 1) {
        const t = e.touches[0];
        dragRef.current = {
          sx: t.clientX,
          sy: t.clientY,
          px: panRef.current.x,
          py: panRef.current.y,
          z: zoomRef.current,
        };
        pinchRef.current = null;
        setDragging(true);
      } else if (e.touches.length === 2) {
        pinchRef.current = {
          startDist: touchDistance(e.touches[0], e.touches[1]),
          startZoom: zoomRef.current,
        };
        dragRef.current = null;
        setDragging(false);
      }
    };

    const onTouchMove = (e: TouchEvent): void => {
      if (e.touches.length === 2 && pinchRef.current) {
        e.preventDefault();
        touchMovedRef.current = true;
        const ratio = touchDistance(e.touches[0], e.touches[1]) / pinchRef.current.startDist;
        const nextZoom = clampZoom(pinchRef.current.startZoom * ratio);
        const mid = touchMidpoint(e.touches[0], e.touches[1]);
        zoomAround(mid.x, mid.y, nextZoom);
        return;
      }

      const d = dragRef.current;
      if (!d || e.touches.length !== 1) return;
      e.preventDefault();
      const t = e.touches[0];
      const dx = t.clientX - d.sx;
      const dy = t.clientY - d.sy;
      if (Math.abs(dx) + Math.abs(dy) > TAP_MAX_MOVE_PX) touchMovedRef.current = true;
      const rect = el.getBoundingClientRect();
      const sliceScale = Math.max(rect.width / (MAP_SIZE.width / d.z), rect.height / (MAP_SIZE.height / d.z));
      setZoomPan(zoomRef.current, { x: d.px - dx / sliceScale, y: d.py - dy / sliceScale });
    };

    const onTouchEnd = (e: TouchEvent): void => {
      if (e.touches.length === 0) {
        dragRef.current = null;
        pinchRef.current = null;
        setDragging(false);
      } else if (e.touches.length === 1 && pinchRef.current) {
        const t = e.touches[0];
        pinchRef.current = null;
        dragRef.current = {
          sx: t.clientX,
          sy: t.clientY,
          px: panRef.current.x,
          py: panRef.current.y,
          z: zoomRef.current,
        };
      }
    };

    const onTouchCancel = (): void => {
      dragRef.current = null;
      pinchRef.current = null;
      setDragging(false);
    };

    // Suppress synthetic clicks after a pan/pinch so dragging doesn't open a city panel.
    const onClickCapture = (e: MouseEvent): void => {
      if (touchMovedRef.current) {
        e.stopPropagation();
        e.preventDefault();
        touchMovedRef.current = false;
      }
    };

    const onResize = (): void => flushView();

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("touchcancel", onTouchCancel, { passive: true });
    el.addEventListener("click", onClickCapture, true);
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchCancel);
      el.removeEventListener("click", onClickCapture, true);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [setZoomPan, flushView]);

  const zoomIn = useCallback(() => {
    setZoomPan(clampZoom(zoomRef.current * ZOOM.step), panRef.current);
  }, [setZoomPan]);

  const zoomOut = useCallback(() => {
    setZoomPan(clampZoom(zoomRef.current / ZOOM.step), panRef.current);
  }, [setZoomPan]);

  const reset = useCallback(() => {
    setZoomPan(ZOOM.min, { x: 0, y: 0 });
  }, [setZoomPan]);

  const onMouseDown = useCallback<React.MouseEventHandler<SVGSVGElement>>((e) => {
    if (e.button !== 0) return;
    dragRef.current = {
      sx: e.clientX,
      sy: e.clientY,
      px: panRef.current.x,
      py: panRef.current.y,
      z: zoomRef.current,
    };
    setDragging(true);
  }, []);

  const onMouseMove = useCallback<React.MouseEventHandler<SVGSVGElement>>(
    (e) => {
      const d = dragRef.current;
      if (!d) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const sliceScale = Math.max(rect.width / (MAP_SIZE.width / d.z), rect.height / (MAP_SIZE.height / d.z));
      setZoomPan(zoomRef.current, {
        x: d.px - (e.clientX - d.sx) / sliceScale,
        y: d.py - (e.clientY - d.sy) / sliceScale,
      });
    },
    [setZoomPan],
  );

  const endDrag = useCallback(() => {
    dragRef.current = null;
    setDragging(false);
  }, []);

  const initialViewBox = useMemo(() => viewBoxFor(ZOOM.min, { x: 0, y: 0 }, null), []);

  return {
    initialViewBox,
    zoomIn,
    zoomOut,
    reset,
    onMouseDown,
    onMouseMove,
    onMouseUp: endDrag,
    onMouseLeave: endDrag,
    dragging,
    svgRef,
  };
}
