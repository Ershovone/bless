"use client";

import { RESURRECTION_APPEARANCES } from "@/data/gospel/resurrectionAppearances";
import { GOSPEL_LOCATIONS } from "@/data/gospel/locations";
import { JERUSALEM_PLACES } from "@/data/gospel/jerusalemPlaces";
import { SectionLabel } from "@/components/layout/SectionLabel";
import { ScriptureRef } from "@/components/bible/ScriptureRef";
import { ProseWithRefs } from "@/components/bible/ProseWithRefs";

function locName(id: string | null): string {
  if (!id) return "—";
  if (id in JERUSALEM_PLACES) return JERUSALEM_PLACES[id].ru;
  if (id in GOSPEL_LOCATIONS) return GOSPEL_LOCATIONS[id].ru;
  return id;
}

export function ResurrectionAppearancesPanel() {
  return (
    <div className="relative z-[2] mx-auto my-7" style={{ width: "min(96%, 1200px)" }}>
      <SectionLabel className="mb-3 text-center">
        Сорок дней явлений Воскресшего · <em>Forty Days of Appearances</em>
      </SectionLabel>

      <ol className="m-0 grid list-none grid-cols-1 gap-2.5 p-0 md:grid-cols-2">
        {RESURRECTION_APPEARANCES.map((a) => {
          const refs = [a.refs.mt, a.refs.mk, a.refs.lk, a.refs.jn, a.refs.other].filter(Boolean) as string[];
          return (
            <li
              key={a.id}
              className="border border-(--color-sepia-light) bg-(--color-parchment-light)/60 px-5 py-4 text-(--color-ink)"
            >
              <div className="mb-1 flex items-center justify-between gap-3">
                <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-(--color-rust)">
                  Явление № {a.order}
                </span>
                <span className="text-[11px] italic text-(--color-sepia)">{locName(a.location)}</span>
              </div>
              <h3 className="m-0 text-[16px] font-medium leading-tight sm:text-[17px]">{a.ru}</h3>
              <p className="mt-2 text-[14px] leading-snug text-(--color-ink-muted) sm:text-[15px]">
                <ProseWithRefs text={a.description} />
              </p>
              {refs.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-x-2 gap-y-0.5 text-[11px] italic text-(--color-rust)">
                  {refs.map((r, i) => (
                    <ScriptureRef key={i} refText={r} />
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
