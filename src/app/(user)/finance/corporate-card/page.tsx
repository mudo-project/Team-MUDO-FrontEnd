'use client'

import { useState } from "react";
import { Send } from "lucide-react";
import FinanceCardCalendar from "@/feature/corporate-card/components/FinanceCardCalendar";
import FinanceCardMonthOverview from "@/feature/corporate-card/components/FinanceCardMonthOverview";
import FinanceCardListFilter from "@/feature/corporate-card/components/FinanceCardListFilter";
import FinanceCardList from "@/feature/corporate-card/components/FinanceCardList";
import FinanceCardDetail from "@/feature/corporate-card/components/FinanceCardDetail";
import type { FinanceCardItem } from "@/feature/corporate-card/mockData";
import { financeCardListMock, financeCardMonthSummary } from "@/feature/corporate-card/mockData";

export default function FinanceCorporateCardPage() {
    const [selectedItem, setSelectedItem] = useState<FinanceCardItem | null>(null);

    const handleClickWrite = () => {
        const firstUnwritten = financeCardListMock.find((item) => item.status === "UNWRITTEN");
        if (firstUnwritten) {
            setSelectedItem(firstUnwritten);
        }
    };

    return (
        <>
            <section
                aria-label="이달 법인카드 요약"
                className="mt-4 flex items-center justify-between overflow-hidden rounded-xl border border-[#DCE9DF] bg-white px-6 py-4"
            >
                <div className="flex items-center gap-8">
                    <div>
                        <strong className="block text-[23px] leading-none">{financeCardMonthSummary.monthlyTotalCount}건</strong>
                        <span className="mt-2 block text-[11px] text-[#718096]">이달 법인카드 내역</span>
                    </div>
                    <div>
                        <strong className="block text-[23px] leading-none text-[#2F7D46]">{financeCardMonthSummary.approvedCount}건</strong>
                        <span className="mt-2 block text-[11px] text-[#718096]">승인 완료</span>
                    </div>
                    <div>
                        <strong className="block text-[23px] leading-none text-[#B78236]">{financeCardMonthSummary.unwrittenCount}건</strong>
                        <span className="mt-2 block text-[11px] text-[#718096]">미작성</span>
                    </div>
                    <div>
                        <strong className="block text-[23px] leading-none text-[#2B6CB0]">{financeCardMonthSummary.inProgressCount}건</strong>
                        <span className="mt-2 block text-[11px] text-[#718096]">결재 중</span>
                    </div>
                </div>
                <span className="rounded-full bg-[#FAF4E9] px-3 py-1.5 text-[12px] font-semibold text-[#B78236]">
                    미작성 {financeCardMonthSummary.unwrittenCount}건 · 목적 기재 필요
                </span>
            </section>

            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <FinanceCardCalendar />
                    <button
                        className="ml-1 h-9 rounded-lg border border-[#DCE9DF] bg-white px-3 text-[12px] text-[#718096]"
                        type="button"
                    >
                        이번 달
                    </button>
                </div>
                <button
                    className="flex h-9 items-center gap-1.5 rounded-lg bg-[#CBD2DC] px-4 text-[12px] font-semibold text-white"
                    disabled
                    type="button"
                >
                    <Send className="size-3.5" />
                    결재 상신
                </button>
            </div>

            <FinanceCardMonthOverview
                approvalProgress={financeCardMonthSummary.approvalProgress}
                onClickWrite={handleClickWrite}
                totalAmount={financeCardMonthSummary.monthlyTotalAmount}
                unwrittenCount={financeCardMonthSummary.unwrittenPurposeCount}
                usageCount={financeCardMonthSummary.usageCount}
            />

            <FinanceCardListFilter />

            <FinanceCardList 
                items={financeCardListMock} 
                onSelectItem={setSelectedItem} 
            />

            <FinanceCardDetail 
                item={selectedItem} 
                onClose={() => setSelectedItem(null)} 
            />
        </>
    );
}
