"use client";

import { useEffect, useRef } from "react";
import { useAtlasStore } from "./useAtlasStore";
import { PLAY_DURATION_MS } from "@/constants/map";

export function usePlayback(): void {
  const playing = useAtlasStore((s) => s.playing);
  const activeJ = useAtlasStore((s) => s.activeJ);
  const setPlayT = useAtlasStore((s) => s.setPlayT);
  const setPlaying = useAtlasStore((s) => s.setPlaying);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) return;
    setPlayT(0);
    const start = performance.now();

    const tick = (now: number): void => {
      const t = Math.min(1, (now - start) / PLAY_DURATION_MS);
      setPlayT(t);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setPlaying(false);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, activeJ, setPlayT, setPlaying]);
}
