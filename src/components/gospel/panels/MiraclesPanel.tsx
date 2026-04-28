"use client";

import { useMemo, useState } from "react";
import { GOSPEL_MIRACLES } from "@/data/gospel/miracles";
import { GOSPEL_LOCATIONS } from "@/data/gospel/locations";
import type { Miracle, MiracleCategory } from "@/types/gospel";
import { SectionLabel } from "@/components/layout/SectionLabel";
import { ScriptureRef } from "@/components/bible/ScriptureRef";
import { ProseWithRefs } from "@/components/bible/ProseWithRefs";
import { useGospelStore } from "@/hooks/useGospelStore";

const CATEGORY_LABELS: Record<MiracleCategory | "all", { ru: string; en: string }> = {
  all: { ru: "Все", en: "All" },
  healing: { ru: "Исцеления", en: "Healings" },
  exorcism: { ru: "Изгнания бесов", en: "Exorcisms" },
  raising: { ru: "Воскрешения", en: "Raisings" },
  nature: { ru: "Над природой", en: "Over Nature" },
  feeding: { ru: "Насыщения", en: "Feedings" },
};

const CATEGORY_COLORS: Record<MiracleCategory, string> = {
  healing: "var(--color-modern-blue)",
  exorcism: "#7a2d1f",
  raising: "var(--color-amber)",
  nature: "#5a7a4a",
  feeding: "var(--color-rust)",
};

const ORDERED_CATEGORIES: Array<MiracleCategory | "all"> = [
  "all",
  "healing",
  "exorcism",
  "raising",
  "nature",
  "feeding",
];

function refList(m: Miracle): string[] {
  return [m.refs.mt, m.refs.mk, m.refs.lk, m.refs.jn].filter(Boolean) as string[];
}

export function MiraclesPanel() {
  const [filter, setFilter] = useState<MiracleCategory | "all">("all");
  const setSelectedLocation = useGospelStore((s) => s.setSelectedLocation);

  const filtered = useMemo(
    () => (filter === "all" ? GOSPEL_MIRACLES : GOSPEL_MIRACLES.filter((m) => m.category === filter)),
    [filter],
  );

  return (
    <div className="relative z-[2] mx-auto my-7" style={{ width: "min(96%, 1400px)" }}>
      <SectionLabel className="mb-3 text-center">
        Чудеса Господни · <em>The Miracles of Jesus</em>
      </SectionLabel>

      <div className="mb-4 flex flex-wrap items-center justify-center gap-1.5">
        {ORDERED_CATEGORIES.map((cat) => {
          const active = filter === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`border px-3 py-1.5 font-sans text-[11px] uppercase tracking-[0.15em] transition-colors ${
                active
                  ? "border-(--color-ink) bg-(--color-ink) text-(--color-parchment-grad-start)"
                  : "border-(--color-sepia-light) bg-(--color-parchment-light)/50 text-(--color-sepia) hover:bg-(--color-parchment-light)"
              }`}
            >
              {CATEGORY_LABELS[cat].ru}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((m) => {
          const refs = refList(m);
          const loc = m.location ? GOSPEL_LOCATIONS[m.location] : null;
          return (
            <article
              key={m.id}
              className="border border-(--color-sepia-light) bg-(--color-parchment-light)/60 px-4 py-3 text-(--color-ink) sm:px-5 sm:py-4"
            >
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <span
                  className="font-sans text-[10px] uppercase tracking-[0.2em]"
                  style={{ color: CATEGORY_COLORS[m.category] }}
                >
                  {CATEGORY_LABELS[m.category].ru}
                </span>
                {loc && (
                  <button
                    type="button"
                    onClick={() => m.location && setSelectedLocation(m.location)}
                    className="text-[11px] italic text-(--color-sepia) hover:text-(--color-ink) hover:underline"
                  >
                    {loc.ru}
                  </button>
                )}
              </div>
              <h3 className="m-0 text-[16px] font-medium leading-tight sm:text-[17px]">{m.ru}</h3>
              <div className="mt-0.5 text-[12px] italic text-(--color-sepia)">{m.en}</div>
              <p className="mt-2 text-[13px] leading-snug text-(--color-ink-muted) sm:text-[14px]">
                <ProseWithRefs text={m.description} />
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
