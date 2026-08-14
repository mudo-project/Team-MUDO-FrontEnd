import { getCorporateCardTransactionsAction } from "@/feature/corporate-card/actions";
import FinanceCorporateCardManagement from "@/feature/corporate-card/components/FinanceCorporateCardManagement";

export default async function FinanceCorporateCardPage() {
    const { content, totalElements } = await getCorporateCardTransactionsAction({ size: 100 });

    const approvedCount = content.filter((item) => item.status === "APPROVED").length;
    const unwrittenCount = content.filter((item) => item.status === "UNWRITTEN").length;
    const inProgressCount = content.filter((item) => item.status === "IN_PROGRESS").length;
    const rejectedCount = content.filter((item) => item.status === "REJECTED").length;
    const totalAmount = content.reduce((sum, item) => sum + item.amount, 0);

    return (
        <>
            <section
                aria-label="이달 법인카드 요약"
                className="mt-4 grid min-h-[92px] grid-cols-[repeat(4,minmax(0,1fr))_minmax(230px,1.35fr)] items-center overflow-hidden rounded-xl border border-[#DCE9DF] bg-white px-5"
            >
                <div className="border-r border-[#E1EBE3] px-1">
                    <strong className="block text-[24px] leading-none">{totalElements}건</strong>
                    <span className="mt-2 block text-[11px] text-[#718096]">이달 법인카드 내역</span>
                </div>
                <div className="border-r border-[#E1EBE3] px-5">
                    <strong className="block text-[24px] leading-none text-[#4D9560]">{approvedCount}건</strong>
                    <span className="mt-2 block text-[11px] text-[#718096]">승인 완료</span>
                </div>
                <div className="border-r border-[#E1EBE3] px-5">
                    <strong className="block text-[24px] leading-none text-[#B78236]">{unwrittenCount}건</strong>
                    <span className="mt-2 block text-[11px] text-[#718096]">미작성</span>
                </div>
                <div className="border-r border-[#E1EBE3] px-5">
                    <strong className="block text-[24px] leading-none text-[#4D9560]">{inProgressCount}건</strong>
                    <span className="mt-2 block text-[11px] text-[#718096]">결재 중</span>
                </div>
                <div className="flex justify-center px-5">
                    <span className="rounded-lg border border-[#D6A85E] bg-white px-4 py-2 text-[12px] font-semibold text-[#B78236]">
                        미작성 {unwrittenCount}건 · 목적 기재 필요
                    </span>
                </div>
            </section>

            <FinanceCorporateCardManagement
                summary={{
                    totalCount: totalElements,
                    approvedCount,
                    unwrittenCount,
                    inProgressCount,
                    rejectedCount,
                    totalAmount,
                }}
                transactions={content}
            />
        </>
    );
}
