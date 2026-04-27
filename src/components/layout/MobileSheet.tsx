"use client";

import type { ReactNode } from "react";
import {
  MOBILE_DOCK_HEIGHT,
  MOBILE_SHEET_MAX_HEIGHT_VH,
  MOBILE_SHEET_TRANSITION_MS,
} from "@/constants/mobile";

type MobileSheetProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
};

export function MobileSheet({ open, title, onClose, children }: MobileSheetProps) {
  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-hidden={!open}
      className={`fixed inset-x-0 z-[30] flex flex-col border-t border-(--color-sepia-light) bg-(--color-parchment) shadow-[0_-12px_30px_-12px_rgba(74,50,30,0.35)] ${
        open ? "" : "pointer-events-none"
      }`}
      style={{
        bottom: MOBILE_DOCK_HEIGHT,
        maxHeight: `${MOBILE_SHEET_MAX_HEIGHT_VH}dvh`,
        transform: open ? "translateY(0)" : "translateY(110%)",
        transition: `transform ${MOBILE_SHEET_TRANSITION_MS}ms cubic-bezier(0.2, 0, 0, 1)`,
      }}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-(--color-sepia-light) px-4 py-2.5">
        <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-(--color-sepia)">
          {title}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть панель"
          className="-m-2 flex h-9 w-9 items-center justify-center text-lg text-(--color-sepia) hover:text-(--color-ink)"
        >
          ×
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3">
        {children}
      </div>
    </div>
  );
}
