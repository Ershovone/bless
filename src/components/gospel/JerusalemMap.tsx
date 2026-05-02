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

// ── Геометрия Иерусалима I века (детальная реконструкция) ─────────────
// Координаты соответствуют современному Старому городу Иерусалима с
// добавлением Города Давида (южный «язык» к югу от Храма), как на
// классических библейских картах. Реальные размеры:
//  — Старый город: ~1 × 1 км
//  — Храмовая платформа: 488 × 280 м

// Внешняя стена. Прямоугольник Старого города с восточным выступом
// Храмовой платформы и узким Городом Давида к югу.
const OLD_CITY_WALL: Array<[number, number]> = [
  // СЗ угол — у Башен Ирода / Цитадели (Яффские ворота)
  [35.2278, 31.7820],
  [35.2300, 31.7822],
  [35.2330, 31.7820],
  // Дамасские ворота
  [35.2360, 31.7818],
  // СВ угол Старого города
  [35.2390, 31.7815],
  // Стык с северной стеной Храмовой платформы
  [35.2390, 31.7800],
  // Восточная стена Храмовой платформы (Кедрон сразу за стеной)
  [35.2392, 31.7775],
  // ЮВ Храма (Pinnacle of the Temple)
  [35.2390, 31.7752],
  // Южная стена Храма
  [35.2370, 31.7748],
  // Спуск к Городу Давида
  [35.2358, 31.7740],
  [35.2355, 31.7725],
  [35.2350, 31.7710],
  [35.2347, 31.7695],
  // Южная оконечность — Силоам
  [35.2342, 31.7680],
  [35.2335, 31.7672],
  [35.2325, 31.7676],
  // Поворот на запад в долину Енном
  [35.2317, 31.7690],
  [35.2308, 31.7705],
  // Дунгские ворота / Сионские ворота
  [35.2300, 31.7720],
  [35.2290, 31.7728],
  // ЮЗ угол на Сионе
  [35.2275, 31.7740],
  // Западная стена вверх по Сиону
  [35.2270, 31.7760],
  [35.2270, 31.7780],
  [35.2272, 31.7800],
  [35.2278, 31.7820],
];

// Храмовая платформа Ирода — 488 × 280 м, лёгкая трапеция.
const TEMPLE_MOUNT: Array<[number, number]> = [
  [35.2348, 31.7800],   // СЗ
  [35.2390, 31.7800],   // СВ
  [35.2392, 31.7775],   // Е-средний
  [35.2390, 31.7752],   // ЮВ (Pinnacle)
  [35.2370, 31.7748],   // ЮЗ
  [35.2348, 31.7752],   // З
  [35.2348, 31.7800],   // замыкание
];

// Внутреннее святилище (Двор Израиля и Святая Святых).
const TEMPLE_SANCTUARY: Array<[number, number]> = [
  [35.2362, 31.7785],
  [35.2375, 31.7785],
  [35.2375, 31.7770],
  [35.2362, 31.7770],
];

// Двор женщин — восточнее святилища.
const TEMPLE_WOMEN_COURT: Array<[number, number]> = [
  [35.2375, 31.7782],
  [35.2384, 31.7782],
  [35.2384, 31.7773],
  [35.2375, 31.7773],
];

// Царский портик Ирода — базилика на южной стороне платформы.
const ROYAL_STOA: Array<[number, number]> = [
  [35.2350, 31.7755],
  [35.2388, 31.7755],
  [35.2388, 31.7752],
  [35.2350, 31.7752],
];

// Антония — крепость в СЗ углу Храма (римская когорта).
const ANTONIA_FORTRESS: Array<[number, number]> = [
  [35.2348, 31.7810],
  [35.2363, 31.7810],
  [35.2363, 31.7800],
  [35.2348, 31.7800],
];

// Тиропейская долина — внутригородское понижение, делила город пополам.
const TYROPOEON_VALLEY: Array<[number, number]> = [
  [35.2335, 31.7820],
  [35.2335, 31.7780],
  [35.2333, 31.7745],
  [35.2333, 31.7715],
  [35.2335, 31.7685],
];

