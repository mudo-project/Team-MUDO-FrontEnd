import { X } from "lucide-react";
import type { FinanceCardItem } from "../mockData";
import FinanceCardApprovalForm from "./FinanceCardApprovalForm";

interface FinanceCardDetailProps {
    item: FinanceCardItem | null;
    onClose: () => void;
}

function UsageDetailCard({ item, showAmountInHeader = false }: { item: FinanceCardItem; showAmountInHeader?: boolean }) {
    const rows: [string, string][] = [
        ["승인일시", item.approvedAt],
        ["카드", `${item.cardName} · ···· ${item.cardLast4}`],
        ["승인번호", item.approvalNumber],
        ["가맹점", item.merchantType],
        ["할부", item.installment],
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

function ApprovalStatusCard({ item }: { item: FinanceCardItem }) {
    return (
        <section aria-label="사용목적" className="mt-7">
            <h3 className="text-[17px] font-bold text-[#172033]">사용목적</h3>
            <div className="mt-3 rounded-lg bg-[#F1F4F8] px-4 py-3 text-[14px] text-[#394257]">
                {item.purpose}
            </div>
            <div className="mt-3 min-h-[88px] rounded-lg bg-[#F1F4F8] px-4 py-3 text-[14px] leading-6 text-[#394257]">
                {item.reason}
            </div>

            <h3 className="mt-7 text-[17px] font-bold text-[#172033]">결재 현황</h3>
            <ul className="relative mt-4 space-y-4 before:absolute before:bottom-4 before:left-[5px] before:top-2 before:w-px before:bg-[#DCE9DF]">
                {item.approvers.map((approver) => (
                    <li 
                        className="relative flex items-start gap-3 text-[14px]" 
                        key={approver.order}
                    >
                        <span className={`relative z-10 mt-1.5 size-[11px] shrink-0 rounded-full ring-4 ring-white ${approver.approvedAt ? "bg-[#4D856B]" : "bg-[#CBD2DC]"}`} />
                        <span className="min-w-0">
                            <strong className="font-semibold text-[#394257]">{approver.name}</strong> 
                            <span className="text-[#64748B]">· {approver.role}</span>
                            <span className="mt-1 block text-[12px] text-[#8A97AA]">
                                {approver.order}차 승인{approver.isFinal ? "(최종 승인자)" : ""} · {approver.approvedAt ?? "대기중"}
                            </span>
                        </span>
                    </li>
                ))}
            </ul>
        </section>
    );
}

function RejectionCard({ item }: { item: FinanceCardItem }) {
    if (!item.rejection) {
        return null;
    }

    return (
        <section 
            aria-label="반려 사유" 
            className="rounded-lg border border-[#D8877D] bg-[#FFFAF9] p-4"
        >
            <h3 className="text-[14px] font-bold text-[#C7665B]">반려 사유</h3>
            <p className="mt-2 text-[13px] leading-5 text-[#4B5565]">{item.rejection.reason}</p>
            <p className="mt-2 text-[12px] text-[#8A97AA]">반려자: {item.rejection.rejectedBy} · {item.rejection.rejectedAt}</p>
        </section>
    );
}

export default function FinanceCardDetail({ item, onClose }: FinanceCardDetailProps) {
    if (!item) {
        return null;
    }

    const isReadOnly = item.status === "APPROVED" || item.status === "IN_PROGRESS";

    return (
        <div className="fixed inset-0 z-50 bg-[#172033]/35">
            <aside className="absolute inset-y-0 right-0 flex w-full max-w-[480px] flex-col bg-white shadow-[-12px_0_28px_rgba(23,32,51,0.12)]">
                <header className="flex h-[68px] items-center justify-between border-b border-[#E1EBE3] px-7">
                    <h1 className="text-[22px] font-bold text-[#172033]">사용내역 상세</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-[12px] font-medium text-[#8A97AA]">API 연동</span>
                        <button 
                            aria-label="닫기" 
                            className="ml-3" 
                            onClick={onClose} 
                            type="button"
                        >
                            <X className="size-[18px] text-[#718096]" />
                        </button>
                    </div>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto px-7 py-6">
                    {!isReadOnly && <RejectionCard item={item} />}
                    <div className={item.rejection ? "mt-6" : undefined}>
                        <UsageDetailCard item={item} showAmountInHeader={Boolean(item.rejection)} />
                    </div>
                    {isReadOnly
                        ?
                        <ApprovalStatusCard item={item} />
                        :
                        <FinanceCardApprovalForm
                            approvers={item.rejection ? item.approvers : []}
                            isResubmission={true}
                            purpose={item.purpose}
                            reason={item.reason}
                        />
                    }
                </div>
                {!isReadOnly && (
                    <footer className="grid grid-cols-2 gap-2 border-t border-[#E1EBE3] bg-white px-7 py-3">
                        <button 
                            className="h-11 rounded-lg border border-[#DCE9DF] text-[13px] font-semibold text-[#64748B]" 
                            type="button"
                        >
                            임시저장
                        </button>
                        <button 
                            className="h-11 rounded-lg bg-[#172033] text-[13px] font-semibold text-white" 
                            type="button"
                        >
                            {item.rejection ? "재상신" : "결재 상신"}
                        </button>
                    </footer>
                )}
            </aside>
        </div>
    );
}
