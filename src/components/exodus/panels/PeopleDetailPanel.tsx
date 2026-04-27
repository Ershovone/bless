"use client";

import { useEffect } from "react";
import { EXODUS_PEOPLES_BY_ID } from "@/data/exodus/peoples";
import { useExodusStore } from "@/hooks/useExodusStore";
import { ScriptureRef } from "@/components/bible/ScriptureRef";

export function PeopleDetailPanel() {
  const selected = useExodusStore((s) => s.selectedPeople);
  const setSelected = useExodusStore((s) => s.setSelectedPeople);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, setSelected]);

  if (!selected) return null;
  const people = EXODUS_PEOPLES_BY_ID[selected];
  if (!people) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[40] backdrop-blur-[2px]"
        style={{ background: "rgba(58,40,23,0.35)" }}
        onClick={() => setSelected(null)}
        aria-hidden
      />
      <aside
        className="fixed right-0 top-0 bottom-0 z-[41] overflow-y-auto border-l-2 border-(--color-sepia-light) px-9 py-10 font-serif text-(--color-ink)"
        style={{
          width: "min(440px, 92vw)",
          background: "linear-gradient(135deg, #fdf4e0, #f0e4ca)",
          boxShadow: "-30px 0 80px -20px rgba(74,50,30,0.5)",
        }}
      >
        <button
          type="button"
          onClick={() => setSelected(null)}
          className="absolute right-5 top-4 h-8 w-8 border border-(--color-sepia-light) bg-transparent text-base text-(--color-sepia) hover:bg-(--color-parchment-light)"
          aria-label="Закрыть"
        >
          ✕
        </button>

        <div
          aria-hidden
          className="mb-3 inline-block h-2 w-12"
          style={{ background: people.color, opacity: 0.85 }}
        />
        <div className="mb-1 text-[11px] uppercase tracking-[0.3em] text-(--color-rust)">
          GENS · НАРОД
        </div>
        <h2 className="m-0 mb-1 text-[36px] font-medium leading-[1.1]">{people.ru}</h2>
        <div className="mb-5 text-lg italic text-(--color-sepia)">{people.en}</div>

        <div className="mb-1 text-[11px] uppercase tracking-[0.25em] text-(--color-rust)">
          Происхождение
        </div>
        <p className="mb-5 text-[15px] leading-[1.55]">{people.origin}</p>

        <div className="mb-1 text-[11px] uppercase tracking-[0.25em] text-(--color-rust)">
          В контексте Исхода
        </div>
        <p className="mb-5 text-[15px] leading-[1.6]">{people.description}</p>

        {people.refs.length > 0 && (
          <div className="mt-6 border-t border-(--color-sepia-light)/60 pt-4">
            <div className="mb-2 text-[11px] uppercase tracking-[0.25em] text-(--color-rust)">
              Ссылки в Писании
            </div>
            <ul className="m-0 list-none space-y-1.5 p-0 text-[14px] italic text-(--color-sepia)">
              {people.refs.map((ref, i) => (
                <li key={i}>
                  <ScriptureRef refText={ref} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </>
  );
}
