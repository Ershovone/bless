"use client";

import { useEffect, useMemo, useRef } from "react";
import { useBibleBook } from "@/hooks/useBibleBook";
import { useBibleStore } from "@/hooks/useBibleStore";
import type { BibleBook, RefChapter } from "@/types/bible";

const SCROLL_OFFSET_PX = 32;

function chapterDisplay(book: BibleBook, requested: RefChapter[]): string {
  if (requested.length === 0) return book.ru;
  if (requested.length === 1) {
    const r = requested[0];
    if (r.verses.length === 0) return `${book.ru_short} ${r.ch}`;
    if (r.verses.length === 1) return `${book.ru_short} ${r.ch}:${r.verses[0]}`;
    const min = r.verses[0];
    const max = r.verses[r.verses.length - 1];
    if (max - min + 1 === r.verses.length) return `${book.ru_short} ${r.ch}:${min}–${max}`;
    return `${book.ru_short} ${r.ch}:${r.verses.join(",")}`;
  }
  const first = requested[0];
  const last = requested[requested.length - 1];
  if (
    first.verses.length === 0 &&
    last.verses.length === 0 &&
    last.ch - first.ch + 1 === requested.length
  ) {
    return `${book.ru_short} ${first.ch}–${last.ch}`;
  }
  return `${book.ru_short} ${requested.map((r) => r.ch).join(", ")}`;
}

function highlightedSet(requested: RefChapter[], chapter: number): Set<number> | null {
  const r = requested.find((rr) => rr.ch === chapter);
  if (!r) return null;
  if (r.verses.length === 0) return new Set<number>(); // whole-chapter request — none specifically highlighted
  return new Set(r.verses);
}

export function BibleReader() {
  const currentRef = useBibleStore((s) => s.currentRef);
  const close = useBibleStore((s) => s.close);

  const bookId = currentRef?.bookId ?? null;
  const { loading, book, error } = useBibleBook(bookId);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const firstHighlightedRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (!currentRef) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentRef, close]);

  const chaptersToShow = useMemo(() => {
    if (!book || !currentRef) return [];
    if (currentRef.chapters.length === 0) {
      return book.chapters.length > 0 ? [book.chapters[0]] : [];
    }
    const wanted = new Set(currentRef.chapters.map((r) => r.ch));
    return book.chapters.filter((c) => wanted.has(c.ch));
  }, [book, currentRef]);

  const firstHighlight = useMemo(() => {
    if (!currentRef) return null;
    for (const c of currentRef.chapters) {
      if (c.verses.length > 0) return { ch: c.ch, v: c.verses[0] };
    }
    return null;
  }, [currentRef]);

  useEffect(() => {
    if (!book || !currentRef) return;
    const id = requestAnimationFrame(() => {
      const container = scrollContainerRef.current;
      const target = firstHighlightedRef.current;
      if (target && container) {
        const containerRect = container.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const delta = targetRect.top - containerRect.top - SCROLL_OFFSET_PX;
        container.scrollTop += delta;
      } else if (container) {
        container.scrollTop = 0;
      }
    });
    return () => cancelAnimationFrame(id);
  }, [book, currentRef]);

  if (!currentRef) return null;

  let firstHighlightAttached = false;

  return (
    <>
      <div
        className="fixed inset-0 z-[60] backdrop-blur-[2px]"
        style={{ background: "rgba(58,40,23,0.4)" }}
        onClick={close}
        aria-hidden
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Писание · ${currentRef.raw}`}
        className="fixed right-0 top-0 bottom-0 z-[61] flex flex-col border-l-2 border-(--color-sepia-light) font-serif text-(--color-ink)"
        style={{
          width: "min(560px, 96vw)",
          background: "linear-gradient(135deg, #fdf4e0, #f0e4ca)",
          boxShadow: "-30px 0 80px -20px rgba(74,50,30,0.5)",
        }}
      >
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-(--color-sepia-light)/60 px-7 py-5">
          <div className="min-w-0 flex-1">
            <div className="mb-1 text-[11px] uppercase tracking-[0.3em] text-(--color-rust)">
              Священное Писание · Синодальный
            </div>
            <h2 className="m-0 truncate text-[26px] font-medium leading-tight">
              {book ? chapterDisplay(book, currentRef.chapters) : currentRef.raw}
            </h2>
            {currentRef.crossBook && (
              <div className="mt-1 text-xs italic text-(--color-sepia)">
                Ссылка охватывает несколько книг — открыта первая.
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={close}
            className="shrink-0 border border-(--color-sepia-light) bg-transparent px-2.5 py-1 text-base text-(--color-sepia) hover:bg-(--color-parchment-light)"
            aria-label="Закрыть"
          >
            ✕
          </button>
        </header>

        <div ref={scrollContainerRef} className="min-h-0 flex-1 overflow-y-auto px-7 py-6">
          {loading && (
            <div className="text-[15px] italic text-(--color-sepia)">Загрузка текста…</div>
          )}
          {error && (
            <div className="text-[15px] text-(--color-rust)">
              Не удалось загрузить книгу: {error}
            </div>
          )}
          {book && chaptersToShow.length === 0 && (
            <div className="text-[15px] italic text-(--color-sepia)">
              Не удалось определить главу из ссылки.
            </div>
          )}
          {book &&
            chaptersToShow.map((chapter) => {
              const hl = highlightedSet(currentRef.chapters, chapter.ch);
              const hasHighlights = hl !== null && hl.size > 0;
              return (
                <section key={chapter.ch} className="mb-7 last:mb-0">
                  <h3 className="mb-3 font-sans text-[11px] uppercase tracking-[0.3em] text-(--color-sepia)">
                    Глава {chapter.ch}
                  </h3>
                  <div className="space-y-2 text-[17px] leading-[1.75] text-(--color-ink)">
                    {chapter.verses.map((v) => {
                      const isHighlighted = hasHighlights && hl?.has(v.v);
                      const attachRef =
                        !firstHighlightAttached &&
                        firstHighlight !== null &&
                        firstHighlight.ch === chapter.ch &&
                        firstHighlight.v === v.v;
                      if (attachRef) firstHighlightAttached = true;
                      return (
                        <p
                          key={v.v}
                          ref={attachRef ? firstHighlightedRef : undefined}
                          className={`m-0 ${
                            hasHighlights && !isHighlighted ? "opacity-75" : ""
                          }`}
                        >
                          <sup
                            className={`mr-1.5 font-sans text-[11px] font-medium tracking-[0.05em] ${
                              isHighlighted ? "text-(--color-rust)" : "text-(--color-sepia)"
                            }`}
                          >
                            {v.v}
                          </sup>
                          <span
                            className={
                              isHighlighted
                                ? "bg-(--color-amber)/20 px-1 -mx-1 rounded-sm font-medium"
                                : ""
                            }
                          >
                            {v.t}
                          </span>
                        </p>
                      );
                    })}
                  </div>
                </section>
              );
            })}
        </div>
      </aside>
    </>
  );
}
