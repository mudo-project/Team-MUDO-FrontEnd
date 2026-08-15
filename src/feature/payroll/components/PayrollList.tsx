'use client'

import { useState } from "react";
import useModal from "@/components/hooks/useModal";
import TwoButtonModal from "@/components/ui/TwoButtonModal";
import { payrollDetailMock } from "../payrollDetailMock";
import PayrollDetail from "./PayrollDetail";
import PayrollListItem from "./PayrollListItem";

interface PayrollListProps {
    items: PayrollListItemData[];
    onToggleAll: () => void;
    onToggleItem: (employeeId: number) => void;
    selectedItemIds: number[];
}

export default function PayrollList({ items, onToggleAll, onToggleItem, selectedItemIds }: PayrollListProps) {
    const [selectedPayrollId, setSelectedPayrollId] = useState<number | null>(null);
    const [calculatingItem, setCalculatingItem] = useState<PayrollListItemData | null>(null);
    const calculateModal = useModal();
    const selectedDetail = selectedPayrollId !== null ? payrollDetailMock[selectedPayrollId] ?? null : null;
    const isAllSelected = items.length > 0 && items.every((item) => selectedItemIds.includes(item.employeeId));

    const handleCalculate = (item: PayrollListItemData) => {
        setCalculatingItem(item);
        calculateModal.openModal();
    };

    return (
        <div className="mt-4 overflow-hidden rounded-xl border border-[#DCE9DF] bg-white">
            <table aria-label="급여 목록" className="w-full table-fixed text-left">
                <colgroup>
                    <col className="w-[54px]" />
                    <col className="w-[160px]" />
                    <col className="w-[100px]" />
                    <col className="w-[100px]" />
                    <col />
                    <col />
                    <col />
                    <col className="w-[90px]" />
                    <col className="w-[120px]" />
                </colgroup>
                <thead className="border-b border-[#E1EBE3] text-[11px] font-medium text-[#94A3B8]">
                    <tr className="h-[50px]">
                        <th className="px-5 text-center">
                            <input aria-label="전체 선택" checked={isAllSelected} className="size-4 accent-[#172033]" onChange={onToggleAll} type="checkbox" />
                        </th>
                        <th className="px-3">직원명</th>
                        <th className="px-3">고용형태</th>
                        <th className="px-3">지급합계</th>
                        <th className="px-3">공제합계</th>
                        <th className="px-3">실수령액</th>
                        <th className="px-3">차수</th>
                        <th className="pl-1 pr-3">준비상태</th>
                        <th className="px-3 text-center">
                            <span className="sr-only">급여 작업</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <PayrollListItem
                            isSelected={selectedItemIds.includes(item.employeeId)}
                            item={item}
                            key={item.employeeId}
                            onCalculate={handleCalculate}
                            onPreview={setSelectedPayrollId}
                            onToggleSelect={onToggleItem}
                        />
                    ))}
                    {items.length === 0 && (
                        <tr>
                            <td className="px-5 py-10 text-center text-[13px] text-[#94A3B8]" colSpan={9}>
                                조건에 맞는 직원이 없습니다.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {selectedDetail && (
                <PayrollDetail detail={selectedDetail} key={selectedDetail.payrollId} onClose={() => setSelectedPayrollId(null)} />
            )}

            {calculateModal.isModal && calculatingItem && (
                <TwoButtonModal
                    activeModal={calculateModal.activeModal}
                    closeModal={calculateModal.closeModal}
                    confirmLabel="계산하기"
                    content={`${calculatingItem.employeeName}님의 근태·계약 정보를 기준으로 이번 달 급여를 계산합니다.`}
                    title="급여를 계산하시겠습니까?"
                />
            )}
        </div>
    );
}