// Кардо — главная улица север-юг через Верхний город.
const CARDO_STREET: Array<[number, number]> = [
  [35.2305, 31.7820],
  [35.2305, 31.7790],
  [35.2310, 31.7755],
  [35.2315, 31.7725],
];

// Дорога вдоль Храмовой стены к Овечьим воротам.
const TEMPLE_ROAD: Array<[number, number]> = [
  [35.2380, 31.7752],
  [35.2380, 31.7780],
  [35.2380, 31.7810],
];

// Три башни Ирода в СЗ углу Цитадели: Гиппик / Фасаил / Мариамна.
const TOWER_HIPPICUS: [number, number] = [35.2280, 31.7820];
const TOWER_PHASAEL: [number, number] = [35.2282, 31.7822];
const TOWER_MARIAMNE: [number, number] = [35.2284, 31.7824];

// Кедронская долина — глубокий овраг между Храмом и Елеоном.
const KIDRON_VALLEY: Array<[number, number]> = [
  [35.2410, 31.7860],
  [35.2408, 31.7820],
  [35.2405, 31.7790],
  [35.2403, 31.7765],
  [35.2400, 31.7740],
  [35.2395, 31.7715],
  [35.2385, 31.7690],
  [35.2370, 31.7670],
  [35.2350, 31.7660],
];

// Долина Енном (Геенна) — обходит с юга и запада, у юго-восточного
// угла соединяется с Кедроном (поле Акелдама / Гефсимания).
const HINNOM_VALLEY: Array<[number, number]> = [
  [35.2245, 31.7800],
  [35.2240, 31.7770],
  [35.2240, 31.7740],
  [35.2245, 31.7710],
  [35.2255, 31.7685],
  [35.2275, 31.7665],
  [35.2305, 31.7655],
  [35.2335, 31.7655],
  [35.2350, 31.7660],
];

// Силуэт Елеонской горы — четыре «вершины» от севера до юга.
const MOUNT_OF_OLIVES_HILL: Array<[number, number]> = [
  [35.2440, 31.7860],
  [35.2475, 31.7840],
  [35.2510, 31.7805],
  [35.2530, 31.7770],
  [35.2535, 31.7740],
  [35.2520, 31.7710],
  [35.2495, 31.7695],
  [35.2470, 31.7700],
  [35.2455, 31.7720],
  [35.2440, 31.7755],
  [35.2435, 31.7790],
  [35.2438, 31.7825],
  [35.2440, 31.7860],
];

// Гребень Елеона — линия по вершинам.
const OLIVES_RIDGE: Array<[number, number]> = [
  [35.2480, 31.7830],
  [35.2510, 31.7795],
  [35.2515, 31.7755],
  [35.2495, 31.7720],
];

// Верхний город (Сион) — возвышенность западнее Тиропейской долины.
// Используется для топографической подсветки.
const UPPER_CITY: Array<[number, number]> = [
  [35.2278, 31.7820],
  [35.2333, 31.7820],
  [35.2333, 31.7780],
  [35.2333, 31.7745],
  [35.2333, 31.7715],
  [35.2300, 31.7720],
  [35.2290, 31.7728],
  [35.2275, 31.7740],
  [35.2270, 31.7760],
  [35.2270, 31.7780],
  [35.2272, 31.7800],
  [35.2278, 31.7820],
];

// Город Давида — узкий южный язык за пределами Старого города.
const CITY_OF_DAVID: Array<[number, number]> = [
  [35.2347, 31.7748],
  [35.2358, 31.7740],
  [35.2355, 31.7725],
  [35.2350, 31.7710],
  [35.2347, 31.7695],
  [35.2342, 31.7680],
  [35.2335, 31.7672],
  [35.2325, 31.7676],
  [35.2320, 31.7690],
  [35.2330, 31.7710],
  [35.2340, 31.7730],
  [35.2347, 31.7748],
];

// Безета (Новый Город) — район к северу от Старого города, который
// был обнесён стеной только при Агриппе I (после Иисуса). Здесь были
// Голгофа и гробница Иосифа.
const BEZETHA_AREA: Array<[number, number]> = [
  [35.2230, 31.7820],
  [35.2270, 31.7870],
  [35.2340, 31.7895],
  [35.2400, 31.7895],
  [35.2410, 31.7860],
  [35.2400, 31.7820],
  [35.2360, 31.7818],
  [35.2330, 31.7820],
  [35.2300, 31.7822],
  [35.2270, 31.7820],
  [35.2230, 31.7820],
];

