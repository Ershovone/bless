"use client";

import { GOSPEL_REGIONS } from "@/data/gospel/regions";
import { useGospelStore } from "@/hooks/useGospelStore";
import { SectionLabel } from "@/components/layout/SectionLabel";

export function RegionsPanel() {
  const selected = useGospelStore((s) => s.selectedRegion);
  const setSelected = useGospelStore((s) => s.setSelectedRegion);
  const showRegions = useGospelStore((s) => s.showRegions);
  const toggleShowRegions = useGospelStore((s) => s.toggleShowRegions);

  return (
    <div className="relative z-[2] mx-auto my-5" style={{ width: "min(96%, 1300px)" }}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <SectionLabel>
          Земли при Иисусе · <em>The Land at the Time of Christ</em>
        </SectionLabel>
        <button
          type="button"
          onClick={toggleShowRegions}
          className="border border-(--color-sepia-light) bg-(--color-parchment-light)/60 px-3 py-1 font-sans text-[10px] uppercase tracking-[0.2em] text-(--color-sepia) hover:bg-(--color-parchment-light)"
          aria-pressed={showRegions}
        >
          {showRegions ? "Скрыть на карте" : "Показать на карте"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {GOSPEL_REGIONS.map((r) => {
          const active = selected === r.id;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => setSelected(active ? null : r.id)}
              className={`flex flex-col items-start gap-1 border px-3.5 py-2.5 text-left transition-all ${
                active
                  ? "border-(--color-ink) bg-(--color-ink) text-(--color-parchment-grad-start)"
                  : "border-(--color-sepia-light) bg-(--color-parchment-light)/60 text-(--color-ink) hover:bg-(--color-parchment-light)"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="inline-block h-2.5 w-2.5"
                  style={{ background: r.color, opacity: 0.85 }}
                />
                <span className="text-[15px] font-medium">{r.ru}</span>
              </div>
              <span
                className={`text-[11px] italic ${active ? "opacity-80" : "text-(--color-sepia) opacity-90"}`}
              >
                {r.en} · {r.ruler}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
