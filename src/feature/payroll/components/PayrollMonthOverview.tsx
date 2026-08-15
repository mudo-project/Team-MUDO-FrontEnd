interface PayrollMonthOverviewProps {
    summary: PayrollMonthSummaryData;
}

export default function PayrollMonthOverview({ summary }: PayrollMonthOverviewProps) {
    const confirmedRatio = summary.targetEmployeeCount > 0
        ? Math.round((summary.confirmedCount / summary.targetEmployeeCount) * 100)
        : 0;

    return (
        <section
            aria-label="이번달 급여 정보"
            className="mt-4 grid min-h-[92px] grid-cols-5 overflow-hidden rounded-xl border border-[#DCE9DF] bg-white"
        >
            <div className="flex flex-col justify-center border-r border-[#E1EBE3] px-5">
                <span className="text-[11px] text-[#718096]">급여 대상</span>
                <strong className="mt-2 block text-[24px] leading-none">{summary.targetEmployeeCount}명</strong>
            </div>
            <div className="flex flex-col justify-center border-r border-[#E1EBE3] px-5">
                <span className="text-[11px] text-[#718096]">미작성</span>
                <strong className="mt-2 block text-[24px] leading-none text-[#64748B]">{summary.notCreatedCount}명</strong>
            </div>
            <div className="flex flex-col justify-center border-r border-[#E1EBE3] px-5">
                <span className="text-[11px] text-[#718096]">작성 중</span>
                <strong className="mt-2 block text-[24px] leading-none text-[#B78236]">{summary.draftCount}명</strong>
            </div>
            <div className="flex flex-col justify-center border-r border-[#E1EBE3] px-5">
                <span className="text-[11px] text-[#718096]">검토 필요</span>
                <strong className="mt-2 block text-[24px] leading-none text-[#2B6CB0]">{summary.calculatedCount}명</strong>
            </div>
            <div className="flex flex-col justify-center px-5">
                <span className="text-[11px] text-[#718096]">확정 완료</span>
                <strong className="mt-2 block text-[24px] leading-none text-[#4D9560]">{summary.confirmedCount}명</strong>
                <div className="mt-2 h-1.5 w-full rounded-full bg-[#E1EBE3]">
                    <div className="h-full rounded-full bg-[#4D9560]" style={{ width: `${confirmedRatio}%` }} />
                </div>
                <span className="mt-1 block text-[11px] text-[#4D9560]">{confirmedRatio}% 확정</span>
            </div>
        </section>
    );
}
