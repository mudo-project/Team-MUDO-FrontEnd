import { X } from "lucide-react";

interface PayrollRevisionHistoryProps {
    employeeName: string;
    onClose: () => void;
    revisions: PayrollRevisionSummary[];
}

export default function PayrollRevisionHistory({ employeeName, onClose, revisions }: PayrollRevisionHistoryProps) {
    return (
        <div className="fixed inset-0 z-[60] bg-[#172033]/35">
            <aside className="absolute inset-y-0 right-0 flex w-full max-w-[480px] flex-col bg-white shadow-[-12px_0_28px_rgba(23,32,51,0.12)]">
                <header className="flex items-center justify-between border-b border-[#E1EBE3] px-7 py-5">
                    <h1 className="text-[16px] font-bold text-[#172033]">{employeeName} · 정정 이력</h1>
                    <button aria-label="닫기" onClick={onClose} type="button">
                        <X className="size-[18px] text-[#718096]" />
                    </button>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto px-7 py-6">
                    <ol className="space-y-3">
                        {revisions.map((revision) => (
                            <li className="rounded-lg border border-[#E1EBE3] px-4 py-3.5" key={revision.payrollId}>
                                <div className="flex items-center gap-2">
                                    <strong className="text-[14px] font-bold text-[#172033]">
                                        {revision.revisionNo > 1 ? `정정 ${revision.revisionNo}차` : `${revision.revisionNo}차`}
                                    </strong>
                                    {revision.isLatest && (
                                        <span className="inline-flex rounded-full bg-[#E7F3EA] px-2 py-0.5 text-[10px] font-semibold text-[#2F7D46]">
                                            최신
                                        </span>
                                    )}
                                </div>
                                <p className="mt-1 text-[11px] text-[#94A3B8]">확정일시 {revision.confirmedAt}</p>
                                <dl className="mt-3 grid grid-cols-3 gap-2 text-[12px]">
                                    <div>
                                        <dt className="text-[#94A3B8]">지급 합계</dt>
                                        <dd className="mt-0.5 font-semibold text-[#172033]">{revision.totalEarnings?.toLocaleString()}원</dd>
                                    </div>
                                    <div>
                                        <dt className="text-[#94A3B8]">공제 합계</dt>
                                        <dd className="mt-0.5 font-semibold text-[#172033]">{revision.totalDeductions?.toLocaleString()}원</dd>
                                    </div>
                                    <div>
                                        <dt className="text-[#94A3B8]">실수령액</dt>
                                        <dd className="mt-0.5 font-semibold text-[#172033]">{revision.netPay?.toLocaleString()}원</dd>
                                    </div>
                                </dl>
                            </li>
                        ))}
                    </ol>
                </div>
            </aside>
        </div>
    );
}
