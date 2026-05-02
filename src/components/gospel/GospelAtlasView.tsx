"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { GospelMapShell } from "./GospelMapShell";
import { GospelContentTabs } from "./GospelContentTabs";
import { LocationDetailPanel } from "./panels/LocationDetailPanel";
import { RegionDetailPanel } from "./panels/RegionDetailPanel";
import { DiscipleDetailPanel } from "./panels/DiscipleDetailPanel";
import { GospelMobileShell } from "./mobile/GospelMobileShell";
import { BibleReader } from "@/components/bible/BibleReader";

function HolyWeekTeaser() {
  return (
    <div
      className="relative z-[2] mx-auto my-7 border border-(--color-rust)/60 bg-(--color-parchment-light)/70 px-6 py-5 sm:px-8 sm:py-6"
      style={{ width: "min(96%, 1200px)" }}
    >
      <div className="grid items-center gap-4 md:grid-cols-[1fr_auto]">
        <div>
          <div className="font-sans text-[10px] uppercase tracking-[0.25em] text-(--color-rust)">
            Святая Святых · Holy of Holies
          </div>
          <h2 className="m-0 mt-1 text-[24px] font-medium leading-tight sm:text-[28px]">
            Страстная неделя · день за днём
          </h2>
          <p className="mt-2 max-w-prose text-[14px] leading-snug text-(--color-ink-muted) sm:text-[15px]">
            Семь дней от Вербного воскресенья до пустой гробницы. Карта Иерусалима I века,
            подробное описание каждого дня и каждого события — Тайной вечери, Гефсимании,
            судов у Анны, Каиафы, Пилата и Ирода, путь на Голгофу.
          </p>
        </div>
        <Link
          href="/gospel/holy-week/"
          className="inline-flex shrink-0 items-center gap-2 border border-(--color-ink) bg-(--color-ink) px-5 py-3 font-sans text-[12px] uppercase tracking-[0.2em] text-(--color-parchment-grad-start) hover:bg-(--color-rust)"
        >
          Открыть Страстную неделю →
        </Link>
      </div>
    </div>
  );
}

export function GospelAtlasView() {
  return (
    <>
      <div className="hidden md:contents">
        <PageHeader
          activeSlug="gospel"
          titleRu="Евангелие"
          titleEn="The Four Gospels"
          subtitle="Жизнь Господа Иисуса Христа · ≈ 5 до н.э. — 30 н.э."
        />
        {/* Map-first shell: карта + все связанные с ней меню как overlay. */}
        <GospelMapShell />
        {/* Анонс отдельной страницы — Страстная неделя. */}
        <HolyWeekTeaser />
        {/* Длинные секции (не связанные напрямую с картой) — в табах со sticky nav. */}
        <GospelContentTabs />
      </div>

      <div className="md:hidden">
        <GospelMobileShell />
      </div>

      <LocationDetailPanel />
      <RegionDetailPanel />
      <DiscipleDetailPanel />
      <BibleReader />
    </>
  );
}
