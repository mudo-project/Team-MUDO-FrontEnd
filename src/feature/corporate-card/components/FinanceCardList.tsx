import type { FinanceCardItem } from "../mockData";
import FinanceCardListItem from "./FinanceCardListItem";

interface FinanceCardListProps {
    items: FinanceCardItem[];
    selectedItemIds: number[];
    onSelectItem: (item: FinanceCardItem) => void;
    onToggleAll: () => void;
    onToggleItem: (itemId: number) => void;
}

export default function FinanceCardList({ items, selectedItemIds, onSelectItem, onToggleAll, onToggleItem }: FinanceCardListProps) {
    const isAllSelected = items.length > 0 && items.every((item) => selectedItemIds.includes(item.id));

    return (
        <div className="mt-4 overflow-hidden rounded-xl border border-[#DCE9DF] bg-white">
            <table aria-label="법인카드 내역" className="w-full table-fixed text-left">
                <colgroup>
                    <col className="w-[54px]" />
                    <col className="w-[160px]" />
                    <col className="w-[220px]" />
                    <col className="w-[180px]" />
                    <col />
                    <col className="w-[140px]" />
                    <col className="w-[128px]" />
                </colgroup>
                <thead className="border-b border-[#E1EBE3] text-[11px] font-medium text-[#94A3B8]">
                    <tr className="h-[50px]">
                        <th className="px-5">
                            <input 
                                aria-label="전체 선택" 
                                checked={isAllSelected} 
                                className="size-4 accent-[#172033]" 
                                onChange={onToggleAll} 
                                type="checkbox"
                            />
                        </th>
                        <th className="px-3">승인일시</th>
                        <th className="px-3">가맹점</th>
                        <th className="px-3">카드</th>
                        <th className="px-3 text-left">금액/사용목적</th>
                        <th className="px-3 text-center">결재 상태</th>
                        <th className="px-3 text-center">
                            <span className="sr-only">내역 작업</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <FinanceCardListItem
                            isSelected={selectedItemIds.includes(item.id)}
                            item={item}
                            key={item.id}
                            onSelect={onSelectItem}
                            onToggleSelect={onToggleItem}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
