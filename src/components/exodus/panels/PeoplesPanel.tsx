"use client";

import { EXODUS_PEOPLES } from "@/data/exodus/peoples";
import { useExodusStore } from "@/hooks/useExodusStore";
import { SectionLabel } from "@/components/layout/SectionLabel";

export function PeoplesPanel() {
  const selected = useExodusStore((s) => s.selectedPeople);
  const setSelected = useExodusStore((s) => s.setSelectedPeople);
  const showPeoples = useExodusStore((s) => s.showPeoples);
  const toggleShowPeoples = useExodusStore((s) => s.toggleShowPeoples);

  return (
    <div className="relative z-[2] mx-auto my-5" style={{ width: "min(96%, 1200px)" }}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <SectionLabel>
          Народы вокруг Исхода · <em>Peoples</em>
        </SectionLabel>
        <button
          type="button"
          onClick={toggleShowPeoples}
          className="border border-(--color-sepia-light) bg-(--color-parchment-light)/60 px-3 py-1 font-sans text-[10px] uppercase tracking-[0.2em] text-(--color-sepia) hover:bg-(--color-parchment-light)"
          aria-pressed={showPeoples}
        >
          {showPeoples ? "Скрыть на карте" : "Показать на карте"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {EXODUS_PEOPLES.map((p) => {
          const active = selected === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelected(active ? null : p.id)}
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
                  style={{ background: p.color, opacity: 0.85 }}
                />
                <span className="text-[15px] font-medium">{p.ru}</span>
              </div>
              <span
                className={`text-[11px] italic ${active ? "opacity-80" : "text-(--color-sepia) opacity-90"}`}
              >
                {p.en}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
