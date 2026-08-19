'use client'

import { format } from "date-fns";
import { History, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { createPayrollEmailBatchAction, getPayrollsAction } from "../actions";
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

function getLastEmailBatchStorageKey(year: number, month: number) {
    return `payroll:lastEmailBatchId:${year}-${month}`;
}

export default function PayrollManagement({ initialData, initialMonth, initialYear }: PayrollManagementProps) {
    const router = useRouter();
    const [data, setData] = useState(initialData);
    const [year, setYear] = useState(initialYear);
    const [month, setMonth] = useState(initialMonth);
    const [employmentTypeFilter, setEmploymentTypeFilter] = useState<PayrollEmploymentTypeFilter>("전체");
    const [statusFilter, setStatusFilter] = useState<PayrollStatusFilter>("전체");
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
    const [loadError, setLoadError] = useState(false);
    const [lastBatchId, setLastBatchId] = useState<number | null>(null);
    const [isLoading, startTransition] = useTransition();

    const calendarMonth = useMemo(() => new Date(year, month - 1, 1), [year, month]);
    const monthLabel = format(calendarMonth, "yyyy년 M월");

    // 브라우저 localStorage(외부 저장소)에서 현재 연·월의 마지막 배치 발송 이력을 읽어와 동기화한다.
    useEffect(() => {
        const stored = localStorage.getItem(getLastEmailBatchStorageKey(year, month));
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLastBatchId(stored ? Number(stored) : null);
    }, [year, month]);

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

    const handleConfirmBatchSend = async () => {
        const result = await createPayrollEmailBatchAction(year, month);

        if (!result.success || !result.data) {
            toast.error(result.message);
            return;
        }

        toast.success(result.message);
        localStorage.setItem(getLastEmailBatchStorageKey(year, month), String(result.data.batchId));
        setLastBatchId(result.data.batchId);
        router.push(`/finance/payroll/email-batches/${result.data.batchId}`);
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
                {lastBatchId !== null && (
                    <Link
                        className="ml-auto flex h-9 items-center gap-1.5 rounded-lg border border-[#DCE9DF] bg-white px-3 text-[12px] font-semibold text-[#718096] hover:bg-[#F4F8F5]"
                        href={`/finance/payroll/email-batches/${lastBatchId}`}
                    >
                        <History className="size-3.5" />
                        {monthLabel} 발송 결과 보기
                    </Link>
                )}
                <Link
                    className={`flex h-9 items-center gap-1.5 rounded-lg border border-[#DCE9DF] bg-white px-3 text-[12px] font-semibold text-[#718096] hover:bg-[#F4F8F5] ${lastBatchId !== null ? "" : "ml-auto"}`}
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
                />
            )}
        </>
    );
}
