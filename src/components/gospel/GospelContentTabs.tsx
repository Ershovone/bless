"use client";

import { useState } from "react";
import { GospelTimelinePanel } from "./panels/GospelTimelinePanel";
import { MiraclesPanel } from "./panels/MiraclesPanel";
import { ParablesPanel } from "./panels/ParablesPanel";
import { DiscoursesPanel } from "./panels/DiscoursesPanel";
import { BeatitudesPanel } from "./panels/BeatitudesPanel";
import { IAmSayingsPanel } from "./panels/IAmSayingsPanel";
import { DisciplesPanel } from "./panels/DisciplesPanel";
import { ResurrectionAppearancesPanel } from "./panels/ResurrectionAppearancesPanel";
import { GospelComparisonPanel } from "./panels/GospelComparisonPanel";

type TabId =
  | "timeline"
  | "miracles"
  | "parables"
  | "discourses"
  | "beatitudes"
  | "iam"
  | "disciples"
  | "resurrection"
  | "comparison";

const TABS: ReadonlyArray<{ id: TabId; ru: string; en: string }> = [
  { id: "timeline", ru: "Хроника", en: "Timeline" },
  { id: "miracles", ru: "Чудеса", en: "Miracles" },
  { id: "parables", ru: "Притчи", en: "Parables" },
  { id: "discourses", ru: "Беседы", en: "Discourses" },
  { id: "beatitudes", ru: "Заповеди блаженств", en: "Beatitudes" },
  { id: "iam", ru: "Я есмь", en: "I Am" },
  { id: "disciples", ru: "Двенадцать", en: "The Twelve" },
  { id: "resurrection", ru: "Воскресение", en: "Resurrection" },
  { id: "comparison", ru: "Параллели", en: "Synoptic" },
];

function TabContent({ tab }: { tab: TabId }) {
  switch (tab) {
    case "timeline":
      return <GospelTimelinePanel />;
    case "miracles":
      return <MiraclesPanel />;
    case "parables":
      return <ParablesPanel />;
    case "discourses":
      return <DiscoursesPanel />;
    case "beatitudes":
      return <BeatitudesPanel />;
    case "iam":
      return <IAmSayingsPanel />;
    case "disciples":
      return <DisciplesPanel />;
    case "resurrection":
      return <ResurrectionAppearancesPanel />;
    case "comparison":
      return <GospelComparisonPanel />;
  }
}

export function GospelContentTabs() {
  const [active, setActive] = useState<TabId>("timeline");

  const handleTabClick = (id: TabId) => {
    setActive(id);
    // Если sticky-nav уже залип сверху, прокручиваем так, чтобы он остался у
    // верхнего края — иначе при смене длинного контента позиция «уплывает».
    if (typeof window === "undefined") return;
    requestAnimationFrame(() => {
      const navEl = document.getElementById("gospel-tabs-nav");
      if (!navEl) return;
      const rect = navEl.getBoundingClientRect();
      // Прокручиваем только если nav уже находится выше своей естественной позиции
      // (т.е. залип) — иначе не дёргаем страницу.
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
        id="gospel-tabs-nav"
        aria-label="Разделы Евангелия"
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
