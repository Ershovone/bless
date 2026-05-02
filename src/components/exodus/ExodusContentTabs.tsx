"use client";

import { useState } from "react";
import { PlaguesPanel } from "./panels/PlaguesPanel";
import { PeoplesPanel } from "./panels/PeoplesPanel";
import { EXODUS_STATIONS, EXODUS_STATION_ORDER } from "@/data/exodus/stations";
import { useExodusStore } from "@/hooks/useExodusStore";
import { SectionLabel } from "@/components/layout/SectionLabel";
import { ScriptureRef } from "@/components/bible/ScriptureRef";

type TabId = "plagues" | "peoples" | "stations";

const TABS: ReadonlyArray<{ id: TabId; ru: string; en: string }> = [
  { id: "plagues", ru: "Десять казней", en: "Ten Plagues" },
  { id: "peoples", ru: "Народы", en: "Peoples" },
  { id: "stations", ru: "42 станции", en: "Stations" },
];

const CONFIDENCE_LABEL = {
  known: "известна",
  approximate: "предположительно",
} as const;

function StationsIndex() {
  const setSelected = useExodusStore((s) => s.setSelectedStation);

  return (
    <div className="relative z-[2] mx-auto my-5" style={{ width: "min(96%, 1300px)" }}>
      <SectionLabel className="mb-3">
        Все станции по Числам 33 · <em>All 42 Stations from Numbers 33</em>
      </SectionLabel>
      <div className="border border-(--color-sepia-light) bg-(--color-parchment-light)/40 text-left">
        <div className="hidden grid-cols-[60px_1fr_140px_140px] border-b border-(--color-sepia-light) px-3 py-3 font-sans text-[10px] uppercase tracking-[0.2em] text-(--color-sepia) sm:grid sm:px-6 sm:py-3.5 sm:text-[11px] sm:tracking-[0.25em]">
          <span>№</span>
          <span>Станция</span>
          <span>Современно</span>
          <span>Ссылка</span>
        </div>
        {EXODUS_STATION_ORDER.map((id, i) => {
          const st = EXODUS_STATIONS[id];
          return (
            <div
              key={id}
              className="grid grid-cols-[40px_1fr_auto] items-baseline gap-x-3 border-b border-dotted border-(--color-sepia-light) px-3 py-3 last:border-b-0 sm:grid-cols-[60px_1fr_140px_140px] sm:px-6 sm:py-3.5"
            >
              <div className="font-sans text-[12px] tracking-[0.05em] text-(--color-rust)">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="col-span-2 min-w-0 sm:col-span-1">
                <button
                  type="button"
                  onClick={() => setSelected(id)}
                  className="block text-left text-[14px] leading-tight hover:underline sm:text-[15px]"
                >
                  {st.ru}
                </button>
                <em className="mt-0.5 block text-[12px] text-(--color-sepia)">
                  {st.en}
                  {st.confidence && (
                    <span className="ml-2 text-[10px] tracking-[0.05em] opacity-70">
                      · {CONFIDENCE_LABEL[st.confidence]}
                    </span>
                  )}
                </em>
              </div>
              <div className="text-right text-[12px] italic text-(--color-sepia) sm:text-left sm:text-[13px]">
                {st.modern ?? <span className="opacity-40">—</span>}
              </div>
              <div className="text-right text-[12px] italic text-(--color-rust) sm:text-[13px]">
                {st.numbersRef ? (
                  <ScriptureRef refText={st.numbersRef} />
                ) : (
                  <span className="opacity-40">—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TabContent({ tab }: { tab: TabId }) {
  switch (tab) {
    case "plagues":
      return <PlaguesPanel />;
    case "peoples":
      return <PeoplesPanel />;
    case "stations":
      return <StationsIndex />;
  }
}

export function ExodusContentTabs() {
  const [active, setActive] = useState<TabId>("plagues");

  const handleTabClick = (id: TabId) => {
    setActive(id);
    if (typeof window === "undefined") return;
    requestAnimationFrame(() => {
      const navEl = document.getElementById("exodus-tabs-nav");
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
        id="exodus-tabs-nav"
        aria-label="Разделы Исхода"
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
