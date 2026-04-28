"use client";

import { useEffect } from "react";
import { DISCIPLES } from "@/data/gospel/disciples";
import { useGospelStore } from "@/hooks/useGospelStore";
import { ScriptureRef } from "@/components/bible/ScriptureRef";
import { ProseWithRefs } from "@/components/bible/ProseWithRefs";

export function DiscipleDetailPanel() {
  const selected = useGospelStore((s) => s.selectedDisciple);
  const setSelected = useGospelStore((s) => s.setSelectedDisciple);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, setSelected]);

  if (!selected) return null;
  const d = DISCIPLES.find((x) => x.id === selected);
  if (!d) return null;

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

        <div className="mb-1 text-[11px] uppercase tracking-[0.3em] text-(--color-rust)">
          АПОСТОЛ · DISCIPULUS
        </div>
        <h2 className="m-0 mb-1 text-[34px] font-medium leading-[1.1]">{d.ru}</h2>
        <div className="mb-1 text-lg italic text-(--color-sepia)">{d.en}</div>
        {d.alias && (
          <div className="mb-4 text-[13px] italic text-(--color-sepia-light)">{d.alias}</div>
        )}

        <div className="mb-1 text-[11px] uppercase tracking-[0.25em] text-(--color-rust)">
          Происхождение
        </div>
        <p className="mb-4 text-[15px] leading-[1.55]">{d.origin}</p>

        <div className="mb-1 text-[11px] uppercase tracking-[0.25em] text-(--color-rust)">
          Призвание
        </div>
        <p className="mb-4 text-[14px] italic">
          <ScriptureRef refText={d.callRef} />
        </p>

        <div className="mb-1 text-[11px] uppercase tracking-[0.25em] text-(--color-rust)">
          В Евангелиях
        </div>
        <p className="mb-5 text-[15px] leading-[1.6]">
          <ProseWithRefs text={d.role} />
        </p>

        <div className="mb-1 text-[11px] uppercase tracking-[0.25em] text-(--color-rust)">
          Дальнейший путь
        </div>
        <p className="text-[14px] leading-[1.55] text-(--color-ink-muted)">
          <ProseWithRefs text={d.later} />
        </p>
      </aside>
    </>
  );
}
