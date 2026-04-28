"use client";

import { I_AM_SAYINGS } from "@/data/gospel/iAmSayings";
import { SectionLabel } from "@/components/layout/SectionLabel";
import { ScriptureRef } from "@/components/bible/ScriptureRef";

export function IAmSayingsPanel() {
  return (
    <div className="relative z-[2] mx-auto my-7" style={{ width: "min(96%, 1300px)" }}>
      <SectionLabel className="mb-3 text-center">
        Семь «Я есмь» — кто Иисус по Евангелию от Иоанна · <em>The Seven I AM Sayings</em>
      </SectionLabel>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {I_AM_SAYINGS.map((s, i) => (
          <article
            key={s.id}
            className="border border-(--color-sepia-light) bg-(--color-parchment-light)/65 px-5 py-4 text-(--color-ink)"
          >
            <div className="mb-1 font-sans text-[10px] uppercase tracking-[0.25em] text-(--color-rust)">
              {String(i + 1).padStart(2, "0")} · I AM
            </div>
            <h3 className="m-0 font-serif text-[18px] italic leading-tight text-(--color-ink)">
              «{s.ru}»
            </h3>
            <div className="mt-1 text-[12px] italic text-(--color-sepia)">{s.en}</div>
            <div className="mt-1.5 text-[11px] italic text-(--color-rust)">
              <ScriptureRef refText={s.ref} />
            </div>
            <p className="mt-3 text-[14px] leading-snug text-(--color-ink-muted) sm:text-[15px]">
              {s.meaning}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
