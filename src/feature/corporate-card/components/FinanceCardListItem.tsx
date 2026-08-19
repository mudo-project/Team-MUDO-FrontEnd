import { format } from "date-fns";
import { ChevronRight } from "lucide-react";
import { FINANCE_CARD_STATUS_BADGE_CLASS, FINANCE_CARD_STATUS_LABEL } from "../statusStyles";

interface FinanceCardListItemProps {
    isSelected: boolean;
    item: CorporateCardTransactionListItemData;
    onSelect: (transactionId: number) => void;
    onToggleSelect: (transactionId: number) => void;
}

export default function FinanceCardListItem({ isSelected, item, onSelect, onToggleSelect }: FinanceCardListItemProps) {
    const isUnwritten = item.status === "UNWRITTEN";

    return (
        <tr className="h-[68px] border-b border-[#E1EBE3] last:border-b-0">
            <td className="px-5">
                <input
                    aria-label={`${item.merchantName} 선택`}
                    checked={isSelected}
                    className="size-4 accent-[#172033]"
                    onChange={() => onToggleSelect(item.transactionId)}
                    type="checkbox"
                />
            </td>
            <td className="px-3 text-[12px] text-[#334155]">{format(new Date(item.approvedAt), "yyyy.MM.dd HH:mm")}</td>
            <td className="px-3 text-[12px]">
                <strong className="block font-semibold">{item.merchantName}</strong>
            </td>
            <td className="px-3 text-[12px]">
                <div>{item.cardName}</div>
            </td>
            <td className="px-3 text-left text-[12px]">
                <strong className="font-semibold">{item.amount.toLocaleString()}</strong>
                {item.expenseCategory
                    ?
                    <span className="ml-1 inline-flex rounded-full bg-[#F1F3F6] px-2 py-0.5 text-[10px] text-[#64748B]">
                        {item.expenseCategory}
                    </span>
                    :
                    <span className="ml-1 text-[10px] text-[#B78236]">● 작성 필요</span>
                }
            </td>
            <td className="px-3 text-center">
                <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${FINANCE_CARD_STATUS_BADGE_CLASS[item.status]}`}>
                    {FINANCE_CARD_STATUS_LABEL[item.status]}
                </span>
            </td>
            <td className="px-3 text-center">
                <button
                    className={`inline-flex h-7 min-w-[58px] items-center justify-center gap-0.5 whitespace-nowrap rounded-md border px-2.5 text-[11px] font-semibold transition-colors ${isUnwritten
                        ? "border-[#E4C58B] bg-[#FFF9EE] text-[#A66F1F] hover:bg-[#FAF1DF]"
                        : "border-[#DCE9DF] bg-white text-[#4D9560] hover:bg-[#F4F8F5]"
                    }`}
                    onClick={() => onSelect(item.transactionId)}
                    type="button"
                >
                    {isUnwritten ? "작성하기" : "상세보기"}
                    <ChevronRight className="size-3" />
                </button>
            </td>
        </tr>
    );
}
