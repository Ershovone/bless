"use client";

import { useState } from "react";
import { CompanionsPanel } from "@/components/panels/CompanionsPanel";
import { LegDistancesPanel } from "@/components/panels/LegDistancesPanel";
import { ChronologyScrubber } from "@/components/panels/ChronologyScrubber";
import { ActsIndex } from "@/components/panels/ActsIndex";
import { ScriptureQuote } from "@/components/panels/ScriptureQuote";

type TabId =
  | "chronology"
  | "companions"
  | "distances"
  | "acts"
  | "scripture";

const TABS: ReadonlyArray<{ id: TabId; ru: string; en: string }> = [
  { id: "chronology", ru: "Хронология", en: "Chronology" },
  { id: "companions", ru: "Спутники", en: "Companions" },
  { id: "distances", ru: "Расстояния", en: "Distances" },
  { id: "acts", ru: "Деяния по главам", en: "Acts" },
  { id: "scripture", ru: "Цитата", en: "Quote" },
];

function TabContent({ tab }: { tab: TabId }) {
  switch (tab) {
    case "chronology":
      return <ChronologyScrubber />;
    case "companions":
      return <CompanionsPanel />;
    case "distances":
      return <LegDistancesPanel />;
    case "acts":
      return <ActsIndex />;
    case "scripture":
      return <ScriptureQuote />;
  }
}

export function PaulContentTabs() {
  const [active, setActive] = useState<TabId>("chronology");

  const handleTabClick = (id: TabId) => {
    setActive(id);
    if (typeof window === "undefined") return;
    requestAnimationFrame(() => {
      const navEl = document.getElementById("paul-tabs-nav");
      if (!navEl) return;
      const rect = navEl.getBoundingClientRect();
      if (rect.top <= 0) {
        navEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  };

  return (
    <section
      className="relative z-[2] mx-auto my-8"
      style={{ width: "min(96%, 1500px)" }}
    >
      <nav
        id="paul-tabs-nav"
        aria-label="Разделы путешествий Павла"
        className="sticky top-0 z-[10] -mx-1 flex items-stretch overflow-x-auto border-b border-(--color-sepia-light) bg-(--color-parchment)/95 backdrop-blur-sm [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {TABS.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab.id)}
              aria-pressed={isActive}
              className={`shrink-0 whitespace-nowrap border-b-2 px-4 py-2.5 font-sans text-[11px] uppercase tracking-[0.18em] transition-all sm:px-5 sm:text-[12px] ${
                isActive
                  ? "border-(--color-rust) bg-(--color-parchment-light)/40 font-medium text-(--color-ink)"
                  : "border-transparent text-(--color-sepia) hover:bg-(--color-parchment-light)/30 hover:text-(--color-ink)"
              }`}
            >
              <span>{tab.ru}</span>
              <em className="ml-2 hidden text-[10px] opacity-60 lg:inline">
                {tab.en}
              </em>
            </button>
          );
        })}
      </nav>

      <div role="region" aria-live="polite" className="mt-1">
        <TabContent tab={active} />
      </div>
    </section>
  );
}
