"use client";

import { useEffect } from "react";
import { GOSPEL_LOCATIONS } from "@/data/gospel/locations";
import { useGospelStore } from "@/hooks/useGospelStore";
import { ScriptureRef } from "@/components/bible/ScriptureRef";
import { ProseWithRefs } from "@/components/bible/ProseWithRefs";

const KIND_LABEL: Record<string, string> = {
  city: "ГОРОД",
  village: "СЕЛЕНИЕ",
  mountain: "ГОРА",
  river: "РЕКА",
  sea: "МОРЕ / ОЗЕРО",
  wilderness: "ПУСТЫНЯ",
  site: "МЕСТО",
};

export function LocationDetailPanel() {
  const selected = useGospelStore((s) => s.selectedLocation);
  const setSelected = useGospelStore((s) => s.setSelectedLocation);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, setSelected]);

  if (!selected) return null;
  const place = GOSPEL_LOCATIONS[selected];
  if (!place) return null;

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

        <div className="mb-1.5 text-[11px] uppercase tracking-[0.3em] text-(--color-rust)">
          {KIND_LABEL[place.kind] ?? "МЕСТО"}
        </div>
        <h2 className="m-0 mb-1 text-[36px] font-medium leading-[1.1]">{place.ru}</h2>
        <div className="mb-3 text-lg italic text-(--color-sepia)">{place.en}</div>
        {place.modern && (
          <div className="mb-1.5 text-[13px] tracking-[0.05em] text-(--color-sepia)">
            Сегодня · <em>{place.modern}</em>
          </div>
        )}
        <div className="mb-5 font-sans text-[11px] tracking-[0.15em] text-(--color-sepia-light)">
          {place.lat.toFixed(3)}°N · {place.lon.toFixed(3)}°E
          {place.confidence === "approximate" && " · локализация приблизительная"}
          {place.confidence === "traditional" && " · по преданию"}
        </div>

        {place.significance && (
          <p className="mb-5 text-[15px] leading-[1.6]">
            <ProseWithRefs text={place.significance} />
          </p>
        )}

        {place.events && place.events.length > 0 && (
          <div className="mt-6 border-t border-(--color-sepia-light)/60 pt-5">
            <div className="mb-3 text-[11px] uppercase tracking-[0.25em] text-(--color-rust)">
              События · <em>Events</em>
            </div>
            <div className="space-y-4">
              {place.events.map((ev, i) => (
                <div key={i}>
                  <div className="mb-1 text-xs italic">
                    <ScriptureRef refText={ev.ref} className="text-(--color-rust)" />
                  </div>
                  <div className="text-[15px] leading-[1.55]">
                    <ProseWithRefs text={ev.ru} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
