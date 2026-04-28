"use client";

import { useMemo } from "react";
import type { GeoProjection } from "d3-geo";
import { GOSPEL_LOCATIONS, GOSPEL_LOCATION_IDS } from "@/data/gospel/locations";
import type { GospelLocationId, GospelLocationKind, LabelDir } from "@/types/gospel";
import { FONT_FAMILIES } from "@/constants/design";
import { project } from "@/lib/geo/projection";
import { useGospelStore } from "@/hooks/useGospelStore";

type ProjectedLocation = {
  id: GospelLocationId;
  ru: string;
  shortLabel?: string;
  en: string;
  x: number;
  y: number;
  kind: GospelLocationKind;
  isMountain: boolean;
  labelDir: LabelDir;
  secondary: boolean;
};

type LabelOffset = {
  dx: number;
  dy: number;
  anchor: "start" | "middle" | "end";
};

type Bbox = { x: number; y: number; w: number; h: number };

const LABEL_OFFSETS: Record<LabelDir, LabelOffset> = {
  N:  { dx: 0,  dy: -8,  anchor: "middle" },
  S:  { dx: 0,  dy: 13,  anchor: "middle" },
  E:  { dx: 7,  dy: 3,   anchor: "start" },
  W:  { dx: -7, dy: 3,   anchor: "end" },
  NE: { dx: 6,  dy: -5,  anchor: "start" },
  NW: { dx: -6, dy: -5,  anchor: "end" },
  SE: { dx: 6,  dy: 10,  anchor: "start" },
  SW: { dx: -6, dy: 10,  anchor: "end" },
};

const FONT_SIZE_ACTIVE = 10;
const FONT_SIZE_INACTIVE = 8.5;
const CHAR_WIDTH_RATIO = 0.5;   // средняя ширина Cormorant italic в SVG-юнитах
const LABEL_PAD_X = 4;          // зазор по горизонтали для столкновений
const LABEL_PAD_Y = 2;          // зазор по вертикали
const SECONDARY_LABEL_ZOOM = 1.4;
const INACTIVE_LABEL_ZOOM = 2.4;

/** Прямоугольник лейбла в координатах SVG (для проверки коллизий). */
function labelBbox(
  px: number,
  py: number,
  offset: LabelOffset,
  text: string,
  fontSize: number,
): Bbox {
  const w = text.length * fontSize * CHAR_WIDTH_RATIO + LABEL_PAD_X * 2;
  const h = fontSize * 1.15 + LABEL_PAD_Y * 2;
  let x = px + offset.dx - LABEL_PAD_X;
  if (offset.anchor === "middle") x = px + offset.dx - w / 2;
  else if (offset.anchor === "end") x = px + offset.dx - w + LABEL_PAD_X;
  // Базовая линия примерно на 0.8 высоты от верха
  const y = py + offset.dy - fontSize * 0.85 - LABEL_PAD_Y;
  return { x, y, w, h };
}

function overlaps(a: Bbox, b: Bbox): boolean {
  return !(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y);
}

type GospelLocationsLayerProps = {
  proj: GeoProjection;
  activeLocations: Set<GospelLocationId>;
};

