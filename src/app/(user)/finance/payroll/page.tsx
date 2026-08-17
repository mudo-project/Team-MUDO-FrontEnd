import { getPayrollsAction } from "@/feature/payroll/actions";
import PayrollManagement from "@/feature/payroll/components/PayrollManagement";
import DesktopOnlyGuard from "@/components/ui/DesktopOnlyGuard";

export default async function FinancePayrollPage() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    let listData: PayrollListData | null = null;

    try {
        listData = await getPayrollsAction({ year, month, size: 100 });
    } catch {
        listData = null;
    }

    if (!listData) {
        return (
            <div className="mt-10 flex h-[200px] items-center justify-center rounded-xl border border-[#DCE9DF] bg-white text-[13px] text-[#64748B]">
                급여 정보를 불러오지 못했습니다.
            </div>
        );
    }

    return (
        <DesktopOnlyGuard>
            <PayrollManagement initialData={listData} initialMonth={month} initialYear={year} />
        </DesktopOnlyGuard>
    );
}
