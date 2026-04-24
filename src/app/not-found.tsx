import Link from "next/link";
import { PageBackground } from "@/components/layout/PageBackground";
import { Ornament } from "@/components/layout/Ornament";

export default function NotFound() {
  return (
    <PageBackground>
      <main className="relative z-10 mx-auto max-w-2xl px-6 py-24 text-center">
        <Ornament />
        <h1 className="mt-4 text-5xl">Страница не найдена</h1>
        <p className="mt-3 italic text-(--color-sepia)">The page you requested could not be found.</p>
        <Link
          href="/"
          className="mt-10 inline-block border border-(--color-sepia-light) bg-(--color-parchment-light) px-6 py-3 tracking-[0.1em] hover:bg-(--color-parchment-darker)"
        >
          ← На главную
        </Link>
      </main>
    </PageBackground>
  );
}