// Дворец Ирода Великого — мощный комплекс в СЗ углу города, к югу от
// трёх башен (Гиппик, Фасаил, Мариамна).
const HEROD_PALACE: Array<[number, number]> = [
  [35.2272, 31.7818],
  [35.2295, 31.7818],
  [35.2295, 31.7790],
  [35.2272, 31.7790],
];

// Притвор Соломона — крытая колоннада на восточной стороне Храмовой
// платформы (Деян 3:11; 5:12; Ин 10:23).
const SOLOMONS_PORTICO: Array<[number, number]> = [
  [35.2386, 31.7800],
  [35.2392, 31.7800],
  [35.2390, 31.7752],
  [35.2384, 31.7752],
];

// Ступени к Храму — широкая лестница с южной стороны платформы
// (главный вход для паломников через Двойные и Тройные ворота).
const TEMPLE_STAIRS: Array<[number, number]> = [
  [35.2358, 31.7748],
  [35.2380, 31.7748],
  [35.2378, 31.7740],
  [35.2360, 31.7740],
];

// Мост Уилсона — арочный мост из Верхнего города к Храму через
// Тиропейскую долину (соединял Цион с западной стеной Храма).
const WILSONS_BRIDGE: Array<[number, number]> = [
  [35.2335, 31.7775],
  [35.2348, 31.7775],
];

// Акведук — снабжал Верхний город водой из источников Соломоновых
// прудов под Вифлеемом. Шёл с юга через Сион.
const AQUEDUCT: Array<[number, number]> = [
  [35.2300, 31.7700],
  [35.2295, 31.7740],
  [35.2300, 31.7770],
  [35.2310, 31.7795],
  [35.2330, 31.7800],
];

// Туннель Езекии — подземный канал из источника Гихон в купель Силоам
// (4 Цар 20:20; 2 Пар 32:30). 533 м. На карте — пунктирная линия.
const HEZEKIAHS_TUNNEL: Array<[number, number]> = [
  [35.2378, 31.7715],
  [35.2370, 31.7705],
  [35.2360, 31.7695],
  [35.2350, 31.7685],
  [35.2342, 31.7678],
];

// Дороги, ведущие из города. Точки от внутренних ворот наружу до края
// карты — для подписей направлений.
type RoadDef = {
  start: [number, number];   // у ворот
  end: [number, number];     // конец у края карты
  label: string;
};

const ROADS_OUT: RoadDef[] = [
  {
    start: [35.2336, 31.7820],
    end: [35.2330, 31.7950],
    label: "к Самарии и Галилее",
  },
  {
    start: [35.2278, 31.7800],
    end: [35.2150, 31.7780],
    label: "к Еммаусу и Иоппии",
  },
  {
    start: [35.2392, 31.7770],
    end: [35.2640, 31.7770],
    label: "к Вифании и Иерихону",
  },
  {
    start: [35.2300, 31.7720],
    end: [35.2230, 31.7625],
    label: "к Вифлеему и Хеврону",
  },
];

// Дополнительные пруды и источники (как на классических картах).
// Размеры в ГРАДУСАХ: 0.001° ≈ 100 м.
type WaterFeature = {
  lon: number;
  lat: number;
  rxDeg: number;
  ryDeg: number;
  label: string;
  shape: "rect" | "ellipse";
};

