import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { formatTargetMonth } from "../revenueReportFormat";

interface RevenueReportListItemProps {
    reportId: number;
    targetMonth: string;
    read: boolean;
}

export default function RevenueReportListItem({ reportId, targetMonth, read }: RevenueReportListItemProps) {
    return (
        <li>
            <Link
                className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-[#F7F9F7]"
                href={`/revenue-report/${reportId}`}
            >
                <span className="flex items-center gap-2">
                    {!read && <span className="size-1.5 shrink-0 rounded-full bg-[#2C8D50]" aria-hidden />}
                    <strong className="text-[14px] font-semibold text-[#0F172A]">
                        {formatTargetMonth(targetMonth)} 매출 리포트
                    </strong>
                </span>
                <span className="flex items-center gap-2">
                    {!read && (
                        <span className="rounded-full bg-[#2C8D50]/10 px-2 py-0.5 text-[11px] font-medium text-[#2C8D50]">
                            안읽음
                        </span>
                    )}
                    <ChevronRight className="size-4 text-[#94A3B8]" />
                </span>
            </Link>
        </li>
    );
}
