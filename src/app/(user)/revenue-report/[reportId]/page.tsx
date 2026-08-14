import RevenueReportDetail from "@/feature/revenue-report/components/RevenueReportDetail";
import { getRevenueReportDetailAction } from "@/feature/revenue-report/actions";

export default async function RevenueReportDetailPage({ params }: { params: Promise<{ reportId: string }> }) {
    const { reportId } = await params;

    let detail: RevenueReportDetailData;
    let snapshot: RevenueSnapshot;
    try {
        detail = await getRevenueReportDetailAction(Number(reportId));
        snapshot = JSON.parse(detail.dataSnapshot) as RevenueSnapshot;
    } catch {
        return (
            <main className="h-[calc(100dvh-52px)] overflow-y-auto">
                <div className="mx-auto w-full max-w-[930px] px-5 py-6">
                    <div className="flex h-[200px] items-center justify-center rounded-xl border border-[#DCE9DF] bg-white text-[13px] text-[#64748B]">
                        매출 리포트를 찾을 수 없습니다.
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="h-[calc(100dvh-52px)] overflow-y-auto">
            <div className="mx-auto w-full max-w-[930px] px-5 py-6">
                <RevenueReportDetail report={detail.report} snapshot={snapshot} targetMonth={detail.targetMonth} />
            </div>
        </main>
    );
}
