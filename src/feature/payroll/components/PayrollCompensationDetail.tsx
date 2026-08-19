'use client'

import { format } from "date-fns";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import useModal from "@/components/hooks/useModal";
import TwoButtonModal from "@/components/ui/TwoButtonModal";
import { savePayrollCompensationAction } from "../actions";
import { formatPeriod } from "../payrollFormat";
import { PAYROLL_ALLOWANCE_TYPE_LABEL, PAYROLL_EMPLOYMENT_TYPE_LABEL, PAYROLL_SALARY_TYPE_LABEL } from "../statusStyles";

interface PayrollCompensationDetailProps {
    compensation: PayrollCompensationGetData;
    employeeId: number;
    employeeName: string;
    onClose: () => void;
    onSaved: (compensation: PayrollCompensationGetData) => void;
}

function todayMonthStart() {
    return `${format(new Date(), "yyyy-MM")}-01`;
}

export default function PayrollCompensationDetail({ compensation, employeeId, employeeName, onClose, onSaved }: PayrollCompensationDetailProps) {
    const [fixedAllowances, setFixedAllowances] = useState(compensation.fixedAllowances);
    const [isAddingAllowance, setIsAddingAllowance] = useState(false);
    const [newAllowanceType, setNewAllowanceType] = useState<PayrollFixedAllowanceType>("OTHER");
    const [newAllowanceName, setNewAllowanceName] = useState("");
    const [newAllowanceAmount, setNewAllowanceAmount] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const saveModal = useModal();

    const handleAddAllowance = () => {
        const amount = Number(newAllowanceAmount);
        if (!newAllowanceName.trim() || !amount) return;

        setFixedAllowances((items) => [
            ...items,
            {
                id: -Date.now(),
                employeeId,
                type: newAllowanceType,
                name: newAllowanceName.trim(),
                amount,
                effectiveFrom: todayMonthStart(),
                effectiveTo: null,
            },
        ]);
        setNewAllowanceType("OTHER");
        setNewAllowanceName("");
        setNewAllowanceAmount("");
        setIsAddingAllowance(false);
    };

    const handleDeleteAllowance = (id: number) => {
        setFixedAllowances((items) => items.filter((item) => item.id !== id));
    };

    const handleSave = async () => {
        if (isSaving) return;

        setIsSaving(true);
        const result = await savePayrollCompensationAction(employeeId, {
            fixedAllowances: fixedAllowances.map((allowance) => ({
                allowanceId: allowance.id > 0 ? allowance.id : null,
                allowanceType: allowance.type,
                allowanceName: allowance.name,
                amount: allowance.amount,
                effectiveFrom: allowance.effectiveFrom,
                effectiveTo: allowance.effectiveTo,
            })),
        });
        setIsSaving(false);

        if (!result.success || !result.data) {
            toast.error(result.message);
            return;
        }

        toast.success(result.message);
        saveModal.closeModal();
        onSaved(result.data);
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#172033]/35">
            <aside className="absolute inset-y-0 right-0 flex w-full max-w-[480px] flex-col bg-white shadow-[-12px_0_28px_rgba(23,32,51,0.12)]">
                <header className="flex items-center justify-between border-b border-[#E1EBE3] px-7 py-5">
                    <h1 className="text-[16px] font-bold text-[#172033]">{employeeName} · 급여 설정</h1>
                    <button aria-label="닫기" onClick={onClose} type="button">
                        <X className="size-[18px] text-[#718096]" />
                    </button>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto px-7 py-6">
                    <section aria-label="계약 이력">
                        <h2 className="text-[13px] font-semibold text-[#394257]">계약 이력</h2>
                        <div className="mt-3 space-y-2">
                            {compensation.compensations.length === 0 && (
                                <p className="text-[12px] text-[#94A3B8]">등록된 계약이 없습니다.</p>
                            )}
                            {compensation.compensations.map((record) => (
                                <div className="rounded-lg border border-[#E1EBE3] px-4 py-3" key={record.id}>
                                    <div className="flex items-center justify-between text-[13px]">
                                        <strong className="font-semibold text-[#172033]">
                                            {PAYROLL_EMPLOYMENT_TYPE_LABEL[record.employmentType]} · {PAYROLL_SALARY_TYPE_LABEL[record.salaryType]}
                                        </strong>
                                        <span className="text-[#172033]">
                                            {record.salaryType === "MONTHLY"
                                                ? `${record.baseSalary?.toLocaleString()}원`
                                                : `${record.hourlyWage?.toLocaleString()}원`}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-[11px] text-[#94A3B8]">
                                        주 {record.weeklyContractHours}시간 · {formatPeriod(record.effectiveFrom, record.effectiveTo)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section aria-label="고정수당 이력" className="mt-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-[13px] font-semibold text-[#394257]">고정수당 이력</h2>
                            {!isAddingAllowance && (
                                <button
                                    className="flex items-center gap-1 text-[11px] font-semibold text-[#4D9560]"
                                    onClick={() => setIsAddingAllowance(true)}
                                    type="button"
                                >
                                    <Plus className="size-3.5" />
                                    수당 추가
                                </button>
                            )}
                        </div>
                        <div className="mt-3 space-y-2">
                            {fixedAllowances.length === 0 && (
                                <p className="text-[12px] text-[#94A3B8]">등록된 고정수당이 없습니다.</p>
                            )}
                            {fixedAllowances.map((allowance) => (
                                <div className="flex items-center justify-between gap-3 rounded-lg border border-[#E1EBE3] px-4 py-3" key={allowance.id}>
                                    <div>
                                        <strong className="text-[13px] font-semibold text-[#172033]">
                                            {allowance.name}
                                            <span className="ml-1.5 text-[11px] font-normal text-[#94A3B8]">
                                                ({PAYROLL_ALLOWANCE_TYPE_LABEL[allowance.type]})
                                            </span>
                                        </strong>
                                        <p className="mt-1 text-[11px] text-[#94A3B8]">{formatPeriod(allowance.effectiveFrom, allowance.effectiveTo)}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[13px] font-semibold text-[#172033]">{allowance.amount.toLocaleString()}원</span>
                                        <button aria-label={`${allowance.name} 삭제`} className="text-[#94A3B8] hover:text-[#C0392B]" onClick={() => handleDeleteAllowance(allowance.id)} type="button">
                                            <X className="size-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {isAddingAllowance && (
                            <div className="mt-2 space-y-2 rounded-lg border border-[#DCE9DF] bg-[#F8FAF8] p-3">
                                <div className="flex items-center gap-2">
                                    <select
                                        className="h-9 rounded-md border border-[#DCE9DF] bg-white px-2 text-[12px] outline-none"
                                        onChange={(event) => setNewAllowanceType(event.target.value as PayrollFixedAllowanceType)}
                                        value={newAllowanceType}
                                    >
                                        {(Object.keys(PAYROLL_ALLOWANCE_TYPE_LABEL) as PayrollFixedAllowanceType[]).map((type) => (
                                            <option key={type} value={type}>{PAYROLL_ALLOWANCE_TYPE_LABEL[type]}</option>
                                        ))}
                                    </select>
                                    <input
                                        className="h-9 w-full rounded-md border border-[#DCE9DF] bg-white px-2.5 text-[12px] outline-none"
                                        onChange={(event) => setNewAllowanceName(event.target.value)}
                                        placeholder="수당명"
                                        value={newAllowanceName}
                                    />
                                    <input
                                        className="h-9 w-[120px] rounded-md border border-[#DCE9DF] bg-white px-2.5 text-[12px] outline-none"
                                        onChange={(event) => setNewAllowanceAmount(event.target.value)}
                                        placeholder="금액"
                                        type="number"
                                        value={newAllowanceAmount}
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button className="h-9 shrink-0 rounded-md border border-[#DCE9DF] bg-white px-3 text-[12px] text-[#64748B]" onClick={() => setIsAddingAllowance(false)} type="button">
                                        취소
                                    </button>
                                    <button className="h-9 shrink-0 rounded-md bg-[#172033] px-3 text-[12px] font-semibold text-white" onClick={handleAddAllowance} type="button">
                                        추가
                                    </button>
                                </div>
                            </div>
                        )}
                    </section>

                    <section aria-label="통상시급 이력" className="mt-6">
                        <h2 className="text-[13px] font-semibold text-[#394257]">통상시급 이력</h2>
                        <div className="mt-3 space-y-2">
                            {compensation.payBases.length === 0 && (
                                <p className="text-[12px] text-[#94A3B8]">등록된 통상시급이 없습니다.</p>
                            )}
                            {compensation.payBases.map((payBasis) => (
                                <div className="flex items-center justify-between rounded-lg border border-[#E1EBE3] px-4 py-3" key={payBasis.id}>
                                    <span className="text-[11px] text-[#94A3B8]">{formatPeriod(payBasis.effectiveFrom, payBasis.effectiveTo)}</span>
                                    <strong className="text-[13px] font-semibold text-[#172033]">{payBasis.ordinaryHourlyWage.toLocaleString()}원</strong>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <footer className="border-t border-[#E1EBE3] bg-white px-7 py-3">
                    <button
                        className="h-11 w-full rounded-lg bg-[#172033] text-[13px] font-semibold text-white"
                        onClick={saveModal.openModal}
                        type="button"
                    >
                        저장
                    </button>
                </footer>
            </aside>

            {saveModal.isModal && (
                <TwoButtonModal
                    activeModal={handleSave}
                    closeModal={saveModal.closeModal}
                    confirmLabel="저장"
                    content={`${employeeName}님의 급여 설정을 저장합니다.`}
                    isPending={isSaving}
                    title="급여 설정을 저장하시겠습니까?"
                />
            )}
        </div>
    );
}
