'use client'

import { Download, Mail, Plus, RotateCw, X } from "lucide-react";
import { useState } from "react";
import useModal from "@/components/hooks/useModal";
import TwoButtonModal from "@/components/ui/TwoButtonModal";
import { payrollRevisionHistoryMock } from "../payrollDetailMock";
import { PAYROLL_STATUS_BADGE_CLASS, PAYROLL_STATUS_LABEL } from "../statusStyles";
import PayrollRevisionHistory from "./PayrollRevisionHistory";

interface PayrollDetailProps {
    detail: PayrollDetailData;
    onClose: () => void;
}

function formatYearMonth(yearMonth: string) {
    const [year, month] = yearMonth.split("-");
    return `${year}년 ${Number(month)}월`;
}

function LineItemRow({ item, onDelete }: { item: PayrollDetailLineItem; onDelete?: () => void }) {
    return (
        <div className="border-b border-[#F1F3F6] px-4 py-3 last:border-b-0">
            <div className="flex items-center justify-between text-[13px]">
                <span className="text-[#394257]">{item.name}</span>
                <div className="flex items-center gap-2">
                    <strong className="font-semibold text-[#172033]">{item.amount.toLocaleString()}원</strong>
                    {onDelete && (
                        <button aria-label={`${item.name} 삭제`} className="text-[#94A3B8] hover:text-[#C0392B]" onClick={onDelete} type="button">
                            <X className="size-3.5" />
                        </button>
                    )}
                </div>
            </div>
            {item.adjusted && (
                <div className="mt-2 rounded-md border-l-2 border-[#D6A85E] bg-[#FFF9EE] px-3 py-2 text-[11px] text-[#B78236]">
                    <p>자동 계산액 {item.originalAmount?.toLocaleString()}원</p>
                    <p>조정 사유: {item.adjustmentReason}</p>
                </div>
            )}
            {item.calculationFormula && (
                <p className="mt-1.5 text-[11px] text-[#94A3B8]">{item.calculationFormula}</p>
            )}
            {item.calculationBasis && (
                <p className="text-[11px] text-[#94A3B8]">{item.calculationBasis}</p>
            )}
        </div>
    );
}

