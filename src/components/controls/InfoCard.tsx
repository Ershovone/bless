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
      className="relative z-[2] mx-auto my-5 grid items-start gap-7 border border-(--color-sepia-light) bg-(--color-parchment-light)/60 px-8 py-7"
      style={{ width: "min(96%, 1200px)", gridTemplateColumns: "1fr 2fr auto" }}
    >
      <div>
        <div className="mb-1 text-xs uppercase tracking-[0.2em] text-(--color-rust)">
          <ScriptureRef refText={journey.acts} />
        </div>
        <h2 className="m-0 text-[32px] font-normal leading-none">{journey.ru}</h2>
        <div className="mt-1 text-[15px] italic text-(--color-sepia)">
          {journey.en} · {journey.years}
        </div>
      </div>
      <p className="m-0 text-base leading-[1.5]">{journey.summary}</p>
      <PlayButton />
      <div className="col-span-full text-sm leading-[2] text-(--color-ink-muted)">
        {journey.route.map((id, i) => (
          <span key={i}>
            <span className="italic">{CITIES[id].en}</span>
            {i < journey.route.length - 1 && (
              <span className="mx-2 text-(--color-amber)">→</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
