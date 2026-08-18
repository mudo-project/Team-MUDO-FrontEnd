'use client'

import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserListAction } from "@/feature/auth/actions";
import { useUserStore } from "@/store/useUserStore";
import type { FinanceCardApprover } from "../constants";
import { FINANCE_CARD_PURPOSE_OPTIONS } from "../constants";

interface FinanceCardApprovalFormProps {
    expenseCategory: string;
    onChangeExpenseCategory: (value: string) => void;
    purpose: string;
    onChangePurpose: (value: string) => void;
    approvers: FinanceCardApprover[];
    isResubmission?: boolean;
    submitLabel?: string;
}

export default function FinanceCardApprovalForm({
    expenseCategory,
    onChangeExpenseCategory,
    purpose,
    onChangePurpose,
    approvers,
    isResubmission = false,
    submitLabel,
}: FinanceCardApprovalFormProps) {
    const userId = Number(useUserStore((state) => state.user.sub));
    const [assignedApprovers, setAssignedApprovers] = useState(approvers);
    const [selectedApproverId, setSelectedApproverId] = useState("");
    const [approverCandidates, setApproverCandidates] = useState<UserListResponse[]>([]);

    useEffect(() => {
        const loadApproverCandidates = async () => {
            const response = await getUserListAction();
            const users = response.data ?? [];
            setApproverCandidates(users.filter((user) => user.userId !== userId));
        };

        loadApproverCandidates();
    }, [userId]);

    const handleAddApprover = (candidateUserId: number) => {
        const candidate = approverCandidates.find((approver) => approver.userId === candidateUserId);

        if (!candidate) {
            return;
        }

        setAssignedApprovers((currentApprovers) => {
            return [
                ...currentApprovers.map((approver, index) => ({ ...approver, order: index + 1, isFinal: false })),
                { ...candidate, order: currentApprovers.length + 1, isFinal: true, approvedAt: null },
            ];
        });
        setSelectedApproverId("");
    };

    const handleRemoveApprover = (order: number) => {
        setAssignedApprovers((currentApprovers) => {
            const remainingApprovers = currentApprovers.filter((approver) => approver.order !== order);

            return remainingApprovers.map((approver, index) => ({
                ...approver,
                order: index + 1,
                isFinal: index === remainingApprovers.length - 1,
            }));
        });
    };

    return (
        <section aria-label="사용목적 작성" className="mt-7">
            {isResubmission && <h3 className="text-[17px] font-bold text-[#172033]">사용목적 작성</h3>}
            <label className="mt-4 block text-[13px] font-semibold text-[#394257]">
                사용 목적
                <select
                    className="mt-2 h-12 w-full rounded-lg border border-[#DCE9DF] bg-white px-3 text-[14px] text-[#394257] outline-none"
                    onChange={(event) => onChangeExpenseCategory(event.target.value)}
                    value={expenseCategory}
                >
                    <option disabled value="">사용 목적 선택</option>
                    {FINANCE_CARD_PURPOSE_OPTIONS.map((option) =>
                        <option key={option} value={option}>{option}</option>
                    )}
                </select>
            </label>

            <label className="mt-4 block text-[13px] font-semibold text-[#394257]">사용 사유
            <textarea
                className="mt-2 min-h-32 w-full resize-none rounded-lg border border-[#DCE9DF] p-3 text-[14px] outline-none placeholder:text-[#94A3B8] focus:border-[#4D9560]"
                onChange={(event) => onChangePurpose(event.target.value)}
                placeholder="사용 사유를 입력하세요"
                value={purpose}
            />
            </label>

            <h3 className={`mt-6 font-bold text-[#172033] ${isResubmission ? "text-[15px]" : "text-[17px]"}`}>결재선 지정</h3>
            <div className={`mt-3 ${isResubmission ? "space-y-3" : "space-y-2"}`}>
                {assignedApprovers.map((approver, index) => (
                    <div
                        className={`flex items-center rounded-xl border border-[#DCE9DF] ${isResubmission ? "gap-2.5 px-3 py-2.5" : "justify-between px-3 py-3 text-[13px]"}`}
                        key={approver.order}
                    >
                        {isResubmission && (
                            <>
                                <span className="w-[82px] text-[12px] text-[#718096]">{approver.isFinal ? "최종 승인자" : `${index + 1}차 승인자`}</span>
                                <span className="flex size-7 items-center justify-center rounded-full bg-[#E2EBE3] text-[10px] font-bold text-[#172033]">{approver.name.slice(0, 2)}</span>
                                <strong className="text-[14px] font-semibold text-[#172033]">{approver.name}</strong>
                            </>
                        )}
                        <span className={isResubmission ? "hidden" : undefined}>
                            {approver.order}차 승인{approver.isFinal ? "(최종 승인자)" : ""} · {approver.name} · {approver.username}
                        </span>
                        <button
                            aria-label={`${approver.name} 결재선에서 제거`}
                            className={isResubmission ? "ml-auto" : undefined}
                            onClick={() => handleRemoveApprover(approver.order)}
                            type="button"
                        >
                            <X className="size-3.5 text-[#94A3B8]" />
                        </button>
                    </div>
                ))}
                {isResubmission && (
                    <div className="pt-1">
                        <div className="rounded-xl border border-dashed border-[#B6CFBA] px-3 py-2">
                            <select className="h-6 w-full bg-white px-1 text-[13px] font-semibold text-[#4D856B] outline-none" onChange={(event) => { const candidateUserId = Number(event.target.value); setSelectedApproverId(event.target.value); handleAddApprover(candidateUserId); }} value={selectedApproverId}>
                                <option disabled hidden value="">결재자 추가</option>
                                {approverCandidates.map((candidate) =>
                                    <option
                                        disabled={assignedApprovers.some((approver) => approver.userId === candidate.userId)}
                                        key={candidate.userId}
                                        value={candidate.userId}
                                    >
                                        {candidate.name} ({candidate.username})
                                    </option>
                                )}
                            </select>
                        </div>
                    </div>
                )}
                {!isResubmission && <button
                    className="flex h-9 w-full items-center justify-center gap-1 rounded-lg border border-dashed border-[#DCE9DF] text-[12px] text-[#718096]"
                    type="button"
                >
                    <Plus className="size-3.5" /> 승인자 추가
                </button>}
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
