import type { FinanceCardItem } from "../mockData";
import FinanceCardListItem from "./FinanceCardListItem";

interface FinanceCardListProps {
    items: FinanceCardItem[];
    onSelectItem: (item: FinanceCardItem) => void;
}

export default function FinanceCardList({ items, onSelectItem }: FinanceCardListProps) {
    return (
        <div className="mt-4 overflow-hidden rounded-xl border border-[#DCE9DF] bg-white">
            <table aria-label="법인카드 내역" className="w-full table-fixed text-left">
                <thead className="border-b border-[#E1EBE3] text-[11px] font-medium text-[#94A3B8]">
                    <tr>
                        <th className="w-[54px] px-5 py-4">
                            <input aria-label="전체 선택" type="checkbox" />
                        </th>
                        <th className="w-[180px]">승인일시</th>
                        <th className="w-[140px]">가맹점</th>
                        <th className="w-[120px]">카드</th>
                        <th>금액/사용목적</th>
                        <th className="w-[90px]">결재 상태</th>
                        <th className="w-[90px] pr-5 text-right">액션</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <FinanceCardListItem item={item} key={item.id} onSelect={onSelectItem} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
