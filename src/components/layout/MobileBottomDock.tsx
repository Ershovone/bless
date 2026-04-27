"use client";

import {
  MOBILE_DOCK_HEIGHT,
  MOBILE_SHEET_TABS,
  type MobileSheetTabId,
} from "@/constants/mobile";

type MobileBottomDockProps = {
  activeTab: MobileSheetTabId | null;
  onTabClick: (tab: MobileSheetTabId) => void;
};

const TAB_BUTTON_BASE =
  "flex h-full flex-1 flex-col items-center justify-center gap-0.5 border-t-2 border-transparent text-[10px] font-sans uppercase tracking-[0.15em] transition-colors";
const TAB_BUTTON_ACTIVE =
  "border-(--color-ink) bg-(--color-parchment-light) text-(--color-ink)";
const TAB_BUTTON_INACTIVE = "text-(--color-sepia) hover:bg-(--color-parchment-light)/40";

export function MobileBottomDock({ activeTab, onTabClick }: MobileBottomDockProps) {
  return (
    <nav
      aria-label="Разделы атласа"
      className="relative z-[35] flex shrink-0 border-t border-(--color-sepia-light) bg-(--color-parchment)"
      style={{
        height: MOBILE_DOCK_HEIGHT,
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {MOBILE_SHEET_TABS.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabClick(tab.id)}
            aria-pressed={active}
            className={`${TAB_BUTTON_BASE} ${active ? TAB_BUTTON_ACTIVE : TAB_BUTTON_INACTIVE}`}
          >
            <span className={active ? "font-medium" : ""}>{tab.ru}</span>
          </button>
        );
      })}
    </nav>
  );
}
