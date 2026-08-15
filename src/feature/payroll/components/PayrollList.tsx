'use client'

import { useState } from "react";
import { toast } from "sonner";
import useModal from "@/components/hooks/useModal";
import TwoButtonModal from "@/components/ui/TwoButtonModal";
import { calculatePayrollAction, getPayrollAction } from "../actions";
import PayrollDetail from "./PayrollDetail";
import PayrollListItem from "./PayrollListItem";

interface PayrollListProps {
    isLoading: boolean;
    items: PayrollListItemData[];
    onListChanged: () => void;
    onToggleAll: () => void;
    onToggleItem: (employeeId: number) => void;
    selectedItemIds: number[];
}

export default function PayrollList({ isLoading, items, onListChanged, onToggleAll, onToggleItem, selectedItemIds }: PayrollListProps) {
    const [selectedDetail, setSelectedDetail] = useState<PayrollAggregateData | null>(null);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const [calculatingItem, setCalculatingItem] = useState<PayrollListItemData | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const calculateModal = useModal();
    const isAllSelected = items.length > 0 && items.every((item) => selectedItemIds.includes(item.employeeId));

    const handlePreview = async (payrollId: number) => {
        if (isDetailLoading) return;

        setIsDetailLoading(true);
        try {
            const detail = await getPayrollAction(payrollId);
            setSelectedDetail(detail);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "급여 상세 조회에 실패하였습니다.");
        } finally {
            setIsDetailLoading(false);
        }
    };

    const handleCalculate = (item: PayrollListItemData) => {
        setCalculatingItem(item);
        calculateModal.openModal();
    };

    const handleConfirmCalculate = async () => {
        if (!calculatingItem?.payrollId || isCalculating) return;

        setIsCalculating(true);
        try {
            const detail = await getPayrollAction(calculatingItem.payrollId);
            const result = await calculatePayrollAction(calculatingItem.payrollId, detail.version);

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            toast.success(result.message);
            calculateModal.closeModal();
            onListChanged();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "급여 계산에 실패하였습니다.");
        } finally {
            setIsCalculating(false);
        }
    };

    return (
        <div className="relative mt-4 overflow-hidden rounded-xl border border-[#DCE9DF] bg-white">
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
                            onPreview={handlePreview}
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

            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 text-[13px] text-[#64748B]">
                    불러오는 중...
                </div>
            )}

            {selectedDetail && (
                <PayrollDetail
                    detail={selectedDetail}
                    key={selectedDetail.payrollId}
                    onClose={() => setSelectedDetail(null)}
                    onListChanged={onListChanged}
                />
            )}

            {calculateModal.isModal && calculatingItem && (
                <TwoButtonModal
                    activeModal={handleConfirmCalculate}
                    closeModal={calculateModal.closeModal}
                    confirmLabel="계산하기"
                    content={`${calculatingItem.employeeName}님의 근태·계약 정보를 기준으로 이번 달 급여를 계산합니다.`}
                    isPending={isCalculating}
                    title="급여를 계산하시겠습니까?"
                />
            )}
        </div>
    );
}
