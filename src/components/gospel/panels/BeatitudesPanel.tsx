"use client";

import { BEATITUDES, BEATITUDES_REF } from "@/data/gospel/beatitudes";
import { SectionLabel } from "@/components/layout/SectionLabel";
import { ScriptureRef } from "@/components/bible/ScriptureRef";

export function BeatitudesPanel() {
  return (
    <div className="relative z-[2] mx-auto my-7" style={{ width: "min(96%, 1100px)" }}>
      <SectionLabel className="mb-2 text-center">
        Заповеди блаженств — Нагорная проповедь · <em>The Beatitudes</em>
      </SectionLabel>
      <div className="mb-4 text-center text-[13px] italic text-(--color-rust)">
        <ScriptureRef refText={BEATITUDES_REF} />
      </div>

      <ol className="grid list-none grid-cols-1 gap-2.5 p-0 md:grid-cols-2 xl:grid-cols-3">
        {BEATITUDES.map((b, i) => (
          <li
            key={i}
            className="border border-(--color-sepia-light) bg-(--color-parchment-light)/60 px-5 py-3.5 text-(--color-ink)"
          >
            <div className="mb-1 flex items-baseline gap-2">
              <span aria-hidden className="font-sans text-[14px] italic text-(--color-rust)">
                {i + 1}
              </span>
              <span className="text-[15px] font-medium leading-tight sm:text-[16px]">{b.ru}</span>
            </div>
            <div className="text-[12px] italic text-(--color-sepia)">{b.en}</div>
            <div className="mt-2 text-[14px] italic leading-snug text-(--color-ink-muted) sm:text-[15px]">
              … {b.promise}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
