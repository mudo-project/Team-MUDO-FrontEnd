'use client'

import { Plus, X } from "lucide-react";
import MemoCard from "./MemoCard";
import MemoFilter from "./MemoFilter";
import { useMemoStore } from "@/store/useMemoStore";

export default function MemoContainer() {
    const isOpen = useMemoStore((state) => state.isOpen)
    const toggleMemo = useMemoStore((state) => state.toggleMemo)

    if (!isOpen) return null;

    return (
    <aside
      className="fixed top-13 right-0 bottom-0 z-40 flex w-full max-w-[420px] flex-col border-l border-[#E6EBE7] bg-white text-[#172033] shadow-[-8px_0_18px_rgba(15,23,42,0.05)]"
      aria-labelledby="memo-title"
    >
      <header className="flex h-[50px] shrink-0 items-center justify-between border-b border-[#E6EBE7] px-3">
        <h1 id="memo-title" className="text-[15px] font-bold tracking-[-0.03em]">
          메모
          <span className="ml-1 text-[11px] font-medium text-[#94A3B8]">5</span>
        </h1>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex h-7 items-center gap-1 rounded-md bg-[#172033] px-2.5 text-[11px] font-medium text-white"
            type="button"
          >
            <Plus className="size-3.5" strokeWidth={2.2} />
            새 메모
          </button>
          <button
            aria-label="메모 패널 닫기"
            className="inline-flex size-7 items-center justify-center text-[#94A3B8]"
            type="button"
            onClick={toggleMemo}
          >
            <X className="size-4" strokeWidth={1.8} />
          </button>
        </div>
      </header>

      <MemoFilter/>

      <MemoCard/>
    </aside>
    )
}
