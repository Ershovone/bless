"use client";

import { useEffect, useMemo, useState } from "react";
import { JERUSALEM_PLACES, JERUSALEM_PLACE_IDS } from "@/data/gospel/jerusalemPlaces";
import type { JerusalemPlaceId, JerusalemPlaceKind } from "@/types/gospel";
import { JERUSALEM_MAP_SIZE } from "@/data/gospel/mapConstants";
import { useJerusalemProjection } from "@/hooks/useGospelProjection";
import { project } from "@/lib/geo/projection";
import { FONT_FAMILIES } from "@/constants/design";
import { ZOOM } from "@/constants/map";
import { SectionLabel } from "@/components/layout/SectionLabel";
import { ScriptureRef } from "@/components/bible/ScriptureRef";
import { ProseWithRefs } from "@/components/bible/ProseWithRefs";
import { MapSvg } from "@/components/atlas/MapSvg";
import { ZoomControls } from "@/components/atlas/ZoomControls";
import { useZoomPan } from "@/hooks/useZoomPan";

const KIND_LABEL: Record<JerusalemPlaceKind, string> = {
  temple: "ХРАМ",
  palace: "ДВОРЕЦ",
  garden: "САД",
  mountain: "ГОРА",
  tomb: "ГРОБНИЦА",
  pool: "КУПЕЛЬ",
  gate: "ВОРОТА",
  execution: "МЕСТО КАЗНИ",
  site: "МЕСТО",
};

/** Маркер вида, соответствующий легенде (▲ ■ ✿ ◆ ✝ ≈ ⌂). */
function PlaceMarker({
  kind,
  size,
  color,
  isSelected,
}: {
  kind: JerusalemPlaceKind;
  size: number;
  color: string;
  isSelected: boolean;
}) {
  const r = size;
  const stroke = "var(--color-parchment-light)";
  const sw = 1.2;
  const op = isSelected ? 1 : 0.92;

  switch (kind) {
    case "temple":
      // ▲ треугольник
      return (
        <polygon
          points={`0,${-r * 1.1} ${r},${r * 0.6} ${-r},${r * 0.6}`}
          fill={color}
          fillOpacity={op}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
      );
    case "palace":
      // ■ квадрат
      return (
        <rect
          x={-r * 0.9}
          y={-r * 0.9}
          width={r * 1.8}
          height={r * 1.8}
          fill={color}
          fillOpacity={op}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
      );
    case "tomb":
      // ◆ ромб
      return (
        <polygon
          points={`0,${-r * 1.15} ${r * 1.15},0 0,${r * 1.15} ${-r * 1.15},0`}
          fill={color}
          fillOpacity={op}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
      );
    case "execution": {
      // ✝ латинский крест
      const tw = r * 0.5; // толщина перекладин
      const ah = r * 0.85; // полуразмер горизонтальной перекладины
      return (
        <g
          fill={color}
          fillOpacity={op}
          stroke={stroke}
          strokeWidth="0.8"
          strokeLinejoin="round"
        >
          <rect x={-tw / 2} y={-r * 1.25} width={tw} height={r * 2.5} />
          <rect x={-ah} y={-r * 0.55} width={ah * 2} height={tw} />
        </g>
      );
    }
    case "pool":
      // ≈ две волнистые линии
      return (
        <g fill="none" stroke={color} strokeWidth={r * 0.45} strokeLinecap="round" opacity={op}>
          <path
            d={`M ${-r * 1.1},${-r * 0.4} Q ${-r * 0.5},${-r * 1.1} 0,${-r * 0.4} T ${r * 1.1},${-r * 0.4}`}
          />
          <path
            d={`M ${-r * 1.1},${r * 0.45} Q ${-r * 0.5},${-r * 0.25} 0,${r * 0.45} T ${r * 1.1},${r * 0.45}`}
          />
        </g>
      );
    case "gate":
      // ⌂ арочные ворота
      return (
        <path
          d={`M ${-r * 0.95},${r * 0.95} L ${-r * 0.95},${0} Q 0,${-r * 1.25} ${r * 0.95},0 L ${r * 0.95},${r * 0.95} Z`}
          fill={color}
          fillOpacity={op}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
      );
    case "garden":
      // ✿ цветок (центр + 4 лепестка)
      return (
        <g fill={color} stroke={stroke} strokeWidth="0.6">
          <circle r={r * 0.45} fillOpacity={op} />
          <circle cx={0} cy={-r * 0.85} r={r * 0.55} fillOpacity={isSelected ? 0.95 : 0.7} />
          <circle cx={r * 0.85} cy={0} r={r * 0.55} fillOpacity={isSelected ? 0.95 : 0.7} />
          <circle cx={0} cy={r * 0.85} r={r * 0.55} fillOpacity={isSelected ? 0.95 : 0.7} />
          <circle cx={-r * 0.85} cy={0} r={r * 0.55} fillOpacity={isSelected ? 0.95 : 0.7} />
        </g>
      );
    case "mountain":
      // ⛰ силуэт двух пиков
      return (
        <polygon
          points={`${-r * 1.2},${r * 0.7} ${-r * 0.4},${-r * 0.7} ${r * 0.1},${r * 0.1} ${r * 0.55},${-r * 0.45} ${r * 1.2},${r * 0.7}`}
          fill={color}
          fillOpacity={op}
          stroke={color}
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
      );
    case "site":
    default:
      return <circle r={r} fill={color} fillOpacity={op} stroke={stroke} strokeWidth={sw} />;
  }
}

