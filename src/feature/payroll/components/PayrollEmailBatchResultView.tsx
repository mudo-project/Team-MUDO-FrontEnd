'use client'

import { RotateCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getPayrollEmailBatchResultAction } from "../actions";
import { PAYROLL_EMAIL_BATCH_STATUS_LABEL, PAYROLL_EMAIL_STATUS_BADGE_CLASS, PAYROLL_EMAIL_STATUS_LABEL } from "../statusStyles";

interface PayrollEmailBatchResultViewProps {
    batchId: number;
    initialResult: PayrollEmailBatchResultDetailData;
}

function formatYearMonth(payrollYearMonth: string) {
    const [year, month] = payrollYearMonth.split("-");
    return `${year}년 ${Number(month)}월`;
}

export default function PayrollEmailBatchResultView({ batchId, initialResult }: PayrollEmailBatchResultViewProps) {
    const [result, setResult] = useState(initialResult);
    const [isLoading, setIsLoading] = useState(false);

    const fetchPage = async (page: number) => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            const next = await getPayrollEmailBatchResultAction(batchId, { page, size: result.deliveries.size });
            setResult(next);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "일괄 발송 결과 조회에 실패하였습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[20px] font-bold text-[#172033]">{formatYearMonth(result.payrollYearMonth)} 명세서 일괄 발송 결과</h1>
                    <p className="mt-1 text-[12px] text-[#94A3B8]">배치 #{result.batchId} · {PAYROLL_EMAIL_BATCH_STATUS_LABEL[result.status as PayrollEmailBatchStatus]}</p>
                </div>
                <button
                    className="flex h-9 items-center gap-1.5 rounded-lg border border-[#DCE9DF] bg-white px-3 text-[12px] font-semibold text-[#394257] disabled:opacity-60"
                    disabled={isLoading}
                    onClick={() => fetchPage(result.deliveries.page)}
                    type="button"
                >
                    <RotateCw className="size-3.5" />
                    새로고침
                </button>
            </div>

            <section aria-label="발송 요약" className="mt-5 grid grid-cols-4 gap-2">
                {([
                    ["전체 대상", result.summary.totalCount],
                    ["발송됨", result.summary.sentCount + result.summary.deliveredCount],
                    ["실패", result.summary.failedCount],
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
                <div className="relative mt-3 overflow-hidden rounded-lg border border-[#E1EBE3]">
                    {result.deliveries.content.map((delivery) => (
                        <div className="flex items-center justify-between gap-3 border-b border-[#F1F3F6] px-4 py-3 text-[13px] last:border-b-0" key={delivery.deliveryId}>
                            <div className="min-w-0 flex-1">
                                <strong className="block font-semibold text-[#172033]">{delivery.employeeName}</strong>
                                <span className="mt-0.5 block text-[11px] text-[#94A3B8]">
                                    {delivery.failureReason ?? delivery.recipientEmail}
                                </span>
                            </div>
                            <div className="shrink-0 text-right">
                                <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${PAYROLL_EMAIL_STATUS_BADGE_CLASS[delivery.status as PayrollEmailDeliveryStatus]}`}>
                                    {PAYROLL_EMAIL_STATUS_LABEL[delivery.status as PayrollEmailDeliveryStatus]}
                                </span>
                                <span className="mt-1 block text-[11px] text-[#94A3B8]">{delivery.requestedAt}</span>
                            </div>
                        </div>
                    ))}
                    {result.deliveries.content.length === 0 && (
                        <p className="px-4 py-10 text-center text-[13px] text-[#94A3B8]">발송 대상이 없습니다.</p>
                    )}

                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/60 text-[13px] text-[#64748B]">
                            불러오는 중...
                        </div>
                    )}
                </div>

                {result.deliveries.totalPages > 1 && (
                    <div className="mt-3 flex items-center justify-center gap-2">
                        <button
                            className="h-8 rounded-md border border-[#DCE9DF] bg-white px-3 text-[12px] text-[#394257] disabled:opacity-40"
                            disabled={result.deliveries.first || isLoading}
                            onClick={() => fetchPage(result.deliveries.page - 1)}
                            type="button"
                        >
                            이전
                        </button>
                        <span className="text-[12px] text-[#94A3B8]">
                            {result.deliveries.page + 1} / {result.deliveries.totalPages}
                        </span>
                        <button
                            className="h-8 rounded-md border border-[#DCE9DF] bg-white px-3 text-[12px] text-[#394257] disabled:opacity-40"
                            disabled={result.deliveries.last || isLoading}
                            onClick={() => fetchPage(result.deliveries.page + 1)}
                            type="button"
                        >
                            다음
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
}
