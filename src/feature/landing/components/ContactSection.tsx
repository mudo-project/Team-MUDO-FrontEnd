import { Building2, Mail } from "lucide-react";
import { CONTACT_EMAIL, MAILTO, ONBOARDING_STEPS } from "@/feature/landing/constants";

export default function ContactSection() {
    return (
        <div id="contact" className="w-full border-t border-[#F1F5F9] bg-[#FBFBF8] py-24">
            <div className="mx-auto w-full max-w-[1120px] px-6">
                <div className="grid grid-cols-1 gap-14 lg:grid-cols-2">
                    <div>
                        <span className="text-[12px] font-semibold tracking-[0.08em] text-[#2C8D50]">
                            도입 방법
                        </span>
                        <div className="mt-3 text-[30px] font-bold leading-[1.35] text-[#0F172A]">
                            가입이 아니라, 발급입니다
                        </div>
                        <p className="mt-3 text-[14px] leading-[24px] text-[#64748B]">
                            이음은 회원가입·소셜 로그인이 없는 내부 전용 서비스입니다. 이음이 학원 대표
                            계정을 발급하면, 대표가 하위 직원·강사·조교 계정과 권한을 직접 만들어 사용하는
                            방식입니다. 조교·실장마다 역할이 다른 학원 특성에 맞춰, 역할도 미리 정해진 값이
                            아니라 필요한 권한만 조립해 만들 수 있어요.
                        </p>

                        <div className="mt-8 flex flex-col gap-5">
                            {ONBOARDING_STEPS.map((item) => (
                                <div key={item.step} className="flex items-start gap-4">
                                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#0F172A] text-[13px] font-bold text-white">
                                        {item.step}
                                    </span>
                                    <div>
                                        <p className="text-[14px] font-bold text-[#0F172A]">{item.title}</p>
                                        <p className="mt-1 text-[13px] leading-[21px] text-[#64748B]">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col justify-center rounded-[18px] border border-[#D7E8DB] bg-white p-10">
                        <Building2 className="size-8 text-[#2C8D50]" strokeWidth={1.6} />
                        <p className="mt-4 text-[19px] font-bold text-[#0F172A]">
                            이음 도입을 고민하고 계신가요?
                        </p>
                        <p className="mt-2 text-[13.5px] leading-[22px] text-[#64748B]">
                            학원 이름과 규모, 궁금하신 점을 이메일로 보내주시면 도입 상담부터 대표 계정
                            발급까지 도와드립니다.
                        </p>
                        <a
                            href={MAILTO}
                            className="mt-6 flex h-12 items-center justify-center gap-2 rounded-[10px] bg-[#0F172A] text-[14px] font-semibold text-white"
                        >
                            <Mail className="size-4" strokeWidth={2} />
                            {CONTACT_EMAIL}
                        </a>
                        <p className="mt-3 text-center text-[12px] text-[#94A3B8]">
                            위 이메일로 문의를 남겨주시면 순차적으로 답변드립니다.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
