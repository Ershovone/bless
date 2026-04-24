import { BibleNav } from "./BibleNav";
import { Ornament } from "./Ornament";

type PageHeaderProps = {
  activeSlug: string;
  titleRu: string;
  titleEn: string;
  subtitle: string;
};

export function PageHeader({ activeSlug, titleRu, titleEn, subtitle }: PageHeaderProps) {
  return (
    <header className="relative z-10 px-5 pt-10 pb-4 text-center">
      <BibleNav activeSlug={activeSlug} />
      <Ornament />
      <h1 className="mx-0 mt-2 mb-1 text-[56px] font-normal leading-[1.05] tracking-[0.01em]">
        <span>{titleRu}</span>
        <em className="mt-1 block text-[22px] font-normal italic tracking-[0.08em] text-(--color-sepia)">
          {titleEn}
        </em>
      </h1>
      <div className="my-3.5 text-sm uppercase tracking-[0.18em] text-(--color-sepia)">
        {subtitle}
      </div>
      <Ornament />
    </header>
  );
}
