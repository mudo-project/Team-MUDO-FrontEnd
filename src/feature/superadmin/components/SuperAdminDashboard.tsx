import { RefreshCw } from "lucide-react";
import { HOSTS } from "../constants";
import { DashboardPeriod, DashboardScope } from "../type";
import AcademyComparison from "./AcademyComparison";
import AcademyDetail from "./AcademyDetail";
import ApiCallDistribution from "./ApiCallDistribution";
import HostResourceCard from "./HostResourceCard";
import MetricCard from "./MetricCard";
import RdsUsageCard from "./RdsUsageCard";
import SuperAdminFilter from "./SuperAdminFilter";

interface SuperAdminDashboardProps {
    academyCode?: string;
    period: DashboardPeriod;
    scope: DashboardScope;
}

export default function SuperAdminDashboard({ academyCode, period, scope }: SuperAdminDashboardProps) {
    const isAcademyScope = scope === "ACADEMY";

    return (
        <main className="h-screen overflow-y-auto bg-[#FCFCFC] p-8">
            <div className="mx-auto min-w-[1100px] bg-[#F5F7F5] px-10 pt-6 pb-10">
                <header className="flex items-start">
                    <div>
                        <h1 className="text-[20px] leading-[30px] font-bold text-[#0F172A]">슈퍼 어드민 대시보드</h1>
                        <p className="mt-[3px] text-[13px] leading-[19.5px] text-[#64748B]">전체 학원의 서비스 운영 상태와 자원 사용량을 확인합니다.</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2.5">
                        <span className="text-[12px] text-[#94A3B8]">마지막 조회 2026.08.16 00:{isAcademyScope ? "37" : "36"}</span>
                        <button className="flex h-[34px] items-center gap-1.5 rounded-[8px] border border-[#D7E8DB] bg-white px-3.5 text-[13px] text-[#0F172A]" type="button">
                            <RefreshCw className="size-3.5" strokeWidth={1.5} />
                            새로고침
                        </button>
                    </div>
                </header>

                <SuperAdminFilter academyCode={academyCode} period={period} scope={scope} />

                <div className="mt-5 grid grid-cols-4 gap-3">
                    <MetricCard label="P95 응답 시간" unit="ms" value={isAcademyScope ? "98.7" : "143.2"} />
                    <MetricCard label="오류율" unit="%" value={isAcademyScope ? "0.4" : "1.8"} />
                    <MetricCard label="RDS 연결 사용량" unit="연결" value={isAcademyScope ? "9 / 100" : "34 / 100"} />
                    <RdsUsageCard value={isAcademyScope ? 9 : 34} />
                </div>

                <ApiCallDistribution scope={scope} />

                <AcademyComparison academyCode={academyCode} scope={scope} />

                <section className="mt-3 rounded-[12px] border border-[#D7E8DB] bg-white px-[22px] py-5">
                    <h2 className="text-[12px] font-semibold text-[#0F172A]">ECS 호스트 여유 자원</h2>
                    <div className="mt-3 space-y-2">
                        {HOSTS.map((host, index) => <HostResourceCard host={host} index={index} key={host.hostId} />)}
                    </div>
                </section>

                {isAcademyScope && academyCode && <div className="mt-5"><AcademyDetail academyCode={academyCode} /></div>}
            </div>
        </main>
    );
}
