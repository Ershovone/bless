"use client";

import { MOBILE_DOCK_HEIGHT, MOBILE_SHEET_TABS } from "@/constants/mobile";

export type MobileBottomDockTab<TId extends string = string> = {
  id: TId;
  ru: string;
  en: string;
};

type MobileBottomDockProps<TId extends string> = {
  activeTab: TId | null;
  onTabClick: (tab: TId) => void;
  tabs?: ReadonlyArray<MobileBottomDockTab<TId>>;
};

const TAB_BUTTON_BASE =
  "flex h-full shrink-0 flex-col items-center justify-center gap-0.5 border-t-2 border-transparent px-4 text-[10px] font-sans uppercase tracking-[0.15em] whitespace-nowrap transition-colors";
const TAB_BUTTON_ACTIVE =
  "border-(--color-ink) bg-(--color-parchment-light) text-(--color-ink)";
const TAB_BUTTON_INACTIVE = "text-(--color-sepia) hover:bg-(--color-parchment-light)/40";

export function MobileBottomDock<TId extends string>({
  activeTab,
  onTabClick,
  tabs = MOBILE_SHEET_TABS as unknown as ReadonlyArray<MobileBottomDockTab<TId>>,
}: MobileBottomDockProps<TId>) {
  return (
    <nav
      aria-label="Разделы атласа"
      className="relative z-[35] flex shrink-0 justify-stretch overflow-x-auto overflow-y-hidden border-t border-(--color-sepia-light) bg-(--color-parchment) [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      style={{
        height: MOBILE_DOCK_HEIGHT,
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {tabs.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabClick(tab.id)}
            aria-pressed={active}
            className={`${TAB_BUTTON_BASE} ${active ? TAB_BUTTON_ACTIVE : TAB_BUTTON_INACTIVE}`}
            style={{ flex: "1 0 max-content", minWidth: 84 }}
          >
            <span className={active ? "font-medium" : ""}>{tab.ru}</span>
          </button>
        );
      })}
    </nav>
  );
}
