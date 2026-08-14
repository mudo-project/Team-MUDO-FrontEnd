import FinanceCorporateCardManagement from "@/feature/corporate-card/components/FinanceCorporateCardManagement";
import { financeCardMonthSummary } from "@/feature/corporate-card/mockData";

export default function FinanceCorporateCardPage() {
    return (
        <>
            <section
                aria-label="이달 법인카드 요약"
                className="mt-4 grid min-h-[92px] grid-cols-[repeat(4,minmax(0,1fr))_minmax(230px,1.35fr)] items-center overflow-hidden rounded-xl border border-[#DCE9DF] bg-white px-5"
            >
                <div className="border-r border-[#E1EBE3] px-1">
                    <strong className="block text-[24px] leading-none">{financeCardMonthSummary.monthlyTotalCount}건</strong>
                    <span className="mt-2 block text-[11px] text-[#718096]">이달 법인카드 내역</span>
                </div>
                <div className="border-r border-[#E1EBE3] px-5">
                    <strong className="block text-[24px] leading-none text-[#4D9560]">{financeCardMonthSummary.approvedCount}건</strong>
                    <span className="mt-2 block text-[11px] text-[#718096]">승인 완료</span>
                </div>
                <div className="border-r border-[#E1EBE3] px-5">
                    <strong className="block text-[24px] leading-none text-[#B78236]">{financeCardMonthSummary.unwrittenCount}건</strong>
                    <span className="mt-2 block text-[11px] text-[#718096]">미작성</span>
                </div>
                <div className="border-r border-[#E1EBE3] px-5">
                    <strong className="block text-[24px] leading-none text-[#4D9560]">{financeCardMonthSummary.inProgressCount}건</strong>
                    <span className="mt-2 block text-[11px] text-[#718096]">결재 중</span>
                </div>
                <div className="flex justify-center px-5">
                    <span className="rounded-lg border border-[#D6A85E] bg-white px-4 py-2 text-[12px] font-semibold text-[#B78236]">
                        미작성 {financeCardMonthSummary.unwrittenCount}건 · 목적 기재 필요
                    </span>
                </div>
            </section>

            <FinanceCorporateCardManagement />
        </>
    );
}
