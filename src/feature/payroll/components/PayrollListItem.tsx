import { ChevronRight } from "lucide-react";
import { PAYROLL_EMPLOYMENT_TYPE_LABEL, PAYROLL_STATUS_BADGE_CLASS, PAYROLL_STATUS_LABEL } from "../statusStyles";

interface PayrollListItemProps {
    isSelected: boolean;
    item: PayrollListItemData;
    onCalculate: (item: PayrollListItemData) => void;
    onPreview: (payrollId: number) => void;
    onToggleSelect: (employeeId: number) => void;
}

export default function PayrollListItem({ isSelected, item, onCalculate, onPreview, onToggleSelect }: PayrollListItemProps) {
    const isPreviewable = item.preparationStatus === "CALCULATED" || item.preparationStatus === "CONFIRMED";
    const isDraft = item.preparationStatus === "DRAFT";
    const revisionLabel = item.revisionNo === 0
        ? "-"
        : item.revisionNo > 1
            ? `정정 ${item.revisionNo}차`
            : `${item.revisionNo}차`;

    return (
        <tr className="h-[68px] border-b border-[#E1EBE3] last:border-b-0">
            <td className="px-5 text-center">
                <input
                    aria-label={`${item.employeeName} 선택`}
                    checked={isSelected}
                    className="size-4 accent-[#172033]"
                    onChange={() => onToggleSelect(item.employeeId)}
                    type="checkbox"
                />
            </td>
            <td className="px-3 text-[12px]">
                <strong className="block font-semibold">{item.employeeName}</strong>
            </td>
            <td className="px-3 text-[12px] text-[#334155]">
                {item.employmentType ? PAYROLL_EMPLOYMENT_TYPE_LABEL[item.employmentType] : "-"}
            </td>
            <td className="px-3 text-[12px] text-[#334155]">
                {item.totalEarnings !== null ? `${item.totalEarnings.toLocaleString()}원` : "-"}
            </td>
            <td className="px-3 text-[12px] text-[#334155]">
                {item.totalDeductions !== null ? `${item.totalDeductions.toLocaleString()}원` : "-"}
            </td>
            <td className="px-3 text-[12px] font-semibold text-[#172033]">
                {item.netPay !== null ? `${item.netPay.toLocaleString()}원` : "-"}
            </td>
            <td className="px-3 text-[12px] text-[#334155]">{revisionLabel}</td>
            <td className="pl-1 pr-3">
                <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${PAYROLL_STATUS_BADGE_CLASS[item.preparationStatus]}`}>
                    {PAYROLL_STATUS_LABEL[item.preparationStatus]}
                </span>
            </td>
            <td className="px-3 text-center">
                {isPreviewable && (
                    <button
                        className="inline-flex h-7 min-w-[74px] items-center justify-center gap-0.5 whitespace-nowrap rounded-md border border-[#DCE9DF] bg-white px-2.5 text-[11px] font-semibold text-[#4D9560] transition-colors hover:bg-[#F4F8F5]"
                        onClick={() => item.payrollId !== null && onPreview(item.payrollId)}
                        type="button"
                    >
                        미리보기
                        <ChevronRight className="size-3" />
                    </button>
                )}
                {isDraft && (
                    <button
                        className="inline-flex h-7 min-w-[74px] items-center justify-center gap-0.5 whitespace-nowrap rounded-md border border-[#E4C58B] bg-[#FFF9EE] px-2.5 text-[11px] font-semibold text-[#A66F1F] transition-colors hover:bg-[#FAF1DF]"
                        onClick={() => onCalculate(item)}
                        type="button"
                    >
                        계산하기
                        <ChevronRight className="size-3" />
                    </button>
                )}
            </td>
        </tr>
    );
}
