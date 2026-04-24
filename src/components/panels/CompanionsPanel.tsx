"use client";

import { CITIES } from "@/data/cities";
import { COMPANIONS } from "@/data/companions";
import { useAtlasStore } from "@/hooks/useAtlasStore";
import { SectionLabel } from "@/components/layout/SectionLabel";

export function CompanionsPanel() {
  const activeJ = useAtlasStore((s) => s.activeJ);
  const selectedCompanion = useAtlasStore((s) => s.selectedCompanion);
  const toggleCompanion = useAtlasStore((s) => s.toggleCompanion);

  const entries = Object.entries(COMPANIONS).filter(([, c]) =>
    c.participation.some((p) => p.journeyIdx === activeJ),
  );

  if (entries.length === 0) return null;

  const active = selectedCompanion ? COMPANIONS[selectedCompanion] : null;

  return (
    <div
      className="relative z-[2] mx-auto my-3.5 border border-(--color-sepia-light) bg-(--color-parchment-light)/55 px-7 py-5"
      style={{ width: "min(96%, 1200px)" }}
    >
      <SectionLabel className="mb-3.5">
        Спутники Павла · <em>Paul&apos;s Companions</em>
      </SectionLabel>
      <div className="flex flex-wrap gap-2.5">
        {entries.map(([key, c]) => {
          const part = c.participation.find((p) => p.journeyIdx === activeJ);
          const isActive = selectedCompanion === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggleCompanion(key)}
              className={`flex items-center gap-2.5 border-[1.5px] px-3.5 py-2 pl-2 transition-all ${
                isActive
                  ? "bg-(--color-ink) text-(--color-parchment-grad-start) shadow-[0_6px_18px_-6px_rgba(58,40,23,0.5)]"
                  : "bg-(--color-parchment-light)/70 text-(--color-ink)"
              }`}
              style={{ borderColor: c.color }}
            >
              <span
                className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[16px] italic text-(--color-parchment-light) font-medium"
                style={{ background: c.color }}
              >
                {c.glyph}
              </span>
              <span className="flex flex-col text-left text-[15px] leading-tight">
                <span className="font-medium">{c.ru}</span>
                {part && (
                  <span className="mt-0.5 text-[11px] italic opacity-75">
                    {CITIES[part.joinedAt]?.en} → {CITIES[part.leftAt]?.en}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
      {active && (
        <div className="mt-3.5 border-t border-dotted border-(--color-sepia-light) pt-3.5 text-[15px] leading-[1.5]">
          <div className="mb-1.5 text-xs uppercase tracking-[0.15em] text-(--color-rust)">
            {active.meta}
          </div>
          <div className="text-(--color-ink)">{active.note}</div>
        </div>
      )}
    </div>
  );
}
