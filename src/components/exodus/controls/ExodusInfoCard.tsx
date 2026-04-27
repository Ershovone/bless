"use client";

import { EXODUS_PHASES } from "@/data/exodus/phases";
import { EXODUS_STATIONS } from "@/data/exodus/stations";
import { useExodusStore } from "@/hooks/useExodusStore";

export function ExodusInfoCard() {
  const activeIdx = useExodusStore((s) => s.activePhaseIdx);
  const phase = EXODUS_PHASES[activeIdx];

  return (
    <div
      className="relative z-[2] mx-auto my-5 grid items-start gap-6 border border-(--color-sepia-light) bg-(--color-parchment-light)/60 px-7 py-6 max-md:grid-cols-1 md:[grid-template-columns:1fr_2fr]"
      style={{ width: "min(96%, 1200px)" }}
    >
      <div>
        <div className="mb-1 text-xs uppercase tracking-[0.2em] text-(--color-rust)">
          {phase.acts}
        </div>
        <h2 className="m-0 text-[30px] font-normal leading-tight">{phase.ru}</h2>
        <div className="mt-1 text-[15px] italic text-(--color-sepia)">
          {phase.en} · {phase.yearsBC}
        </div>
      </div>
      <p className="m-0 text-base leading-[1.55]">{phase.description}</p>
      <div className="col-span-full text-sm leading-[2] text-(--color-ink-muted)">
        {phase.stations.map((id, i) => (
          <span key={id}>
            <span className="italic">{EXODUS_STATIONS[id].en}</span>
            {i < phase.stations.length - 1 && (
              <span className="mx-2 text-(--color-amber)">→</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