export default function PayrollDetail({ detail, onClose }: PayrollDetailProps) {
    const [earnings, setEarnings] = useState(detail.earnings);
    const [memo, setMemo] = useState(detail.memo ?? "");
    const [isAddingEarning, setIsAddingEarning] = useState(false);
    const [newEarningName, setNewEarningName] = useState("");
    const [newEarningAmount, setNewEarningAmount] = useState("");
    const [isRevisionHistoryOpen, setIsRevisionHistoryOpen] = useState(false);
    const confirmModal = useModal();
    const revisionModal = useModal();
    const retryModal = useModal();

    const revisionLabel = detail.revisionNo > 1 ? `정정 ${detail.revisionNo}차` : `${detail.revisionNo}차`;
    const isEditable = detail.preparationStatus === "CALCULATED";
    const isConfirmed = detail.preparationStatus === "CONFIRMED";
    const revisions = payrollRevisionHistoryMock[detail.payrollId] ?? [];

    const totalEarnings = earnings.reduce((sum, item) => sum + item.amount, 0);
    const netPay = totalEarnings - detail.totalDeductions;

    const handleAddEarning = () => {
        const amount = Number(newEarningAmount);
        if (!newEarningName.trim() || !amount) return;

        setEarnings((items) => [...items, { name: newEarningName.trim(), amount, editable: true }]);
        setNewEarningName("");
        setNewEarningAmount("");
        setIsAddingEarning(false);
    };

    const handleDeleteEarning = (index: number) => {
        setEarnings((items) => items.filter((_, itemIndex) => itemIndex !== index));
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#172033]/35">
            <aside className="absolute inset-y-0 right-0 flex w-full max-w-[480px] flex-col bg-white shadow-[-12px_0_28px_rgba(23,32,51,0.12)]">
                <header className="border-b border-[#E1EBE3] px-7 py-5">
                    <div className="flex items-start justify-between gap-4">
                        <p className="flex items-center gap-2 text-[15px]">
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${PAYROLL_STATUS_BADGE_CLASS[detail.preparationStatus]}`}>
                                {PAYROLL_STATUS_LABEL[detail.preparationStatus]}
                            </span>
                            <strong className="text-[18px] font-bold text-[#172033]">{detail.employeeName}</strong>
                            <span className="text-[#94A3B8]">
                                · {detail.contract.employmentTypeLabel} · {formatYearMonth(detail.yearMonth)} · {revisionLabel}
                            </span>
                        </p>
                        <button aria-label="닫기" onClick={onClose} type="button">
                            <X className="size-[18px] text-[#718096]" />
                        </button>
                    </div>
                    <p className="mt-2 text-[12px] text-[#94A3B8]">지급 예정일 {detail.scheduledPayDate.replaceAll("-", ".")}</p>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto px-7 py-6">
                    <section aria-label="근태 기준">
                        <h2 className="text-[13px] font-semibold text-[#394257]">근태 기준</h2>
                        <div className="mt-3 grid grid-cols-3 gap-2">
                            {([
                                ["근무일수", `${detail.attendance.workDays}일`],
                                ["총 근로시간", `${detail.attendance.workHours}시간`],
                                ["연장근로", `${detail.attendance.overtimeHours}시간`],
                                ["야간근로", `${detail.attendance.nightHours}시간`],
                                ["휴일근로", `${detail.attendance.holidayHours}시간`],
                                ["유급휴가", `${detail.attendance.paidLeaveHours}시간`],
                            ] as [string, string][]).map(([label, value]) => (
                                <div className="rounded-lg bg-[#F8FAF8] px-3 py-2.5" key={label}>
                                    <span className="block text-[11px] text-[#94A3B8]">{label}</span>
                                    <strong className="mt-1 block text-[15px] text-[#172033]">{value}</strong>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section aria-label="계약 기준" className="mt-6">
                        <h2 className="text-[13px] font-semibold text-[#394257]">계약 기준</h2>
                        <dl className="mt-3 divide-y divide-[#F1F3F6] rounded-lg border border-[#E1EBE3]">
                            {([
                                ["고용 형태", `${detail.contract.employmentTypeLabel} · ${detail.contract.salaryTypeLabel}`],
                                ["기본급", `${detail.contract.baseSalary.toLocaleString()}원`],
                                ["통상시급", `${detail.contract.ordinaryHourlyWage.toLocaleString()}원`],
                                ["주 계약시간", `${detail.contract.weeklyContractHours}시간`],
                            ] as [string, string][]).map(([label, value]) => (
                                <div className="flex items-center justify-between px-4 py-2.5 text-[13px]" key={label}>
                                    <dt className="text-[#7C8AA0]">{label}</dt>
                                    <dd className="font-semibold text-[#172033]">{value}</dd>
                                </div>
                            ))}
                        </dl>
                    </section>

                    <button
                        aria-expanded="false"
                        className="mt-6 flex w-full items-center justify-between text-[13px] font-semibold text-[#394257]"
                        type="button"
                    >
                        계산 기준
                        <span aria-hidden className="text-[#94A3B8]">⌄</span>
                    </button>

                    <section aria-label="지급 항목" className="mt-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-[13px] font-semibold text-[#394257]">지급 항목</h2>
                            {isEditable && !isAddingEarning && (
                                <button
                                    className="flex items-center gap-1 text-[11px] font-semibold text-[#4D9560]"
                                    onClick={() => setIsAddingEarning(true)}
                                    type="button"
                                >
                                    <Plus className="size-3.5" />
                                    수기 항목 추가
                                </button>
                            )}
                        </div>
                        <div className="mt-3 overflow-hidden rounded-lg border border-[#E1EBE3]">
                            {earnings.map((item, index) => (
                                <LineItemRow
                                    item={item}
                                    key={`${item.name}-${index}`}
                                    onDelete={isEditable && item.editable ? () => handleDeleteEarning(index) : undefined}
                                />
                            ))}
                        </div>
                        {isEditable && isAddingEarning && (
                            <div className="mt-2 flex items-center gap-2 rounded-lg border border-[#DCE9DF] bg-[#F8FAF8] p-3">
                                <input
                                    className="h-9 w-full rounded-md border border-[#DCE9DF] bg-white px-2.5 text-[12px] outline-none"
                                    onChange={(event) => setNewEarningName(event.target.value)}
                                    placeholder="항목명"
                                    value={newEarningName}
                                />
                                <input
                                    className="h-9 w-[120px] rounded-md border border-[#DCE9DF] bg-white px-2.5 text-[12px] outline-none"
                                    onChange={(event) => setNewEarningAmount(event.target.value)}
                                    placeholder="금액"
                                    type="number"
                                    value={newEarningAmount}
                                />
                                <button
                                    className="h-9 shrink-0 rounded-md bg-[#172033] px-3 text-[12px] font-semibold text-white"
                                    onClick={handleAddEarning}
                                    type="button"
                                >
                                    추가
                                </button>
                                <button
                                    className="h-9 shrink-0 rounded-md border border-[#DCE9DF] bg-white px-3 text-[12px] text-[#64748B]"
                                    onClick={() => setIsAddingEarning(false)}
                                    type="button"
                                >
                                    취소
                                </button>
                            </div>
                        )}
                    </section>

                    <section aria-label="공제 항목" className="mt-6">
                        <h2 className="text-[13px] font-semibold text-[#394257]">공제 항목</h2>
                        <div className="mt-3 overflow-hidden rounded-lg border border-[#E1EBE3]">
                            {detail.deductions.map((item) => (
                                <LineItemRow item={item} key={item.name} />
                            ))}
                        </div>
                    </section>

                    {(isEditable || detail.memo) && (
                        <section aria-label="메모" className="mt-6">
                            <h2 className="text-[13px] font-semibold text-[#394257]">메모</h2>
                            {isEditable ?
                                <textarea
                                    className="mt-3 min-h-24 w-full resize-y rounded-lg border border-[#E1EBE3] px-3.5 py-3 text-[13px] outline-none focus:border-[#4D9560]"
                                    onChange={(event) => setMemo(event.target.value)}
                                    placeholder="검토 메모를 입력하세요."
                                    value={memo}
                                />
                                :
                                <p className="mt-3 rounded-lg bg-[#F8FAF8] px-3.5 py-3 text-[13px] text-[#394257]">{detail.memo}</p>
                            }
                        </section>
                    )}

                    <section aria-label="지급/공제 요약" className="mt-6 rounded-lg bg-[#F8FAF8] px-4 py-3.5">
                        <div className="flex items-center justify-between text-[13px] text-[#7C8AA0]">
                            <span>지급 합계</span>
                            <span>{totalEarnings.toLocaleString()}원</span>
                        </div>
                        <div className="mt-1.5 flex items-center justify-between text-[13px] text-[#7C8AA0]">
                            <span>공제 합계</span>
                            <span>{detail.totalDeductions.toLocaleString()}원</span>
                        </div>
                        <div className="mt-2.5 flex items-center justify-between border-t border-[#E1EBE3] pt-2.5 text-[15px] font-bold text-[#172033]">
                            <span>실수령액</span>
                            <span>{netPay.toLocaleString()}원</span>
                        </div>
                    </section>

                    <section aria-label="명세서 작업" className="mt-6">
                        <h2 className="text-[13px] font-semibold text-[#394257]">명세서 작업</h2>
                        {detail.statement?.status === "READY" && (
                            <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-[#E1EBE3] px-4 py-3">
                                <div>
                                    <strong className="block text-[13px] font-semibold text-[#172033]">준비 완료</strong>
                                    <span className="mt-0.5 block text-[11px] text-[#94A3B8]">
                                        {detail.statement.generatedAt} · {detail.statement.fileSizeLabel}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        className="flex h-9 items-center gap-1.5 rounded-lg border border-[#DCE9DF] bg-white px-3 text-[12px] font-semibold text-[#394257]"
                                        type="button"
                                    >
                                        <Download className="size-3.5" />
                                        PDF 다운로드
                                    </button>
                                    <button
                                        className="flex h-9 items-center gap-1.5 rounded-lg bg-[#172033] px-3 text-[12px] font-semibold text-white"
                                        type="button"
                                    >
                                        <Mail className="size-3.5" />
                                        이메일 발송
                                    </button>
                                </div>
                            </div>
                        )}
                        {detail.statement?.status === "FAILED" && (
                            <div className="mt-3 rounded-lg border border-[#E8B4AC] bg-[#FFFAF9] px-4 py-3">
                                <div className="flex items-center justify-between gap-3">
                                    <strong className="text-[13px] font-semibold text-[#C0392B]">생성 실패</strong>
                                    <button
                                        className="flex h-8 items-center gap-1.5 rounded-lg border border-[#E8B4AC] bg-white px-3 text-[12px] font-semibold text-[#C0392B]"
                                        onClick={retryModal.openModal}
                                        type="button"
                                    >
                                        <RotateCw className="size-3.5" />
                                        재시도
                                    </button>
                                </div>
                                <p className="mt-2 text-[12px] text-[#8A5A54]">{detail.statement.failureReason}</p>
                            </div>
                        )}
                        {!detail.statement && (
                            <p className="mt-3 rounded-lg border border-[#E1EBE3] bg-[#F8FAF8] px-4 py-3 text-[12px] text-[#94A3B8]">
                                급여 확정 후 명세서가 생성됩니다.
                            </p>
                        )}
                    </section>
                </div>

                {isEditable && (
                    <footer className="border-t border-[#E1EBE3] bg-white px-7 py-3">
                        <button
                            className="h-11 w-full rounded-lg bg-[#172033] text-[13px] font-semibold text-white"
                            onClick={confirmModal.openModal}
                            type="button"
                        >
                            확정하기
                        </button>
                    </footer>
                )}
                {isConfirmed && (
                    <footer className="grid grid-cols-2 gap-2 border-t border-[#E1EBE3] bg-white px-7 py-3">
                        <button
                            className="h-11 rounded-lg border border-[#DCE9DF] text-[13px] font-semibold text-[#64748B]"
                            onClick={() => setIsRevisionHistoryOpen(true)}
                            type="button"
                        >
                            정정 이력 보기
                        </button>
                        <button
                            className="h-11 rounded-lg border border-[#DCE9DF] text-[13px] font-semibold text-[#64748B]"
                            onClick={revisionModal.openModal}
                            type="button"
                        >
                            정정본 생성
                        </button>
                    </footer>
                )}
            </aside>

            {confirmModal.isModal && (
                <TwoButtonModal
                    activeModal={confirmModal.activeModal}
                    closeModal={confirmModal.closeModal}
                    confirmLabel="확정하기"
                    content={`${detail.employeeName}님의 ${formatYearMonth(detail.yearMonth)} 급여를 확정합니다. 확정 후에는 지급항목과 메모를 수정할 수 없습니다.`}
                    title="급여를 확정하시겠습니까?"
                />
            )}
            {revisionModal.isModal && (
                <TwoButtonModal
                    activeModal={revisionModal.activeModal}
                    closeModal={revisionModal.closeModal}
                    confirmLabel="정정본 생성"
                    content={`확정된 급여를 기준으로 새 정정본(${detail.revisionNo + 1}차)을 생성합니다.`}
                    title="급여 정정본을 생성하시겠습니까?"
                />
            )}
            {retryModal.isModal && (
                <TwoButtonModal
                    activeModal={retryModal.activeModal}
                    closeModal={retryModal.closeModal}
                    confirmLabel="재시도"
                    content="급여명세서 생성을 다시 시도합니다."
                    title="명세서 생성을 재시도하시겠습니까?"
                />
            )}
            {isRevisionHistoryOpen && (
                <PayrollRevisionHistory
                    employeeName={detail.employeeName}
                    onClose={() => setIsRevisionHistoryOpen(false)}
                    revisions={revisions}
                />
            )}
        </div>
    );
}
