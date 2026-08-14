import { ChevronRight } from "lucide-react";

interface FinanceCardMonthOverviewProps {
    totalAmount: number;
    usageCount: number;
    unwrittenCount: number;
    approvalProgress: { pending: number; inProgress: number; approved: number; rejected: number };
    onClickWrite: () => void;
}

export default function FinanceCardMonthOverview({
    totalAmount,
    usageCount,
    unwrittenCount,
    approvalProgress,
    onClickWrite,
}: FinanceCardMonthOverviewProps) {
    return (
        <section
            aria-label="이번 달 법인카드 정보"
            className="mt-4 grid grid-cols-4 overflow-hidden rounded-xl border border-[#DCE9DF] bg-white"
        >
            <div className="border-r border-[#E1EBE3] p-5">
                <span className="text-[11px] text-[#718096]">이번 달 사용액</span>
                <strong className="mt-1 block text-[23px] leading-none tracking-[-0.04em]">
                    {totalAmount.toLocaleString()} 원
                </strong>
            </div>
            <div className="border-r border-[#E1EBE3] p-5">
                <span className="text-[11px] text-[#718096]">사용 건수</span>
                <strong className="mt-1 block text-[23px] leading-none">{usageCount}건</strong>
            </div>
            <div className="border-r border-[#E1EBE3] p-5">
                <span className="text-[11px] text-[#718096]">사용목적 미작성</span>
                <button
                    className="mt-1 flex items-center gap-0.5 text-[23px] font-bold leading-none text-[#B78236]"
                    onClick={onClickWrite}
                    type="button"
                >
                    {unwrittenCount}건
                    <span className="ml-1.5 flex items-center text-[12px] font-medium text-[#94A3B8]">
                        작성하기 <ChevronRight className="size-3.5" />
                    </span>
                </button>
            </div>
            <div className="p-5">
                <span className="text-[11px] text-[#718096]">결재 진행</span>
                <p className="mt-1.5 flex items-center gap-2 text-[12px] text-[#718096]">
                    <span className="flex items-center gap-1">
                        <span className="size-1.5 rounded-full bg-[#64748B]" />대기 {approvalProgress.pending}
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="size-1.5 rounded-full bg-[#2B6CB0]" />결재중 {approvalProgress.inProgress}
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="size-1.5 rounded-full bg-[#2F7D46]" />승인 {approvalProgress.approved}
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="size-1.5 rounded-full bg-[#C0392B]" />반려 {approvalProgress.rejected}
                    </span>
                </p>
            </div>
        </section>
    );
}
