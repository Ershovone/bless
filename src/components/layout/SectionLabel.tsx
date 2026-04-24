import type { ReactNode } from "react";

type SectionLabelProps = {
  children: ReactNode;
  className?: string;
};

export function SectionLabel({ children, className = "" }: SectionLabelProps) {
  return (
    <div
      className={`text-[13px] uppercase tracking-[0.2em] text-(--color-sepia) ${className}`}
    >
      {children}
    </div>
  );
}
