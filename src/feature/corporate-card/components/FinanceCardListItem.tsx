import type { FinanceCardItem } from "../mockData";
import { FINANCE_CARD_STATUS_BADGE_CLASS, FINANCE_CARD_STATUS_LABEL } from "../statusStyles";

interface FinanceCardListItemProps {
    item: FinanceCardItem;
    onSelect: (item: FinanceCardItem) => void;
}

export default function FinanceCardListItem({ item, onSelect }: FinanceCardListItemProps) {
    const isUnwritten = item.status === "UNWRITTEN";

    return (
        <tr className="h-[68px] border-b border-[#E1EBE3] last:border-b-0">
            <td className="px-5">
                <input aria-label={`${item.merchantName} 선택`} type="checkbox" />
            </td>
            <td className="text-[12px]">
                <div>{item.approvedAt}</div>
                <strong className="mt-0.5 block font-semibold">{item.merchantName}</strong>
                <small className="block text-[10px] text-[#94A3B8]">{item.merchantType}</small>
            </td>
            <td className="text-[12px]">
                <div>{item.cardName}</div>
                <small className="block text-[10px] text-[#94A3B8]">···· {item.cardLast4}</small>
            </td>
            <td className="text-[12px]">
                <strong className="font-semibold">{item.amount.toLocaleString()}</strong>{" "}
                {item.purpose
                    ?
                    <span className="ml-1 inline-flex rounded-full bg-[#EEF4FA] px-2 py-0.5 text-[11px] text-[#334155]">
                        {item.purpose}
                    </span>
                    :
                    <span className="ml-1 text-[11px] text-[#B78236]">• 작성 필요</span>
                }
            </td>
            <td>
                <span className={`inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${FINANCE_CARD_STATUS_BADGE_CLASS[item.status]}`}>
                    {FINANCE_CARD_STATUS_LABEL[item.status]}
                </span>
            </td>
            <td className="pr-5 text-right">
                <button
                    className="text-[12px] font-semibold text-[#172033]"
                    onClick={() => onSelect(item)}
                    type="button"
                >
                    {isUnwritten ? "작성" : "보기"} &gt;
                </button>
            </td>
        </tr>
    );
}
