'use client'

import { Search, Send } from "lucide-react";
import { useState } from "react";
import useModal from "@/components/hooks/useModal";
import TwoButtonModal from "@/components/ui/TwoButtonModal";
import PayrollBatchResultPanel from "./PayrollBatchResultPanel";

export type PayrollEmploymentTypeFilter = "전체" | PayrollEmploymentType;
export type PayrollStatusFilter = "전체" | PayrollPreparationStatus;

interface PayrollListFilterProps {
    employmentTypeFilter: PayrollEmploymentTypeFilter;
    monthLabel: string;
    onChangeEmploymentTypeFilter: (filter: PayrollEmploymentTypeFilter) => void;
    onChangeSearchQuery: (query: string) => void;
    onChangeStatusFilter: (filter: PayrollStatusFilter) => void;
    onConfirmBatchSend: () => Promise<PayrollEmailBatchResultData>;
    searchQuery: string;
    selectedCount: number;
    statusFilter: PayrollStatusFilter;
    totalCount: number;
}

export default function PayrollListFilter({
    employmentTypeFilter,
    monthLabel,
    onChangeEmploymentTypeFilter,
    onChangeSearchQuery,
    onChangeStatusFilter,
    onConfirmBatchSend,
    searchQuery,
    selectedCount,
    statusFilter,
    totalCount,
}: PayrollListFilterProps) {
    const [batchResult, setBatchResult] = useState<PayrollEmailBatchResultData | null>(null);
    const [isSending, setIsSending] = useState(false);
    const batchSendModal = useModal();

    const handleConfirmSend = async () => {
        if (isSending) return;

        setIsSending(true);
        const result = await onConfirmBatchSend();
        setIsSending(false);
        batchSendModal.closeModal();
        setBatchResult(result);
    };

    return (
        <div className="mt-5 flex items-start gap-2">
            <div className="flex flex-col gap-1.5">
                <label className="flex h-9 w-[220px] items-center gap-2 rounded-lg border border-[#DCE9DF] bg-white px-3 text-[12px] text-[#94A3B8]">
                    <Search className="size-3.5" />
                    <span className="sr-only">직원명 검색</span>
                    <input
                        className="w-full outline-none placeholder:text-[#94A3B8]"
                        onChange={(event) => onChangeSearchQuery(event.target.value)}
                        placeholder="직원명 검색"
                        value={searchQuery}
                    />
                </label>
                <span className="text-[12px] text-[#94A3B8]">총 {totalCount}명</span>
            </div>
            <select
                aria-label="고용형태 필터"
                className="h-9 rounded-lg border border-[#DCE9DF] bg-white px-3 text-[12px] text-[#334155] outline-none"
                onChange={(event) => onChangeEmploymentTypeFilter(event.target.value as PayrollEmploymentTypeFilter)}
                value={employmentTypeFilter}
            >
                <option value="전체">전체 고용 형태</option>
                <option value="REGULAR">정규직</option>
                <option value="FIXED_TERM">기간제</option>
                <option value="PART_TIME">파트타임</option>
            </select>
            <select
                aria-label="준비 상태 필터"
                className="h-9 rounded-lg border border-[#DCE9DF] bg-white px-3 text-[12px] text-[#334155] outline-none"
                onChange={(event) => onChangeStatusFilter(event.target.value as PayrollStatusFilter)}
                value={statusFilter}
            >
                <option value="전체">전체 준비 상태</option>
                <option value="NOT_CREATED">미작성</option>
                <option value="DRAFT">작성 중</option>
                <option value="CALCULATED">계산 완료</option>
                <option value="CONFIRMED">확정</option>
            </select>

            <button
                className={`ml-auto flex h-9 items-center gap-1.5 rounded-lg px-4 text-[12px] font-semibold text-white disabled:cursor-not-allowed ${selectedCount > 0
                    ? "bg-[#172033] hover:bg-[#2B344B]"
                    : "cursor-not-allowed bg-[#CBD2DC]"
                }`}
                disabled={selectedCount === 0}
                onClick={batchSendModal.openModal}
                type="button"
            >
                <Send className="size-3.5" />
                선택한 {selectedCount}명 명세서 발송
            </button>

            {batchSendModal.isModal && (
                <TwoButtonModal
                    activeModal={handleConfirmSend}
                    closeModal={batchSendModal.closeModal}
                    confirmLabel="발송 시작"
                    content={`${monthLabel} 확정 급여 중 선택한 ${selectedCount}명에게 명세서를 이메일로 발송합니다. 확정되지 않았거나 명세서가 준비되지 않은 직원, 이메일이 없는 직원은 자동 제외됩니다.`}
                    isPending={isSending}
                    title={`선택한 ${selectedCount}명에게 명세서를 발송하시겠습니까?`}
                />
            )}

            {batchResult && (
                <PayrollBatchResultPanel onClose={() => setBatchResult(null)} result={batchResult} />
            )}
        </div>
    );
}
