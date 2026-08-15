'use client'

import { format } from "date-fns";
import { Settings } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { payrollBatchResultMock } from "../payrollBatchResultMock";
import PayrollCalendar from "./PayrollCalendar";
import PayrollList from "./PayrollList";
import PayrollListFilter, { type PayrollEmploymentTypeFilter, type PayrollStatusFilter } from "./PayrollListFilter";

interface PayrollManagementProps {
    items: PayrollListItemData[];
}

export default function PayrollManagement({ items }: PayrollManagementProps) {
    const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 7, 1));
    const [employmentTypeFilter, setEmploymentTypeFilter] = useState<PayrollEmploymentTypeFilter>("전체");
    const [statusFilter, setStatusFilter] = useState<PayrollStatusFilter>("전체");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);

    const isMockMonth = format(calendarMonth, "yyyy-MM") === "2026-08";
    const monthLabel = format(calendarMonth, "yyyy년 M월");

    const visibleItems = useMemo(() => {
        if (!isMockMonth) return [];

        const normalizedSearchQuery = searchQuery.trim().toLowerCase();

        return items.filter((item) => {
            const matchesEmploymentType = employmentTypeFilter === "전체" || item.employmentType === employmentTypeFilter;
            const matchesStatus = statusFilter === "전체" || item.preparationStatus === statusFilter;
            const matchesSearch = !normalizedSearchQuery || item.employeeName.toLowerCase().includes(normalizedSearchQuery);

            return matchesEmploymentType && matchesStatus && matchesSearch;
        });
    }, [items, employmentTypeFilter, statusFilter, searchQuery, isMockMonth]);

    const handleToggleItem = (employeeId: number) => {
        setSelectedItemIds((itemIds) => (
            itemIds.includes(employeeId)
                ? itemIds.filter((id) => id !== employeeId)
                : [...itemIds, employeeId]
        ));
    };

    const handleToggleAll = () => {
        const visibleItemIds = visibleItems.map((item) => item.employeeId);
        const isAllVisibleItemsSelected = visibleItemIds.length > 0 && visibleItemIds.every((itemId) => selectedItemIds.includes(itemId));

        setSelectedItemIds((itemIds) => (
            isAllVisibleItemsSelected
                ? itemIds.filter((itemId) => !visibleItemIds.includes(itemId))
                : Array.from(new Set([...itemIds, ...visibleItemIds]))
        ));
    };

    const handleConfirmBatchSend = (): PayrollEmailBatchResultData => {
        const selectedDeliveries = payrollBatchResultMock.deliveries.filter((delivery) => selectedItemIds.includes(delivery.employeeId));
        const result: PayrollEmailBatchResultData = {
            ...payrollBatchResultMock,
            summary: {
                totalCount: selectedDeliveries.length,
                pendingCount: 0,
                sendingCount: 0,
                sentCount: selectedDeliveries.filter((delivery) => delivery.status === "SENT").length,
                retryWaitCount: 0,
                unknownCount: 0,
                deliveredCount: 0,
                failedCount: 0,
                skippedCount: selectedDeliveries.filter((delivery) => delivery.status === "SKIPPED").length,
            },
            deliveries: selectedDeliveries,
        };

        setSelectedItemIds([]);
        return result;
    };

    return (
        <>
            <div className="mt-5 flex items-center gap-1.5">
                <PayrollCalendar month={calendarMonth} onChangeMonth={setCalendarMonth} />
                <button
                    className="ml-1 h-9 rounded-lg border border-[#DCE9DF] bg-white px-3 text-[12px] text-[#718096]"
                    onClick={() => setCalendarMonth(new Date(2026, 7, 1))}
                    type="button"
                >
                    이번 달
                </button>
                <Link
                    className="ml-auto flex h-9 items-center gap-1.5 rounded-lg border border-[#DCE9DF] bg-white px-3 text-[12px] font-semibold text-[#718096] hover:bg-[#F4F8F5]"
                    href="/finance/payroll/settings"
                >
                    <Settings className="size-3.5" />
                    급여 설정
                </Link>
            </div>

            <PayrollListFilter
                employmentTypeFilter={employmentTypeFilter}
                monthLabel={monthLabel}
                onChangeEmploymentTypeFilter={setEmploymentTypeFilter}
                onChangeSearchQuery={setSearchQuery}
                onChangeStatusFilter={setStatusFilter}
                onConfirmBatchSend={handleConfirmBatchSend}
                searchQuery={searchQuery}
                selectedCount={selectedItemIds.length}
                statusFilter={statusFilter}
                totalCount={visibleItems.length}
            />
            <PayrollList items={visibleItems} onToggleAll={handleToggleAll} onToggleItem={handleToggleItem} selectedItemIds={selectedItemIds} />
        </>
    );
}
