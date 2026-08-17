import { METRICS, SPECIAL_FEATURES } from "@/feature/landing/constants";

export default function SpecialFeaturesSection() {
    return (
        <div id="special" className="w-full border-t border-[#F1F5F9] bg-[#0F172A] py-24">
            <div className="mx-auto w-full max-w-[1120px] px-6">
                <div className="max-w-[560px]">
                    <span className="text-[12px] font-semibold tracking-[0.08em] text-[#8FD1A8]">
                        특별 제공 기능
                    </span>
                    <div className="mt-3 text-[30px] font-bold leading-[1.35] text-white">
                        이음만 할 수 있는 일
                    </div>
                    <p className="mt-3 text-[14px] leading-[24px] text-[#94A3B8]">
                        다른 학원 관리 프로그램에는 없는, 이음만의 자동화 기능입니다.
                    </p>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
                    {SPECIAL_FEATURES.map((feature) => (
                        <div
                            key={feature.title}
                            className="rounded-[16px] border border-white/10 bg-white/5 p-6"
                        >
                            <div className="flex size-10 items-center justify-center rounded-[10px] bg-white/10 text-[#8FD1A8]">
                                <feature.icon className="size-5" strokeWidth={1.8} />
                            </div>
                            <p className="mt-4 text-[15px] font-bold text-white">{feature.title}</p>
                            <p className="mt-2 text-[13px] leading-[21px] text-[#94A3B8]">{feature.description}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-10 grid grid-cols-1 gap-4 border-t border-white/10 pt-10 sm:grid-cols-3">
                    {METRICS.map((metric) => (
                        <div key={metric.label}>
                            <p className="text-[30px] font-bold text-white">{metric.value}</p>
                            <p className="mt-1 text-[12.5px] text-[#94A3B8]">{metric.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
