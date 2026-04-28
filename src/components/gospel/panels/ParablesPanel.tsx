"use client";

import { useMemo, useState } from "react";
import { GOSPEL_PARABLES } from "@/data/gospel/parables";
import { GOSPEL_LOCATIONS } from "@/data/gospel/locations";
import type { Parable, ParableTheme } from "@/types/gospel";
import { SectionLabel } from "@/components/layout/SectionLabel";
import { ScriptureRef } from "@/components/bible/ScriptureRef";
import { ProseWithRefs } from "@/components/bible/ProseWithRefs";
import { useGospelStore } from "@/hooks/useGospelStore";

const THEME_LABEL: Record<ParableTheme | "all", string> = {
  all: "Все",
  kingdom: "Царство",
  mercy: "Милость",
  prayer: "Молитва",
  judgment: "Суд",
  discipleship: "Ученичество",
  watchfulness: "Бодрствование",
  lostness: "Потерянное",
};

const THEME_COLORS: Record<ParableTheme, string> = {
  kingdom: "var(--color-rust)",
  mercy: "var(--color-modern-blue)",
  prayer: "#5a7a4a",
  judgment: "#7a2d1f",
  discipleship: "var(--color-amber)",
  watchfulness: "#6b5a3a",
  lostness: "#8a6677",
};

const ORDERED_THEMES: Array<ParableTheme | "all"> = [
  "all", "kingdom", "lostness", "mercy", "prayer", "judgment", "watchfulness", "discipleship",
];

function refList(p: Parable): string[] {
  return [p.refs.mt, p.refs.mk, p.refs.lk].filter(Boolean) as string[];
}

export function ParablesPanel() {
  const [filter, setFilter] = useState<ParableTheme | "all">("all");
  const setSelectedLocation = useGospelStore((s) => s.setSelectedLocation);

  const filtered = useMemo(
    () => (filter === "all" ? GOSPEL_PARABLES : GOSPEL_PARABLES.filter((p) => p.theme === filter)),
    [filter],
  );

  return (
    <div className="relative z-[2] mx-auto my-7" style={{ width: "min(96%, 1400px)" }}>
      <SectionLabel className="mb-3 text-center">
        Притчи Иисуса Христа · <em>The Parables of Jesus</em>
      </SectionLabel>

      <div className="mb-4 flex flex-wrap items-center justify-center gap-1.5">
        {ORDERED_THEMES.map((t) => {
          const active = filter === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setFilter(t)}
              className={`border px-3 py-1.5 font-sans text-[11px] uppercase tracking-[0.15em] transition-colors ${
                active
                  ? "border-(--color-ink) bg-(--color-ink) text-(--color-parchment-grad-start)"
                  : "border-(--color-sepia-light) bg-(--color-parchment-light)/50 text-(--color-sepia) hover:bg-(--color-parchment-light)"
              }`}
            >
              {THEME_LABEL[t]}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((p) => {
          const refs = refList(p);
          const loc = p.location ? GOSPEL_LOCATIONS[p.location] : null;
          return (
            <article
              key={p.id}
              className="border border-(--color-sepia-light) bg-(--color-parchment-light)/60 px-4 py-3 text-(--color-ink) sm:px-5 sm:py-4"
            >
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <span
                  className="font-sans text-[10px] uppercase tracking-[0.2em]"
                  style={{ color: THEME_COLORS[p.theme] }}
                >
                  {THEME_LABEL[p.theme]}
                </span>
                {loc && (
                  <button
                    type="button"
                    onClick={() => p.location && setSelectedLocation(p.location)}
                    className="text-[11px] italic text-(--color-sepia) hover:text-(--color-ink) hover:underline"
                  >
                    {loc.ru}
                  </button>
                )}
              </div>
              <h3 className="m-0 text-[16px] font-medium leading-tight sm:text-[17px]">{p.ru}</h3>
              <div className="mt-0.5 text-[12px] italic text-(--color-sepia)">{p.en}</div>
              <p className="mt-2 text-[13px] leading-snug text-(--color-ink-muted) sm:text-[14px]">
                <ProseWithRefs text={p.summary} />
              </p>
              {refs.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-x-2 gap-y-0.5 text-[11px] italic text-(--color-rust)">
                  {refs.map((r, i) => (
                    <ScriptureRef key={i} refText={r} />
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
