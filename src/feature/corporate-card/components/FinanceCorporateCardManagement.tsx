'use client'

import { isSameDay, isSameMonth } from "date-fns";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
    batchSubmitCorporateCardExpensesAction,
    getCorporateCardTransactionAction,
} from "../actions";
import FinanceCardCalendar from "./FinanceCardCalendar";
import FinanceCardDetail from "./FinanceCardDetail";
import FinanceCardList from "./FinanceCardList";
import FinanceCardListFilter, { type FinanceCardFilter } from "./FinanceCardListFilter";
import FinanceCardMonthOverview from "./FinanceCardMonthOverview";

interface FinanceCorporateCardSummary {
    totalCount: number;
    approvedCount: number;
    unwrittenCount: number;
    inProgressCount: number;
    rejectedCount: number;
    totalAmount: number;
}

interface FinanceCorporateCardManagementProps {
    transactions: CorporateCardTransactionListItemData[];
    summary: FinanceCorporateCardSummary;
}

const FILTER_STATUS: Record<Exclude<FinanceCardFilter, "전체">, CorporateCardTransactionStatus> = {
    미작성: "UNWRITTEN",
    진행중: "IN_PROGRESS",
    승인됨: "APPROVED",
    반려됨: "REJECTED",
};

export default function FinanceCorporateCardManagement({ transactions, summary }: FinanceCorporateCardManagementProps) {
    const router = useRouter();
    const [selectedDetail, setSelectedDetail] = useState<CorporateCardTransactionData | null>(null);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
    const [isBatchSubmitting, setIsBatchSubmitting] = useState(false);
    const [calendarMonth, setCalendarMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [activeFilter, setActiveFilter] = useState<FinanceCardFilter>("전체");
    const [searchQuery, setSearchQuery] = useState("");

    const visibleItems = useMemo(() => {
        const normalizedSearchQuery = searchQuery.trim().toLowerCase();

        return transactions.filter((item) => {
            const matchesDate = selectedDate
                ? isSameDay(new Date(item.approvedAt), selectedDate)
                : isSameMonth(new Date(item.approvedAt), calendarMonth);
            const matchesFilter = activeFilter === "전체" || item.status === FILTER_STATUS[activeFilter];
            const matchesSearch = !normalizedSearchQuery || [
                item.merchantName,
                item.cardName,
                item.expenseCategory ?? "",
            ].some((value) => value.toLowerCase().includes(normalizedSearchQuery));

            return matchesDate && matchesFilter && matchesSearch;
        });
    }, [transactions, activeFilter, searchQuery, selectedDate, calendarMonth]);

    const handleSelectItem = async (transactionId: number) => {
        if (isDetailLoading) return;

        setIsDetailLoading(true);
        try {
            const detail = await getCorporateCardTransactionAction(transactionId);
            setSelectedDetail(detail);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "법인카드 사용내역 상세 조회에 실패하였습니다.");
        } finally {
            setIsDetailLoading(false);
        }
    };

    const handleClickWrite = () => {
        const firstUnwritten = transactions.find((item) => item.status === "UNWRITTEN");

        if (firstUnwritten) {
            handleSelectItem(firstUnwritten.transactionId);
        }
    };

    const handleDetailSaved = (data: CorporateCardTransactionData) => {
        setSelectedDetail(data);
        router.refresh();
    };

    const handleDetailSubmitted = () => {
        setSelectedDetail(null);
        router.refresh();
    };

    const handleToggleItem = (transactionId: number) => {
        setSelectedItemIds((itemIds) => (
            itemIds.includes(transactionId)
                ? itemIds.filter((id) => id !== transactionId)
                : [...itemIds, transactionId]
        ));
    };

    const handleToggleAll = () => {
        const visibleItemIds = visibleItems.map((item) => item.transactionId);
        const isAllVisibleItemsSelected = visibleItemIds.length > 0 && visibleItemIds.every((itemId) => selectedItemIds.includes(itemId));

        setSelectedItemIds((itemIds) => (
            isAllVisibleItemsSelected
                ? itemIds.filter((itemId) => !visibleItemIds.includes(itemId))
                : Array.from(new Set([...itemIds, ...visibleItemIds]))
        ));
    };

    const handleBatchSubmit = async () => {
        if (selectedItemIds.length === 0 || isBatchSubmitting) return;

        setIsBatchSubmitting(true);
        const result = await batchSubmitCorporateCardExpensesAction(selectedItemIds);
        setIsBatchSubmitting(false);

        if (!result.success) {
            toast.error(result.message);
            return;
        }

        toast.success(result.message);
        setSelectedItemIds([]);
        router.refresh();
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
                    className={`h-9 rounded-lg px-5 text-[12px] font-semibold text-white disabled:cursor-not-allowed ${selectedItemIds.length > 0
                        ? "bg-[#172033] hover:bg-[#2B344B]"
                        : "cursor-not-allowed bg-[#CBD2DC]"
                    }`}
                    disabled={selectedItemIds.length === 0 || isBatchSubmitting}
                    onClick={handleBatchSubmit}
                    type="button"
                >
                    {isBatchSubmitting ? "상신 중..." : "결재 상신"}
                </button>
            </div>

            <FinanceCardMonthOverview
                approvalProgress={{
                    inProgress: summary.inProgressCount,
                    approved: summary.approvedCount,
                    rejected: summary.rejectedCount,
                }}
                onClickWrite={handleClickWrite}
                totalAmount={summary.totalAmount}
                unwrittenCount={summary.unwrittenCount}
                usageCount={summary.totalCount}
            />

            <FinanceCardListFilter
                activeFilter={activeFilter}
                onChangeFilter={setActiveFilter}
                onChangeSearchQuery={setSearchQuery}
                searchQuery={searchQuery}
            />

            <FinanceCardList
                items={visibleItems}
                onSelectItem={handleSelectItem}
                onToggleAll={handleToggleAll}
                onToggleItem={handleToggleItem}
                selectedItemIds={selectedItemIds}
            />

            <FinanceCardDetail
                item={selectedDetail}
                key={selectedDetail?.transactionId}
                onClose={() => setSelectedDetail(null)}
                onSaved={handleDetailSaved}
                onSubmitted={handleDetailSubmitted}
            />
        </>
    );
}
