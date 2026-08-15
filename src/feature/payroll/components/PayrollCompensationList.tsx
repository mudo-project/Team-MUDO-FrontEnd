'use client'

import { useState } from "react";
import { PAYROLL_EMPLOYMENT_TYPE_LABEL, PAYROLL_SALARY_TYPE_LABEL } from "../statusStyles";
import PayrollCompensationDetail from "./PayrollCompensationDetail";

interface PayrollCompensationListProps {
    employees: PayrollEmployeeCompensationData[];
}

export default function PayrollCompensationList({ employees }: PayrollCompensationListProps) {
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
    const selected = employees.find((employee) => employee.employeeId === selectedEmployeeId) ?? null;

    return (
        <section aria-label="직원별 급여 설정" className="mt-6 rounded-xl border border-[#DCE9DF] bg-white p-6">
            <h2 className="text-[15px] font-bold text-[#172033]">직원별 급여 설정</h2>
            <p className="mt-1 text-[12px] text-[#94A3B8]">계약·고정수당·통상시급 이력을 직원별로 관리합니다.</p>

            <div className="mt-5 overflow-hidden rounded-lg border border-[#E1EBE3]">
                <table aria-label="직원별 급여 설정 목록" className="w-full table-fixed text-left">
                    <colgroup>
                        <col className="w-[140px]" />
                        <col className="w-[100px]" />
                        <col />
                        <col className="w-[110px]" />
                        <col className="w-[110px]" />
                        <col className="w-[90px]" />
                    </colgroup>
                    <thead className="border-b border-[#E1EBE3] text-[11px] font-medium text-[#94A3B8]">
                        <tr className="h-[44px]">
                            <th className="px-4">직원명</th>
                            <th className="px-3">고용형태</th>
                            <th className="px-3">기본급 / 시급</th>
                            <th className="px-3">주 계약시간</th>
                            <th className="px-3">통상시급</th>
                            <th className="px-3 text-center">
                                <span className="sr-only">편집</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee) => {
                            const compensation = employee.compensations[0];
                            const payBasis = employee.payBases[0];

                            return (
                                <tr className="h-[56px] border-b border-[#F1F3F6] last:border-b-0" key={employee.employeeId}>
                                    <td className="px-4 text-[13px] font-semibold text-[#172033]">{employee.employeeName}</td>
                                    <td className="px-3 text-[12px] text-[#334155]">
                                        {PAYROLL_EMPLOYMENT_TYPE_LABEL[compensation.employmentType]} · {PAYROLL_SALARY_TYPE_LABEL[compensation.salaryType]}
                                    </td>
                                    <td className="px-3 text-[12px] text-[#334155]">
                                        {compensation.salaryType === "MONTHLY"
                                            ? `${compensation.baseSalary?.toLocaleString()}원`
                                            : `${compensation.hourlyWage?.toLocaleString()}원`}
                                    </td>
                                    <td className="px-3 text-[12px] text-[#334155]">{compensation.weeklyContractHours}시간</td>
                                    <td className="px-3 text-[12px] text-[#334155]">{payBasis?.ordinaryHourlyWage.toLocaleString()}원</td>
                                    <td className="px-3 text-center">
                                        <button
                                            className="h-7 rounded-md border border-[#DCE9DF] bg-white px-2.5 text-[11px] font-semibold text-[#4D9560] hover:bg-[#F4F8F5]"
                                            onClick={() => setSelectedEmployeeId(employee.employeeId)}
                                            type="button"
                                        >
                                            편집
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {selected && (
                <PayrollCompensationDetail employee={selected} key={selected.employeeId} onClose={() => setSelectedEmployeeId(null)} />
            )}
        </section>
    );
}
