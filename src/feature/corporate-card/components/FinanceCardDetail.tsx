'use client'

import { format } from "date-fns";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { saveCorporateCardExpenseAction, submitCorporateCardExpenseAction } from "../actions";
import type { FinanceCardApprover } from "../constants";
import FinanceCardApprovalForm from "./FinanceCardApprovalForm";

interface FinanceCardDetailProps {
    item: CorporateCardTransactionData | null;
    onClose: () => void;
    onSaved: (data: CorporateCardTransactionData) => void;
    onSubmitted: () => void;
}

function UsageDetailCard({ item, showAmountInHeader = false }: { item: CorporateCardTransactionData; showAmountInHeader?: boolean }) {
    const installmentLabel = item.installmentMonths > 0 ? `${item.installmentMonths}개월` : "일시불";
    const rows: [string, string][] = [
        ["승인일시", format(new Date(item.approvedAt), "yyyy.MM.dd HH:mm")],
        ["카드", `${item.cardName} · ${item.cardNumberMasked}`],
        ["승인번호", item.approvalNumber],
        ["할부", installmentLabel],
        ...(!showAmountInHeader ? [["금액", `${item.amount.toLocaleString()}원`] as [string, string]] : []),
    ];

    return (
        <section aria-label="사용내역" className="rounded-xl bg-[#F1F4F8] p-5">
            <div className="flex items-center justify-between gap-4">
                <h2 className="text-[18px] font-bold text-[#172033]">{item.merchantName}</h2>
                {showAmountInHeader &&
                    <strong className="text-[18px] font-bold text-[#172033]">{item.amount.toLocaleString()}원</strong>
                }
            </div>
            <dl className="mt-4 space-y-2.5 text-[14px]">
                {rows.map(([label, value]) => (
                    <div className="flex items-center" key={label}>
                        <dt className="w-[88px] shrink-0 text-[#7C8AA0]">{label}</dt>
                        <dd className="font-medium text-[#394257]">{value}</dd>
                    </div>
                ))}
            </dl>
        </section>
    );
}

function ApprovalStatusCard({ item }: { item: CorporateCardTransactionData }) {
    return (
        <section aria-label="사용목적" className="mt-7">
            <h3 className="text-[17px] font-bold text-[#172033]">사용목적</h3>
            <div className="mt-3 rounded-lg bg-[#F1F4F8] px-4 py-3 text-[14px] text-[#394257]">
                {item.expenseCategory}
            </div>
            <div className="mt-3 min-h-[88px] rounded-lg bg-[#F1F4F8] px-4 py-3 text-[14px] leading-6 text-[#394257]">
                {item.purpose}
            </div>

            <h3 className="mt-7 text-[17px] font-bold text-[#172033]">결재 현황</h3>
            <p className="mt-4 text-[13px] text-[#94A3B8]">결재 현황 조회 기능은 아직 제공되지 않습니다.</p>
        </section>
    );
}

function RejectionNotice() {
    return (
        <section aria-label="반려 사유" className="rounded-lg border border-[#D8877D] bg-[#FFFAF9] p-4">
            <h3 className="text-[14px] font-bold text-[#C7665B]">반려 사유</h3>
            <p className="mt-2 text-[13px] leading-5 text-[#4B5565]">반려 사유 조회 기능은 아직 제공되지 않습니다.</p>
        </section>
    );
}

export default function FinanceCardDetail({ item, onClose, onSaved, onSubmitted }: FinanceCardDetailProps) {
    const [expenseCategory, setExpenseCategory] = useState(item?.expenseCategory ?? "");
    const [purpose, setPurpose] = useState(item?.purpose ?? "");
    const [approvers, setApprovers] = useState<FinanceCardApprover[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!item) {
        return null;
    }

    const isReadOnly = item.status === "APPROVED" || item.status === "IN_PROGRESS";
    const isRejected = item.status === "REJECTED";

    const handleSave = async () => {
        if (isSaving) return;

        setIsSaving(true);
        const result = await saveCorporateCardExpenseAction(item.transactionId, expenseCategory, purpose);
        setIsSaving(false);

        if (!result.success) {
            toast.error(result.message);
            return;
        }

        toast.success(result.message);
        if (result.data) {
            onSaved(result.data);
        }
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        const approverIds = approvers.map((approver) => approver.userId);
        const result = await submitCorporateCardExpenseAction(
            item.transactionId,
            expenseCategory,
            purpose,
            approverIds.length > 0 ? approverIds : undefined
        );
        setIsSubmitting(false);

        if (!result.success) {
            toast.error(result.message);
            return;
        }

        toast.success(result.message);
        onSubmitted();
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#172033]/35">
            <aside className="absolute inset-y-0 right-0 flex w-full max-w-[480px] flex-col bg-white shadow-[-12px_0_28px_rgba(23,32,51,0.12)]">
                <header className="flex h-[68px] items-center justify-between border-b border-[#E1EBE3] px-7">
                    <h1 className="text-[22px] font-bold text-[#172033]">사용내역 상세</h1>
                    <button
                        aria-label="닫기"
                        onClick={onClose}
                        type="button"
                    >
                        <X className="size-[18px] text-[#718096]" />
                    </button>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto px-7 py-6">
                    {isRejected && <RejectionNotice />}
                    <div className={isRejected ? "mt-6" : undefined}>
                        <UsageDetailCard item={item} showAmountInHeader={isRejected} />
                    </div>
                    {isReadOnly
                        ?
                        <ApprovalStatusCard item={item} />
                        :
                        <FinanceCardApprovalForm
                            approvers={[]}
                            expenseCategory={expenseCategory}
                            isResubmission={true}
                            onChangeApprovers={setApprovers}
                            onChangeExpenseCategory={setExpenseCategory}
                            onChangePurpose={setPurpose}
                            purpose={purpose}
                        />
                    }
                </div>
                {!isReadOnly && (
                    <footer className="grid grid-cols-2 gap-2 border-t border-[#E1EBE3] bg-white px-7 py-3">
                        <button
                            className="h-11 rounded-lg border border-[#DCE9DF] text-[13px] font-semibold text-[#64748B] disabled:opacity-60"
                            disabled={isSaving}
                            onClick={handleSave}
                            type="button"
                        >
                            {isSaving ? "저장 중..." : "임시저장"}
                        </button>
                        <button
                            className="h-11 rounded-lg bg-[#172033] text-[13px] font-semibold text-white disabled:opacity-60"
                            disabled={isSubmitting}
                            onClick={handleSubmit}
                            type="button"
                        >
                            {isSubmitting ? "상신 중..." : (isRejected ? "재상신" : "결재 상신")}
                        </button>
                    </footer>
                )}
            </aside>
        </div>
    );
}
