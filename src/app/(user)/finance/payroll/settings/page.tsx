import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getPayrollCompensationAction, getPayrollPolicyAction, getPayrollsAction } from "@/feature/payroll/actions";
import PayrollCompensationList, { type PayrollCompensationListItem } from "@/feature/payroll/components/PayrollCompensationList";
import PayrollPolicyForm from "@/feature/payroll/components/PayrollPolicyForm";
import DesktopOnlyGuard from "@/components/ui/DesktopOnlyGuard";

export default async function FinancePayrollSettingsPage() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    let policy: PayrollPolicyGetData | null = null;
    let employees: PayrollCompensationListItem[] = [];
    let loadError = false;

    try {
        policy = await getPayrollPolicyAction();

        const listData = await getPayrollsAction({ year, month, size: 100 });
        const compensationResults = await Promise.all(
            listData.content.map(async (item): Promise<PayrollCompensationListItem | null> => {
                try {
                    const compensation = await getPayrollCompensationAction(item.employeeId);
                    return { employeeId: item.employeeId, employeeName: item.employeeName, compensation };
                } catch {
                    return null;
                }
            })
        );
        employees = compensationResults.filter((item): item is PayrollCompensationListItem => item !== null);
    } catch {
        loadError = true;
    }

    if (loadError || !policy) {
        return (
            <div className="mt-10 flex h-[200px] items-center justify-center rounded-xl border border-[#DCE9DF] bg-white text-[13px] text-[#64748B]">
                급여 설정을 불러오지 못했습니다.
            </div>
        );
    }

    return (
        <div className="mt-4 pb-8">
            <Link className="flex items-center gap-1.5 text-[12px] font-semibold text-[#64748B]" href="/finance/payroll">
                <ArrowLeft className="size-3.5" />
                급여명세서로 돌아가기
            </Link>

            <h1 className="mt-3 text-[20px] font-bold text-[#172033]">급여 설정</h1>
            <p className="mt-1 text-[12px] text-[#94A3B8]">급여 계산의 기준이 되는 정책과 직원별 급여 설정을 관리합니다.</p>

            <div className="mt-5">
                <DesktopOnlyGuard>
                    <PayrollPolicyForm policy={policy} />
                    <PayrollCompensationList employees={employees} />
                </DesktopOnlyGuard>
            </div>
        </div>
    );
}
