import Link from "next/link";
import type { Metadata } from "next";
import { PageBackground } from "@/components/layout/PageBackground";
import { Ornament } from "@/components/layout/Ornament";
import { buildMetadata, SITE_TITLE } from "@/lib/seo/metadata";

type BookSlot = {
  slug: string;
  ru: string;
  en: string;
  ref: string;
};

const BOOKS: BookSlot[] = [
  {
    slug: "exodus",
    ru: "Исход",
    en: "Exodus",
    ref: "Путь Моисея · ≈ 1446 до н.э.",
  },
  {
    slug: "gospel",
    ru: "Евангелие",
    en: "The Four Gospels",
    ref: "Жизнь Иисуса Христа · ≈ 5 до н.э. — 30 н.э.",
  },
  {
    slug: "paul",
    ru: "Деяния Апостолов",
    en: "Acts of the Apostles",
    ref: "Путешествия апостола Павла · 46–62 н.э.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: `${SITE_TITLE} — Интерактивный атлас`,
  description:
    "Интерактивный атлас Библии: пергаментные карты библейских путешествий с маршрутами, хронологией и подробностями.",
  path: "/",
});

export default function HomePage() {
  return (
    <PageBackground>
      <main className="relative z-10 mx-auto w-full max-w-5xl px-6 py-16 text-center">
        <Ornament />
        <h1 className="mt-4 text-6xl leading-[1.05] tracking-tight text-(--color-ink)">
          Атлас Библии
          <em className="mt-2 block text-2xl not-italic text-(--color-sepia)">
            <span className="italic">Bible Atlas</span>
          </em>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg italic leading-relaxed text-(--color-sepia)">
          Интерактивные карты библейских путешествий на пергаменте — маршруты,
          спутники, хронология и города.
        </p>
        <div className="mt-10">
          <Ornament />
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BOOKS.map((b) => (
            <Link
              key={b.slug}
              href={`/${b.slug}/`}
              className="block border border-(--color-sepia-light) bg-(--color-parchment-light)/60 p-6 text-left transition-all hover:bg-(--color-parchment-light) hover:shadow-lg"
            >
              <h2 className="text-2xl font-medium leading-tight text-(--color-ink)">
                {b.ru}
              </h2>
              <p className="mt-1 text-sm italic text-(--color-sepia)">{b.en}</p>
              <p className="mt-3 text-sm text-(--color-ink-muted)">{b.ref}</p>
            </Link>
          ))}
        </div>
      </main>
    </PageBackground>
  );
}
