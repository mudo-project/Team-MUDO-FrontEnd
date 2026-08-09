'use client'

import { useCallback, useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { createMemoAction, getMemoListAction } from "../actions";
import MemoCard from "./MemoCard";
import MemoCreateForm from "./MemoCreateForm";
import MemoFilter from "./MemoFilter";
import type { MemoColor } from "./MemoColorPicker";
import { useMemoStore } from "@/store/useMemoStore";

type SortOrder = "latest" | "oldest";

const SORT_ORDER_TO_API: Record<SortOrder, MemoSortOrder> = {
    latest: "NEWEST",
    oldest: "OLDEST",
};

export default function MemoContainer() {
    const isOpen = useMemoStore((state) => state.isOpen)
    const toggleMemo = useMemoStore((state) => state.toggleMemo)
    const [isCreating, setIsCreating] = useState(false)
    const [sortOrder, setSortOrder] = useState<SortOrder>("latest")
    const [memos, setMemos] = useState<MemoData[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchMemos = useCallback(async () => {
        setIsLoading(true);

        try {
            const data = await getMemoListAction(SORT_ORDER_TO_API[sortOrder]);
            setMemos(data);
        } catch (error) {
            const message = error instanceof Error ? error.message : "메모 목록 조회에 실패하였습니다.";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }, [sortOrder]);

    useEffect(() => {
        if (isOpen) {
            fetchMemos();
        }
    }, [isOpen, fetchMemos]);

    if (!isOpen) return null;

    const handleCreate = async (title: string, content: string, color: MemoColor) => {
        const result = await createMemoAction(title, content, color.code);

        if (result.success) {
            toast.success(result.message);
            setIsCreating(false);
            fetchMemos();
        } else {
            toast.error(result.message);
        }
    };

    return (
    <aside
      className="fixed top-13 right-0 bottom-0 z-40 flex w-full max-w-[420px] flex-col border-l border-[#E6EBE7] bg-white text-[#172033] shadow-[-8px_0_18px_rgba(15,23,42,0.05)]"
      aria-labelledby="memo-title"
    >
      <header className="flex h-[50px] shrink-0 items-center justify-between border-b border-[#E6EBE7] px-3">
        <h1 id="memo-title" className="text-[15px] font-bold tracking-[-0.03em]">
          메모
          <span className="ml-1 text-[11px] font-medium text-[#94A3B8]">{memos.length}</span>
        </h1>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex h-7 items-center gap-1 rounded-md bg-[#172033] px-2.5 text-[11px] font-medium text-white"
            type="button"
            onClick={() => setIsCreating(true)}
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

      <MemoFilter sortOrder={sortOrder} onChangeSortOrder={setSortOrder} />

      <MemoCard
        createForm={isCreating && <MemoCreateForm onCancel={() => setIsCreating(false)} onSave={handleCreate} />}
        isLoading={isLoading}
        memos={memos}
        onRefresh={fetchMemos}
      />
    </aside>
    )
}
