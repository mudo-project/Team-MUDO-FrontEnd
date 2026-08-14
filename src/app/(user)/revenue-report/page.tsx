import RevenueReportList from "@/feature/revenue-report/components/RevenueReportList";
import { getRevenueReportListAction } from "@/feature/revenue-report/actions";

export default async function RevenueReportPage() {
    let reports: RevenueReportListItemData[] = [];
    let loadError = false;
    try {
        reports = await getRevenueReportListAction();
    } catch {
        loadError = true;
    }

    return (
        <main className="h-[calc(100dvh-52px)] overflow-y-auto">
            <div className="mx-auto w-full max-w-[930px] px-5 py-6">
                <header>
                    <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">AI 매출 브리핑</h1>
                    <p className="mt-1 text-[13px] text-[#64748B]">
                        AI가 매달 정리한 학원 매출·지출 리포트를 확인하세요.
                    </p>
                </header>

                <section aria-label="매출 리포트 목록" className="mt-5">
                    {loadError ? (
                        <div className="flex h-[200px] items-center justify-center rounded-xl border border-[#DCE9DF] bg-white text-[13px] text-[#64748B]">
                            매출 리포트 목록을 불러오지 못했습니다.
                        </div>
                    ) : (
                        <RevenueReportList reports={reports} />
                    )}
                </section>
            </div>
        </main>
    );
}
