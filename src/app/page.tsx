import Link from "next/link";
import type { Metadata } from "next";
import { PageBackground } from "@/components/layout/PageBackground";
import { Ornament } from "@/components/layout/Ornament";
import { buildMetadata, SITE_TITLE } from "@/lib/seo/metadata";

type BookSlot = {
  slug: string | null;
  ru: string;
  en: string;
  ref: string;
  enabled: boolean;
};

const BOOKS: BookSlot[] = [
  { slug: null,   ru: "Бытие",             en: "Genesis",              ref: "Эдем → Ханаан",               enabled: false },
  { slug: null,   ru: "Исход",             en: "Exodus",               ref: "Путь Моисея",                 enabled: false },
  { slug: null,   ru: "Царства",           en: "Kings",                ref: "Царская история",             enabled: false },
  { slug: null,   ru: "Евангелия",         en: "Gospels",              ref: "Путь Христа",                 enabled: false },
  { slug: "paul", ru: "Деяния Апостолов",  en: "Acts of the Apostles", ref: "Путешествия Павла · 46–62 A.D.", enabled: true },
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
          Интерактивные карты библейских путешествий на пергаменте — маршруты, спутники, хронология и города.
        </p>
        <div className="mt-10">
          <Ornament />
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {BOOKS.map((b, i) => {
            const card = (
              <div
                className={`border border-(--color-sepia-light) bg-(--color-parchment-light)/60 p-6 text-left transition-all ${
                  b.enabled ? "hover:bg-(--color-parchment-light) hover:shadow-lg" : "opacity-50"
                }`}
              >
                <div className="font-sans text-[11px] uppercase tracking-[0.25em] text-(--color-rust)">
                  {b.enabled ? "Доступно · Live" : "Скоро · Coming soon"}
                </div>
                <h2 className="mt-2 text-2xl font-medium leading-tight text-(--color-ink)">
                  {b.ru}
                </h2>
                <p className="mt-1 text-sm italic text-(--color-sepia)">{b.en}</p>
                <p className="mt-3 text-sm text-(--color-ink-muted)">{b.ref}</p>
              </div>
            );
            return b.enabled && b.slug ? (
              <Link key={i} href={`/${b.slug}/`} className="block">
                {card}
              </Link>
            ) : (
              <div key={i}>{card}</div>
            );
          })}
        </div>
      </main>
    </PageBackground>
  );
}
