'use client'

import "chart.js/auto";
import { Bar } from "react-chartjs-2";

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
                <div className="mt-3 h-[220px] w-full" data-testid="bar-chart">
                    <Bar
                        data={{
                            labels: chartData.map((item) => item.label),
                            datasets: [
                                {
                                    data: chartData.map((item) => item.amount),
                                    backgroundColor: "#2C8D50",
                                    borderRadius: 6,
                                    barThickness: 22,
                                },
                            ],
                        }}
                        options={{
                            indexAxis: "y",
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { display: false },
                                tooltip: {
                                    callbacks: {
                                        label: (context) => `지출액: ${Number(context.parsed.x).toLocaleString()}원`,
                                    },
                                },
                            },
                            scales: {
                                x: {
                                    grid: { color: "#E1EBE3" },
                                    ticks: {
                                        color: "#94A3B8",
                                        font: { size: 11 },
                                        callback: (value) => Number(value).toLocaleString(),
                                    },
                                },
                                y: {
                                    grid: { display: false },
                                    ticks: { color: "#0F172A", font: { size: 12 } },
                                },
                            },
                        }}
                    />
                </div>
            )}
        </section>
    );
}
