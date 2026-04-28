"use client";

import { GOSPEL_COMPARISON } from "@/data/gospel/comparison";
import { SectionLabel } from "@/components/layout/SectionLabel";
import { ScriptureRef } from "@/components/bible/ScriptureRef";

const COLUMNS: Array<{ key: "mt" | "mk" | "lk" | "jn"; ru: string; en: string; color: string }> = [
  { key: "mt", ru: "Матфей", en: "Matthew", color: "var(--color-rust)" },
  { key: "mk", ru: "Марк", en: "Mark", color: "var(--color-amber)" },
  { key: "lk", ru: "Лука", en: "Luke", color: "var(--color-modern-blue)" },
  { key: "jn", ru: "Иоанн", en: "John", color: "#5a7a4a" },
];

export function GospelComparisonPanel() {
  return (
    <div className="relative z-[2] mx-auto my-7" style={{ width: "min(96%, 1500px)" }}>
      <SectionLabel className="mb-3 text-center">
        Четвероевангелие — параллельная сетка · <em>Synoptic & Johannine Comparison</em>
      </SectionLabel>

      <div className="overflow-x-auto border border-(--color-sepia-light) bg-(--color-parchment-light)/40">
        <table className="w-full min-w-[800px] border-collapse text-left">
          <thead>
            <tr className="border-b border-(--color-sepia-light) bg-(--color-parchment-light)/70">
              <th className="px-4 py-3 font-sans text-[10px] uppercase tracking-[0.2em] text-(--color-sepia)">
                Событие
              </th>
              {COLUMNS.map((c) => (
                <th
                  key={c.key}
                  className="px-3 py-3 font-sans text-[10px] uppercase tracking-[0.2em]"
                  style={{ color: c.color, minWidth: 130 }}
                >
                  {c.ru}
                  <em className="ml-1.5 text-[9px] not-italic opacity-70">{c.en}</em>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {GOSPEL_COMPARISON.map((row, i) => (
              <tr
                key={i}
                className="border-b border-dotted border-(--color-sepia-light) last:border-b-0"
              >
                <td className="px-4 py-2.5 text-[13px] font-medium text-(--color-ink) sm:text-[14px]">
                  {row.ru}
                </td>
                {COLUMNS.map((c) => {
                  const ref = row.refs[c.key];
                  return (
                    <td key={c.key} className="px-3 py-2.5 text-[12px] italic">
                      {ref ? (
                        <ScriptureRef refText={ref} className="text-(--color-rust)" />
                      ) : (
                        <span className="text-(--color-sepia-light) opacity-50">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
