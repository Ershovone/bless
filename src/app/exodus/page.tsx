import type { Metadata } from "next";
import { PageBackground } from "@/components/layout/PageBackground";
import { ExodusAtlasView } from "@/components/exodus/ExodusAtlasView";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Исход из Египта · Bible Atlas",
  description:
    "Интерактивный атлас Исхода: 22 станции от Раамсеса до Равнин Моава, 10 казней, народы вокруг Израиля (Аморреи, Моавитяне, Эдомитяне, Амалекитяне) и пять фаз 40-летнего пути.",
  path: "/exodus",
});

export default function ExodusPage() {
  return (
    <PageBackground>
      <ExodusAtlasView />
    </PageBackground>
  );
}
