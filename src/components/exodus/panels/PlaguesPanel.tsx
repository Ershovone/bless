"use client";

import { useState } from "react";
import { EXODUS_PLAGUES } from "@/data/exodus/plagues";
import type { PlagueId } from "@/types/exodus";
import { SectionLabel } from "@/components/layout/SectionLabel";

export function PlaguesPanel() {
  const [openId, setOpenId] = useState<PlagueId | null>(null);

  return (
    <div className="relative z-[2] mx-auto my-5" style={{ width: "min(96%, 1200px)" }}>
      <SectionLabel className="mb-3">
        Десять казней Египетских · <em>The Ten Plagues</em>
      </SectionLabel>
      <ol className="grid list-none grid-cols-2 gap-2 p-0 sm:grid-cols-3 lg:grid-cols-5">
        {EXODUS_PLAGUES.map((p) => {
          const isOpen = openId === p.id;
          return (
            <li key={p.id} className="m-0 p-0">
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : p.id)}
                aria-expanded={isOpen}
                className={`flex w-full flex-col items-start gap-1 border px-3.5 py-3 text-left transition-all ${
                  isOpen
                    ? "border-(--color-rust) bg-(--color-parchment-light) text-(--color-ink)"
                    : "border-(--color-sepia-light) bg-(--color-parchment-light)/60 text-(--color-ink) hover:bg-(--color-parchment-light)"
                }`}
              >
                <div className="flex w-full items-baseline justify-between">
                  <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-(--color-rust)">
                    {p.numeral}
                  </span>
                  <span aria-hidden className="text-2xl text-(--color-rust) opacity-80">
                    {p.glyph}
                  </span>
                </div>
                <span className="text-[15px] font-medium">{p.ru}</span>
                <span className="text-[11px] italic text-(--color-sepia)">{p.en}</span>
                <span className="font-sans text-[10px] tracking-[0.1em] text-(--color-sepia-light)">
                  {p.ref}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {openId && (
        <div
          className="mt-3 border border-(--color-sepia-light) bg-(--color-parchment-light)/80 p-5 text-[15px] leading-[1.6] text-(--color-ink)"
          role="region"
          aria-live="polite"
        >
          {EXODUS_PLAGUES.find((p) => p.id === openId)?.description}
        </div>
      )}
    </div>
  );
}
