'use client'

import { useState } from "react";
import { Plus, X } from "lucide-react";
import MemoCard from "./MemoCard";
import MemoCreateForm from "./MemoCreateForm";
import MemoFilter from "./MemoFilter";
import { useMemoStore } from "@/store/useMemoStore";

const INITIAL_MEMOS = [
  {
    id: 1,
    title: "9월 시간표 초안",
    content: ["수학A반 월·수·금", "영어B반 화·목 오후 5시", "과학D반 토 오전"],
    time: "08.04",
    accent: "#6F9B7B",
    background: "#EDF4EE",
  },
  {
    id: 2,
    title: "8월 강사 회의 준비",
    content: ["- PPT 슬라이드 최종 확인", "- 참석자 명단 출력", "- 음료·다과 주문 (8/16 마감)"],
    time: "08.03",
    accent: "#B29A57",
    background: "#F7F2E2",
  },
  {
    id: 3,
    title: "비품 구매 요청",
    content: ["화이트보드 마커 × 20", "지우개 × 5", "출석부 × 3권", "→ 정다는 행정팀 전달"],
    time: "08.02",
    accent: "#B7837C",
    background: "#F8EEEE",
  },
  {
    id: 4,
    title: "수강생 오리엔테이션 체크리스트",
    content: ["입학 안내문 발송 완료", "교재 배부 8/17", "반 배정표 게시판 부착 필요"],
    time: "07.31",
    accent: "#7890B8",
    background: "#EEF2FA",
  },
  {
    id: 5,
    title: "개인 메모",
    content: ["강도현 강사 면담 일정 잡기 (8월 중)", "박서연 연가 복귀 확인"],
    time: "07.29",
    accent: "#8977AE",
    background: "#F2EFF8",
  },
];

export default function MemoContainer() {
    const isOpen = useMemoStore((state) => state.isOpen)
    const toggleMemo = useMemoStore((state) => state.toggleMemo)
    const [isCreating, setIsCreating] = useState(false)
    const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest")
    const sortedMemos = [...INITIAL_MEMOS].sort((firstMemo, secondMemo) => {
      const firstDate = Number(firstMemo.time.replace(".", ""));
      const secondDate = Number(secondMemo.time.replace(".", ""));

      return sortOrder === "latest" ? secondDate - firstDate : firstDate - secondDate;
    });

    if (!isOpen) return null;

    return (
    <aside
      className="fixed top-13 right-0 bottom-0 z-40 flex w-full max-w-[420px] flex-col border-l border-[#E6EBE7] bg-white text-[#172033] shadow-[-8px_0_18px_rgba(15,23,42,0.05)]"
      aria-labelledby="memo-title"
    >
      <header className="flex h-[50px] shrink-0 items-center justify-between border-b border-[#E6EBE7] px-3">
        <h1 id="memo-title" className="text-[15px] font-bold tracking-[-0.03em]">
          메모
          <span className="ml-1 text-[11px] font-medium text-[#94A3B8]">{INITIAL_MEMOS.length}</span>
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
        createForm={isCreating && <MemoCreateForm onCancel={() => setIsCreating(false)} onSave={() => setIsCreating(false)} />}
        memos={sortedMemos}
      />
    </aside>
    )
}
