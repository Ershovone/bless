"use client";

import { JOURNEYS } from "@/data/journeys";
import { CITIES } from "@/data/cities";
import { useAtlasStore } from "@/hooks/useAtlasStore";
import { PlayButton } from "./PlayButton";
import { ScriptureRef } from "@/components/bible/ScriptureRef";

export function InfoCard() {
  const activeJ = useAtlasStore((s) => s.activeJ);
  const journey = JOURNEYS[activeJ];

  return (
    <div
      className="relative z-[2] mx-auto my-5 grid grid-cols-1 items-start gap-5 border border-(--color-sepia-light) bg-(--color-parchment-light)/60 px-5 py-5 sm:gap-7 sm:px-8 sm:py-7 md:[grid-template-columns:1fr_2fr_auto]"
      style={{ width: "min(96%, 1200px)" }}
    >
      <div>
        <div className="mb-1 text-xs uppercase tracking-[0.2em] text-(--color-rust)">
          <ScriptureRef refText={journey.acts} />
        </div>
        <h2 className="m-0 text-2xl font-normal leading-tight sm:text-[32px] sm:leading-none">
          {journey.ru}
        </h2>
        <div className="mt-1 text-sm italic text-(--color-sepia) sm:text-[15px]">
          {journey.en} · {journey.years}
        </div>
      </div>
      <p className="m-0 text-[15px] leading-[1.55] sm:text-base sm:leading-[1.5]">
        {journey.summary}
      </p>
      <div className="md:self-start">
        <PlayButton />
      </div>
      <div className="text-sm leading-[1.9] text-(--color-ink-muted) md:col-span-full">
        {journey.route.map((id, i) => (
          <span key={i} className="inline-block">
            <span className="italic">{CITIES[id].en}</span>
            {i < journey.route.length - 1 && (
              <span className="mx-1.5 text-(--color-amber)">→</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
