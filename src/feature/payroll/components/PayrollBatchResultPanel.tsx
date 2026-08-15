import { X } from "lucide-react";
import { PAYROLL_EMAIL_STATUS_BADGE_CLASS, PAYROLL_EMAIL_STATUS_LABEL } from "../statusStyles";

interface PayrollBatchResultPanelProps {
    onClose: () => void;
    result: PayrollEmailBatchResultData;
}

function formatYearMonth(yearMonth: string) {
    const [year, month] = yearMonth.split("-");
    return `${year}년 ${Number(month)}월`;
}

export default function PayrollBatchResultPanel({ onClose, result }: PayrollBatchResultPanelProps) {
    return (
        <div className="fixed inset-0 z-50 bg-[#172033]/35">
            <aside className="absolute inset-y-0 right-0 flex w-full max-w-[520px] flex-col bg-white shadow-[-12px_0_28px_rgba(23,32,51,0.12)]">
                <header className="flex items-center justify-between border-b border-[#E1EBE3] px-7 py-5">
                    <div>
                        <h1 className="text-[16px] font-bold text-[#172033]">{formatYearMonth(result.yearMonth)} 명세서 발송 결과</h1>
                        <p className="mt-1 text-[12px] text-[#94A3B8]">{result.batchId > 0 ? `배치 #${result.batchId} · ` : ""}완료됨</p>
                    </div>
                    <button aria-label="닫기" onClick={onClose} type="button">
                        <X className="size-[18px] text-[#718096]" />
                    </button>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto px-7 py-6">
                    <section aria-label="발송 요약" className="grid grid-cols-3 gap-2">
                        {([
                            ["전체 대상", result.summary.totalCount],
                            ["발송됨", result.summary.sentCount],
                            ["제외됨", result.summary.skippedCount],
                        ] as [string, number][]).map(([label, value]) => (
                            <div className="rounded-lg bg-[#F8FAF8] px-3 py-3" key={label}>
                                <span className="block text-[11px] text-[#94A3B8]">{label}</span>
                                <strong className="mt-1 block text-[20px] text-[#172033]">{value}명</strong>
                            </div>
                        ))}
                    </section>

                    <section aria-label="대상자별 발송 상태" className="mt-6">
                        <h2 className="text-[13px] font-semibold text-[#394257]">대상자별 발송 상태</h2>
                        <div className="mt-3 overflow-hidden rounded-lg border border-[#E1EBE3]">
                            {result.deliveries.map((delivery) => (
                                <div className="flex items-center justify-between gap-3 border-b border-[#F1F3F6] px-4 py-3 text-[13px] last:border-b-0" key={delivery.deliveryId}>
                                    <div className="min-w-0 flex-1">
                                        <strong className="block font-semibold text-[#172033]">{delivery.employeeName}</strong>
                                        <span className="mt-0.5 block text-[11px] text-[#94A3B8]">
                                            {delivery.failureReason ?? delivery.recipientEmailMasked}
                                        </span>
                                    </div>
                                    <span className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${PAYROLL_EMAIL_STATUS_BADGE_CLASS[delivery.status]}`}>
                                        {PAYROLL_EMAIL_STATUS_LABEL[delivery.status]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </aside>
        </div>
    );
}
