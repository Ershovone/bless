"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { ExodusAtlasMap } from "./ExodusAtlasMap";
import { ExodusPhaseTabs } from "./controls/ExodusPhaseTabs";
import { ExodusInfoCard } from "./controls/ExodusInfoCard";
import { PeoplesPanel } from "./panels/PeoplesPanel";
import { PlaguesPanel } from "./panels/PlaguesPanel";
import { PeopleDetailPanel } from "./panels/PeopleDetailPanel";
import { StationDetailPanel } from "./panels/StationDetailPanel";
import { ExodusMobileShell } from "./mobile/ExodusMobileShell";
import { BibleReader } from "@/components/bible/BibleReader";

export function ExodusAtlasView() {
  return (
    <>
      <div className="hidden md:contents">
        <PageHeader
          activeSlug="exodus"
          titleRu="Исход из Египта"
          titleEn="The Exodus from Egypt"
          subtitle="Книга Исход и Чисел · Liber Exodus · ~1446–1406 до Р.Х."
        />
        <ExodusAtlasMap />
        <ExodusPhaseTabs />
        <ExodusInfoCard />
        <PeoplesPanel />
        <PlaguesPanel />
      </div>

      <div className="md:hidden">
        <ExodusMobileShell />
      </div>

      <PeopleDetailPanel />
      <StationDetailPanel />
      <BibleReader />
    </>
  );
}
