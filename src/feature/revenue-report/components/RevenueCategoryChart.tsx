'use client'

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface RevenueCategoryChartProps {
    data: { category: string; amount: number }[];
}

const CATEGORY_LABEL: Record<string, string> = {
    BOOK: "도서비",
    FACILITY: "시설비",
};

export default function RevenueCategoryChart({ data }: RevenueCategoryChartProps) {
    const chartData = data.map((item) => ({
        label: CATEGORY_LABEL[item.category] ?? item.category,
        amount: item.amount,
    }));

    return (
        <section aria-label="지출 카테고리" className="rounded-xl border border-[#DCE9DF] bg-white p-5">
            <h2 className="text-[14px] font-semibold text-[#0F172A]">지출 카테고리</h2>

            {chartData.length === 0 ? (
                <p className="mt-3 text-[13px] text-[#94A3B8]">이번 달 지출 내역이 없어요.</p>
            ) : (
                <div className="mt-3 h-[220px] w-full">
                    <ResponsiveContainer height="100%" width="100%">
                        <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 24 }}>
                            <CartesianGrid horizontal={false} stroke="#E1EBE3" />
                            <XAxis
                                axisLine={false}
                                tick={{ fill: "#94A3B8", fontSize: 11 }}
                                tickFormatter={(value: number) => value.toLocaleString()}
                                tickLine={false}
                                type="number"
                            />
                            <YAxis
                                axisLine={false}
                                dataKey="label"
                                tick={{ fill: "#0F172A", fontSize: 12 }}
                                tickLine={false}
                                type="category"
                                width={64}
                            />
                            <Tooltip
                                cursor={{ fill: "#F7F9F7" }}
                                formatter={(value) => [`${Number(value).toLocaleString()}원`, "지출액"]}
                            />
                            <Bar barSize={22} dataKey="amount" fill="#2C8D50" radius={[0, 6, 6, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </section>
    );
}
