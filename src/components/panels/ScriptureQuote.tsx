import { ScriptureRef } from "@/components/bible/ScriptureRef";

export function ScriptureQuote() {
  return (
    <div className="relative z-[2] mx-auto max-w-3xl px-10 pb-7 pt-12 text-center">
      <div className="text-[26px] italic leading-[1.4]">
        «Благовествовать <em>не там</em>, где уже было известно имя Христово, чтобы не созидать на чужом основании»
      </div>
      <div className="mt-4 text-[13px] uppercase tracking-[0.15em] text-(--color-rust)">
        — <ScriptureRef refText="Рим 15:20">Послание к Римлянам 15:20 · Romans 15:20</ScriptureRef>
      </div>
    </div>
  );
}
