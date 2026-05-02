"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { ExodusMapShell } from "./ExodusMapShell";
import { ExodusContentTabs } from "./ExodusContentTabs";
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
        {/* Map-first shell: фазы, контекст и народы — overlay на карте. */}
        <ExodusMapShell />
        {/* Длинные секции — в табах со sticky nav. */}
        <ExodusContentTabs />
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
