"use client";

import Link from "next/link";
import { JOURNEYS } from "@/data/journeys";
import { ROMAN_NUMERALS } from "@/constants/design";
import { MOBILE_HEADER_HEIGHT } from "@/constants/mobile";
import { useAtlasStore } from "@/hooks/useAtlasStore";

const CHIP_BASE_CLS =
  "flex h-9 w-9 items-center justify-center border border-(--color-sepia-light) text-base italic transition-colors";
const CHIP_ACTIVE_CLS =
  "border-(--color-ink) bg-(--color-ink) text-(--color-parchment-grad-start)";
const CHIP_INACTIVE_CLS = "bg-(--color-parchment-light)/70 text-(--color-ink)";

export function MobileHeader() {
  const activeJ = useAtlasStore((s) => s.activeJ);
  const setActiveJ = useAtlasStore((s) => s.setActiveJ);
  const journey = JOURNEYS[activeJ];

  return (
    <header
      className="relative z-[2] flex shrink-0 items-center gap-2 border-b border-(--color-sepia-light) bg-(--color-parchment) px-3"
      style={{ height: MOBILE_HEADER_HEIGHT }}
    >
      <Link
        href="/"
        aria-label="К атласу Библии"
        className="flex h-9 w-9 items-center justify-center text-(--color-sepia) hover:text-(--color-ink)"
      >
        <span aria-hidden className="text-xl leading-none">←</span>
      </Link>

      <div className="flex min-w-0 flex-1 flex-col leading-tight">
        <span className="truncate font-sans text-[10px] uppercase tracking-[0.2em] text-(--color-sepia)">
          Путешествия Павла
        </span>
        <span className="truncate text-[13px] font-medium text-(--color-ink)">
          {ROMAN_NUMERALS[activeJ]} · {journey.years}
        </span>
      </div>

      <div role="group" aria-label="Путешествие" className="flex items-center gap-1">
        {JOURNEYS.map((j, i) => {
          const active = activeJ === i;
          return (
            <button
              key={j.id}
              type="button"
              onClick={() => setActiveJ(i)}
              aria-label={`Путешествие ${ROMAN_NUMERALS[i]} · ${j.years}`}
              aria-pressed={active}
              className={`${CHIP_BASE_CLS} ${active ? CHIP_ACTIVE_CLS : CHIP_INACTIVE_CLS}`}
            >
              {ROMAN_NUMERALS[i]}
            </button>
          );
        })}
      </div>
    </header>
  );
}
