"use client";

import { useMemo, useState } from "react";
import { JERUSALEM_PLACES, JERUSALEM_PLACE_IDS } from "@/data/gospel/jerusalemPlaces";
import type { JerusalemPlaceId, JerusalemPlaceKind } from "@/types/gospel";
import { JERUSALEM_MAP_SIZE } from "@/data/gospel/mapConstants";
import { useJerusalemProjection } from "@/hooks/useGospelProjection";
import { project } from "@/lib/geo/projection";
import { FONT_FAMILIES } from "@/constants/design";
import { SectionLabel } from "@/components/layout/SectionLabel";
import { ScriptureRef } from "@/components/bible/ScriptureRef";
import { ProseWithRefs } from "@/components/bible/ProseWithRefs";

// Схема Старого города I века: примерные lon/lat границ для рисунка стены
const OLD_CITY_WALL: Array<[number, number]> = [
  [35.226, 31.785], // СЗ
  [35.238, 31.787], // С
  [35.244, 31.785], // СВ (Овечьи ворота)
  [35.244, 31.778], // В (Храмовая гора)
  [35.241, 31.768], // ЮВ
  [35.230, 31.770], // Ю (Сион)
  [35.225, 31.775], // ЮЗ
  [35.226, 31.785],
];

// Долина Кедрон между городом и Елеоном — линия с востока
const KIDRON_VALLEY: Array<[number, number]> = [
  [35.241, 31.790],
  [35.242, 31.778],
  [35.241, 31.768],
];

// Силуэт Елеонской горы — простой холм за долиной
const MOUNT_OF_OLIVES_HILL: Array<[number, number]> = [
  [35.244, 31.782],
  [35.247, 31.778],
  [35.247, 31.776],
  [35.244, 31.773],
];

const TEMPLE_MOUNT_RECT: Array<[number, number]> = [
  [35.234, 31.781],
  [35.238, 31.781],
  [35.238, 31.776],
  [35.234, 31.776],
  [35.234, 31.781],
];

const KIND_GLYPH: Record<JerusalemPlaceKind, string> = {
  temple: "▲",
  palace: "■",
  garden: "✿",
  mountain: "⛰",
  tomb: "◆",
  pool: "≈",
  gate: "⌂",
  execution: "✝",
  site: "●",
};

const KIND_COLOR: Record<JerusalemPlaceKind, string> = {
  temple: "var(--color-rust)",
  palace: "var(--color-sepia)",
  garden: "#5a7a4a",
  mountain: "var(--color-sepia-light)",
  tomb: "var(--color-ink)",
  pool: "var(--color-modern-blue)",
  gate: "var(--color-sepia)",
  execution: "var(--color-rust)",
  site: "var(--color-sepia)",
};