export function GospelLocationsLayer({ proj, activeLocations }: GospelLocationsLayerProps) {
  const hover = useGospelStore((s) => s.hoverLocation);
  const setHover = useGospelStore((s) => s.setHoverLocation);
  const setSelected = useGospelStore((s) => s.setSelectedLocation);
  const zoom = useGospelStore((s) => s.zoomDisplay);

  const projected = useMemo<ProjectedLocation[]>(
    () =>
      GOSPEL_LOCATION_IDS.map((id) => {
        const l = GOSPEL_LOCATIONS[id];
        const p = project(proj, l.lon, l.lat);
        return {
          id,
          ru: l.ru,
          shortLabel: l.shortLabel,
          en: l.en,
          x: p.x,
          y: p.y,
          kind: l.kind,
          isMountain: l.kind === "mountain",
          labelDir: l.labelDir ?? "N",
          secondary: l.secondary ?? false,
        };
      }),
    [proj],
  );

  /**
   * Коллизионная раскладка лейблов (а-ля Google/Yandex Maps).
   * Берём кандидатов в порядке приоритета:
   *   1. active + !secondary
   *   2. active + secondary  (только при zoom >= SECONDARY_LABEL_ZOOM)
   *   3. inactive            (только при zoom >= INACTIVE_LABEL_ZOOM)
   * Жадно: каждый следующий лейбл показываем, только если его bbox не
   * пересекается с уже размещёнными.
   */
  const visibleLabels = useMemo(() => {
    type Candidate = { c: ProjectedLocation; prio: number; fontSize: number };
    const candidates: Candidate[] = [];

    for (const c of projected) {
      const inActive = activeLocations.has(c.id);
      if (inActive && !c.secondary) {
        candidates.push({ c, prio: 0, fontSize: FONT_SIZE_ACTIVE });
      } else if (inActive && c.secondary && zoom >= SECONDARY_LABEL_ZOOM) {
        candidates.push({ c, prio: 1, fontSize: FONT_SIZE_ACTIVE });
      } else if (!inActive && zoom >= INACTIVE_LABEL_ZOOM) {
        candidates.push({ c, prio: 2, fontSize: FONT_SIZE_INACTIVE });
      }
    }
    candidates.sort((a, b) => a.prio - b.prio);

    const placed: Bbox[] = [];
    const result = new Set<GospelLocationId>();
    for (const { c, fontSize } of candidates) {
      const text = c.shortLabel ?? c.ru;
      const offset = LABEL_OFFSETS[c.labelDir];
      const bbox = labelBbox(c.x, c.y, offset, text, fontSize);
      if (placed.some((p) => overlaps(p, bbox))) continue;
      placed.push(bbox);
      result.add(c.id);
    }
    return result;
  }, [projected, activeLocations, zoom]);

  return (
    <>
      {projected.map((c) => {
        const inActive = activeLocations.has(c.id);
        const isHovered = hover === c.id;
        const showLabel = isHovered || visibleLabels.has(c.id);
        const offset = LABEL_OFFSETS[c.labelDir];
        const labelText = c.shortLabel ?? c.ru;
        const fontSize = inActive ? FONT_SIZE_ACTIVE : FONT_SIZE_INACTIVE;

        return (
          <g
            key={c.id}
            transform={`translate(${c.x}, ${c.y})`}
            onMouseEnter={() => setHover(c.id)}
            onMouseLeave={() => setHover(null)}
            onClick={(e) => {
              e.stopPropagation();
              setSelected(c.id);
            }}
            style={{ cursor: "pointer" }}
          >
            <circle r="12" fill="transparent" />

            {c.isMountain ? (
              <g>
                <polygon
                  points={`0,${inActive ? -5 : -3.5} ${inActive ? 4.5 : 3},${inActive ? 3 : 2} ${inActive ? -4.5 : -3},${inActive ? 3 : 2}`}
                  fill={inActive ? "var(--color-rust)" : "var(--color-sepia-light)"}
                  fillOpacity={inActive ? 1 : 0.7}
                  stroke={inActive ? "var(--color-rust)" : "none"}
                  strokeWidth={0.8}
                />
              </g>
            ) : inActive ? (
              <>
                <circle r={isHovered ? 3.6 : 2.8} fill="var(--color-ink)" />
                <circle
                  r={isHovered ? 5.8 : 4.4}
                  fill="none"
                  stroke="var(--color-rust)"
                  strokeWidth="0.7"
                  opacity="0.7"
                />
              </>
            ) : (
              <>
                <circle
                  r={isHovered ? 3 : 1.8}
                  fill="var(--color-sepia-light)"
                  opacity={isHovered ? 0.9 : 0.55}
                />
                {isHovered && (
                  <circle
                    r="4.5"
                    fill="none"
                    stroke="var(--color-sepia-light)"
                    strokeWidth="0.6"
                    opacity="0.6"
                  />
                )}
              </>
            )}

            {showLabel && (
              <text
                x={offset.dx}
                y={offset.dy}
                textAnchor={offset.anchor}
                fontSize={fontSize}
                fontFamily={FONT_FAMILIES.serif}
                fontStyle="italic"
                fontWeight={inActive ? 500 : 400}
                fill={inActive ? "var(--color-ink)" : "var(--color-sepia)"}
                opacity={inActive ? 1 : 0.7}
                style={{
                  pointerEvents: "none",
                  paintOrder: "stroke",
                  stroke: "var(--color-parchment)",
                  strokeWidth: 2.8,
                  strokeLinejoin: "round",
                }}
              >
                {labelText}
              </text>
            )}
          </g>
        );
      })}
    </>
  );
}