const WATER_FEATURES: WaterFeature[] = [
  // Пруд Башни — у западной стены, рядом с Дворцом Ирода (~30×40 м)
  { lon: 35.2278, lat: 31.7795, rxDeg: 0.0004, ryDeg: 0.0004, label: "пруд Башни", shape: "rect" },
  // Пруд Израиля — севернее Храма, рядом с Вифездой (~100×50 м)
  { lon: 35.2382, lat: 31.7815, rxDeg: 0.0008, ryDeg: 0.0004, label: "пруд Израиля", shape: "rect" },
  // Змеиный пруд — за городом на западе (~80×100 м)
  { lon: 35.2235, lat: 31.7745, rxDeg: 0.0008, ryDeg: 0.0008, label: "Змеиный пруд", shape: "rect" },
  // Источник Гихон — у восточной стены Города Давида (точка)
  { lon: 35.2375, lat: 31.7710, rxDeg: 0.0002, ryDeg: 0.0002, label: "источник Гихон", shape: "ellipse" },
  // Источник Ен-Рогель — на юге, у слияния долин (точка)
  { lon: 35.2350, lat: 31.7660, rxDeg: 0.0002, ryDeg: 0.0002, label: "Ен-Рогель", shape: "ellipse" },
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
  const sanctuaryD = projPath(proj, TEMPLE_SANCTUARY, true);
  const womenCourtD = projPath(proj, TEMPLE_WOMEN_COURT, true);
  const royalStoaD = projPath(proj, ROYAL_STOA, true);
  const antoniaD = projPath(proj, ANTONIA_FORTRESS, true);
  const kidronD = smoothPath(proj, KIDRON_VALLEY);
  const hinnomD = smoothPath(proj, HINNOM_VALLEY);
  const tyropoeonD = smoothPath(proj, TYROPOEON_VALLEY);
  const cardoD = smoothPath(proj, CARDO_STREET);
  const templeRoadD = projPath(proj, TEMPLE_ROAD);
  const olivesHillD = projPath(proj, MOUNT_OF_OLIVES_HILL, true);
  const olivesRidgeD = smoothPath(proj, OLIVES_RIDGE);
  const upperCityD = projPath(proj, UPPER_CITY, true);
  const cityOfDavidD = projPath(proj, CITY_OF_DAVID, true);
  const bezethaD = projPath(proj, BEZETHA_AREA, true);
  const herodPalaceD = projPath(proj, HEROD_PALACE, true);
  const solomonsPorticoD = projPath(proj, SOLOMONS_PORTICO, true);
  const templeStairsD = projPath(proj, TEMPLE_STAIRS, true);
  const wilsonsBridgeD = projPath(proj, WILSONS_BRIDGE);
  const aqueductD = smoothPath(proj, AQUEDUCT);
  const hezekiahsTunnelD = smoothPath(proj, HEZEKIAHS_TUNNEL);

  const towerHippicus = project(proj, TOWER_HIPPICUS[0], TOWER_HIPPICUS[1]);
  const towerPhasael = project(proj, TOWER_PHASAEL[0], TOWER_PHASAEL[1]);
  const towerMariamne = project(proj, TOWER_MARIAMNE[0], TOWER_MARIAMNE[1]);

  // Дороги — старт у ворот, конец у края карты
  const projectedRoads = ROADS_OUT.map((r) => ({
    label: r.label,
    start: project(proj, r.start[0], r.start[1]),
    end: project(proj, r.end[0], r.end[1]),
  }));

  // Пруды/источники — проецируем в экранные размеры
  const projectedWaters = WATER_FEATURES.map((w) => {
    const c = project(proj, w.lon, w.lat);
    const ex = project(proj, w.lon + w.rxDeg, w.lat);
    const ey = project(proj, w.lon, w.lat - w.ryDeg);
    return {
      ...w,
      cx: c.x,
      cy: c.y,
      rx: Math.abs(ex.x - c.x),
      ry: Math.abs(ey.y - c.y),
    };
  });

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
            {/* ── Топография: холмы и долины ────────────────────────── */}

            {/* Силуэт Елеонской горы — холм с радиальным градиентом и штриховкой */}
            <path d={olivesHillD} fill="url(#olivesGradient)" stroke="none" />
            <path
              d={olivesHillD}
              fill="url(#hillHatch)"
              stroke="var(--color-sepia)"
              strokeOpacity="0.35"
              strokeWidth="0.8"
            />

            {/* Безета (Новый Город) — район, обнесённый стеной только при
                Агриппе I, после евангельских событий. Здесь Голгофа. */}
            <path
              d={bezethaD}
              fill="var(--color-parchment-light)"
              fillOpacity="0.4"
              stroke="var(--color-sepia-light)"
              strokeOpacity="0.6"
              strokeWidth="1"
              strokeDasharray="5 3"
              strokeLinejoin="round"
            />
            <text
              x={project(proj, 35.2300, 31.7855).x}
              y={project(proj, 35.2300, 31.7855).y}
              textAnchor="middle"
              fontFamily={FONT_FAMILIES.serif}
              fontStyle="italic"
              fontSize={9}
              letterSpacing={1.5}
              fill="var(--color-sepia-light)"
              opacity="0.75"
              style={{
                paintOrder: "stroke",
                stroke: "var(--color-parchment)",
                strokeWidth: 2.5,
                strokeLinejoin: "round",
              }}
            >
              Безета (Новый Город)
            </text>

            {/* Верхний город (Сион) — топографический оттенок */}
            <path
              d={upperCityD}
              fill="var(--color-sepia-light)"
              fillOpacity="0.10"
              stroke="none"
            />

            {/* Город Давида — отдельный топографический слой */}
            <path
              d={cityOfDavidD}
              fill="var(--color-sepia-light)"
              fillOpacity="0.08"
              stroke="none"
            />

            {/* Тиропейская долина — внутригородское понижение */}
            <path
              d={tyropoeonD}
              fill="none"
              stroke="var(--color-modern-blue)"
              strokeWidth="1.2"
              strokeOpacity="0.3"
              strokeDasharray="2 4"
              strokeLinecap="round"
            />

            {/* Кедронская долина — извилистая голубая лента */}
            <path
              d={kidronD}
              fill="none"
              stroke="var(--color-modern-blue)"
              strokeWidth="2.8"
              strokeOpacity="0.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text
              transform={(() => {
                const mid = project(proj, 35.2405, 31.7770);
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

            {/* Долина Енном — обхватывает с юга и запада */}
            <path
              d={hinnomD}
              fill="none"
              stroke="var(--color-modern-blue)"
              strokeWidth="2"
              strokeOpacity="0.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="4 2"
            />
            <text
              x={project(proj, 35.2275, 31.7670).x}
              y={project(proj, 35.2275, 31.7670).y}
              textAnchor="middle"
              fontFamily={FONT_FAMILIES.serif}
              fontStyle="italic"
              fontSize={9}
              fill="var(--color-modern-blue)"
              opacity="0.65"
              letterSpacing={1}
            >
              долина Енном (Геенна)
            </text>

            {/* ── Городские стены и дороги ──────────────────────────── */}

            {/* Стены Старого города — двойная обводка для весомости */}
            <path
              d={wallD}
              fill="var(--color-parchment-light)"
              fillOpacity="0.45"
              stroke="var(--color-sepia)"
              strokeWidth="3"
              strokeOpacity="0.85"
              strokeLinejoin="round"
            />
            <path
              d={wallD}
              fill="none"
              stroke="var(--color-parchment)"
              strokeWidth="1"
              strokeOpacity="0.7"
              strokeLinejoin="round"
            />

            {/* Кардо — главная улица север-юг */}
            <path
              d={cardoD}
              fill="none"
              stroke="var(--color-sepia)"
              strokeOpacity="0.35"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              strokeLinecap="round"
            />

            {/* Дорога к Овечьим воротам вдоль Храма */}
            <path
              d={templeRoadD}
              fill="none"
              stroke="var(--color-sepia)"
              strokeOpacity="0.3"
              strokeWidth="1.2"
              strokeDasharray="3 2"
              strokeLinecap="round"
            />

            {/* ── Храмовая платформа Ирода ──────────────────────────── */}

            {/* Внешняя платформа (Двор язычников) */}
            <path
              d={templeD}
              fill="var(--color-rust)"
              fillOpacity="0.12"
              stroke="var(--color-rust)"
              strokeOpacity="0.55"
              strokeWidth="2"
              strokeLinejoin="round"
            />

            {/* Двор женщин */}
            <path
              d={womenCourtD}
              fill="var(--color-rust)"
              fillOpacity="0.18"
              stroke="var(--color-rust)"
              strokeOpacity="0.55"
              strokeWidth="1"
              strokeLinejoin="round"
            />

            {/* Святилище — Святое и Святое Святых */}
            <path
              d={sanctuaryD}
              fill="var(--color-rust)"
              fillOpacity="0.32"
              stroke="var(--color-rust)"
              strokeOpacity="0.75"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />

            {/* Царский портик — на южной стороне */}
            <path
              d={royalStoaD}
              fill="var(--color-rust)"
              fillOpacity="0.18"
              stroke="var(--color-rust)"
              strokeOpacity="0.5"
              strokeWidth="0.8"
              strokeLinejoin="round"
            />

            {/* Притвор Соломона — восточная колоннада Храма (Деян 3:11) */}
            <path
              d={solomonsPorticoD}
              fill="var(--color-rust)"
              fillOpacity="0.22"
              stroke="var(--color-rust)"
              strokeOpacity="0.6"
              strokeWidth="0.8"
              strokeLinejoin="round"
            />

            {/* Ступени к Храму — главный южный вход для паломников */}
            <path
              d={templeStairsD}
              fill="var(--color-sepia)"
              fillOpacity="0.35"
              stroke="var(--color-sepia)"
              strokeOpacity="0.6"
              strokeWidth="0.6"
            />
            <text
              x={project(proj, 35.2370, 31.7744).x}
              y={project(proj, 35.2370, 31.7744).y + 14}
              textAnchor="middle"
              fontFamily={FONT_FAMILIES.serif}
              fontStyle="italic"
              fontSize={7.5}
              letterSpacing={0.5}
              fill="var(--color-sepia)"
              opacity="0.75"
              style={{
                paintOrder: "stroke",
                stroke: "var(--color-parchment)",
                strokeWidth: 2.5,
                strokeLinejoin: "round",
              }}
            >
              ступени к Храму
            </text>

            {/* Антония — крепость в СЗ углу Храма */}
            <path
              d={antoniaD}
              fill="var(--color-sepia)"
              fillOpacity="0.25"
              stroke="var(--color-sepia)"
              strokeOpacity="0.75"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />

            {/* ── Дворец Ирода Великого ─────────────────────────── */}
            <path
              d={herodPalaceD}
              fill="var(--color-sepia)"
              fillOpacity="0.20"
              stroke="var(--color-sepia)"
              strokeOpacity="0.7"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <text
              x={project(proj, 35.2284, 31.7805).x}
              y={project(proj, 35.2284, 31.7805).y - 10}
              textAnchor="middle"
              fontFamily={FONT_FAMILIES.serif}
              fontStyle="italic"
              fontSize={8}
              letterSpacing={0.5}
              fill="var(--color-sepia)"
              opacity="0.85"
              style={{
                paintOrder: "stroke",
                stroke: "var(--color-parchment)",
                strokeWidth: 2.5,
                strokeLinejoin: "round",
              }}
            >
              Дворец Ирода
            </text>

            {/* ── Башни Ирода в СЗ углу Цитадели ───────────────────── */}
            {[towerHippicus, towerPhasael, towerMariamne].map((t, i) => (
              <g key={`tower-${i}`} transform={`translate(${t.x}, ${t.y})`}>
                <rect
                  x="-3"
                  y="-3"
                  width="6"
                  height="6"
                  fill="var(--color-sepia)"
                  fillOpacity="0.75"
                  stroke="var(--color-sepia)"
                  strokeWidth="0.7"
                />
              </g>
            ))}

            {/* ── Мост Уилсона — из Сиона к Храму через Тиропейскую долину */}
            <path
              d={wilsonsBridgeD}
              fill="none"
              stroke="var(--color-sepia)"
              strokeOpacity="0.7"
              strokeWidth="2.5"
              strokeLinecap="square"
            />
            <text
              x={(project(proj, 35.2340, 31.7775).x)}
              y={(project(proj, 35.2340, 31.7775).y) - 4}
              textAnchor="middle"
              fontFamily={FONT_FAMILIES.serif}
              fontStyle="italic"
              fontSize={7.5}
              fill="var(--color-sepia)"
              opacity="0.7"
              style={{
                paintOrder: "stroke",
                stroke: "var(--color-parchment)",
                strokeWidth: 2.5,
                strokeLinejoin: "round",
              }}
            >
              мост
            </text>

            {/* ── Акведук — снабжал Верхний город водой из Соломоновых прудов */}
            <path
              d={aqueductD}
              fill="none"
              stroke="var(--color-modern-blue)"
              strokeOpacity="0.45"
              strokeWidth="1.4"
              strokeDasharray="6 2 1 2"
              strokeLinecap="round"
            />
            <text
              x={project(proj, 35.2295, 31.7745).x - 14}
              y={project(proj, 35.2295, 31.7745).y}
              textAnchor="end"
              fontFamily={FONT_FAMILIES.serif}
              fontStyle="italic"
              fontSize={8}
              fill="var(--color-modern-blue)"
              opacity="0.7"
              letterSpacing={0.5}
              style={{
                paintOrder: "stroke",
                stroke: "var(--color-parchment)",
                strokeWidth: 2.5,
                strokeLinejoin: "round",
              }}
            >
              Акведук
            </text>

            {/* ── Туннель Езекии — подземный канал Гихон → Силоам */}
            <path
              d={hezekiahsTunnelD}
              fill="none"
              stroke="#a83a26"
              strokeOpacity="0.7"
              strokeWidth="1.4"
              strokeDasharray="2 2"
              strokeLinecap="round"
            />
            <text
              x={project(proj, 35.2360, 31.7693).x + 12}
              y={project(proj, 35.2360, 31.7693).y}
              textAnchor="start"
              fontFamily={FONT_FAMILIES.serif}
              fontStyle="italic"
              fontSize={8}
              fill="#a83a26"
              opacity="0.85"
              letterSpacing={0.5}
              style={{
                paintOrder: "stroke",
                stroke: "var(--color-parchment)",
                strokeWidth: 2.5,
                strokeLinejoin: "round",
              }}
            >
              туннель Езекии
            </text>

            {/* ── Дополнительные пруды и источники ──────────────── */}
            {projectedWaters.map((w, i) =>
              w.shape === "rect" ? (
                <g key={`water-${i}`}>
                  <rect
                    x={w.cx - w.rx}
                    y={w.cy - w.ry}
                    width={w.rx * 2}
                    height={w.ry * 2}
                    fill="var(--color-modern-blue)"
                    fillOpacity="0.4"
                    stroke="var(--color-modern-blue)"
                    strokeOpacity="0.7"
                    strokeWidth="0.8"
                  />
                  <text
                    x={w.cx}
                    y={w.cy + w.ry + 10}
                    textAnchor="middle"
                    fontFamily={FONT_FAMILIES.serif}
                    fontStyle="italic"
                    fontSize={8}
                    fill="var(--color-modern-blue)"
                    opacity="0.8"
                    style={{
                      paintOrder: "stroke",
                      stroke: "var(--color-parchment)",
                      strokeWidth: 2.5,
                      strokeLinejoin: "round",
                    }}
                  >
                    {w.label}
                  </text>
                </g>
              ) : (
                <g key={`water-${i}`}>
                  <circle
                    cx={w.cx}
                    cy={w.cy}
                    r={Math.max(w.rx, w.ry)}
                    fill="var(--color-modern-blue)"
                    fillOpacity="0.6"
                    stroke="var(--color-modern-blue)"
                    strokeWidth="1"
                  />
                  <text
                    x={w.cx}
                    y={w.cy + Math.max(w.rx, w.ry) + 10}
                    textAnchor="middle"
                    fontFamily={FONT_FAMILIES.serif}
                    fontStyle="italic"
                    fontSize={8}
                    fill="var(--color-modern-blue)"
                    opacity="0.8"
                    style={{
                      paintOrder: "stroke",
                      stroke: "var(--color-parchment)",
                      strokeWidth: 2.5,
                      strokeLinejoin: "round",
                    }}
                  >
                    {w.label}
                  </text>
                </g>
              ),
            )}

            {/* ── Дороги, ведущие из города ─────────────────────── */}
            {projectedRoads.map((r, i) => {
              const dx = r.end.x - r.start.x;
              const dy = r.end.y - r.start.y;
              const len = Math.hypot(dx, dy) || 1;
              // Точка для подписи — чуть ближе к концу дороги
              const tx = r.start.x + dx * 0.85;
              const ty = r.start.y + dy * 0.85;
              return (
                <g key={`road-${i}`}>
                  <line
                    x1={r.start.x}
                    y1={r.start.y}
                    x2={r.end.x}
                    y2={r.end.y}
                    stroke="var(--color-sepia)"
                    strokeOpacity="0.5"
                    strokeWidth="1.6"
                    strokeDasharray="6 3"
                    strokeLinecap="round"
                  />
                  <text
                    x={tx}
                    y={ty - 4}
                    textAnchor={dx > 0 ? "start" : dx < 0 ? "end" : "middle"}
                    fontFamily={FONT_FAMILIES.serif}
                    fontStyle="italic"
                    fontSize={9}
                    fill="var(--color-sepia)"
                    opacity="0.85"
                    letterSpacing={0.5}
                    style={{
                      paintOrder: "stroke",
                      stroke: "var(--color-parchment)",
                      strokeWidth: 3,
                      strokeLinejoin: "round",
                    }}
                  >
                    {r.label}
                  </text>
                </g>
              );
            })}

            {/* Гребень Елеона — пунктир */}
            <path
              d={olivesRidgeD}
              fill="none"
              stroke="var(--color-sepia)"
              strokeOpacity="0.35"
              strokeWidth="1"
              strokeDasharray="2 3"
            />
          </g>

          {/* Региональные подписи */}
          <g pointerEvents="none">
            <text
              x={project(proj, 35.2510, 31.7770).x}
              y={project(proj, 35.2510, 31.7770).y - 22}
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
              x={project(proj, 35.2300, 31.7780).x}
              y={project(proj, 35.2300, 31.7780).y}
              textAnchor="middle"
              fontFamily={FONT_FAMILIES.serif}
              fontSize={10}
              letterSpacing={3}
              fill="var(--color-sepia-light)"
              opacity="0.75"
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
              x={project(proj, 35.2335, 31.7700).x}
              y={project(proj, 35.2335, 31.7700).y}
              textAnchor="middle"
              fontFamily={FONT_FAMILIES.serif}
              fontSize={9}
              letterSpacing={2}
              fill="var(--color-sepia-light)"
              opacity="0.7"
              style={{
                paintOrder: "stroke",
                stroke: "var(--color-parchment)",
                strokeWidth: 3,
                strokeLinejoin: "round",
              }}
            >
              ГОРОД ДАВИДА
            </text>
            <text
              x={project(proj, 35.2275, 31.7825).x}
              y={project(proj, 35.2275, 31.7825).y - 4}
              textAnchor="middle"
              fontFamily={FONT_FAMILIES.serif}
              fontStyle="italic"
              fontSize={8}
              letterSpacing={1}
              fill="var(--color-sepia)"
              opacity="0.6"
              style={{
                paintOrder: "stroke",
                stroke: "var(--color-parchment)",
                strokeWidth: 2.5,
                strokeLinejoin: "round",
              }}
            >
              башни Ирода
            </text>
            <text
              x={project(proj, 35.2370, 31.7775).x}
              y={project(proj, 35.2370, 31.7775).y}
              textAnchor="middle"
              fontFamily={FONT_FAMILIES.serif}
              fontStyle="italic"
              fontSize={8.5}
              letterSpacing={1.5}
              fill="var(--color-rust)"
              opacity="0.85"
              style={{
                paintOrder: "stroke",
                stroke: "var(--color-parchment)",
                strokeWidth: 2.5,
                strokeLinejoin: "round",
              }}
            >
              Святилище
            </text>
            <text
              x={project(proj, 35.2369, 31.7754).x}
              y={project(proj, 35.2369, 31.7754).y}
              textAnchor="middle"
              fontFamily={FONT_FAMILIES.serif}
              fontStyle="italic"
              fontSize={7.5}
              letterSpacing={1}
              fill="var(--color-rust)"
              opacity="0.7"
              style={{
                paintOrder: "stroke",
                stroke: "var(--color-parchment)",
                strokeWidth: 2.5,
                strokeLinejoin: "round",
              }}
            >
              Царский портик
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
