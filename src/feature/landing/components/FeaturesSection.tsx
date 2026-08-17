import { FEATURE_PILLARS } from "@/feature/landing/constants";

export default function FeaturesSection() {
    return (
        <section id="features" className="w-full border-t border-[#F1F5F9] py-24">
            <div className="mx-auto w-full max-w-[1120px] px-6">
                <div className="max-w-[560px]">
                    <span className="text-[12px] font-semibold tracking-[0.08em] text-[#2C8D50]">핵심 기능</span>
                    <h2 className="mt-3 text-[30px] font-bold leading-[1.35] text-[#0F172A]">
                        독립된 기능이 아닌, 업무 흐름이 이어지는 그룹웨어
                    </h2>
                    <p className="mt-3 text-[14px] leading-[24px] text-[#64748B]">
                        운영, 조직, 협업, 경영이 연결된 업무 자동화. 학원 운영에 필요한 4가지 영역을 하나의
                        워크스페이스에 담았습니다.
                    </p>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {FEATURE_PILLARS.map((pillar) => (
                        <div key={pillar.title} className="rounded-[16px] border border-[#E8EDF2] bg-white p-6">
                            <div className="flex size-10 items-center justify-center rounded-[10px] bg-[#EAF5EE] text-[#246B40]">
                                <pillar.icon className="size-5" strokeWidth={1.8} />
                            </div>
                            <p className="mt-4 text-[16px] font-bold text-[#0F172A]">{pillar.title}</p>
                            <p className="mt-1.5 text-[12.5px] leading-[19px] text-[#64748B]">{pillar.description}</p>
                            <ul className="mt-4 flex flex-col gap-2 border-t border-[#F1F5F9] pt-4">
                                {pillar.items.map((item) => (
                                    <li key={item} className="text-[12.5px] leading-[19px] text-[#334155]">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
