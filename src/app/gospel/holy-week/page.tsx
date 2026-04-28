import type { Metadata } from "next";
import Link from "next/link";
import { PageBackground } from "@/components/layout/PageBackground";
import { PageHeader } from "@/components/layout/PageHeader";
import { JerusalemMap } from "@/components/gospel/JerusalemMap";
import { HolyWeekPanel } from "@/components/gospel/panels/HolyWeekPanel";
import { ResurrectionAppearancesPanel } from "@/components/gospel/panels/ResurrectionAppearancesPanel";
import { BibleReader } from "@/components/bible/BibleReader";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Страстная неделя · Евангелие · Bible Atlas",
  description:
    "Семь дней Страстной недели Господа Иисуса Христа: от торжественного входа в Иерусалим до пустой гробницы и явлений Воскресшего. Карта Иерусалима I века.",
  path: "/gospel/holy-week",
});

export default function HolyWeekPage() {
  return (
    <PageBackground>
      <div
        className="relative z-10 mx-auto px-5 pt-6"
        style={{ width: "min(96%, 1500px)" }}
      >
        <Link
          href="/gospel/"
          className="inline-flex items-center gap-2 border border-(--color-sepia-light) bg-(--color-parchment-light)/70 px-4 py-2 font-sans text-[11px] uppercase tracking-[0.18em] text-(--color-sepia) shadow-[0_2px_8px_-2px_rgba(74,50,30,0.2)] transition-colors hover:border-(--color-ink) hover:bg-(--color-parchment-light) hover:text-(--color-ink)"
        >
          <span aria-hidden className="text-base leading-none">←</span>
          <span>К Евангелию</span>
        </Link>
      </div>
      <PageHeader
        activeSlug="gospel"
        titleRu="Страстная неделя"
        titleEn="The Passion Week"
        subtitle="Семь дней — Иерусалим, Нисан 30 н.э."
      />
      <JerusalemMap />
      <HolyWeekPanel />
      <ResurrectionAppearancesPanel />
      <BibleReader />
    </PageBackground>
  );
}
