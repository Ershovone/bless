"use client";

import { useState } from "react";
import { ExodusAtlasMap } from "@/components/exodus/ExodusAtlasMap";
import { ExodusInfoCard } from "@/components/exodus/controls/ExodusInfoCard";
import { PeoplesPanel } from "@/components/exodus/panels/PeoplesPanel";
import { PlaguesPanel } from "@/components/exodus/panels/PlaguesPanel";
import { MobileBottomDock, type MobileBottomDockTab } from "@/components/layout/MobileBottomDock";
import { MobileSheet } from "@/components/layout/MobileSheet";
import { ExodusMobileHeader } from "./ExodusMobileHeader";

type ExodusMobileTabId = "phase" | "peoples" | "plagues";

const TABS: ReadonlyArray<MobileBottomDockTab<ExodusMobileTabId>> = [
  { id: "phase", ru: "Фаза", en: "Phase" },
  { id: "peoples", ru: "Народы", en: "Peoples" },
  { id: "plagues", ru: "Казни", en: "Plagues" },
];

const TAB_TITLE: Record<ExodusMobileTabId, string> = {
  phase: "Фаза · Phase",
  peoples: "Народы · Peoples",
  plagues: "Казни · Plagues",
};

function SheetContent({ tab }: { tab: ExodusMobileTabId }) {
  switch (tab) {
    case "phase":
      return <ExodusInfoCard />;
    case "peoples":
      return <PeoplesPanel />;
    case "plagues":
      return <PlaguesPanel />;
  }
}

export function ExodusMobileShell() {
  const [openTab, setOpenTab] = useState<ExodusMobileTabId | null>(null);

  const handleTabClick = (tab: ExodusMobileTabId) => {
    setOpenTab((prev) => (prev === tab ? null : tab));
  };

  return (
    <div className="fixed inset-0 z-[20] flex flex-col bg-(--color-parchment)">
      <ExodusMobileHeader />
      <div className="relative min-h-0 flex-1">
        <ExodusAtlasMap variant="fullscreen" />
      </div>
      <MobileSheet
        open={openTab !== null}
        title={openTab ? TAB_TITLE[openTab] : undefined}
        onClose={() => setOpenTab(null)}
      >
        {openTab && <SheetContent tab={openTab} />}
      </MobileSheet>
      <MobileBottomDock<ExodusMobileTabId>
        activeTab={openTab}
        onTabClick={handleTabClick}
        tabs={TABS}
      />
    </div>
  );
}
