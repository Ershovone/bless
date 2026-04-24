import type { Metadata } from "next";
import Script from "next/script";
import { PageBackground } from "@/components/layout/PageBackground";
import { PaulAtlasView } from "@/components/atlas/PaulAtlasView";
import { JOURNEYS } from "@/data/journeys";
import { buildMetadata } from "@/lib/seo/metadata";
import { paulAtlasJsonLd } from "@/lib/seo/jsonLd";

export const metadata: Metadata = buildMetadata({
  title: "Путешествия Апостола Павла · Bible Atlas",
  description:
    "Интерактивный атлас миссионерских путешествий апостола Павла (46–62 A.D.). Маршруты, спутники, расстояния, хронология событий из Деяний 13–28.",
  path: "/paul",
});

export default function PaulPage() {
  return (
    <PageBackground>
      <Script
        id="jsonld-paul"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(paulAtlasJsonLd(JOURNEYS)) }}
      />
      <PaulAtlasView />
    </PageBackground>
  );
}
