import PayrollAmountSummary from "@/feature/payroll/components/PayrollAmountSummary";
import PayrollManagement from "@/feature/payroll/components/PayrollManagement";
import PayrollMonthOverview from "@/feature/payroll/components/PayrollMonthOverview";
import { payrollListMock } from "@/feature/payroll/mockData";

export default function FinancePayrollPage() {
    const items = payrollListMock;

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
            <PayrollAmountSummary summary={summary} />
            <PayrollManagement items={items} />
        </>
    );
}
