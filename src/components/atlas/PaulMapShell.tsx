"use client";

import { useState } from "react";
import { AtlasMap } from "./AtlasMap";
import { JOURNEYS } from "@/data/journeys";
import { CITIES } from "@/data/cities";
import { ROMAN_NUMERALS } from "@/constants/design";
import { useAtlasStore } from "@/hooks/useAtlasStore";
import { ScriptureRef } from "@/components/bible/ScriptureRef";
import { PlayButton } from "@/components/controls/PlayButton";

/** Лента из 4 путешествий поверх карты — селектор активного маршрута. */
function JourneyRibbon() {
  const activeJ = useAtlasStore((s) => s.activeJ);
  const setActiveJ = useAtlasStore((s) => s.setActiveJ);

  return (
    <div className="flex max-w-[calc(100vw-2rem)] items-stretch overflow-x-auto border border-(--color-sepia-light) bg-(--color-parchment-light)/90 shadow-[0_6px_16px_-4px_rgba(74,50,30,0.3)] backdrop-blur-sm [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {JOURNEYS.map((j, i) => {
        const active = activeJ === i;
        return (
          <button
            key={j.id}
            type="button"
            onClick={() => setActiveJ(i)}
            title={`${j.ru} · ${j.years}`}
            className={`flex shrink-0 items-center gap-2 border-r border-(--color-sepia-light)/40 px-3 py-2 transition-all last:border-r-0 ${
              active
                ? "bg-(--color-ink) text-(--color-parchment-grad-start)"
                : "text-(--color-ink) hover:bg-(--color-parchment-light)"
            }`}
          >
            <span
              aria-hidden
              className="font-serif text-[16px] italic leading-none"
              style={!active ? { color: j.color } : undefined}
            >
              {ROMAN_NUMERALS[i]}
            </span>
            <span className="hidden whitespace-nowrap font-sans text-[10px] uppercase tracking-[0.1em] sm:inline">
              {j.ru}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** Карточка контекста — путешествие, года, краткое описание, цепочка городов. */
function InfoOverlay() {
  const [collapsed, setCollapsed] = useState(false);
  const activeJ = useAtlasStore((s) => s.activeJ);
  const journey = JOURNEYS[activeJ];

  return (
    <div className="border border-(--color-sepia-light) bg-(--color-parchment-light)/92 shadow-[0_8px_24px_-6px_rgba(74,50,30,0.3)] backdrop-blur-sm">
      <button
        type="button"
        onClick={() => setCollapsed((v) => !v)}
        aria-expanded={!collapsed}
        className="flex w-full items-start justify-between gap-3 px-4 py-2.5 text-left hover:bg-(--color-parchment-light)/40"
      >
        <div className="min-w-0">
          <div className="truncate font-sans text-[10px] uppercase tracking-[0.22em] text-(--color-rust)">
            {journey.years}
          </div>
          <div className="truncate text-[15px] font-medium leading-tight text-(--color-ink)">
            {journey.ru}
          </div>
        </div>
        <span aria-hidden className="shrink-0 text-(--color-sepia) opacity-70">
          {collapsed ? "▾" : "▴"}
        </span>
      </button>

      {!collapsed && (
        <div className="border-t border-(--color-sepia-light)/60 px-4 py-3">
          <div className="mb-2 font-sans text-[10px] uppercase tracking-[0.18em] text-(--color-rust)">
            <ScriptureRef refText={journey.acts} />
          </div>
          <p className="m-0 text-[13px] leading-snug text-(--color-ink-muted)">
            {journey.summary}
          </p>
          {journey.route.length > 0 && (
            <div className="mt-3 max-h-[160px] overflow-y-auto border-t border-(--color-sepia-light)/40 pt-2 text-[11px] leading-relaxed text-(--color-ink-muted)">
              {journey.route.map((id, i) => (
                <span key={`${id}-${i}`}>
                  <span className="italic">{CITIES[id].ru}</span>
                  {i < journey.route.length - 1 && (
                    <span className="mx-1.5 text-(--color-amber)">→</span>
                  )}
                </span>
              ))}
            </div>
          )}
          <div className="mt-3 flex items-center gap-2">
            <PlayButton />
          </div>
        </div>
      )}
    </div>
  );
}

/** Поп-овер «Слои» — переключатель современных границ. */
function LayersOverlay() {
  const [open, setOpen] = useState(false);
  const modernView = useAtlasStore((s) => s.modernView);
  const toggleModernView = useAtlasStore((s) => s.toggleModernView);

  return (
    <div className="border border-(--color-sepia-light) bg-(--color-parchment-light)/92 shadow-[0_8px_24px_-6px_rgba(74,50,30,0.3)] backdrop-blur-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 px-3.5 py-2.5 hover:bg-(--color-parchment-light)/40"
      >
        <div className="text-left">
          <div className="font-sans text-[10px] uppercase tracking-[0.22em] text-(--color-rust)">
            Слои карты
          </div>
          <div className="text-[11px] italic text-(--color-sepia)">
            {modernView ? "современные границы" : "только древний мир"}
          </div>
        </div>
        <span aria-hidden className="text-(--color-sepia) opacity-70">
          {open ? "▴" : "▾"}
        </span>
      </button>

      {open && (
        <div className="border-t border-(--color-sepia-light)/60 px-3 py-3">
          <button
            type="button"
            onClick={toggleModernView}
            className={`flex w-full items-center gap-2 border px-2.5 py-1.5 text-left text-[12px] transition-all ${
              modernView
                ? "border-(--color-modern-blue) bg-(--color-modern-blue) text-(--color-parchment-light)"
                : "border-(--color-sepia-light) bg-(--color-parchment-light)/60 text-(--color-ink) hover:bg-(--color-parchment-light)"
            }`}
          >
            <span
              aria-hidden
              className="inline-block h-2.5 w-2.5 rounded-full border-[1.5px] border-current"
              style={{ background: modernView ? "currentColor" : "transparent" }}
            />
            <span>Современные границы</span>
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Map-first shell для путешествий Павла: карта во всю площадь, поверх —
 * лента путешествий, контекст с PlayButton, переключатель слоёв.
 */
export function PaulMapShell() {
  return (
    <div
      className="relative mx-auto my-5 overflow-hidden border-2 border-(--color-sepia-light) shadow-[0_30px_60px_-15px_rgba(74,50,30,0.35),inset_0_0_60px_rgba(139,111,71,0.12)]"
      style={{
        width: "min(96%, 1800px)",
        height: "min(85vh, 920px)",
        background: "linear-gradient(135deg, #f0e4ca, #e0d2b4)",
      }}
    >
      <div className="absolute inset-0">
        <AtlasMap variant="fullscreen" />
      </div>

      <div className="pointer-events-none absolute left-1/2 top-3 z-10 -translate-x-1/2">
        <div className="pointer-events-auto">
          <JourneyRibbon />
        </div>
      </div>

      <div className="pointer-events-none absolute left-3 top-16 z-10 w-[320px] max-w-[35vw] sm:top-20">
        <div className="pointer-events-auto">
          <InfoOverlay />
        </div>
      </div>

      <div className="pointer-events-none absolute right-3 top-16 z-10 w-[230px] sm:top-20">
        <div className="pointer-events-auto">
          <LayersOverlay />
        </div>
      </div>
    </div>
  );
}
