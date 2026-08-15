import {
    getAcademyApiCallFrequencyAction,
    getAcademyListAction,
    getOperationalMetricsAction,
} from "@/feature/superadmin/actions";
import AcademyComparison from "@/feature/superadmin/components/AcademyComparison";
import AcademyDetail from "@/feature/superadmin/components/AcademyDetail";
import ApiCallDistribution from "@/feature/superadmin/components/ApiCallDistribution";
import HostResourceCard from "@/feature/superadmin/components/HostResourceCard";
import MetricCard from "@/feature/superadmin/components/MetricCard";
import RdsUsageCard from "@/feature/superadmin/components/RdsUsageCard";
import SectionError from "@/feature/superadmin/components/SectionError";
import SuperAdminFilter from "@/feature/superadmin/components/SuperAdminFilter";
import SuperAdminRefreshButton from "@/feature/superadmin/components/SuperAdminRefreshButton";

interface SuperAdminProps {
    searchParams: Promise<{
        scope: 'ACADEMY' | 'ALL';
        period: 'LAST_HOUR' | 'TODAY' | 'LAST_24_HOURS';
        academyCode?: string;
    }>
}

export default async function Page({ searchParams }: SuperAdminProps) {
    const { scope = 'ALL', period = 'LAST_HOUR', academyCode } = await searchParams;
    const academyListResponse = await getAcademyListAction();
    const academies = academyListResponse.data ?? [];

    const selectedAcademyCode = scope === "ACADEMY"
        ? academyCode ?? academies[0]?.code
        : undefined;
    const isAcademyScope = scope === "ACADEMY";
    const dashboardQuery = { scope, period, academyCode: selectedAcademyCode };
    const [operationalMetricsResponse, apiCallFrequencyResponse] = await Promise.all([
        getOperationalMetricsAction(dashboardQuery),
        getAcademyApiCallFrequencyAction(dashboardQuery),
    ]);
    const operationalMetrics = operationalMetricsResponse.data;

    return (
        <main className="h-screen overflow-y-auto bg-[#FCFCFC] p-8">
            <div className="mx-auto min-w-[1100px] bg-[#F5F7F5] px-10 pt-6 pb-10">
                <header className="flex items-start">
                    <div>
                        <h1 className="text-[20px] leading-[30px] font-bold text-[#0F172A]">슈퍼 어드민 대시보드</h1>
                        <p className="mt-[3px] text-[13px] leading-[19.5px] text-[#64748B]">전체 학원의 서비스 운영 상태와 자원 사용량을 확인합니다.</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2.5">
                        <SuperAdminRefreshButton />
                    </div>
                </header>

                <SuperAdminFilter
                    academies={academies}
                    academyCode={selectedAcademyCode}
                    academyListError={academyListResponse.success ? "" : academyListResponse.message}
                    period={period}
                    scope={scope}
                />

                {!operationalMetrics && (
                    <div className="mt-5">
                        <SectionError message={operationalMetricsResponse.message} />
                    </div>
                )}

                {operationalMetrics && (
                    <>
                        <div className="mt-5 grid grid-cols-4 gap-3">
                            <MetricCard label="P95 응답 시간" unit="ms" value={operationalMetrics.p95ResponseMilliseconds.toFixed(1)} />
                            <MetricCard label="오류율" unit="%" value={operationalMetrics.errorRatePercent.toFixed(1)} />
                            <MetricCard label="RDS 연결 사용량" unit="연결" value={`${operationalMetrics.rdsConnectionBudget.current.toLocaleString()} / ${operationalMetrics.rdsConnectionBudget.safeBudget.toLocaleString()}`} />
                            <RdsUsageCard value={operationalMetrics.rdsConnectionBudget.usedPercent} />
                        </div>

                        <ApiCallDistribution metrics={operationalMetrics.apiCallMetrics} />
                    </>
                )}

                <AcademyComparison
                    errorMessage={apiCallFrequencyResponse.success ? "" : apiCallFrequencyResponse.message}
                    rows={apiCallFrequencyResponse.data ?? []}
                />

                {operationalMetrics && (
                    <section className="mt-3 rounded-[12px] border border-[#D7E8DB] bg-white px-[22px] py-5">
                        <h2 className="text-[12px] font-semibold text-[#0F172A]">ECS 호스트 여유 자원</h2>
                        <div className="mt-3 space-y-2">
                            {operationalMetrics.ecsHostHeadrooms.map((host) => <HostResourceCard host={host} key={`${host.cluster}-${host.hostId}`} />)}
                            {operationalMetrics.ecsHostHeadrooms.length === 0 && (
                                <p className="text-[12px] text-[#94A3B8]">조회된 ECS 호스트가 없습니다.</p>
                            )}
                        </div>
                    </section>
                )}

                {isAcademyScope && selectedAcademyCode && (
                    <div className="mt-5">
                        <AcademyDetail academyCode={selectedAcademyCode} />
                    </div>
                )}
            </div>
        </main>
    );
}
