import type { ReactNode } from "react";

const PAPER_GRADIENT = `radial-gradient(ellipse at 20% 30%, rgba(139,111,71,0.12), transparent 50%),
                         radial-gradient(ellipse at 80% 70%, rgba(90,58,26,0.10), transparent 50%),
                         radial-gradient(ellipse at 50% 50%, rgba(232,220,196,0.5), transparent 70%)`;

const VIGNETTE_SHADOW = "inset 0 0 200px 50px rgba(74,50,30,0.32)";

const GRAIN_SVG = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 0 0.12  0 0 0 0.35 0'/></filter><rect width='160' height='160' filter='url(%23n)'/></svg>")`;

export function PageBackground({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-full overflow-hidden bg-(--color-parchment) pb-14 text-(--color-ink)">
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: PAPER_GRADIENT }} />
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ boxShadow: VIGNETTE_SHADOW }} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-multiply"
        style={{ backgroundImage: GRAIN_SVG }}
      />
      {children}
    </div>
  );
}
