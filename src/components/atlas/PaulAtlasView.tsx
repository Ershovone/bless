"use client";

import { Suspense, useEffect } from "react";
import { PaulMapShell } from "@/components/atlas/PaulMapShell";
import { PaulContentTabs } from "@/components/atlas/PaulContentTabs";
import { CityDetailPanel } from "@/components/panels/CityDetailPanel";
import { BibleReader } from "@/components/bible/BibleReader";
import { MobileAtlasShell } from "@/components/layout/MobileAtlasShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAtlasStore } from "@/hooks/useAtlasStore";
import { useURLSync } from "@/hooks/useURLSync";

function URLSync() {
  useURLSync();
  return null;
}

type PaulAtlasViewProps = {
  initialJourneyIdx?: number;
};

export function PaulAtlasView({ initialJourneyIdx }: PaulAtlasViewProps) {
  const setActiveJ = useAtlasStore((s) => s.setActiveJ);

  useEffect(() => {
    if (typeof initialJourneyIdx === "number") setActiveJ(initialJourneyIdx);
  }, [initialJourneyIdx, setActiveJ]);

  return (
    <>
      <Suspense fallback={null}>
        <URLSync />
      </Suspense>

      <div className="hidden md:contents">
        <PageHeader
          activeSlug="paul"
          titleRu="Путешествия Апостола Павла"
          titleEn="The Journeys of the Apostle Paul"
          subtitle="Деяния святых Апостолов · Acta Apostolorum · 46–62 A.D."
        />
        {/* Map-first shell: путешествия, контекст и слои — overlay на карте. */}
        <PaulMapShell />
        {/* Длинные секции — в табах со sticky nav. */}
        <PaulContentTabs />
      </div>

      <div className="md:hidden">
        <MobileAtlasShell />
      </div>

      <CityDetailPanel />
      <BibleReader />
    </>
  );
}
