"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MAP_SIZE, ZOOM } from "@/constants/map";

type DragState = { sx: number; sy: number; px: number; py: number; z: number };
type PinchState = { startDist: number; startZoom: number; cx: number; cy: number };

const TAP_MAX_MOVE_PX = 8;

function clampZoom(z: number): number {
  return Math.max(ZOOM.min, Math.min(ZOOM.max, z));
}

export type ZoomPanState = {
  zoom: number;
  pan: { x: number; y: number };
  viewBox: { x: number; y: number; w: number; h: number };
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

function viewBoxFor(zoom: number, pan: { x: number; y: number }) {
  const { width, height } = MAP_SIZE;
  const w = width / zoom;
  const h = height / zoom;
  const cx = width / 2 + pan.x;
  const cy = height / 2 + pan.y;
  const x = Math.max(0, Math.min(width - w, cx - w / 2));
  const y = Math.max(0, Math.min(height - h, cy - h / 2));
  return { x, y, w, h };
}

function zoomAroundPoint(
  el: Element,
  clientX: number,
  clientY: number,
  nextZoom: number,
  prevZoom: number,
  prevPan: { x: number; y: number },
): { x: number; y: number } {
  const rect = el.getBoundingClientRect();
  const mx = (clientX - rect.left) / rect.width;
  const my = (clientY - rect.top) / rect.height;
  const vb0 = viewBoxFor(prevZoom, prevPan);
  const ptX = vb0.x + mx * vb0.w;
  const ptY = vb0.y + my * vb0.h;
  const w1 = MAP_SIZE.width / nextZoom;
  const h1 = MAP_SIZE.height / nextZoom;
  const newCx = ptX - (mx - 0.5) * w1;
  const newCy = ptY - (my - 0.5) * h1;
  return { x: newCx - MAP_SIZE.width / 2, y: newCy - MAP_SIZE.height / 2 };
}

function touchDistance(t1: Touch, t2: Touch): number {
  return Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
}

function touchMidpoint(t1: Touch, t2: Touch): { x: number; y: number } {
  return { x: (t1.clientX + t2.clientX) / 2, y: (t1.clientY + t2.clientY) / 2 };
}

export function useZoomPan(): ZoomPanState {
  const [zoom, setZoom] = useState<number>(ZOOM.min);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const zoomRef = useRef<number>(zoom);
  const panRef = useRef<{ x: number; y: number }>(pan);
  const dragRef = useRef<DragState | null>(null);
  const pinchRef = useRef<PinchState | null>(null);
  const touchMovedRef = useRef<boolean>(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => { zoomRef.current = zoom; }, [zoom]);
  useEffect(() => { panRef.current = pan; }, [pan]);

  // Non-passive wheel + touch listeners (React synthetic events are passive).
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;

    const applyZoomAround = (clientX: number, clientY: number, nextZoom: number): void => {
      const z0 = zoomRef.current;
      if (nextZoom === z0) return;
      const nextPan = zoomAroundPoint(el, clientX, clientY, nextZoom, z0, panRef.current);
      zoomRef.current = nextZoom;
      panRef.current = nextPan;
      setZoom(nextZoom);
      setPan(nextPan);
    };

    const onWheel = (e: WheelEvent): void => {
      e.preventDefault();
      const delta = -Math.sign(e.deltaY) * ZOOM.wheelDelta;
      applyZoomAround(e.clientX, e.clientY, clampZoom(zoomRef.current * (1 + delta)));
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
        const [a, b] = [e.touches[0], e.touches[1]];
        const mid = touchMidpoint(a, b);
        pinchRef.current = {
          startDist: touchDistance(a, b),
          startZoom: zoomRef.current,
          cx: mid.x,
          cy: mid.y,
        };
        dragRef.current = null;
        setDragging(false);
      }
    };

    const onTouchMove = (e: TouchEvent): void => {
      if (e.touches.length === 2 && pinchRef.current) {
        e.preventDefault();
        touchMovedRef.current = true;
        const [a, b] = [e.touches[0], e.touches[1]];
        const dist = touchDistance(a, b);
        const ratio = dist / pinchRef.current.startDist;
        const nextZoom = clampZoom(pinchRef.current.startZoom * ratio);
        const mid = touchMidpoint(a, b);
        applyZoomAround(mid.x, mid.y, nextZoom);
        pinchRef.current = {
          ...pinchRef.current,
          cx: mid.x,
          cy: mid.y,
        };
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
      const scale = (MAP_SIZE.width / d.z) / rect.width;
      const nextPan = { x: d.px - dx * scale, y: d.py - dy * scale };
      panRef.current = nextPan;
      setPan(nextPan);
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

    // Suppress synthetic clicks after a pan gesture so tapping a city still works but dragging doesn't open it.
    const onClickCapture = (e: MouseEvent): void => {
      if (touchMovedRef.current) {
        e.stopPropagation();
        e.preventDefault();
        touchMovedRef.current = false;
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("touchcancel", onTouchCancel, { passive: true });
    el.addEventListener("click", onClickCapture, true);

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchCancel);
      el.removeEventListener("click", onClickCapture, true);
    };
  }, []);

  const zoomIn = useCallback(() => setZoom((z) => clampZoom(z * ZOOM.step)), []);
  const zoomOut = useCallback(() => setZoom((z) => clampZoom(z / ZOOM.step)), []);
  const reset = useCallback(() => {
    setZoom(ZOOM.min);
    setPan({ x: 0, y: 0 });
  }, []);

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

  const onMouseMove = useCallback<React.MouseEventHandler<SVGSVGElement>>((e) => {
    const d = dragRef.current;
    if (!d) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const scale = (MAP_SIZE.width / d.z) / rect.width;
    setPan({
      x: d.px - (e.clientX - d.sx) * scale,
      y: d.py - (e.clientY - d.sy) * scale,
    });
  }, []);

  const endDrag = useCallback(() => {
    dragRef.current = null;
    setDragging(false);
  }, []);

  return {
    zoom,
    pan,
    viewBox: viewBoxFor(zoom, pan),
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
