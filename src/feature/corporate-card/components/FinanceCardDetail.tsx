import { X } from "lucide-react";
import type { FinanceCardItem } from "../mockData";
import FinanceCardApprovalForm from "./FinanceCardApprovalForm";

interface FinanceCardDetailProps {
    item: FinanceCardItem | null;
    onClose: () => void;
}

function UsageDetailCard({ item }: { item: FinanceCardItem }) {
    const rows: [string, string][] = [
        ["승인일시", item.approvedAt],
        ["카드", `${item.cardName} · ···· ${item.cardLast4}`],
        ["승인번호", item.approvalNumber],
        ["가맹점", item.merchantType],
        ["할부", item.installment],
        ["금액", `${item.amount.toLocaleString()}원`],
    ];

    return (
        <section aria-label="사용내역" className="rounded-xl border border-[#DCE9DF] p-4">
            <h2 className="text-[15px] font-bold">{item.merchantName}</h2>
            <dl className="mt-3 grid grid-cols-2 gap-y-2 text-[12px]">
                {rows.map(([label, value]) => (
                    <div className="col-span-2 flex items-center justify-between" key={label}>
                        <dt className="text-[#718096]">{label}</dt>
                        <dd className="font-medium">{value}</dd>
                    </div>
                ))}
            </dl>
        </section>
    );
}

function ApprovalStatusCard({ item }: { item: FinanceCardItem }) {
    return (
        <section aria-label="사용목적" className="mt-4">
            <h3 className="text-[13px] font-semibold">사용목적</h3>
            <div className="mt-2 rounded-lg border border-[#DCE9DF] bg-[#FCFCFC] px-3 py-2 text-[12px]">
                {item.purpose}
            </div>
            <div className="mt-2 rounded-lg border border-[#DCE9DF] bg-[#FCFCFC] px-3 py-3 text-[12px] text-[#334155]">
                {item.reason}
            </div>

            <h3 className="mt-4 text-[13px] font-semibold">결재 현황</h3>
            <ul className="mt-2 space-y-2">
                {item.approvers.map((approver) => (
                    <li className="flex items-start gap-2 text-[12px]" key={approver.order}>
                        <span className={`mt-1 size-1.5 shrink-0 rounded-full ${approver.approvedAt ? "bg-[#2F7D46]" : "bg-[#CBD2DC]"}`} />
                        <span>
                            <strong className="font-semibold">{approver.name}</strong> · {approver.role}
                            <span className="mt-0.5 block text-[11px] text-[#94A3B8]">
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
            className="rounded-xl border border-[#F0C4C4] bg-[#FBEAEA] p-4 text-[#C0392B]"
        >
            <h3 className="text-[13px] font-semibold">반려 사유</h3>
            <p className="mt-1.5 text-[12px]">{item.rejection.reason}</p>
            <dl className="mt-2 flex items-center gap-3 text-[11px]">
                <div className="flex items-center gap-1">
                    <dt>반려자</dt>
                    <dd className="font-medium">{item.rejection.rejectedBy}</dd>
                </div>
                <div className="flex items-center gap-1">
                    <dt>반려일시</dt>
                    <dd className="font-medium">{item.rejection.rejectedAt}</dd>
                </div>
            </dl>
            <div className="mt-3 flex items-center gap-2">
                <button
                    className="h-9 flex-1 rounded-lg border border-[#DCE9DF] bg-white text-[12px] font-semibold text-[#718096]"
                    type="button"
                >
                    임시저장
                </button>
                <button
                    className="h-9 flex-1 rounded-lg bg-[#4D9560] text-[12px] font-semibold text-white"
                    type="button"
                >
                    재상신
                </button>
            </div>
        </section>
    );
}

export default function FinanceCardDetail({ item, onClose }: FinanceCardDetailProps) {
    if (!item) {
        return null;
    }

    const isReadOnly = item.status === "APPROVED" || item.status === "IN_PROGRESS" || item.status === "PENDING";

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
            <aside className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-xl">
                <header className="flex items-center justify-between">
                    <h1 className="text-[16px] font-bold">사용내역 상세</h1>
                    <div className="flex items-center gap-2">
                        <span className="rounded-full bg-[#F1F5F9] px-2 py-1 text-[10px] text-[#64748B]">API 연동</span>
                        <button aria-label="닫기" onClick={onClose} type="button">
                            <X className="size-4.5 text-[#718096]" />
                        </button>
                    </div>
                </header>

                <div className="mt-4 space-y-4">
                    {!isReadOnly && <RejectionCard item={item} />}
                    <UsageDetailCard item={item} />
                    {isReadOnly
                        ?
                        <ApprovalStatusCard item={item} />
                        :
                        <FinanceCardApprovalForm
                            approvers={item.rejection ? item.approvers : []}
                            purpose={item.purpose}
                            reason={item.reason}
                            submitLabel={item.status === "UNWRITTEN" ? "결재 상신" : undefined}
                        />
                    }
                </div>
            </aside>
        </div>
    );
}
