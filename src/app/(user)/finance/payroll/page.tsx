import { Settings } from "lucide-react";
import Link from "next/link";
import PayrollAmountSummary from "@/feature/payroll/components/PayrollAmountSummary";
import PayrollCalendar from "@/feature/payroll/components/PayrollCalendar";
import PayrollList from "@/feature/payroll/components/PayrollList";
import PayrollListFilter from "@/feature/payroll/components/PayrollListFilter";
import PayrollMonthOverview from "@/feature/payroll/components/PayrollMonthOverview";
import { payrollListMock } from "@/feature/payroll/mockData";

export default function FinancePayrollPage() {
    const items = payrollListMock;
    const monthLabel = "2026년 8월";

    const summary: PayrollMonthSummaryData = {
        targetEmployeeCount: items.length,
        notCreatedCount: items.filter((item) => item.preparationStatus === "NOT_CREATED").length,
        draftCount: items.filter((item) => item.preparationStatus === "DRAFT").length,
        calculatedCount: items.filter((item) => item.preparationStatus === "CALCULATED").length,
        confirmedCount: items.filter((item) => item.preparationStatus === "CONFIRMED").length,
        totalEarnings: items.reduce((sum, item) => sum + (item.totalEarnings ?? 0), 0),
        totalDeductions: items.reduce((sum, item) => sum + (item.totalDeductions ?? 0), 0),
        totalNetPay: items.reduce((sum, item) => sum + (item.netPay ?? 0), 0),
    };

    return (
        <>
            <PayrollMonthOverview summary={summary} />

            <div className="mt-5 flex items-center gap-1.5">
                <PayrollCalendar label={monthLabel} />
                <button
                    className="ml-1 h-9 rounded-lg border border-[#DCE9DF] bg-white px-3 text-[12px] text-[#718096]"
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

            <PayrollAmountSummary summary={summary} />
            <PayrollListFilter monthLabel={monthLabel} totalCount={items.length} />
            <PayrollList items={items} />
        </>
    );
}
