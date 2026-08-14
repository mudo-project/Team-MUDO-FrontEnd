import RevenueReportListItem from "./RevenueReportListItem";

interface RevenueReportListProps {
    reports: { reportId: number; targetMonth: string; read: boolean }[];
}

export default function RevenueReportList({ reports }: RevenueReportListProps) {
    if (reports.length === 0) {
        return (
            <div className="flex h-[200px] flex-col items-center justify-center gap-1 rounded-xl border border-[#DCE9DF] bg-white text-[13px] text-[#64748B]">
                <p>아직 생성된 매출 리포트가 없어요.</p>
                <p className="text-[12px] text-[#94A3B8]">매달 1일에 AI가 지난 달 매출 리포트를 생성해요.</p>
            </div>
        );
    }

    return (
        <ul className="divide-y divide-[#E1EBE3] overflow-hidden rounded-xl border border-[#DCE9DF] bg-white">
            {reports.map((report) => (
                <RevenueReportListItem key={report.reportId} {...report} />
            ))}
        </ul>
    );
}
