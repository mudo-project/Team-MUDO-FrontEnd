'use client'

import { format } from "date-fns";
import { useMemo, useState } from "react";
import type { FinanceCardItem, FinanceCardStatus } from "../mockData";
import { financeCardListMock, financeCardMonthSummary } from "../mockData";
import FinanceCardCalendar from "./FinanceCardCalendar";
import FinanceCardDetail from "./FinanceCardDetail";
import FinanceCardList from "./FinanceCardList";
import FinanceCardListFilter, { type FinanceCardFilter } from "./FinanceCardListFilter";
import FinanceCardMonthOverview from "./FinanceCardMonthOverview";

const FILTER_STATUS: Record<Exclude<FinanceCardFilter, "전체">, FinanceCardStatus> = {
    미작성: "UNWRITTEN",
    진행중: "IN_PROGRESS",
    승인됨: "APPROVED",
    반려됨: "REJECTED",
};

export default function FinanceCorporateCardManagement() {
    const [selectedItem, setSelectedItem] = useState<FinanceCardItem | null>(null);
    const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
    const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 7, 1));
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [activeFilter, setActiveFilter] = useState<FinanceCardFilter>("전체");
    const [searchQuery, setSearchQuery] = useState("");

    const visibleItems = useMemo(() => {
        const selectedDateKey = selectedDate ? format(selectedDate, "MM.dd") : null;
        const normalizedSearchQuery = searchQuery.trim().toLowerCase();

        return financeCardListMock.filter((item) => {
            const matchesDate = !selectedDateKey || item.approvedAt.startsWith(selectedDateKey);
            const matchesFilter = activeFilter === "전체" || item.status === FILTER_STATUS[activeFilter];
            const matchesSearch = !normalizedSearchQuery || [
                item.merchantName,
                item.merchantType,
                item.cardName,
                item.cardLast4,
                item.purpose ?? "",
            ].some((value) => value.toLowerCase().includes(normalizedSearchQuery));

            return matchesDate && matchesFilter && matchesSearch;
        });
    }, [activeFilter, searchQuery, selectedDate]);

    const handleClickWrite = () => {
        const firstUnwritten = financeCardListMock.find((item) => item.status === "UNWRITTEN");

        if (firstUnwritten) {
            setSelectedItem(firstUnwritten);
        }
    };

    const handleToggleItem = (itemId: number) => {
        setSelectedItemIds((itemIds) => (
            itemIds.includes(itemId)
                ? itemIds.filter((id) => id !== itemId)
                : [...itemIds, itemId]
        ));
    };

    const handleToggleAll = () => {
        const visibleItemIds = visibleItems.map((item) => item.id);
        const isAllVisibleItemsSelected = visibleItemIds.length > 0 && visibleItemIds.every((itemId) => selectedItemIds.includes(itemId));

        setSelectedItemIds((itemIds) => (
            isAllVisibleItemsSelected
                ? itemIds.filter((itemId) => !visibleItemIds.includes(itemId))
                : Array.from(new Set([...itemIds, ...visibleItemIds]))
        ));
    };

    return (
        <>
            <div className="mt-5 flex min-h-9 items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <FinanceCardCalendar month={calendarMonth} onChangeMonth={setCalendarMonth} onSelectDate={setSelectedDate} />
                    <button
                        className="ml-1 h-9 rounded-lg border border-[#DCE9DF] bg-white px-3 text-[12px] text-[#718096]"
                        onClick={() => {
                            setCalendarMonth(new Date());
                            setSelectedDate(undefined);
                        }}
                        type="button"
                    >
                        이번 달
                    </button>
                </div>
                <button
                    className={`h-9 rounded-lg px-5 text-[12px] font-semibold text-white ${selectedItemIds.length > 0
                        ? "bg-[#172033] hover:bg-[#2B344B]"
                        : "cursor-not-allowed bg-[#CBD2DC]"
                    }`}
                    disabled={selectedItemIds.length === 0}
                    type="button"
                >
                    결재 상신
                </button>
            </div>

            <FinanceCardMonthOverview
                approvalProgress={financeCardMonthSummary.approvalProgress}
                onClickWrite={handleClickWrite}
                totalAmount={financeCardMonthSummary.monthlyTotalAmount}
                unwrittenCount={financeCardMonthSummary.unwrittenPurposeCount}
                usageCount={financeCardMonthSummary.usageCount}
            />

            <FinanceCardListFilter
                activeFilter={activeFilter}
                onChangeFilter={setActiveFilter}
                onChangeSearchQuery={setSearchQuery}
                searchQuery={searchQuery}
            />

            <FinanceCardList
                items={visibleItems}
                onSelectItem={setSelectedItem}
                onToggleAll={handleToggleAll}
                onToggleItem={handleToggleItem}
                selectedItemIds={selectedItemIds}
            />

            <FinanceCardDetail item={selectedItem} onClose={() => setSelectedItem(null)} />
        </>
    );
}
