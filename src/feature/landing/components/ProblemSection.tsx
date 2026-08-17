import { PROBLEM_INSIGHTS, PROBLEM_QUOTES } from "@/feature/landing/constants";

export default function ProblemSection() {
    return (
        <div id="problem" className="w-full border-t border-[#F1F5F9] py-24">
            <div className="mx-auto w-full max-w-[1120px] px-6">
                <div className="max-w-[560px]">
                    <span className="text-[12px] font-semibold tracking-[0.08em] text-[#2C8D50]">WHY 이음</span>
                    <div className="mt-3 text-[30px] font-bold leading-[1.35] text-[#0F172A]">
                        학원에는 아직 &apos;사내 협업 시스템&apos;이 없습니다
                    </div>
                    <p className="mt-3 text-[14px] leading-[24px] text-[#64748B]">
                        5개 학원, 14명의 실무자 인터뷰에서 확인한 현장의 목소리입니다. 카카오톡, 스프레드시트,
                        종이 출석부로 굴러가는 업무가 실무자들의 스트레스와 학원의 생산성 저하로 이어지고
                        있었습니다.
                    </p>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
                    {PROBLEM_QUOTES.map((item) => (
                        <div key={item.role} className="rounded-[14px] border border-[#E8EDF2] bg-white p-6">
                            <p className="text-[14px] leading-[24px] text-[#0F172A]">&ldquo;{item.quote}&rdquo;</p>
                            <p className="mt-4 text-[12px] font-semibold text-[#64748B]">— {item.role}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                    {PROBLEM_INSIGHTS.map((item) => (
                        <div key={item.title} className="rounded-[14px] bg-[#F8FAFC] p-6">
                            <p className="text-[13px] font-bold text-[#0F172A]">{item.title}</p>
                            <p className="mt-2 text-[13px] leading-[21px] text-[#64748B]">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
