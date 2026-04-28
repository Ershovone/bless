"use client";

import Link from "next/link";
import { GOSPEL_PHASES } from "@/data/gospel/phases";
import { MOBILE_HEADER_HEIGHT } from "@/constants/mobile";
import { useGospelStore } from "@/hooks/useGospelStore";

const PHASE_NUMERAL = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

const CHIP_BASE_CLS =
  "flex h-8 w-7 items-center justify-center border border-(--color-sepia-light) text-[12px] italic transition-colors";
const CHIP_ACTIVE_CLS =
  "border-(--color-ink) bg-(--color-ink) text-(--color-parchment-grad-start)";
const CHIP_INACTIVE_CLS = "bg-(--color-parchment-light)/70 text-(--color-ink)";

export function GospelMobileHeader() {
  const activeIdx = useGospelStore((s) => s.activePhaseIdx);
  const setActiveIdx = useGospelStore((s) => s.setActivePhaseIdx);
  const phase = GOSPEL_PHASES[activeIdx];

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
          Евангелие
        </span>
        <span className="truncate text-[12px] font-medium text-(--color-ink)">
          {PHASE_NUMERAL[activeIdx]} · {phase.yearsAD}
        </span>
      </div>

      <div role="group" aria-label="Фаза" className="flex items-center gap-0.5 overflow-x-auto">
        {GOSPEL_PHASES.map((p, i) => {
          const active = activeIdx === i;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setActiveIdx(i)}
              aria-label={`Фаза ${PHASE_NUMERAL[i]} · ${p.yearsAD}`}
              aria-pressed={active}
              className={`${CHIP_BASE_CLS} ${active ? CHIP_ACTIVE_CLS : CHIP_INACTIVE_CLS}`}
            >
              {PHASE_NUMERAL[i]}
            </button>
          );
        })}
      </div>
    </header>
  );
}
