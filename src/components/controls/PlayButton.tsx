"use client";

import { useAtlasStore } from "@/hooks/useAtlasStore";

export function PlayButton() {
  const playing = useAtlasStore((s) => s.playing);
  const setPlaying = useAtlasStore((s) => s.setPlaying);

  return (
    <button
      type="button"
      onClick={() => setPlaying(!playing)}
      className="whitespace-nowrap bg-(--color-rust) px-5 py-3.5 text-sm uppercase tracking-[0.12em] text-(--color-parchment-grad-start) shadow-[0_6px_16px_-4px_rgba(139,74,43,0.5)] transition-transform hover:-translate-y-px"
    >
      {playing ? "❚❚  Остановить" : "▶  Проиграть путь"}
    </button>
  );
}
