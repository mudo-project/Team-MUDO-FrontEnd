import RevenueReportDetail from "@/feature/revenue-report/components/RevenueReportDetail";

const MOCK_DETAIL = {
    targetMonth: "2026-08-01",
    report:
        "원장님, 안녕하세요! 2026년 8월 학원 재정 운용 결과를 정리해 드릴게요. 이번 달은 예상했던 매출 4,200,000원을 넘어선 4,500,000원의 실제 매출을 기록했어요. 지출 부문에서는 시설비 600,000원, 도서비 300,000원, 마케팅비 300,000원을 합쳐 총 1,200,000원이 발생했고, 이에 따라 순이익은 예상했던 3,000,000원보다 높은 3,300,000원으로 집계되었어요. 전월 대비 매출과 순이익 모두 늘어난 좋은 흐름이에요.",
    snapshot: {
        revenue: { expected: 4200000, actual: 4500000 },
        expense: {
            actual: 1200000,
            byCategory: [
                { category: "FACILITY", amount: 600000 },
                { category: "BOOK", amount: 300000 },
                { category: "MARKETING", amount: 300000 },
            ],
        },
        profit: { actual: 3300000, expected: 3000000 },
        previousMonth: {
            available: true,
            revenue: { actual: 3800000 },
            profit: { actual: 2800000 },
        },
        byLecture: [
            { lectureName: "중등 수학 심화반", teacherName: "김강사", studentCount: 12, actualRevenue: 1800000 },
            { lectureName: "고등 영어 독해반", teacherName: "이강사", studentCount: 9, actualRevenue: 1500000 },
            { lectureName: "초등 국어 논술반", teacherName: "박강사", studentCount: 8, actualRevenue: 1200000 },
        ],
        byTeacher: [
            { teacherName: "김강사", lectureCount: 2, studentCount: 18, actualRevenue: 2100000 },
            { teacherName: "이강사", lectureCount: 1, studentCount: 9, actualRevenue: 1500000 },
            { teacherName: "박강사", lectureCount: 1, studentCount: 8, actualRevenue: 900000 },
        ],
    },
};

export default async function RevenueReportDetailPage({ params }: { params: Promise<{ reportId: string }> }) {
    await params;

    return (
        <main className="h-[calc(100dvh-52px)] overflow-y-auto">
            <div className="mx-auto w-full max-w-[930px] px-5 py-6">
                <RevenueReportDetail
                    report={MOCK_DETAIL.report}
                    snapshot={MOCK_DETAIL.snapshot}
                    targetMonth={MOCK_DETAIL.targetMonth}
                />
            </div>
        </main>
    );
}
