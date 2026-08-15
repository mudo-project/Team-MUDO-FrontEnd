interface PayrollAmountSummaryProps {
    summary: PayrollMonthSummaryData;
}

export default function PayrollAmountSummary({ summary }: PayrollAmountSummaryProps) {
    return (
        <section
            aria-label="이번달 지급액 정보"
            className="mt-5 grid min-h-[92px] grid-cols-4 overflow-hidden rounded-xl border border-[#DCE9DF] bg-white"
        >
            <div className="flex flex-col justify-center border-r border-[#E1EBE3] px-5">
                <span className="text-[11px] text-[#718096]">총 지급액</span>
                <strong className="mt-1 block text-[28px] leading-none tracking-[-0.04em]">
                    {summary.totalEarnings.toLocaleString()} <span className="text-[13px]">원</span>
                </strong>
            </div>
            <div className="flex flex-col justify-center border-r border-[#E1EBE3] px-5">
                <span className="text-[11px] text-[#718096]">총 공제액</span>
                <strong className="mt-1 block text-[28px] leading-none tracking-[-0.04em] text-[#C0392B]">
                    -{summary.totalDeductions.toLocaleString()} <span className="text-[13px]">원</span>
                </strong>
            </div>
            <div className="flex flex-col justify-center border-r border-[#E1EBE3] px-5">
                <span className="text-[11px] text-[#718096]">차인지급 예정액</span>
                <strong className="mt-1 block text-[28px] leading-none tracking-[-0.04em]">
                    {summary.totalNetPay.toLocaleString()} <span className="text-[13px]">원</span>
                </strong>
            </div>
            <div className="flex flex-col justify-center px-5">
                <span className="text-[11px] text-[#718096]">확정 현황</span>
                <strong className="mt-1 block text-[20px] leading-none">
                    {summary.confirmedCount}<span className="text-[13px] text-[#94A3B8]"> / {summary.targetEmployeeCount}명</span>
                </strong>
            </div>
        </section>
    );
}
