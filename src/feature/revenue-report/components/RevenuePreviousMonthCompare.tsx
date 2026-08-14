interface RevenuePreviousMonthCompareProps {
    available: boolean;
    currentRevenue: number;
    currentProfit: number;
    previousRevenue?: number;
    previousProfit?: number;
}

interface CompareRowProps {
    label: string;
    current: number;
    previous: number;
}

function CompareRow({ label, current, previous }: CompareRowProps) {
    const changeRate = previous === 0 ? 0 : Math.round(((current - previous) / previous) * 1000) / 10;
    const isIncrease = changeRate > 0;
    const isDecrease = changeRate < 0;
    const max = Math.max(current, previous, 1);

    return (
        <div>
            <div className="flex items-center justify-between">
                <span className="text-[12px] text-[#718096]">{label}</span>
                <span
                    className={`text-[12px] font-semibold ${isIncrease ? "text-[#2F7D46]" : isDecrease ? "text-[#C0392B]" : "text-[#718096]"
                        }`}
                >
                    {isIncrease && "▲"}
                    {isDecrease && "▼"}
                    {changeRate === 0 ? "변동 없음" : `${Math.abs(changeRate)}%`}
                </span>
            </div>
            <div className="mt-2 space-y-1.5">
                <div className="flex items-center gap-2">
                    <span className="w-9 shrink-0 text-[11px] text-[#94A3B8]">이번달</span>
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-[#EEF3F0]">
                        <span
                            className="block h-full rounded-full bg-[#2C8D50]"
                            style={{ width: `${(current / max) * 100}%` }}
                        />
                    </span>
                    <span className="w-24 shrink-0 text-right text-[11px] text-[#0F172A]">
                        {current.toLocaleString()}원
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-9 shrink-0 text-[11px] text-[#94A3B8]">전월</span>
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-[#EEF3F0]">
                        <span
                            className="block h-full rounded-full bg-[#CBD5E1]"
                            style={{ width: `${(previous / max) * 100}%` }}
                        />
                    </span>
                    <span className="w-24 shrink-0 text-right text-[11px] text-[#64748B]">
                        {previous.toLocaleString()}원
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function RevenuePreviousMonthCompare({
    available,
    currentRevenue,
    currentProfit,
    previousRevenue,
    previousProfit,
}: RevenuePreviousMonthCompareProps) {
    return (
        <section aria-label="전월 대비" className="rounded-xl border border-[#DCE9DF] bg-white p-5">
            <h2 className="text-[14px] font-semibold text-[#0F172A]">전월 대비</h2>

            {available && previousRevenue !== undefined && previousProfit !== undefined ? (
                <div className="mt-4 grid grid-cols-2 gap-6">
                    <CompareRow label="매출" current={currentRevenue} previous={previousRevenue} />
                    <CompareRow label="순이익" current={currentProfit} previous={previousProfit} />
                </div>
            ) : (
                <p className="mt-3 text-[13px] text-[#94A3B8]">비교할 전월 데이터가 없어요.</p>
            )}
        </section>
    );
}
