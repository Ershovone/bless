import type { Journey } from "@/types/atlas";
import { getCanonicalUrl } from "./paths";

export function paulAtlasJsonLd(journeys: Journey[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: "Путешествия Апостола Павла · The Journeys of the Apostle Paul",
    inLanguage: ["ru", "en"],
    url: getCanonicalUrl("/paul"),
    about: {
      "@type": "Thing",
      name: "Acts of the Apostles",
      alternateName: "Деяния святых Апостолов",
    },
    temporalCoverage: "0046/0062",
    hasPart: journeys.map((j) => ({
      "@type": "Event",
      name: `${j.ru} · ${j.en}`,
      description: j.summary,
      startDate: j.years,
      isBasedOn: { "@type": "Book", name: j.acts },
      url: getCanonicalUrl(`/paul/journey/${j.slug}`),
    })),
  };
}
