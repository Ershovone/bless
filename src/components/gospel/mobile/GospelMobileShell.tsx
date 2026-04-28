"use client";

import { useState } from "react";
import { GospelAtlasMap } from "@/components/gospel/GospelAtlasMap";
import { GospelInfoCard } from "@/components/gospel/controls/GospelInfoCard";
import { RegionsPanel } from "@/components/gospel/panels/RegionsPanel";
import { MiraclesPanel } from "@/components/gospel/panels/MiraclesPanel";
import { ParablesPanel } from "@/components/gospel/panels/ParablesPanel";
import { DiscoursesPanel } from "@/components/gospel/panels/DiscoursesPanel";
import { GospelTimelinePanel } from "@/components/gospel/panels/GospelTimelinePanel";
import { DisciplesPanel } from "@/components/gospel/panels/DisciplesPanel";
import { MobileBottomDock, type MobileBottomDockTab } from "@/components/layout/MobileBottomDock";
import { MobileSheet } from "@/components/layout/MobileSheet";
import { GospelMobileHeader } from "./GospelMobileHeader";

type GospelMobileTabId =
  | "phase"
  | "regions"
  | "timeline"
  | "miracles"
  | "parables"
  | "discourses"
  | "disciples";

const TABS: ReadonlyArray<MobileBottomDockTab<GospelMobileTabId>> = [
  { id: "phase", ru: "Период", en: "Phase" },
  { id: "regions", ru: "Земли", en: "Regions" },
  { id: "timeline", ru: "Хроника", en: "Timeline" },
  { id: "miracles", ru: "Чудеса", en: "Miracles" },
  { id: "parables", ru: "Притчи", en: "Parables" },
  { id: "discourses", ru: "Беседы", en: "Discourses" },
  { id: "disciples", ru: "Двенадцать", en: "Twelve" },
];

const TAB_TITLE: Record<GospelMobileTabId, string> = {
  phase: "Период · Phase",
  regions: "Земли · Regions",
  timeline: "Хроника · Timeline",
  miracles: "Чудеса · Miracles",
  parables: "Притчи · Parables",
  discourses: "Беседы · Discourses",
  disciples: "Двенадцать · The Twelve",
};

function SheetContent({ tab }: { tab: GospelMobileTabId }) {
  switch (tab) {
    case "phase":
      return <GospelInfoCard />;
    case "regions":
      return <RegionsPanel />;
    case "timeline":
      return <GospelTimelinePanel />;
    case "miracles":
      return <MiraclesPanel />;
    case "parables":
      return <ParablesPanel />;
    case "discourses":
      return <DiscoursesPanel />;
    case "disciples":
      return <DisciplesPanel />;
  }
}

export function GospelMobileShell() {
  const [openTab, setOpenTab] = useState<GospelMobileTabId | null>(null);

  const handleTabClick = (tab: GospelMobileTabId) => {
    setOpenTab((prev) => (prev === tab ? null : tab));
  };

  return (
    <div className="fixed inset-0 z-[20] flex flex-col bg-(--color-parchment)">
      <GospelMobileHeader />
      <div className="relative min-h-0 flex-1">
        <GospelAtlasMap variant="fullscreen" />
      </div>
      <MobileSheet
        open={openTab !== null}
        title={openTab ? TAB_TITLE[openTab] : undefined}
        onClose={() => setOpenTab(null)}
      >
        {openTab && <SheetContent tab={openTab} />}
      </MobileSheet>
      <MobileBottomDock<GospelMobileTabId>
        activeTab={openTab}
        onTabClick={handleTabClick}
        tabs={TABS}
      />
    </div>
  );
}
