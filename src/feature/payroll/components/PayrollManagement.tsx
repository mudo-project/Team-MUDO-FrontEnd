'use client'

import { Settings } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { createPayrollEmailDeliveryAction, getPayrollsAction } from "../actions";
import PayrollAmountSummary from "./PayrollAmountSummary";
import PayrollCalendar from "./PayrollCalendar";
import PayrollList from "./PayrollList";
import PayrollListFilter, { type PayrollEmploymentTypeFilter, type PayrollStatusFilter } from "./PayrollListFilter";
import PayrollMonthOverview from "./PayrollMonthOverview";

interface PayrollManagementProps {
    initialData: PayrollListData;
    initialMonth: number;
    initialYear: number;
}

export default function PayrollManagement({ initialData, initialMonth, initialYear }: PayrollManagementProps) {
    const [data, setData] = useState(initialData);
    const [year, setYear] = useState(initialYear);
    const [month, setMonth] = useState(initialMonth);
    const [employmentTypeFilter, setEmploymentTypeFilter] = useState<PayrollEmploymentTypeFilter>("전체");
    const [statusFilter, setStatusFilter] = useState<PayrollStatusFilter>("전체");
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
    const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
    const [loadError, setLoadError] = useState(false);
    const [isLoading, startTransition] = useTransition();

    const calendarMonth = useMemo(() => new Date(year, month - 1, 1), [year, month]);
    const monthLabel = `${year}년 ${month}월`;

    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
        return () => clearTimeout(timeout);
    }, [searchQuery]);

    useEffect(() => {
        let isCancelled = false;

        startTransition(async () => {
            try {
                const result = await getPayrollsAction({
                    year,
                    month,
                    size: 100,
                    employmentType: employmentTypeFilter === "전체" ? undefined : employmentTypeFilter,
                    status: statusFilter === "전체" ? undefined : statusFilter,
                    employeeName: debouncedSearchQuery.trim() || undefined,
                });
                if (isCancelled) return;
                setData(result);
                setSelectedItemIds([]);
                setLoadError(false);
            } catch {
                if (!isCancelled) setLoadError(true);
            }
        });

        return () => {
            isCancelled = true;
        };
    }, [year, month, employmentTypeFilter, statusFilter, debouncedSearchQuery]);

    const summary: PayrollMonthSummaryData = {
        targetEmployeeCount: data.summary.targetEmployeeCount,
        notCreatedCount: data.summary.notCreatedCount,
        draftCount: data.summary.targetEmployeeCount
            - data.summary.notCreatedCount
            - data.summary.calculatedCount
            - data.summary.confirmedCount,
        calculatedCount: data.summary.calculatedCount,
        confirmedCount: data.summary.confirmedCount,
        totalEarnings: data.summary.totalEarnings,
        totalDeductions: data.summary.totalDeductions,
        totalNetPay: data.summary.totalNetPay,
    };

    const handleChangeCalendarMonth = (nextMonth: Date) => {
        setYear(nextMonth.getFullYear());
        setMonth(nextMonth.getMonth() + 1);
    };

    const handleToggleItem = (employeeId: number) => {
        setSelectedItemIds((itemIds) => (
            itemIds.includes(employeeId)
                ? itemIds.filter((id) => id !== employeeId)
                : [...itemIds, employeeId]
        ));
    };

    const handleToggleAll = () => {
        const visibleItemIds = data.content.map((item) => item.employeeId);
        const isAllVisibleItemsSelected = visibleItemIds.length > 0 && visibleItemIds.every((itemId) => selectedItemIds.includes(itemId));

        setSelectedItemIds((itemIds) => (
            isAllVisibleItemsSelected
                ? itemIds.filter((itemId) => !visibleItemIds.includes(itemId))
                : Array.from(new Set([...itemIds, ...visibleItemIds]))
        ));
    };

    const handleRefreshList = async () => {
        try {
            const result = await getPayrollsAction({
                year,
                month,
                size: 100,
                employmentType: employmentTypeFilter === "전체" ? undefined : employmentTypeFilter,
                status: statusFilter === "전체" ? undefined : statusFilter,
                employeeName: debouncedSearchQuery.trim() || undefined,
            });
            setData(result);
        } catch {
        }
    };

    const handleConfirmBatchSend = async (): Promise<PayrollEmailBatchResultData> => {
        const selectedItems = data.content.filter((item) => selectedItemIds.includes(item.employeeId));
        const deliveries: PayrollEmailDeliveryData[] = [];

        for (const item of selectedItems) {
            if (item.payrollId === null || item.preparationStatus !== "CONFIRMED") {
                deliveries.push({
                    deliveryId: -item.employeeId,
                    employeeId: item.employeeId,
                    employeeName: item.employeeName,
                    recipientEmailMasked: "-",
                    status: "SKIPPED",
                    failureReason: "급여가 확정되지 않았거나 명세서가 준비되지 않았습니다.",
                });
                continue;
            }

            const result = await createPayrollEmailDeliveryAction(item.payrollId);

            deliveries.push({
                deliveryId: result.data?.deliveryId ?? -item.employeeId,
                employeeId: item.employeeId,
                employeeName: item.employeeName,
                recipientEmailMasked: "-",
                status: result.success && result.data ? (result.data.status as PayrollEmailDeliveryStatus) : "FAILED",
                failureReason: result.success ? null : result.message,
            });
        }

        setSelectedItemIds([]);
        await handleRefreshList();

        return {
            batchId: 0,
            yearMonth: `${year}-${String(month).padStart(2, "0")}`,
            status: "COMPLETED",
            summary: {
                totalCount: deliveries.length,
                pendingCount: deliveries.filter((delivery) => delivery.status === "PENDING").length,
                sendingCount: deliveries.filter((delivery) => delivery.status === "SENDING").length,
                sentCount: deliveries.filter((delivery) => delivery.status === "SENT").length,
                retryWaitCount: deliveries.filter((delivery) => delivery.status === "RETRY_WAIT").length,
                unknownCount: deliveries.filter((delivery) => delivery.status === "UNKNOWN").length,
                deliveredCount: deliveries.filter((delivery) => delivery.status === "DELIVERED").length,
                failedCount: deliveries.filter((delivery) => delivery.status === "FAILED").length,
                skippedCount: deliveries.filter((delivery) => delivery.status === "SKIPPED").length,
            },
            deliveries,
        };
    };

    return (
        <>
            <PayrollMonthOverview summary={summary} />
            <PayrollAmountSummary summary={summary} />

            <div className="mt-5 flex items-center gap-1.5">
                <PayrollCalendar month={calendarMonth} onChangeMonth={handleChangeCalendarMonth} />
                <button
                    className="ml-1 h-9 rounded-lg border border-[#DCE9DF] bg-white px-3 text-[12px] text-[#718096]"
                    onClick={() => {
                        setYear(initialYear);
                        setMonth(initialMonth);
                    }}
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
                totalCount={data.totalElements}
            />

            {loadError ? (
                <div className="mt-4 flex h-[200px] items-center justify-center rounded-xl border border-[#DCE9DF] bg-white text-[13px] text-[#64748B]">
                    급여 목록을 불러오지 못했습니다.
                </div>
            ) : (
                <PayrollList
                    isLoading={isLoading}
                    items={data.content}
                    onListChanged={handleRefreshList}
                    onToggleAll={handleToggleAll}
                    onToggleItem={handleToggleItem}
                    selectedItemIds={selectedItemIds}
                />
            )}
        </>
    );
}