// ── Геометрия Иерусалима I века (историческая реконструкция) ───────────

// Стена Старого города (Второй стены времён Христа).
// Размеры приближены к реальным: ~1.1 км шириной (35.227–35.238) ×
// ~2.4 км в высоту с Городом Давида (31.764–31.788).
// Восточная стена частично является восточной стеной Храмовой платформы.
const OLD_CITY_WALL: Array<[number, number]> = [
  [35.227, 31.788],   // СЗ — у Дамасских ворот
  [35.232, 31.789],
  [35.238, 31.788],   // СВ — Овечьи ворота
  [35.238, 31.781],   // восточная стена = восточная стена Храма
  [35.238, 31.776],   // ЮВ Храма
  [35.236, 31.773],   // спуск к Городу Давида
  [35.236, 31.769],
  [35.235, 31.764],   // юг — оконечность Города Давида
  [35.232, 31.762],
  [35.229, 31.766],
  [35.227, 31.770],   // ЮЗ — Сионские ворота
  [35.225, 31.774],
  [35.225, 31.780],   // западная стена
  [35.226, 31.785],
  [35.227, 31.788],   // замыкание
];

// Платформа Храма Ирода — реальные пропорции ~470 м (С–Ю) × ~280 м (З–В).
const TEMPLE_MOUNT: Array<[number, number]> = [
  [35.234, 31.781],
  [35.238, 31.781],
  [35.238, 31.776],
  [35.234, 31.776],
  [35.234, 31.781],
];

// Кедронская долина — глубокий овраг между восточной стеной и Елеоном.
const KIDRON_VALLEY: Array<[number, number]> = [
  [35.241, 31.794],
  [35.241, 31.787],
  [35.241, 31.781],
  [35.240, 31.776],
  [35.239, 31.770],
  [35.236, 31.764],
  [35.234, 31.761],
];

// Долина Енном (Геенна) — обходит Иерусалим с юга и запада, у юго-вост.
// угла соединяется с Кедроном.
const HINNOM_VALLEY: Array<[number, number]> = [
  [35.223, 31.787],
  [35.222, 31.780],
  [35.223, 31.772],
  [35.226, 31.767],
  [35.231, 31.762],
  [35.234, 31.761],
];

// Силуэт Елеонской горы — мягкий «холм» к востоку от Кедрона.
const MOUNT_OF_OLIVES_HILL: Array<[number, number]> = [
  [35.244, 31.793],
  [35.250, 31.789],
  [35.256, 31.783],
  [35.258, 31.778],
  [35.257, 31.772],
  [35.253, 31.766],
  [35.247, 31.764],
  [35.244, 31.770],
  [35.243, 31.778],
  [35.243, 31.785],
  [35.244, 31.793],
];

