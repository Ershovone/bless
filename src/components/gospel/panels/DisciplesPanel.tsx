"use client";

import { DISCIPLES } from "@/data/gospel/disciples";
import { useGospelStore } from "@/hooks/useGospelStore";
import { SectionLabel } from "@/components/layout/SectionLabel";

export function DisciplesPanel() {
  const selected = useGospelStore((s) => s.selectedDisciple);
  const setSelected = useGospelStore((s) => s.setSelectedDisciple);

  return (
    <div className="relative z-[2] mx-auto my-7" style={{ width: "min(96%, 1300px)" }}>
      <SectionLabel className="mb-3 text-center">
        Двенадцать апостолов · <em>The Twelve Apostles</em>
      </SectionLabel>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {DISCIPLES.map((d) => {
          const active = selected === d.id;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => setSelected(active ? null : d.id)}
              className={`flex flex-col items-start gap-0.5 border px-3 py-2.5 text-left transition-all ${
                active
                  ? "border-(--color-ink) bg-(--color-ink) text-(--color-parchment-grad-start)"
                  : "border-(--color-sepia-light) bg-(--color-parchment-light)/60 text-(--color-ink) hover:bg-(--color-parchment-light)"
              }`}
            >
              <span className="text-[15px] font-medium leading-tight">{d.ru}</span>
              <span
                className={`text-[11px] italic ${active ? "opacity-80" : "text-(--color-sepia) opacity-90"}`}
              >
                {d.en}
              </span>
              {d.alias && (
                <span
                  className={`mt-0.5 text-[10px] italic ${active ? "opacity-65" : "text-(--color-sepia-light) opacity-80"}`}
                >
                  {d.alias}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