function projPath(proj: ReturnType<typeof useJerusalemProjection>["proj"], pts: Array<[number, number]>): string {
  return pts
    .map(([lon, lat], i) => {
      const p = project(proj, lon, lat);
      return `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    })
    .join(" ");
}

export function JerusalemMap() {
  const { proj } = useJerusalemProjection();
  const [selected, setSelected] = useState<JerusalemPlaceId | null>(null);
  const [hover, setHover] = useState<JerusalemPlaceId | null>(null);

  const projected = useMemo(() => {
    return JERUSALEM_PLACE_IDS.map((id) => {
      const p = JERUSALEM_PLACES[id];
      const pt = project(proj, p.lon, p.lat);
      return { ...p, x: pt.x, y: pt.y };
    });
  }, [proj]);

  const wallD = projPath(proj, OLD_CITY_WALL);
  const kidronD = projPath(proj, KIDRON_VALLEY);
  const olivesD = projPath(proj, MOUNT_OF_OLIVES_HILL);
  const templeD = projPath(proj, TEMPLE_MOUNT_RECT);

  const selectedPlace = selected ? JERUSALEM_PLACES[selected] : null;

  return (
    <div
      className="relative z-[2] mx-auto my-5 border border-(--color-sepia-light) bg-(--color-parchment-light)/60 px-4 py-5 sm:px-7 sm:py-6"
      style={{ width: "min(96%, 1400px)" }}
    >
      <SectionLabel className="mb-4 text-center">
        Иерусалим в дни страданий · <em>Jerusalem in the Passion Week</em>
      </SectionLabel>

      <div
        className="relative mx-auto overflow-hidden border border-(--color-sepia-light) bg-(--color-parchment)"
        style={{ aspectRatio: `${JERUSALEM_MAP_SIZE.width} / ${JERUSALEM_MAP_SIZE.height}` }}
      >
        <svg
          viewBox={`0 0 ${JERUSALEM_MAP_SIZE.width} ${JERUSALEM_MAP_SIZE.height}`}
          preserveAspectRatio="xMidYMid meet"
          className="block h-full w-full"
        >
          {/* Долина Кедрон */}
          <path
            d={kidronD}
            stroke="var(--color-modern-blue)"
            strokeWidth="3"
            strokeOpacity="0.4"
            fill="none"
            strokeLinecap="round"
          />

          {/* Силуэт Елеонской горы */}
          <path
            d={olivesD}
            fill="var(--color-sepia-light)"
            fillOpacity="0.18"
            stroke="var(--color-sepia)"
            strokeOpacity="0.4"
            strokeWidth="1"
          />

          {/* Стены Старого города */}
          <path
            d={wallD}
            fill="var(--color-parchment-light)"
            fillOpacity="0.5"
            stroke="var(--color-sepia)"
            strokeWidth="2.5"
            strokeOpacity="0.65"
            strokeLinejoin="round"
          />

          {/* Храмовая гора */}
          <path
            d={templeD}
            fill="var(--color-rust)"
            fillOpacity="0.12"
            stroke="var(--color-rust)"
            strokeOpacity="0.4"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />

          {/* Подписи областей */}
          <g pointerEvents="none">
            <text
              x={projected.find((p) => p.id === "mount_of_olives")?.x ?? 0}
              y={(projected.find((p) => p.id === "mount_of_olives")?.y ?? 0) + 32}
              textAnchor="middle"
              fontFamily={FONT_FAMILIES.serif}
              fontSize={11}
              letterSpacing={4}
              fill="var(--color-sepia)"
              opacity="0.7"
              style={{
                paintOrder: "stroke",
                stroke: "var(--color-parchment)",
                strokeWidth: 3,
                strokeLinejoin: "round",
              }}
            >
              ЕЛЕОНСКАЯ ГОРА
            </text>
            <text
              x={projected.find((p) => p.id === "temple")?.x ?? 0}
              y={(projected.find((p) => p.id === "temple")?.y ?? 0) - 28}
              textAnchor="middle"
              fontFamily={FONT_FAMILIES.serif}
              fontStyle="italic"
              fontSize={11}
              letterSpacing={3}
              fill="var(--color-rust)"
              opacity="0.75"
              style={{
                paintOrder: "stroke",
                stroke: "var(--color-parchment)",
                strokeWidth: 3,
                strokeLinejoin: "round",
              }}
            >
              ХРАМОВАЯ ГОРА
            </text>
            <text
              x={
                projected.find((p) => p.id === "upper_room")?.x ??
                JERUSALEM_MAP_SIZE.width / 2
              }
              y={(projected.find((p) => p.id === "upper_room")?.y ?? 0) + 28}
              textAnchor="middle"
              fontFamily={FONT_FAMILIES.serif}
              fontSize={10}
              letterSpacing={3}
              fill="var(--color-sepia-light)"
              opacity="0.7"
            >
              ГОРА СИОН
            </text>
          </g>

          {/* Точки мест */}
          {projected.map((p) => {
            const isSelected = selected === p.id;
            const isHovered = hover === p.id;
            const big = isSelected || isHovered;
            return (
              <g
                key={p.id}
                transform={`translate(${p.x}, ${p.y})`}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHover(p.id)}
                onMouseLeave={() => setHover(null)}
                onClick={() => setSelected(isSelected ? null : p.id)}
              >
                <circle r="14" fill="transparent" />
                <circle
                  r={big ? 7 : 5}
                  fill={KIND_COLOR[p.kind]}
                  fillOpacity={isSelected ? 1 : 0.85}
                  stroke="var(--color-parchment-light)"
                  strokeWidth="1.5"
                />
                <text
                  y={-12}
                  textAnchor="middle"
                  fontSize={big ? 13 : 11}
                  fontFamily={FONT_FAMILIES.serif}
                  fontStyle="italic"
                  fontWeight={big ? 500 : 400}
                  fill="var(--color-ink)"
                  opacity={big ? 1 : 0.85}
                  style={{
                    pointerEvents: "none",
                    paintOrder: "stroke",
                    stroke: "var(--color-parchment)",
                    strokeWidth: 3.5,
                    strokeLinejoin: "round",
                  }}
                >
                  {p.ru}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Легенда */}
        <div className="absolute bottom-2 right-2 flex flex-col gap-0.5 border border-(--color-sepia-light) bg-(--color-parchment-light)/85 px-2.5 py-1.5 font-sans text-[10px] text-(--color-sepia) sm:bottom-3 sm:right-3 sm:gap-1 sm:px-3 sm:py-2 sm:text-[11px]">
          <div className="mb-0.5 uppercase tracking-[0.2em] text-(--color-rust)">Легенда</div>
          <div>▲ Храм · ■ дворец · ✿ сад · ◆ гробница · ✝ Голгофа · ≈ купель · ⌂ ворота</div>
        </div>
      </div>

      {/* Карточка выбранного места */}
      {selectedPlace && (
        <div className="mt-4 border border-(--color-sepia-light) bg-(--color-parchment-light)/85 px-5 py-4 sm:px-7 sm:py-5">
          <div className="flex items-baseline justify-between gap-3">
            <div>
              <h3 className="m-0 text-[22px] font-medium leading-tight text-(--color-ink) sm:text-[26px]">
                {selectedPlace.ru}
              </h3>
              <div className="mt-0.5 text-[13px] italic text-(--color-sepia) sm:text-[14px]">
                {selectedPlace.en}
              </div>
            </div>
            {selectedPlace.ref && (
              <div className="shrink-0 text-right text-sm italic text-(--color-rust) sm:text-base">
                <ScriptureRef refText={selectedPlace.ref} />
              </div>
            )}
          </div>
          <p className="mt-3 text-[15px] leading-[1.55] text-(--color-ink) sm:text-base">
            <ProseWithRefs text={selectedPlace.description} />
          </p>
        </div>
      )}

      <p className="mt-4 text-center text-[12px] italic leading-snug text-(--color-sepia)">
        Схематичная карта основана на традиционных локализациях. Точные границы города I века
        известны лишь приблизительно. Кликните на точку, чтобы прочитать о месте.
      </p>
      <span className="hidden">{KIND_GLYPH.temple}</span>
    </div>
  );
}
