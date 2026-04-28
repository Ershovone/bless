import type { Metadata } from "next";
import { PageBackground } from "@/components/layout/PageBackground";
import { GospelAtlasView } from "@/components/gospel/GospelAtlasView";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Евангелие · Bible Atlas",
  description:
    "Интерактивный атлас четырёх Евангелий: жизнь Господа Иисуса Христа от Рождества до Вознесения. Восемь периодов, чудеса, притчи, беседы, Двенадцать апостолов, Страстная неделя с картой Иерусалима.",
  path: "/gospel",
});

export default function GospelPage() {
  return (
    <PageBackground>
      <GospelAtlasView />
    </PageBackground>
  );
}
