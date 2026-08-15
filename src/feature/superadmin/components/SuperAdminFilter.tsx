"use client";

import { usePathname, useRouter } from "next/navigation";
import { PERIOD_OPTIONS } from "../constants";
import { AcademyData, DashboardPeriod, DashboardScope } from "../type";

interface SuperAdminFilterProps {
    academies: AcademyData[];
    academyCode?: string;
    academyListError: string;
    period: DashboardPeriod;
    scope: DashboardScope;
}

export default function SuperAdminFilter({ academies, academyCode, academyListError, period, scope }: SuperAdminFilterProps) {
    const pathname = usePathname();
    const router = useRouter();

    const replaceFilters = (nextScope: DashboardScope, nextPeriod: DashboardPeriod, nextAcademyCode?: string) => {
        const params = new URLSearchParams();
        params.set("scope", nextScope);
        params.set("period", nextPeriod);

        if (nextScope === "ACADEMY" && nextAcademyCode) {
            params.set("academyCode", nextAcademyCode);
        }

        router.replace(`${pathname}?${params.toString()}`);
    };

    const changeScope = (nextScope: DashboardScope) => {
        replaceFilters(nextScope, period, nextScope === "ACADEMY" ? academyCode ?? academies[0]?.code : undefined);
    };

    return (
        <div className="mt-4 flex items-center gap-2.5 border-b border-[#D7E8DB] pb-5">
            <select className="h-9 rounded-[8px] border border-[#D7E8DB] bg-white px-3 text-[13px] text-[#0F172A] outline-none" onChange={(event) => changeScope(event.target.value as DashboardScope)} value={scope}>
                <option value="ALL">전체 학원</option>
                <option value="ACADEMY">특정 학원</option>
            </select>
            {scope === "ACADEMY" && (
                <select
                    aria-label="학원 선택"
                    className="h-9 w-[150px] rounded-[8px] border border-[#D7E8DB] bg-white px-3 text-[13px] text-[#0F172A] outline-none"
                    disabled={academies.length === 0}
                    onChange={(event) => replaceFilters(scope, period, event.target.value)}
                    value={academyCode ?? ""}
                >
                    {academies.length === 0 && <option value="">조회된 학원 없음</option>}
                    {academies.map((academy) => (
                        <option key={academy.code} value={academy.code}>{academy.code}</option>
                    ))}
                </select>
            )}
            {academyListError && <p className="text-[12px] text-red-500" role="alert">{academyListError}</p>}
            <span className="h-5 w-px bg-[#D7E8DB]" />
            {PERIOD_OPTIONS.map((option) => (
                <button
                    className={`h-[34px] rounded-[8px] border px-3 text-[13px] ${period === option.value ? "border-[#0F172A] bg-[#0F172A] font-semibold text-white" : "border-[#D7E8DB] bg-white text-[#64748B]"}`}
                    key={option.value}
                    onClick={() => replaceFilters(scope, option.value, academyCode)}
                    type="button"
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}
