'use client'

import { Download, Mail, Plus, RotateCw, X } from "lucide-react";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import useModal from "@/components/hooks/useModal";
import TwoButtonModal from "@/components/ui/TwoButtonModal";
import {
    confirmPayrollAction,
    createPayrollEarningAction,
    createPayrollEmailDeliveryAction,
    createPayrollRevisionAction,
    deletePayrollEarningAction,
    getPayrollAction,
    getPayrollRevisionsAction,
    getPayrollStatementDownloadUrlAction,
    retryPayrollStatementAction,
    updatePayrollAction,
} from "../actions";
import { PAYROLL_EMPLOYMENT_TYPE_LABEL, PAYROLL_SALARY_TYPE_LABEL, PAYROLL_STATUS_BADGE_CLASS, PAYROLL_STATUS_LABEL } from "../statusStyles";
import { formatYearMonth } from "../payrollFormat";
import PayrollEmailDeliveryResultPanel from "./PayrollEmailDeliveryResultPanel";
import PayrollRevisionHistory from "./PayrollRevisionHistory";

const STATEMENT_POLL_INTERVAL_MS = 3000;

interface PayrollDetailProps {
    detail: PayrollAggregateData;
    onClose: () => void;
    onListChanged: () => void;
}

function LineItemRow({ item, onDelete }: { item: PayrollLineItemData; onDelete?: () => void }) {
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

export default function PayrollDetail({ detail: initialDetail, onClose, onListChanged }: PayrollDetailProps) {
    const [detail, setDetail] = useState(initialDetail);
    const [memo, setMemo] = useState(detail.memo ?? "");
    const [isSavingMemo, setIsSavingMemo] = useState(false);
    const [isAddingEarning, setIsAddingEarning] = useState(false);
    const [newEarningName, setNewEarningName] = useState("");
    const [newEarningAmount, setNewEarningAmount] = useState("");
    const [isMutating, setIsMutating] = useState(false);
    const [revisions, setRevisions] = useState<PayrollAggregateData[] | null>(null);
    const [isRevisionHistoryOpen, setIsRevisionHistoryOpen] = useState(false);
    const [emailDeliveryResult, setEmailDeliveryResult] = useState<PayrollEmailDeliveryCreateData | null>(null);
    const confirmModal = useModal();
    const revisionModal = useModal();
    const retryModal = useModal();

    const revisionLabel = detail.revisionNo > 1 ? `정정 ${detail.revisionNo}차` : `${detail.revisionNo}차`;
    const isEditable = detail.status === "CALCULATED";
    const isConfirmed = detail.status === "CONFIRMED";
    const employmentTypeLabel = detail.employee.employmentType ? PAYROLL_EMPLOYMENT_TYPE_LABEL[detail.employee.employmentType] : "-";
    const compensation = detail.snapshots?.compensations?.[0];

    const refreshDetail = async () => {
        const nextDetail = await getPayrollAction(detail.payrollId);
        setDetail(nextDetail);
        setMemo(nextDetail.memo ?? "");
        onListChanged();
    };

    // 확정 직후 명세서는 PENDING으로 비동기 생성되므로, READY/FAILED로 바뀔 때까지 폴링해 재진입 없이 버튼을 노출한다.
    useEffect(() => {
        if (detail.statement?.status !== "PENDING") return;

        const interval = setInterval(async () => {
            try {
                const nextDetail = await getPayrollAction(detail.payrollId);
                setDetail(nextDetail);
                if (nextDetail.statement?.status !== "PENDING") {
                    onListChanged();
                }
            } catch {
            }
        }, STATEMENT_POLL_INTERVAL_MS);

        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [detail.statement?.status, detail.payrollId]);

    const handleSaveMemo = async () => {
        if (isSavingMemo) return;

        setIsSavingMemo(true);
        const result = await updatePayrollAction(detail.payrollId, detail.version, memo);
        setIsSavingMemo(false);

        if (!result.success) {
            toast.error(result.message);
            return;
        }

        toast.success(result.message);
        await refreshDetail();
    };

    const handleAddEarning = async () => {
        const amount = Number(newEarningAmount);
        if (!newEarningName.trim() || !amount || isMutating) return;

        setIsMutating(true);
        const result = await createPayrollEarningAction(detail.payrollId, detail.version, newEarningName.trim(), amount);
        setIsMutating(false);

        if (!result.success) {
            toast.error(result.message);
            return;
        }

        toast.success(result.message);
        setNewEarningName("");
        setNewEarningAmount("");
        setIsAddingEarning(false);
        await refreshDetail();
    };

    const handleDeleteEarning = async (itemId: number) => {
        if (isMutating) return;

        setIsMutating(true);
        const result = await deletePayrollEarningAction(detail.payrollId, itemId, detail.version);
        setIsMutating(false);

        if (!result.success) {
            toast.error(result.message);
            return;
        }

        toast.success(result.message);
        await refreshDetail();
    };

    const handleConfirm = async () => {
        const result = await confirmPayrollAction(detail.payrollId, detail.version);

        if (!result.success) {
            toast.error(result.message);
            return;
        }

        toast.success(result.message);
        confirmModal.closeModal();
        await refreshDetail();
    };

    const handleCreateRevision = async () => {
        const result = await createPayrollRevisionAction(detail.payrollId, detail.version);

        if (!result.success) {
            toast.error(result.message);
            return;
        }

        toast.success(result.message);
        revisionModal.closeModal();
        onListChanged();
        onClose();
    };

    const handleRetryStatement = async () => {
        const result = await retryPayrollStatementAction(detail.payrollId);

        if (!result.success) {
            toast.error(result.message);
            return;
        }

        toast.success(result.message);
        retryModal.closeModal();
        await refreshDetail();
    };

    const handleOpenRevisionHistory = async () => {
        try {
            const data = await getPayrollRevisionsAction(detail.payrollId);
            setRevisions(data);
            setIsRevisionHistoryOpen(true);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "급여 정정 이력 조회에 실패하였습니다.");
        }
    };

    const handleDownloadStatement = async () => {
        const result = await getPayrollStatementDownloadUrlAction(detail.payrollId);

        if (!result.success || !result.data) {
            toast.error(result.message);
            return;
        }

        window.open(result.data.downloadUrl, "_blank", "noopener,noreferrer");
    };

    const handleSendEmail = async () => {
        const result = await createPayrollEmailDeliveryAction(detail.payrollId);

        if (!result.success) {
            toast.error(result.message);
            return;
        }

        toast.success(result.message);
        if (result.data) {
            setEmailDeliveryResult(result.data);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#172033]/35">
            <aside className="absolute inset-y-0 right-0 flex w-full max-w-[480px] flex-col bg-white shadow-[-12px_0_28px_rgba(23,32,51,0.12)]">
                <header className="border-b border-[#E1EBE3] px-7 py-5">
                    <div className="flex items-start justify-between gap-4">
                        <p className="flex items-center gap-2 text-[15px]">
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${PAYROLL_STATUS_BADGE_CLASS[detail.status]}`}>
                                {PAYROLL_STATUS_LABEL[detail.status]}
                            </span>
                            <strong className="text-[18px] font-bold text-[#172033]">{detail.employee.name}</strong>
                            <span className="text-[#94A3B8]">
                                · {employmentTypeLabel} · {formatYearMonth(detail.yearMonth)} · {revisionLabel}
                            </span>
                        </p>
                        <button aria-label="닫기" onClick={onClose} type="button">
                            <X className="size-[18px] text-[#718096]" />
                        </button>
                    </div>
                    <p className="mt-2 text-[12px] text-[#94A3B8]">지급 예정일 {format(new Date(detail.scheduledPayDate), "yyyy.MM.dd")}</p>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto px-7 py-6">
                    {detail.snapshots ? (
                        <>
                            <section aria-label="근태 기준">
                                <h2 className="text-[13px] font-semibold text-[#394257]">근태 기준</h2>
                                <div className="mt-3 grid grid-cols-3 gap-2">
                                    {([
                                        ["근무일수", `${detail.snapshots.attendance.workDays}일`],
                                        ["총 근로시간", `${detail.snapshots.attendance.workHours}시간`],
                                        ["연장근로", `${detail.snapshots.attendance.overtimeHours}시간`],
                                        ["야간근로", `${detail.snapshots.attendance.nightHours}시간`],
                                        ["휴일근로", `${detail.snapshots.attendance.holidayHours}시간`],
                                        ["유급휴가", `${detail.snapshots.attendance.paidLeaveHours}시간`],
                                    ] as [string, string][]).map(([label, value]) => (
                                        <div className="rounded-lg bg-[#F8FAF8] px-3 py-2.5" key={label}>
                                            <span className="block text-[11px] text-[#94A3B8]">{label}</span>
                                            <strong className="mt-1 block text-[15px] text-[#172033]">{value}</strong>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {compensation && (
                                <section aria-label="계약 기준" className="mt-6">
                                    <h2 className="text-[13px] font-semibold text-[#394257]">계약 기준</h2>
                                    <dl className="mt-3 divide-y divide-[#F1F3F6] rounded-lg border border-[#E1EBE3]">
                                        {([
                                            ["고용 형태", `${PAYROLL_EMPLOYMENT_TYPE_LABEL[compensation.employmentType]} · ${PAYROLL_SALARY_TYPE_LABEL[compensation.salaryType]}`],
                                            ["기본급/시급", compensation.salaryType === "MONTHLY"
                                                ? `${compensation.baseSalary?.toLocaleString()}원`
                                                : `${compensation.hourlyWage?.toLocaleString()}원`],
                                            ["통상시급", `${compensation.ordinaryHourlyWage.toLocaleString()}원`],
                                            ["주 계약시간", `${compensation.weeklyContractHours}시간`],
                                        ] as [string, string][]).map(([label, value]) => (
                                            <div className="flex items-center justify-between px-4 py-2.5 text-[13px]" key={label}>
                                                <dt className="text-[#7C8AA0]">{label}</dt>
                                                <dd className="font-semibold text-[#172033]">{value}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                </section>
                            )}
                        </>
                    ) : (
                        <p className="rounded-lg border border-[#E1EBE3] bg-[#F8FAF8] px-4 py-3 text-[12px] text-[#94A3B8]">
                            아직 계산 기준 Snapshot이 없습니다.
                        </p>
                    )}

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
                            {detail.earnings.map((item) => (
                                <LineItemRow
                                    item={item}
                                    key={item.itemId}
                                    onDelete={isEditable && item.editable ? () => handleDeleteEarning(item.itemId) : undefined}
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
                                    className="h-9 shrink-0 rounded-md bg-[#172033] px-3 text-[12px] font-semibold text-white disabled:opacity-60"
                                    disabled={isMutating}
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
                                <LineItemRow item={item} key={item.itemId} />
                            ))}
                        </div>
                    </section>

                    {(isEditable || detail.memo) && (
                        <section aria-label="메모" className="mt-6">
                            <h2 className="text-[13px] font-semibold text-[#394257]">메모</h2>
                            {isEditable ?
                                <>
                                    <textarea
                                        className="mt-3 min-h-24 w-full resize-y rounded-lg border border-[#E1EBE3] px-3.5 py-3 text-[13px] outline-none focus:border-[#4D9560]"
                                        onChange={(event) => setMemo(event.target.value)}
                                        placeholder="검토 메모를 입력하세요."
                                        value={memo}
                                    />
                                    <div className="mt-2 flex justify-end">
                                        <button
                                            className="h-8 rounded-md border border-[#DCE9DF] bg-white px-3 text-[11px] font-semibold text-[#394257] disabled:opacity-60"
                                            disabled={isSavingMemo}
                                            onClick={handleSaveMemo}
                                            type="button"
                                        >
                                            {isSavingMemo ? "저장 중..." : "메모 저장"}
                                        </button>
                                    </div>
                                </>
                                :
                                <p className="mt-3 rounded-lg bg-[#F8FAF8] px-3.5 py-3 text-[13px] text-[#394257]">{detail.memo}</p>
                            }
                        </section>
                    )}

                    <section aria-label="지급/공제 요약" className="mt-6 rounded-lg bg-[#F8FAF8] px-4 py-3.5">
                        <div className="flex items-center justify-between text-[13px] text-[#7C8AA0]">
                            <span>지급 합계</span>
                            <span>{detail.totalEarnings?.toLocaleString() ?? "-"}원</span>
                        </div>
                        <div className="mt-1.5 flex items-center justify-between text-[13px] text-[#7C8AA0]">
                            <span>공제 합계</span>
                            <span>{detail.totalDeductions?.toLocaleString() ?? "-"}원</span>
                        </div>
                        <div className="mt-2.5 flex items-center justify-between border-t border-[#E1EBE3] pt-2.5 text-[15px] font-bold text-[#172033]">
                            <span>실수령액</span>
                            <span>{detail.netPay?.toLocaleString() ?? "-"}원</span>
                        </div>
                    </section>

                    <section aria-label="명세서 작업" className="mt-6">
                        <h2 className="text-[13px] font-semibold text-[#394257]">명세서 작업</h2>
                        {detail.statement?.status === "READY" && (
                            <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-[#E1EBE3] px-4 py-3">
                                <div>
                                    <strong className="block text-[13px] font-semibold text-[#172033]">준비 완료</strong>
                                    <span className="mt-0.5 block text-[11px] text-[#94A3B8]">
                                        {detail.statement.generatedAt} · {detail.statement.fileSize ? `${Math.round(detail.statement.fileSize / 1024)}KB` : ""}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        className="flex h-9 items-center gap-1.5 rounded-lg border border-[#DCE9DF] bg-white px-3 text-[12px] font-semibold text-[#394257]"
                                        onClick={handleDownloadStatement}
                                        type="button"
                                    >
                                        <Download className="size-3.5" />
                                        PDF 다운로드
                                    </button>
                                    <button
                                        className="flex h-9 items-center gap-1.5 rounded-lg bg-[#172033] px-3 text-[12px] font-semibold text-white"
                                        onClick={handleSendEmail}
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
                        {detail.statement?.status === "PENDING" && (
                            <p className="mt-3 rounded-lg border border-[#E1EBE3] bg-[#F8FAF8] px-4 py-3 text-[12px] text-[#94A3B8]">
                                명세서를 생성하고 있습니다.
                            </p>
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
                            onClick={handleOpenRevisionHistory}
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
                    activeModal={handleConfirm}
                    closeModal={confirmModal.closeModal}
                    confirmLabel="확정하기"
                    content={`${detail.employee.name}님의 ${formatYearMonth(detail.yearMonth)} 급여를 확정합니다. 확정 후에는 지급항목과 메모를 수정할 수 없습니다.`}
                    title="급여를 확정하시겠습니까?"
                />
            )}
            {revisionModal.isModal && (
                <TwoButtonModal
                    activeModal={handleCreateRevision}
                    closeModal={revisionModal.closeModal}
                    confirmLabel="정정본 생성"
                    content={`확정된 급여를 기준으로 새 정정본(${detail.revisionNo + 1}차)을 생성합니다.`}
                    title="급여 정정본을 생성하시겠습니까?"
                />
            )}
            {retryModal.isModal && (
                <TwoButtonModal
                    activeModal={handleRetryStatement}
                    closeModal={retryModal.closeModal}
                    confirmLabel="재시도"
                    content="급여명세서 생성을 다시 시도합니다."
                    title="명세서 생성을 재시도하시겠습니까?"
                />
            )}
            {isRevisionHistoryOpen && revisions && (
                <PayrollRevisionHistory
                    employeeName={detail.employee.name}
                    onClose={() => setIsRevisionHistoryOpen(false)}
                    revisions={revisions}
                />
            )}
            {emailDeliveryResult && (
                <PayrollEmailDeliveryResultPanel
                    employeeName={detail.employee.name}
                    onClose={() => setEmailDeliveryResult(null)}
                    result={emailDeliveryResult}
                />
            )}
        </div>
    );
}
