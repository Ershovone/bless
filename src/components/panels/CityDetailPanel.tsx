"use client";

import { useEffect } from "react";
import { CITIES } from "@/data/cities";
import { CITY_DETAILS } from "@/data/cityDetails";
import { EPISTLES } from "@/data/epistles";
import { EPISTLE_GLYPH } from "@/constants/design";
import { useAtlasStore } from "@/hooks/useAtlasStore";

export function CityDetailPanel() {
  const selectedCity = useAtlasStore((s) => s.selectedCity);
  const setSelectedCity = useAtlasStore((s) => s.setSelectedCity);

  useEffect(() => {
    if (!selectedCity) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") setSelectedCity(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedCity, setSelectedCity]);

  useEffect(() => {
    if (!selectedCity) return;
    const scrollY = window.scrollY;
    const body = document.body;
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    return () => {
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      window.scrollTo(0, scrollY);
    };
  }, [selectedCity]);

  if (!selectedCity || !CITIES[selectedCity]) return null;

  const city = CITIES[selectedCity];
  const details = CITY_DETAILS[selectedCity];
  const epistles = EPISTLES[selectedCity];

  return (
    <>
      <div
        className="fixed inset-0 z-20 backdrop-blur-[2px]"
        style={{ background: "rgba(58,40,23,0.35)" }}
        onClick={() => setSelectedCity(null)}
        aria-hidden
      />
      <aside
        className="fixed right-0 top-0 bottom-0 z-[21] overflow-y-auto border-l-2 border-(--color-sepia-light) px-9 py-10 font-serif text-(--color-ink)"
        style={{
          width: "min(440px, 90vw)",
          background: "linear-gradient(135deg, #fdf4e0, #f0e4ca)",
          boxShadow: "-30px 0 80px -20px rgba(74,50,30,0.5)",
        }}
      >
        <button
          type="button"
          onClick={() => setSelectedCity(null)}
          className="absolute right-5 top-4 h-8 w-8 border border-(--color-sepia-light) bg-transparent text-base text-(--color-sepia) hover:bg-(--color-parchment-light)"
          aria-label="Close details"
        >
          ✕
        </button>

        <div className="mb-1.5 text-[11px] uppercase tracking-[0.3em] text-(--color-rust)">
          CIVITAS · ГОРОД
        </div>
        <h2 className="m-0 mb-1 text-[40px] font-medium leading-[1.1]">{city.ru}</h2>
        <div className="mb-3 text-lg italic text-(--color-sepia)">{city.en}</div>
        {details?.modern && (
          <div className="mb-1.5 text-[13px] tracking-[0.05em] text-(--color-sepia)">
            Сегодня · <em>{details.modern}</em>
          </div>
        )}
        <div className="mb-7 font-sans text-[11px] tracking-[0.15em] text-(--color-sepia-light)">
          {city.lat.toFixed(2)}°N · {city.lon.toFixed(2)}°E
        </div>

        {details && details.events.length > 0 && (
          <div className="mt-6 border-t border-(--color-sepia-light)/60 pt-5">
            <div className="mb-3.5 text-[11px] uppercase tracking-[0.25em] text-(--color-rust)">
              События · <em>Events</em>
            </div>
            {details.events.map((ev, i) => (
              <div key={i} className="mb-4.5">
                <div className="mb-1 flex justify-between">
                  <span className="text-sm font-semibold tracking-[0.1em] text-(--color-rust)">
                    {ev.year} AD
                  </span>
                  <span className="text-xs italic text-(--color-sepia)">{ev.ref}</span>
                </div>
                <div className="text-[15px] leading-[1.55] text-(--color-ink)">{ev.ru}</div>
              </div>
            ))}
          </div>
        )}

        {epistles && epistles.length > 0 && (
          <div className="mt-6 border-t border-(--color-sepia-light)/60 pt-5">
            <div className="mb-3.5 text-[11px] uppercase tracking-[0.25em] text-(--color-rust)">
              Послания · <em>Epistles</em>
            </div>
            {epistles.map((ep, i) => (
              <div key={i} className="mb-3.5 flex items-start gap-3">
                <div className="pt-0.5 text-xl leading-none text-(--color-rust)">
                  {EPISTLE_GLYPH}
                </div>
                <div>
                  <div className="text-[17px] font-medium">{ep.ru}</div>
                  <div className="mt-0.5 text-xs text-(--color-sepia)">
                    <em>{ep.en}</em> · {ep.written}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </aside>
    </>
  );
}
