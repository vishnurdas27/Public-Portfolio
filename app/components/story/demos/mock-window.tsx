import type { ReactNode } from "react";

// window chrome for the two mock UIs, labelled so nobody mistakes them for real screens
export function MockWindow({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="sticker overflow-hidden !rounded-[1.2rem]">
      <div className="flex items-center justify-between gap-3 border-b-[2.5px] border-ink bg-paper px-4 py-2.5">
        <div className="flex items-center gap-3">
          <span aria-hidden className="flex gap-1.5">
            <span className="size-3 rounded-full border-2 border-ink bg-coral" />
            <span className="size-3 rounded-full border-2 border-ink bg-butter" />
            <span className="size-3 rounded-full border-2 border-ink bg-leaf" />
          </span>
          <span className="text-[0.78rem] font-semibold">{title}</span>
        </div>
        <span className="pill !py-0.5 text-[0.68rem]">re-created · fake data</span>
      </div>
      {children}
    </div>
  );
}
