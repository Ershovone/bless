"use client";

import { Suspense, useEffect } from "react";
import { AtlasMap } from "@/components/atlas/AtlasMap";
import { JourneyTabs } from "@/components/controls/JourneyTabs";
import { InfoCard } from "@/components/controls/InfoCard";
import { ViewToggles } from "@/components/controls/ViewToggles";
import { CompanionsPanel } from "@/components/panels/CompanionsPanel";
import { LegDistancesPanel } from "@/components/panels/LegDistancesPanel";
import { ChronologyScrubber } from "@/components/panels/ChronologyScrubber";
import { ActsIndex } from "@/components/panels/ActsIndex";
import { ScriptureQuote } from "@/components/panels/ScriptureQuote";
import { CityDetailPanel } from "@/components/panels/CityDetailPanel";
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
      <PageHeader
        activeSlug="paul"
        titleRu="Путешествия Апостола Павла"
        titleEn="The Journeys of the Apostle Paul"
        subtitle="Деяния святых Апостолов · Acta Apostolorum · 46–62 A.D."
      />
      <AtlasMap />
      <JourneyTabs />
      <InfoCard />
      <ViewToggles />
      <CompanionsPanel />
      <LegDistancesPanel />
      <ChronologyScrubber />
      <ActsIndex />
      <ScriptureQuote />
      <CityDetailPanel />
    </>
  );
}
