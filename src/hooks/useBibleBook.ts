"use client";

import { useEffect, useState } from "react";
import type { BibleBook, BibleBookId } from "@/types/bible";
import { getAssetUrl } from "@/lib/seo/paths";

const BOOK_CACHE = new Map<BibleBookId, BibleBook>();
const PENDING = new Map<BibleBookId, Promise<BibleBook>>();

async function fetchBook(id: BibleBookId): Promise<BibleBook> {
  const cached = BOOK_CACHE.get(id);
  if (cached) return cached;
  const pending = PENDING.get(id);
  if (pending) return pending;

  const url = getAssetUrl(`/data/bible/synodal/${id.toLowerCase()}.json`);
  const promise = fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to load ${id}: HTTP ${res.status}`);
      return res.json() as Promise<BibleBook>;
    })
    .then((book) => {
      BOOK_CACHE.set(id, book);
      PENDING.delete(id);
      return book;
    })
    .catch((err) => {
      PENDING.delete(id);
      throw err;
    });
  PENDING.set(id, promise);
  return promise;
}

type UseBibleBookResult =
  | { loading: true; book: null; error: null }
  | { loading: false; book: BibleBook; error: null }
  | { loading: false; book: null; error: string };

export function useBibleBook(id: BibleBookId | null): UseBibleBookResult {
  const cached = id ? BOOK_CACHE.get(id) ?? null : null;
  const [book, setBook] = useState<BibleBook | null>(cached);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(id !== null && cached === null);

  useEffect(() => {
    if (!id) {
      setBook(null);
      setError(null);
      setLoading(false);
      return;
    }
    const cachedNow = BOOK_CACHE.get(id);
    if (cachedNow) {
      setBook(cachedNow);
      setError(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchBook(id)
      .then((b) => {
        if (cancelled) return;
        setBook(b);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setBook(null);
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return { loading: true, book: null, error: null };
  if (error) return { loading: false, book: null, error };
  if (!book) return { loading: false, book: null, error: "Книга не выбрана" };
  return { loading: false, book, error: null };
}
