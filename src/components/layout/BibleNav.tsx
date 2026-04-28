import Link from "next/link";

type NavItem = {
  slug: string | null;
  ru: string;
  en: string;
};

const ITEMS: NavItem[] = [
  { slug: null, ru: "Бытие", en: "Genesis" },
  { slug: "exodus", ru: "Исход", en: "Exodus" },
  { slug: null, ru: "Царства", en: "Kings" },
  { slug: "gospel", ru: "Евангелие", en: "Gospels" },
  { slug: "paul", ru: "Деяния Апостолов", en: "Acts of the Apostles" },
];

export function BibleNav({ activeSlug }: { activeSlug: string }) {
  return (
    <nav className="mb-5 flex flex-wrap items-center justify-center gap-2 border-y border-(--color-sepia-light) px-5 py-2.5 text-sm text-(--color-sepia-light) tracking-[0.08em]">
      <Link
        href="/"
        className="mr-4 font-sans text-[10px] uppercase tracking-[0.3em] text-(--color-sepia) hover:text-(--color-ink)"
      >
        Атлас Библии · <em className="not-italic">Bible Atlas</em>
      </Link>
      {ITEMS.map((item, i) => {
        const isActive = item.slug === activeSlug;
        const isLast = i === ITEMS.length - 1;
        const content = (
          <span
            className={`italic ${
              isActive
                ? "border-b-[1.5px] border-(--color-rust) pb-0.5 not-italic font-medium text-(--color-ink) opacity-100"
                : "opacity-60"
            }`}
          >
            {item.ru}
          </span>
        );
        return (
          <span key={i} className="flex items-center gap-2">
            {item.slug && !isActive ? (
              <Link href={`/${item.slug}/`}>{content}</Link>
            ) : (
              content
            )}
            {!isLast && <span className="opacity-40">·</span>}
          </span>
        );
      })}
      <span className="ml-3 border border-(--color-amber) px-1.5 py-0.5 font-sans text-[9px] uppercase tracking-[0.2em] text-(--color-amber) opacity-75">
        скоро
      </span>
    </nav>
  );
}
