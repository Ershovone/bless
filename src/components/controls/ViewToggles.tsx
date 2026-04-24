"use client";

import { useAtlasStore } from "@/hooks/useAtlasStore";

export function ViewToggles() {
  const modernView = useAtlasStore((s) => s.modernView);
  const toggleModernView = useAtlasStore((s) => s.toggleModernView);

  return (
    <div
      className="relative z-[2] mx-auto mb-1 mt-3.5 flex justify-center gap-3"
      style={{ width: "min(96%, 1200px)" }}
    >
      <button
        type="button"
        onClick={toggleModernView}
        className={`flex items-center gap-2.5 border px-5 py-2.5 text-sm tracking-[0.05em] transition-colors ${
          modernView
            ? "border-(--color-modern-blue) bg-(--color-modern-blue) text-(--color-parchment-light)"
            : "border-(--color-sepia-light) bg-(--color-parchment-light)/60 text-(--color-ink)"
        }`}
      >
        <span
          className="inline-block h-2.5 w-2.5 rounded-full border-[1.5px] border-current"
          style={{ background: modernView ? "currentColor" : "transparent" }}
        />
        Современные границы · <em>Modern borders</em>
      </button>
    </div>
  );
}
