import { MAILTO, PRICING_PLANS } from "@/feature/landing/constants";

export default function PricingSection() {
    return (
        <div id="pricing" className="w-full border-t border-[#F1F5F9] py-24">
            <div className="mx-auto w-full max-w-[1120px] px-6">
                <div className="max-w-[560px]">
                    <span className="text-[12px] font-semibold tracking-[0.08em] text-[#2C8D50]">요금제</span>
                    <div className="mt-3 text-[30px] font-bold leading-[1.35] text-[#0F172A]">
                        학원 규모에 맞게, 부담 없이
                    </div>
                    <p className="mt-3 text-[14px] leading-[24px] text-[#64748B]">
                        회원가입이 아닌 도입 문의로 시작합니다. 학원 규모에 맞는 플랜을 함께 정해드려요.
                    </p>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
                    {PRICING_PLANS.map((plan) => (
                        <div
                            key={plan.name}
                            className={`rounded-[18px] border p-8 ${
                                plan.highlight
                                    ? "border-[#2C8D50] bg-[#F3F9F5] shadow-[0_16px_32px_rgba(44,141,80,0.12)]"
                                    : "border-[#E2E8F0] bg-white"
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-[16px] font-bold text-[#0F172A]">{plan.name}</p>
                                {plan.highlight && (
                                    <span className="rounded-full bg-[#2C8D50] px-2.5 py-1 text-[11px] font-semibold text-white">
                                        규모 있는 학원 추천
                                    </span>
                                )}
                            </div>
                            <p className="mt-4 text-[26px] font-bold text-[#0F172A]">{plan.price}</p>
                            <p className="mt-1 text-[12.5px] text-[#64748B]">{plan.priceNote}</p>

                            <div className="mt-6 flex flex-col divide-y divide-[#F1F5F9] border-t border-[#F1F5F9]">
                                {plan.rows.map(([label, value]) => (
                                    <div key={label} className="flex items-center justify-between py-2.5 text-[13px]">
                                        <span className="text-[#64748B]">{label}</span>
                                        <span className="font-semibold text-[#0F172A]">{value}</span>
                                    </div>
                                ))}
                            </div>

                            <a
                                href={MAILTO}
                                className={`mt-7 flex h-11 w-full items-center justify-center rounded-[9px] text-[13px] font-semibold ${
                                    plan.highlight ? "bg-[#0F172A] text-white" : "border border-[#D7E8DB] bg-white text-[#0F172A]"
                                }`}
                            >
                                이 플랜으로 문의하기
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