// Гребень Елеона — для пунктирного намёка на хребет.
const OLIVES_RIDGE: Array<[number, number]> = [
  [35.250, 31.787],
  [35.253, 31.780],
  [35.250, 31.772],
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

// Per-точка labelDir, чтобы лейблы не наезжали друг на друга
const PLACE_LABEL_DIR: Partial<Record<JerusalemPlaceId, "N" | "S" | "E" | "W" | "NE" | "NW" | "SE" | "SW">> = {
  temple: "N",
  upper_room: "SW",
  caiaphas_palace: "S",
  pilate_praetorium: "NW",
  herod_antipas: "W",
  gethsemane: "E",
  mount_of_olives: "E",
  golgotha: "NW",
  tomb: "W",
  bethesda: "N",
  siloam: "S",
  antonia: "NE",
  damascus_gate: "N",
  sheep_gate: "E",
  east_gate: "E",
};

const LABEL_OFFSETS: Record<string, { dx: number; dy: number; anchor: "start" | "middle" | "end" }> = {
  N:  { dx: 0,  dy: -10, anchor: "middle" },
  S:  { dx: 0,  dy: 18,  anchor: "middle" },
  E:  { dx: 10, dy: 4,   anchor: "start" },
  W:  { dx: -10,dy: 4,   anchor: "end" },
  NE: { dx: 8,  dy: -7,  anchor: "start" },
  NW: { dx: -8, dy: -7,  anchor: "end" },
  SE: { dx: 8,  dy: 14,  anchor: "start" },
  SW: { dx: -8, dy: 14,  anchor: "end" },
};

function projPath(
  proj: ReturnType<typeof useJerusalemProjection>["proj"],
  pts: Array<[number, number]>,
  closed = false,
): string {
  if (pts.length === 0) return "";
  const segments = pts
    .map(([lon, lat], i) => {
      const p = project(proj, lon, lat);
      return `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    })
    .join(" ");
  return closed ? `${segments} Z` : segments;
}

/** Сглаживание Кэтмэлл-Ром — для извилистых долин. */
function smoothPath(
  proj: ReturnType<typeof useJerusalemProjection>["proj"],
  pts: Array<[number, number]>,
): string {
  if (pts.length < 2) return "";
  const projected = pts.map(([lon, lat]) => project(proj, lon, lat));
  const tension = 0.5;
  let d = `M ${projected[0].x.toFixed(1)} ${projected[0].y.toFixed(1)}`;
  for (let i = 0; i < projected.length - 1; i++) {
    const p0 = projected[Math.max(0, i - 1)];
    const p1 = projected[i];
    const p2 = projected[i + 1];
    const p3 = projected[Math.min(projected.length - 1, i + 2)];
    const c1x = p1.x + ((p2.x - p0.x) / 6) * tension;
    const c1y = p1.y + ((p2.y - p0.y) / 6) * tension;
    const c2x = p2.x - ((p3.x - p1.x) / 6) * tension;
    const c2y = p2.y - ((p3.y - p1.y) / 6) * tension;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

export function JerusalemMap() {
  const { proj } = useJerusalemProjection();
  const [selected, setSelected] = useState<JerusalemPlaceId | null>(null);
  const [hover, setHover] = useState<JerusalemPlaceId | null>(null);
  const [zoomDisplay, setZoomDisplay] = useState<number>(ZOOM.min);
  const zoomPan = useZoomPan(JERUSALEM_MAP_SIZE, setZoomDisplay);

  const projected = useMemo(() => {
    return JERUSALEM_PLACE_IDS.map((id) => {
      const p = JERUSALEM_PLACES[id];
      const pt = project(proj, p.lon, p.lat);
      return { ...p, x: pt.x, y: pt.y };
    });
  }, [proj]);

  const wallD = projPath(proj, OLD_CITY_WALL, true);
  const templeD = projPath(proj, TEMPLE_MOUNT, true);
  const kidronD = smoothPath(proj, KIDRON_VALLEY);
  const hinnomD = smoothPath(proj, HINNOM_VALLEY);
  const olivesHillD = projPath(proj, MOUNT_OF_OLIVES_HILL, true);
  const olivesRidgeD = smoothPath(proj, OLIVES_RIDGE);

  const selectedPlace = selected ? JERUSALEM_PLACES[selected] : null;

  // Esc закрывает боковую панель — как в LocationDetailPanel
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

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
        <MapSvg zoomPan={zoomPan}>
          <defs>
            <radialGradient id="olivesGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#9a8a6a" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#9a8a6a" stopOpacity="0.05" />
            </radialGradient>
            <pattern id="hillHatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="6" stroke="var(--color-sepia)" strokeWidth="0.5" opacity="0.18" />
            </pattern>
          </defs>

          {/* Все декоративные слои — без событий, чтобы не перехватывать клики по точкам */}
          <g pointerEvents="none">
            {/* Силуэт Елеонской горы — мягкий холм с штриховкой */}
            <path d={olivesHillD} fill="url(#olivesGradient)" stroke="none" />
            <path d={olivesHillD} fill="url(#hillHatch)" stroke="var(--color-sepia)" strokeOpacity="0.35" strokeWidth="0.8" />

            {/* Кедронская долина — извилистая голубая лента */}
            <path
              d={kidronD}
              fill="none"
              stroke="var(--color-modern-blue)"
              strokeWidth="2.5"
              strokeOpacity="0.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text
              transform={(() => {
                const mid = project(proj, 35.241, 31.778);
                return `translate(${mid.x + 8}, ${mid.y}) rotate(90)`;
              })()}
              fontFamily={FONT_FAMILIES.serif}
              fontStyle="italic"
              fontSize={10}
              fill="var(--color-modern-blue)"
              opacity="0.7"
              letterSpacing={2}
            >
              долина Кедрон
            </text>

            {/* Долина Енном — обхватывает с юга */}
            <path
              d={hinnomD}
              fill="none"
              stroke="var(--color-modern-blue)"
              strokeWidth="1.8"
              strokeOpacity="0.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="3 2"
            />
            <text
              x={project(proj, 35.230, 31.760).x}
              y={project(proj, 35.230, 31.760).y + 16}
              textAnchor="middle"
              fontFamily={FONT_FAMILIES.serif}
              fontStyle="italic"
              fontSize={9}
              fill="var(--color-modern-blue)"
              opacity="0.65"
              letterSpacing={2}
            >
              долина Енном (Геенна)
            </text>

            {/* Стены Старого города — бронзовая обводка */}
            <path
              d={wallD}
              fill="var(--color-parchment-light)"
              fillOpacity="0.55"
              stroke="var(--color-sepia)"
              strokeWidth="2.5"
              strokeOpacity="0.75"
              strokeLinejoin="round"
            />

            {/* Храмовая гора (платформа) */}
            <path
              d={templeD}
              fill="var(--color-rust)"
              fillOpacity="0.14"
              stroke="var(--color-rust)"
              strokeOpacity="0.5"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />

            {/* Гребень Елеона — пунктир для контекста */}
            <path
              d={olivesRidgeD}
              fill="none"
              stroke="var(--color-sepia)"
              strokeOpacity="0.3"
              strokeWidth="1"
              strokeDasharray="2 3"
            />
          </g>

          {/* Региональные подписи */}
          <g pointerEvents="none">
            <text
              x={project(proj, 35.255, 31.781).x}
              y={project(proj, 35.255, 31.781).y - 12}
              textAnchor="middle"
              fontFamily={FONT_FAMILIES.serif}
              fontSize={11}
              letterSpacing={4}
              fill="var(--color-sepia)"
              opacity="0.65"
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
              x={project(proj, 35.239, 31.778).x}
              y={project(proj, 35.239, 31.778).y - 4}
              textAnchor="middle"
              fontFamily={FONT_FAMILIES.serif}
              fontStyle="italic"
              fontSize={11}
              letterSpacing={3}
              fill="var(--color-rust)"
              opacity="0.7"
              style={{
                paintOrder: "stroke",
                stroke: "var(--color-parchment)",
                strokeWidth: 3,
                strokeLinejoin: "round",
              }}
            >
              Храмовая гора
            </text>
            <text
              x={project(proj, 35.224, 31.775).x}
              y={project(proj, 35.224, 31.775).y}
              textAnchor="middle"
              fontFamily={FONT_FAMILIES.serif}
              fontSize={10}
              letterSpacing={3}
              fill="var(--color-sepia-light)"
              opacity="0.7"
              style={{
                paintOrder: "stroke",
                stroke: "var(--color-parchment)",
                strokeWidth: 3,
                strokeLinejoin: "round",
              }}
            >
              ГОРА СИОН
            </text>
            <text
              x={project(proj, 35.236, 31.766).x}
              y={project(proj, 35.236, 31.766).y - 6}
              textAnchor="middle"
              fontFamily={FONT_FAMILIES.serif}
              fontSize={9}
              letterSpacing={2}
              fill="var(--color-sepia-light)"
              opacity="0.65"
              style={{
                paintOrder: "stroke",
                stroke: "var(--color-parchment)",
                strokeWidth: 3,
                strokeLinejoin: "round",
              }}
            >
              ГОРОД ДАВИДА
            </text>
          </g>

          {/* Точки мест с типизированными маркерами */}
          {projected.map((p) => {
            const isSelected = selected === p.id;
            const isHovered = hover === p.id;
            const big = isSelected || isHovered;
            const dir = PLACE_LABEL_DIR[p.id] ?? "N";
            const offset = LABEL_OFFSETS[dir];
            return (
              <g
                key={p.id}
                transform={`translate(${p.x}, ${p.y})`}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHover(p.id)}
                onMouseLeave={() => setHover(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(p.id);
                }}
              >
                {/* Прозрачная hit-зона */}
                <circle r="14" fill="transparent" />
                {/* Halo под маркером для контраста */}
                {big && (
                  <circle
                    r={big ? 11 : 9}
                    fill="var(--color-parchment-light)"
                    fillOpacity="0.85"
                    stroke="var(--color-rust)"
                    strokeWidth="0.8"
                    strokeOpacity="0.6"
                  />
                )}
                <PlaceMarker
                  kind={p.kind}
                  size={big ? 7.5 : 5.8}
                  color={KIND_COLOR[p.kind]}
                  isSelected={isSelected}
                />
                <text
                  x={offset.dx}
                  y={offset.dy}
                  textAnchor={offset.anchor}
                  fontSize={big ? 12 : 10.5}
                  fontFamily={FONT_FAMILIES.serif}
                  fontStyle="italic"
                  fontWeight={big ? 500 : 400}
                  fill="var(--color-ink)"
                  opacity={big ? 1 : 0.92}
                  style={{
                    pointerEvents: "none",
                    paintOrder: "stroke",
                    stroke: "var(--color-parchment)",
                    strokeWidth: 3,
                    strokeLinejoin: "round",
                  }}
                >
                  {p.ru}
                </text>
              </g>
            );
          })}
        </MapSvg>

        <ZoomControls
          onZoomIn={zoomPan.zoomIn}
          onZoomOut={zoomPan.zoomOut}
          onReset={zoomPan.reset}
          zoomValue={zoomDisplay}
          position="bottom-right"
        />

      </div>

      <p className="mt-4 text-center text-[12px] italic leading-snug text-(--color-sepia)">
        Карта основана на исторической реконструкции Иерусалима I века. Колесо мыши и
        кнопки справа — для приближения. Клик на точку открывает подробности.
      </p>
      <span className="hidden">{KIND_GLYPH.temple}</span>

      {/* Боковая панель деталей — как у остальных detail-panel в проекте */}
      {selectedPlace && (
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

            <div className="mb-3 flex items-center gap-2.5">
              <span
                aria-hidden
                className="inline-flex h-7 w-7 items-center justify-center text-[18px] leading-none"
                style={{ color: KIND_COLOR[selectedPlace.kind] }}
              >
                {KIND_GLYPH[selectedPlace.kind]}
              </span>
              <span className="text-[11px] uppercase tracking-[0.3em] text-(--color-rust)">
                {KIND_LABEL[selectedPlace.kind]}
              </span>
            </div>
            <h2 className="m-0 mb-1 text-[34px] font-medium leading-[1.1]">
              {selectedPlace.ru}
            </h2>
            <div className="mb-5 text-lg italic text-(--color-sepia)">{selectedPlace.en}</div>

            {selectedPlace.ref && (
              <div className="mb-5 font-sans text-[12px] tracking-[0.15em] text-(--color-sepia-light)">
                <ScriptureRef refText={selectedPlace.ref} className="text-(--color-rust)" />
              </div>
            )}

            <p className="text-[15px] leading-[1.6]">
              <ProseWithRefs text={selectedPlace.description} />
            </p>
          </aside>
        </>
      )}
    </div>
  );
}
