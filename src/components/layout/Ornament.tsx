import { ORNAMENT_GLYPH } from "@/constants/design";

export function Ornament({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`text-sm tracking-[0.75em] text-(--color-rust) opacity-70 ${className}`}
    >
      {ORNAMENT_GLYPH}
    </div>
  );
}
