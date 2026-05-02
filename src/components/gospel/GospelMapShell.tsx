"use client";

import { useState } from "react";
import { GospelAtlasMap } from "./GospelAtlasMap";
import { GOSPEL_PHASES } from "@/data/gospel/phases";
import { GOSPEL_LOCATIONS } from "@/data/gospel/locations";
import { GOSPEL_REGIONS } from "@/data/gospel/regions";
import { useGospelStore } from "@/hooks/useGospelStore";
import { ScriptureRef } from "@/components/bible/ScriptureRef";

const PHASE_NUMERAL = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

/**
 * Тонкая «риббон»-полоса с фазами поверх карты — как селектор слоёв в
 * картографических сервисах. Только римские цифры + точки даты, чтобы влезло.
 */
function PhaseRibbon() {
  const activeIdx = useGospelStore((s) => s.activePhaseIdx);
  const setActiveIdx = useGospelStore((s) => s.setActivePhaseIdx);

  return (
    <div className="flex max-w-[calc(100vw-2rem)] items-stretch overflow-x-auto border border-(--color-sepia-light) bg-(--color-parchment-light)/90 shadow-[0_6px_16px_-4px_rgba(74,50,30,0.3)] backdrop-blur-sm [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {GOSPEL_PHASES.map((p, i) => {
        const active = activeIdx === i;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => setActiveIdx(i)}
            title={`${p.ru} · ${p.yearsAD}`}
            className={`flex shrink-0 items-center gap-2 border-r border-(--color-sepia-light)/40 px-3 py-2 transition-all last:border-r-0 ${
              active
                ? "bg-(--color-ink) text-(--color-parchment-grad-start)"
                : "text-(--color-ink) hover:bg-(--color-parchment-light)"
            }`}
          >
            <span
              aria-hidden
              className="font-serif text-[16px] italic leading-none"
              style={!active ? { color: p.color } : undefined}
            >
              {PHASE_NUMERAL[i]}
            </span>
            <span className="hidden whitespace-nowrap font-sans text-[10px] uppercase tracking-[0.1em] sm:inline">
              {p.ru}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Карточка контекста — фаза, описание, ключевой стих, цепочка городов.
 * Сворачивается клавишей ▲, чтобы освободить карту.
 */
function InfoOverlay() {
  const [collapsed, setCollapsed] = useState(false);
  const activeIdx = useGospelStore((s) => s.activePhaseIdx);
  const phase = GOSPEL_PHASES[activeIdx];

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
            {phase.yearsAD}
          </div>
          <div className="truncate text-[15px] font-medium leading-tight text-(--color-ink)">
            {phase.ru}
          </div>
        </div>
        <span aria-hidden className="shrink-0 text-(--color-sepia) opacity-70">
          {collapsed ? "▾" : "▴"}
        </span>
      </button>

      {!collapsed && (
        <div className="border-t border-(--color-sepia-light)/60 px-4 py-3">
          <div className="mb-2 flex flex-wrap gap-x-1.5 gap-y-0.5 font-sans text-[10px] uppercase tracking-[0.18em] text-(--color-rust)">
            {phase.acts.split(" · ").map((ref, i, arr) => (
              <span key={i}>
                <ScriptureRef refText={ref} />
                {i < arr.length - 1 && <span className="ml-1.5 opacity-50">·</span>}
              </span>
            ))}
          </div>
          <p className="m-0 text-[13px] leading-snug text-(--color-ink-muted)">
            {phase.description}
          </p>
          {phase.keyVerse && (
            <blockquote className="mt-3 border-l-2 border-(--color-rust)/60 pl-3 text-[12px] italic leading-snug text-(--color-ink-muted)">
              «{phase.keyVerse.text}»
              <footer className="mt-1 text-[10px] not-italic tracking-[0.05em] text-(--color-rust)">
                <ScriptureRef refText={phase.keyVerse.ref} />
              </footer>
            </blockquote>
          )}
          {phase.locations.length > 0 && (
            <div className="mt-3 border-t border-(--color-sepia-light)/40 pt-2 text-[11px] leading-relaxed text-(--color-ink-muted)">
              {phase.locations.map((id, i) => {
                const loc = GOSPEL_LOCATIONS[id];
                if (!loc) return null;
                return (
                  <span key={`${id}-${i}`}>
                    <span className="italic">{loc.ru}</span>
                    {i < phase.locations.length - 1 && (
                      <span className="mx-1.5 text-(--color-amber)">→</span>
                    )}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Поп-овер «Земли I века» — переключатель видимости + список с цветами.
 */
function RegionsOverlay() {
  const [open, setOpen] = useState(false);
  const showRegions = useGospelStore((s) => s.showRegions);
  const toggleShowRegions = useGospelStore((s) => s.toggleShowRegions);
  const selected = useGospelStore((s) => s.selectedRegion);
  const setSelected = useGospelStore((s) => s.setSelectedRegion);

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
            Земли I в.
          </div>
          <div className="text-[11px] italic text-(--color-sepia)">
            {showRegions ? "регионы видны" : "регионы скрыты"}
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
            onClick={toggleShowRegions}
            className="mb-2 w-full border border-(--color-sepia-light) bg-(--color-parchment-light)/60 px-2.5 py-1.5 font-sans text-[10px] uppercase tracking-[0.18em] text-(--color-sepia) hover:bg-(--color-parchment-light)"
          >
            {showRegions ? "Скрыть на карте" : "Показать на карте"}
          </button>
          <div className="grid gap-1">
            {GOSPEL_REGIONS.map((r) => {
              const active = selected === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelected(active ? null : r.id)}
                  className={`flex items-center gap-2 border px-2.5 py-1 text-left text-[12px] transition-all ${
                    active
                      ? "border-(--color-ink) bg-(--color-ink) text-(--color-parchment-grad-start)"
                      : "border-(--color-sepia-light) bg-(--color-parchment-light)/60 text-(--color-ink) hover:bg-(--color-parchment-light)"
                  }`}
                >
                  <span
                    aria-hidden
                    className="inline-block h-2.5 w-2.5"
                    style={{ background: r.color, opacity: 0.85 }}
                  />
                  <span>{r.ru}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Map-first shell: карта во всю ширину, поверх — все связанные с картой
 * элементы управления (фазы, контекст, регионы) как overlay-панели.
 */
export function GospelMapShell() {
  return (
    <div
      className="relative mx-auto my-5 overflow-hidden border-2 border-(--color-sepia-light) shadow-[0_30px_60px_-15px_rgba(74,50,30,0.35),inset_0_0_60px_rgba(139,111,71,0.12)]"
      style={{
        width: "min(96%, 1800px)",
        height: "min(85vh, 920px)",
        background: "linear-gradient(135deg, #f0e4ca, #e0d2b4)",
      }}
    >
      {/* Карта на всю площадь */}
      <div className="absolute inset-0">
        <GospelAtlasMap variant="fullscreen" />
      </div>

      {/* Верх по центру — лента фаз */}
      <div className="pointer-events-none absolute left-1/2 top-3 z-10 -translate-x-1/2">
        <div className="pointer-events-auto">
          <PhaseRibbon />
        </div>
      </div>

      {/* Слева — карточка контекста, под лентой фаз */}
      <div className="pointer-events-none absolute left-3 top-16 z-10 w-[300px] max-w-[35vw] sm:top-20">
        <div className="pointer-events-auto">
          <InfoOverlay />
        </div>
      </div>

      {/* Справа — регионы (поп-овер) */}
      <div className="pointer-events-none absolute right-3 top-16 z-10 w-[230px] sm:top-20">
        <div className="pointer-events-auto">
          <RegionsOverlay />
        </div>
      </div>
    </div>
  );
}
