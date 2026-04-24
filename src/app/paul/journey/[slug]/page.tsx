import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBackground } from "@/components/layout/PageBackground";
import { PaulAtlasView } from "@/components/atlas/PaulAtlasView";
import { JOURNEYS, JOURNEY_BY_SLUG } from "@/data/journeys";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return JOURNEYS.map((j) => ({ slug: j.slug }));
}

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const j = JOURNEY_BY_SLUG[slug];
  if (!j) return buildMetadata({ title: "Путешествие не найдено", description: "", path: "/paul" });
  return buildMetadata({
    title: `${j.ru} · ${j.en} · ${j.years} — Атлас Библии`,
    description: `${j.summary} ${j.acts}. Интерактивная карта маршрута со спутниками и расстояниями.`,
    path: `/paul/journey/${slug}`,
  });
}

export default async function JourneyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const journey = JOURNEY_BY_SLUG[slug];
  if (!journey) notFound();
  const idx = JOURNEYS.findIndex((j) => j.slug === slug);
  return (
    <PageBackground>
      <PaulAtlasView initialJourneyIdx={idx} />
    </PageBackground>
  );
}
