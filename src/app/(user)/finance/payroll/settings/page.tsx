import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import PayrollCompensationList from "@/feature/payroll/components/PayrollCompensationList";
import PayrollPolicyForm from "@/feature/payroll/components/PayrollPolicyForm";
import { payrollCompensationMock, payrollPolicyMock } from "@/feature/payroll/payrollSettingsMock";

export default function FinancePayrollSettingsPage() {
    return (
        <div className="mt-4 pb-8">
            <Link className="flex items-center gap-1.5 text-[12px] font-semibold text-[#64748B]" href="/finance/payroll">
                <ArrowLeft className="size-3.5" />
                급여명세서로 돌아가기
            </Link>

            <h1 className="mt-3 text-[20px] font-bold text-[#172033]">급여 설정</h1>
            <p className="mt-1 text-[12px] text-[#94A3B8]">급여 계산의 기준이 되는 정책과 직원별 급여 설정을 관리합니다.</p>

            <div className="mt-5">
                <PayrollPolicyForm policy={payrollPolicyMock} />
                <PayrollCompensationList employees={payrollCompensationMock} />
            </div>
        </div>
    );
}
