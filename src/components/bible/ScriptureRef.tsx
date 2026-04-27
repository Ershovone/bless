"use client";

import { type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { parseScriptureRef } from "@/lib/bible/parser";
import { useBibleStore } from "@/hooks/useBibleStore";

type ScriptureRefProps = {
  refText: string;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

const BASE_CLS =
  "cursor-pointer underline decoration-(--color-amber)/60 decoration-dotted underline-offset-[3px] transition-colors hover:decoration-(--color-rust) hover:text-(--color-ink)";

export function ScriptureRef({ refText, children, className, style }: ScriptureRefProps) {
  const open = useBibleStore((s) => s.open);

  const parsed = parseScriptureRef(refText);

  if (!parsed) {
    return (
      <span className={className} style={style}>
        {children ?? refText}
      </span>
    );
  }

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    open(parsed);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={`Открыть ${refText}`}
      className={`${BASE_CLS} ${className ?? ""}`.trim()}
      style={style}
    >
      {children ?? refText}
    </button>
  );
}
