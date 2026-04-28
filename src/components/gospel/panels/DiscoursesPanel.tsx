"use client";

import { GOSPEL_DISCOURSES } from "@/data/gospel/discourses";
import { GOSPEL_LOCATIONS } from "@/data/gospel/locations";
import { SectionLabel } from "@/components/layout/SectionLabel";
import { ScriptureRef } from "@/components/bible/ScriptureRef";
import { ProseWithRefs } from "@/components/bible/ProseWithRefs";
import { useGospelStore } from "@/hooks/useGospelStore";

export function DiscoursesPanel() {
  const setSelectedLocation = useGospelStore((s) => s.setSelectedLocation);

  return (
    <div className="relative z-[2] mx-auto my-7" style={{ width: "min(96%, 1300px)" }}>
      <SectionLabel className="mb-3 text-center">
        Великие беседы Иисуса · <em>The Major Discourses</em>
      </SectionLabel>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {GOSPEL_DISCOURSES.map((d) => {
          const loc = d.location ? GOSPEL_LOCATIONS[d.location] : null;
          return (
            <article
              key={d.id}
              className="border border-(--color-sepia-light) bg-(--color-parchment-light)/60 px-5 py-4 text-(--color-ink)"
            >
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <h3 className="m-0 text-[18px] font-medium leading-tight sm:text-[20px]">{d.ru}</h3>
                <span className="shrink-0 text-[12px] italic text-(--color-rust)">
                  <ScriptureRef refText={d.ref} />
                </span>
              </div>
              <div className="text-[12px] italic text-(--color-sepia)">{d.en}</div>
              {loc && (
                <button
                  type="button"
                  onClick={() => d.location && setSelectedLocation(d.location)}
                  className="mt-1 inline-block font-sans text-[10px] uppercase tracking-[0.18em] text-(--color-sepia-light) hover:text-(--color-ink)"
                >
                  ☖ {loc.ru} · {loc.en}
                </button>
              )}
              <p className="mt-3 text-[14px] leading-[1.55] text-(--color-ink-muted) sm:text-[15px]">
                <ProseWithRefs text={d.summary} />
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
