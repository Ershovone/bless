"use client";

import { Fragment, useMemo } from "react";
import { parseProseRefs } from "@/lib/bible/parser";
import { ScriptureRef } from "./ScriptureRef";

type ProseWithRefsProps = {
  text: string;
};

export function ProseWithRefs({ text }: ProseWithRefsProps) {
  const segments = useMemo(() => parseProseRefs(text), [text]);
  return (
    <>
      {segments.map((seg, i) =>
        typeof seg === "string" ? (
          <Fragment key={i}>{seg}</Fragment>
        ) : (
          <ScriptureRef key={i} refText={seg.refText} />
        ),
      )}
    </>
  );
}
