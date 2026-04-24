import type { CountryPath } from "@/types/atlas";
import { MAP_SIZE } from "@/constants/map";
import { FONT_FAMILIES } from "@/constants/design";
import { MAP_CLIP_ID } from "./MapDefs";

export function ModernBordersLayer({ countries }: { countries: CountryPath[] }) {
  return (
    <g clipPath={`url(#${MAP_CLIP_ID})`} style={{ pointerEvents: "none" }}>
      {countries.map((c, i) => (
        <path
          key={`border-${i}`}
          d={c.d}
          fill="none"
          stroke="var(--color-modern-blue)"
          strokeWidth="1.2"
          strokeDasharray="5 3"
          opacity="0.55"
        />
      ))}
      {countries
        .filter(
          (c) => c.cx >= 0 && c.cx <= MAP_SIZE.width && c.cy >= 0 && c.cy <= MAP_SIZE.height && c.name,
        )
        .map((c, i) => (
          <text
            key={`lbl-${i}`}
            x={c.cx}
            y={c.cy}
            fontSize="14"
            textAnchor="middle"
            fontFamily={FONT_FAMILIES.sans}
            fontWeight="600"
            fill="var(--color-modern-blue-dark)"
            letterSpacing="2"
            opacity="0.85"
            style={{
              paintOrder: "stroke",
              stroke: "rgba(253,244,224,0.8)",
              strokeWidth: 4,
            }}
          >
            {c.name?.toUpperCase()}
          </text>
        ))}
    </g>
  );
}
