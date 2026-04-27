"use client";

import { useEffect } from "react";
import { EXODUS_STATIONS, EXODUS_STATION_ORDER } from "@/data/exodus/stations";
import { useExodusStore } from "@/hooks/useExodusStore";

export function StationDetailPanel() {
  const selected = useExodusStore((s) => s.selectedStation);
  const setSelected = useExodusStore((s) => s.setSelectedStation);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, setSelected]);

  if (!selected) return null;
  const station = EXODUS_STATIONS[selected];
  if (!station) return null;
  const number = EXODUS_STATION_ORDER.indexOf(selected) + 1;

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

        <div className="mb-1.5 flex items-baseline gap-3">
          <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-(--color-rust)">
            СТАНЦИЯ № {number} · STATIO
          </span>
        </div>
        <h2 className="m-0 mb-1 text-[38px] font-medium leading-[1.1]">{station.ru}</h2>
        <div className="mb-3 text-lg italic text-(--color-sepia)">{station.en}</div>
        {station.modern && (
          <div className="mb-1.5 text-[13px] tracking-[0.05em] text-(--color-sepia)">
            Сегодня · <em>{station.modern}</em>
          </div>
        )}
        <div className="mb-5 font-sans text-[11px] tracking-[0.15em] text-(--color-sepia-light)">
          {station.lat.toFixed(2)}°N · {station.lon.toFixed(2)}°E
          {station.exodusRef ? ` · ${station.exodusRef}` : ""}
          {station.numbersRef ? ` · ${station.numbersRef}` : ""}
        </div>

        {station.significance && (
          <p className="mb-5 text-[15px] leading-[1.6]">{station.significance}</p>
        )}

        {!station.significance && (!station.events || station.events.length === 0) && (
          <p className="mb-5 text-[14px] italic leading-[1.55] text-(--color-sepia)">
            Других упоминаний в Писании нет — название встречается только в перечне станций
            Исхода. Точное место по сей день остаётся неизвестным.
          </p>
        )}

        {station.events && station.events.length > 0 && (
          <div className="mt-6 border-t border-(--color-sepia-light)/60 pt-5">
            <div className="mb-3 text-[11px] uppercase tracking-[0.25em] text-(--color-rust)">
              События · <em>Events</em>
            </div>
            <div className="space-y-4">
              {station.events.map((ev, i) => (
                <div key={i}>
                  <div className="mb-1 text-xs italic text-(--color-rust)">{ev.ref}</div>
                  <div className="text-[15px] leading-[1.55]">{ev.ru}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
