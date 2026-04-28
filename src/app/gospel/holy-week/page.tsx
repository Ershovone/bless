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
      <PageHeader
        activeSlug="gospel"
        titleRu="Страстная неделя"
        titleEn="The Passion Week"
        subtitle="Семь дней — Иерусалим, Нисан 30 н.э."
      />
      <div className="mx-auto mb-2 px-5 text-center">
        <Link
          href="/gospel/"
          className="inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.2em] text-(--color-sepia) hover:text-(--color-ink)"
        >
          ← Вернуться к Евангелию
        </Link>
      </div>
      <JerusalemMap />
      <HolyWeekPanel />
      <ResurrectionAppearancesPanel />
      <BibleReader />
    </PageBackground>
  );
}
