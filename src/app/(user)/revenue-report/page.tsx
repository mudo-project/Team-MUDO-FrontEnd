import RevenueReportList from "@/feature/revenue-report/components/RevenueReportList";

const MOCK_REPORTS = [
    { reportId: 3, targetMonth: "2026-08-01", read: false },
    { reportId: 2, targetMonth: "2026-07-01", read: true },
    { reportId: 1, targetMonth: "2026-06-01", read: true },
];

export default function RevenueReportPage() {
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
                    <RevenueReportList reports={MOCK_REPORTS} />
                </section>
            </div>
        </main>
    );
}
