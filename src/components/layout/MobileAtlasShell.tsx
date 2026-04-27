"use client";

import { useEffect, useState } from "react";
import { AtlasMap } from "@/components/atlas/AtlasMap";
import { useAtlasStore } from "@/hooks/useAtlasStore";
import { InfoCard } from "@/components/controls/InfoCard";
import { ViewToggles } from "@/components/controls/ViewToggles";
import { CompanionsPanel } from "@/components/panels/CompanionsPanel";
import { LegDistancesPanel } from "@/components/panels/LegDistancesPanel";
import { ChronologyScrubber } from "@/components/panels/ChronologyScrubber";
import { ActsIndex } from "@/components/panels/ActsIndex";
import { ScriptureQuote } from "@/components/panels/ScriptureQuote";
import {
  MOBILE_SHEET_TABS,
  type MobileSheetTabId,
} from "@/constants/mobile";
import { MobileBottomDock } from "./MobileBottomDock";
import { MobileHeader } from "./MobileHeader";
import { MobileSheet } from "./MobileSheet";

const TAB_TITLE: Record<MobileSheetTabId, string> = Object.fromEntries(
  MOBILE_SHEET_TABS.map((t) => [t.id, `${t.ru} · ${t.en}`]),
) as Record<MobileSheetTabId, string>;

function SheetContent({ tab }: { tab: MobileSheetTabId }) {
  switch (tab) {
    case "route":
      return (
        <>
          <InfoCard />
          <ViewToggles />
          <LegDistancesPanel />
        </>
      );
    case "companions":
      return <CompanionsPanel />;
    case "chronology":
      return <ChronologyScrubber />;
    case "acts":
      return (
        <>
          <ActsIndex />
          <ScriptureQuote />
        </>
      );
  }
}

export function MobileAtlasShell() {
  const [openTab, setOpenTab] = useState<MobileSheetTabId | null>(null);
  const playing = useAtlasStore((s) => s.playing);

  useEffect(() => {
    if (playing) setOpenTab(null);
  }, [playing]);

  const handleTabClick = (tab: MobileSheetTabId) => {
    setOpenTab((prev) => (prev === tab ? null : tab));
  };

  return (
    <div className="fixed inset-0 z-[20] flex flex-col bg-(--color-parchment)">
      <MobileHeader />
      <div className="relative min-h-0 flex-1">
        <AtlasMap variant="fullscreen" />
      </div>
      <MobileSheet
        open={openTab !== null}
        title={openTab ? TAB_TITLE[openTab] : undefined}
        onClose={() => setOpenTab(null)}
      >
        {openTab && <SheetContent tab={openTab} />}
      </MobileSheet>
      <MobileBottomDock activeTab={openTab} onTabClick={handleTabClick} />
    </div>
  );
}
