"use client";

import { GOSPEL_PHASES } from "@/data/gospel/phases";
import { GOSPEL_LOCATIONS } from "@/data/gospel/locations";
import { useGospelStore } from "@/hooks/useGospelStore";
import { ScriptureRef } from "@/components/bible/ScriptureRef";

const REF_SEPARATOR = " · ";

export function GospelInfoCard() {
  const activeIdx = useGospelStore((s) => s.activePhaseIdx);
  const phase = GOSPEL_PHASES[activeIdx];

  return (
    <div
      className="relative z-[2] mx-auto my-5 grid items-start gap-6 border border-(--color-sepia-light) bg-(--color-parchment-light)/60 px-7 py-6 max-md:grid-cols-1 md:[grid-template-columns:1fr_2fr]"
      style={{ width: "min(96%, 1300px)" }}
    >
      <div>
        <div className="mb-1 text-xs uppercase tracking-[0.2em] text-(--color-rust)">
          {phase.acts.split(REF_SEPARATOR).map((part, i, arr) => (
            <span key={i}>
              <ScriptureRef refText={part} />
              {i < arr.length - 1 ? REF_SEPARATOR : ""}
            </span>
          ))}
        </div>
        <h2 className="m-0 text-[28px] font-normal leading-tight sm:text-[30px]">{phase.ru}</h2>
        <div className="mt-1 text-[15px] italic text-(--color-sepia)">
          {phase.en} · {phase.yearsAD}
        </div>
      </div>
      <div>
        <p className="m-0 text-base leading-[1.55]">{phase.description}</p>
        {phase.keyVerse && (
          <blockquote className="mt-4 border-l-2 border-(--color-rust)/60 pl-4 text-[15px] italic leading-snug text-(--color-ink-muted)">
            «{phase.keyVerse.text}»
            <footer className="mt-1.5 not-italic text-[12px] tracking-[0.05em] text-(--color-rust)">
              <ScriptureRef refText={phase.keyVerse.ref} />
            </footer>
          </blockquote>
        )}
      </div>
      <div className="col-span-full text-sm leading-[2] text-(--color-ink-muted)">
        {phase.locations.map((id, i) => {
          const loc = GOSPEL_LOCATIONS[id];
          if (!loc) return null;
          return (
            <span key={`${id}-${i}`}>
              <span className="italic">{loc.en}</span>
              {i < phase.locations.length - 1 && (
                <span className="mx-2 text-(--color-amber)">→</span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
