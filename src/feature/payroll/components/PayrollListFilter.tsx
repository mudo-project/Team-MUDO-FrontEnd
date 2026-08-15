'use client'

import { Search, Send } from "lucide-react";
import { useState } from "react";
import useModal from "@/components/hooks/useModal";
import TwoButtonModal from "@/components/ui/TwoButtonModal";
import { payrollBatchResultMock } from "../payrollBatchResultMock";
import PayrollBatchResultPanel from "./PayrollBatchResultPanel";

interface PayrollListFilterProps {
    monthLabel: string;
    totalCount: number;
}

export default function PayrollListFilter({ monthLabel, totalCount }: PayrollListFilterProps) {
    const [showResultPanel, setShowResultPanel] = useState(false);
    const batchSendModal = useModal(() => setShowResultPanel(true));

    return (
        <div className="mt-5 flex items-start gap-2">
            <div className="flex flex-col gap-1.5">
                <label className="flex h-9 w-[220px] items-center gap-2 rounded-lg border border-[#DCE9DF] bg-white px-3 text-[12px] text-[#94A3B8]">
                    <Search className="size-3.5" />
                    <span className="sr-only">직원명 검색</span>
                    <input
                        className="w-full outline-none placeholder:text-[#94A3B8]"
                        placeholder="직원명 검색"
                    />
                </label>
                <span className="text-[12px] text-[#94A3B8]">총 {totalCount}명</span>
            </div>
            <select
                aria-label="고용형태 필터"
                className="h-9 rounded-lg border border-[#DCE9DF] bg-white px-3 text-[12px] text-[#334155] outline-none"
                defaultValue="전체"
            >
                <option value="전체">전체 고용 형태</option>
                <option value="REGULAR">정규직</option>
                <option value="FIXED_TERM">기간제</option>
                <option value="PART_TIME">파트타임</option>
            </select>
            <select
                aria-label="준비 상태 필터"
                className="h-9 rounded-lg border border-[#DCE9DF] bg-white px-3 text-[12px] text-[#334155] outline-none"
                defaultValue="전체"
            >
                <option value="전체">전체 준비 상태</option>
                <option value="NOT_CREATED">미작성</option>
                <option value="DRAFT">작성 중</option>
                <option value="CALCULATED">계산 완료</option>
                <option value="CONFIRMED">확정</option>
            </select>

            <button
                className="ml-auto flex h-9 items-center gap-1.5 rounded-lg bg-[#172033] px-4 text-[12px] font-semibold text-white hover:bg-[#2B344B]"
                onClick={batchSendModal.openModal}
                type="button"
            >
                <Send className="size-3.5" />
                이 달 명세서 일괄 발송
            </button>

            {batchSendModal.isModal && (
                <TwoButtonModal
                    activeModal={batchSendModal.activeModal}
                    closeModal={batchSendModal.closeModal}
                    confirmLabel="일괄 발송 시작"
                    content={`${monthLabel} 확정 급여의 명세서를 직원 이메일로 발송합니다. 확정되지 않았거나 명세서가 준비되지 않은 직원, 이메일이 없는 직원은 자동 제외됩니다.`}
                    title="이 달 명세서를 일괄 발송하시겠습니까?"
                />
            )}

            {showResultPanel && (
                <PayrollBatchResultPanel onClose={() => setShowResultPanel(false)} result={payrollBatchResultMock} />
            )}
        </div>
    );
}
