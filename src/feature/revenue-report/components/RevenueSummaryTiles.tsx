interface RevenueSummaryTilesProps {
    expectedRevenue: number;
    actualRevenue: number;
    expenseActual: number;
    expectedProfit: number;
    actualProfit: number;
}

export default function RevenueSummaryTiles({
    expectedRevenue,
    actualRevenue,
    expenseActual,
    expectedProfit,
    actualProfit,
}: RevenueSummaryTilesProps) {
    return (
        <section
            aria-label="매출 요약"
            className="grid grid-cols-4 overflow-hidden rounded-xl border border-[#DCE9DF] bg-white"
        >
            <div className="flex flex-col justify-center gap-1 border-r border-[#E1EBE3] px-5 py-4">
                <span className="text-[11px] text-[#718096]">예상 매출</span>
                <strong className="text-[20px] leading-none text-[#64748B]">
                    {expectedRevenue.toLocaleString()}<span className="text-[12px]"> 원</span>
                </strong>
            </div>
            <div className="flex flex-col justify-center gap-1 border-r border-[#E1EBE3] px-5 py-4">
                <span className="text-[11px] text-[#718096]">실제 매출</span>
                <strong className="text-[22px] leading-none text-[#0F172A]">
                    {actualRevenue.toLocaleString()}<span className="text-[12px]"> 원</span>
                </strong>
            </div>
            <div className="flex flex-col justify-center gap-1 border-r border-[#E1EBE3] px-5 py-4">
                <span className="text-[11px] text-[#718096]">지출</span>
                <strong className="text-[22px] leading-none text-[#C0392B]">
                    {expenseActual.toLocaleString()}<span className="text-[12px]"> 원</span>
                </strong>
            </div>
            <div className="flex flex-col justify-center gap-1 px-5 py-4">
                <span className="text-[11px] text-[#718096]">순이익 (예상 {expectedProfit.toLocaleString()}원)</span>
                <strong className="text-[22px] leading-none text-[#2F7D46]">
                    {actualProfit.toLocaleString()}<span className="text-[12px]"> 원</span>
                </strong>
            </div>
        </section>
    );
}
