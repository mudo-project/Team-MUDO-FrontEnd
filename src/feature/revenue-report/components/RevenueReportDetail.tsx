import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import RevenueSummaryTiles from "./RevenueSummaryTiles";
import RevenuePreviousMonthCompare from "./RevenuePreviousMonthCompare";
import RevenueCategoryChart from "./RevenueCategoryChart";
import RevenueLectureTable from "./RevenueLectureTable";
import RevenueTeacherTable from "./RevenueTeacherTable";

interface RevenueReportDetailProps {
    targetMonth: string;
    report: string;
    snapshot: {
        revenue: { expected: number; actual: number };
        expense: { actual: number; byCategory: { category: string; amount: number }[] };
        profit: { actual: number; expected: number };
        previousMonth: { available: boolean; revenue?: { actual: number }; profit?: { actual: number } };
        byLecture: { lectureName: string; teacherName: string; studentCount: number; actualRevenue: number }[];
        byTeacher: { teacherName: string; lectureCount: number; studentCount: number; actualRevenue: number }[];
    };
}

function formatTargetMonth(targetMonth: string) {
    const [year, month] = targetMonth.split("-");
    return `${year}년 ${Number(month)}월`;
}

export default function RevenueReportDetail({ targetMonth, report, snapshot }: RevenueReportDetailProps) {
    return (
        <div className="space-y-5">
            <header className="flex items-center gap-3">
                <Link
                    aria-label="매출 리포트 목록으로 돌아가기"
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#DCE9DF] bg-white hover:bg-[#F7F9F7]"
                    href="/revenue-report"
                >
                    <ChevronLeft className="size-4 text-[#64748B]" />
                </Link>
                <h1 className="text-xl font-bold tracking-tight text-[#0F172A]">
                    {formatTargetMonth(targetMonth)} 매출 리포트
                </h1>
            </header>

            <section aria-label="AI 서술 리포트" className="rounded-xl border border-[#DCE9DF] bg-[#F7F9F7] p-5">
                <span className="rounded-full bg-[#2C8D50]/10 px-2 py-0.5 text-[11px] font-semibold text-[#2C8D50]">
                    AI 브리핑
                </span>
                <p className="mt-3 whitespace-pre-line text-[14px] leading-relaxed text-[#334155]">{report}</p>
            </section>

            <RevenueSummaryTiles
                actualProfit={snapshot.profit.actual}
                actualRevenue={snapshot.revenue.actual}
                expectedProfit={snapshot.profit.expected}
                expectedRevenue={snapshot.revenue.expected}
                expenseActual={snapshot.expense.actual}
            />

            <RevenuePreviousMonthCompare
                available={snapshot.previousMonth.available}
                currentProfit={snapshot.profit.actual}
                currentRevenue={snapshot.revenue.actual}
                previousProfit={snapshot.previousMonth.profit?.actual}
                previousRevenue={snapshot.previousMonth.revenue?.actual}
            />

            <RevenueCategoryChart data={snapshot.expense.byCategory} />

            <div className="grid grid-cols-2 gap-5">
                <RevenueLectureTable data={snapshot.byLecture} />
                <RevenueTeacherTable data={snapshot.byTeacher} />
            </div>
        </div>
    );
}
