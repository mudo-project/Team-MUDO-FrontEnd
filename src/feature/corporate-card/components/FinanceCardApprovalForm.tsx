'use client'

import { Plus, X } from "lucide-react";
import { useState } from "react";
import type { FinanceCardApprover } from "../mockData";
import { FINANCE_CARD_PURPOSE_OPTIONS } from "../mockData";

interface FinanceCardApprovalFormProps {
    purpose: string | null;
    reason: string | null;
    approvers: FinanceCardApprover[];
    submitLabel?: string;
}

export default function FinanceCardApprovalForm({
    purpose,
    reason,
    approvers,
    submitLabel,
}: FinanceCardApprovalFormProps) {
    const [selectedPurpose, setSelectedPurpose] = useState(purpose);

    return (
        <section aria-label="사용목적 작성" className="mt-4">
            <h3 className="text-[13px] font-semibold">사용 목적</h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
                {FINANCE_CARD_PURPOSE_OPTIONS.map((option) => (
                    <button
                        className={
                            `h-8 rounded-full border px-3 text-[12px]
                            ${option === selectedPurpose
                                ? "border-[#4D9560] bg-[#EEF4EF] text-[#2F7D46]"
                                : "border-[#DCE9DF] bg-white text-[#718096]"
                            }
                        `}
                        key={option}
                        onClick={() => setSelectedPurpose(option)}
                        type="button"
                    >
                        {option}
                    </button>
                ))}
            </div>

            <h3 className="mt-4 text-[13px] font-semibold">사용 사유</h3>
            <textarea
                className="mt-2 min-h-24 w-full resize-y rounded-lg border border-[#DCE9DF] p-3 text-[12px] outline-none placeholder:text-[#94A3B8] focus:border-[#4D9560]"
                defaultValue={reason ?? ""}
                placeholder="사용 사유를 입력하세요"
            />

            <h3 className="mt-4 text-[13px] font-semibold">결재선 지정</h3>
            <div className="mt-2 space-y-2">
                {approvers.map((approver) => (
                    <div
                        className="flex items-center justify-between rounded-lg border border-[#DCE9DF] px-3 py-2 text-[12px]"
                        key={approver.order}
                    >
                        <span>
                            {approver.order}차 승인{approver.isFinal ? "(최종 승인자)" : ""} · {approver.name} · {approver.role}
                        </span>
                        <button aria-label={`${approver.name} 결재선에서 제거`} type="button">
                            <X className="size-3.5 text-[#94A3B8]" />
                        </button>
                    </div>
                ))}
                <button
                    className="flex h-9 w-full items-center justify-center gap-1 rounded-lg border border-dashed border-[#DCE9DF] text-[12px] text-[#718096]"
                    type="button"
                >
                    <Plus className="size-3.5" /> 승인자 추가
                </button>
            </div>

            {submitLabel
                ?
                <button
                    className="mt-5 h-11 w-full rounded-lg bg-[#4D9560] text-[13px] font-semibold text-white"
                    type="button"
                >
                    {submitLabel}
                </button>
                :
                null
            }
        </section>
    );
}
