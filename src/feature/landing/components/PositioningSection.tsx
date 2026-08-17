import { Check } from "lucide-react";
import { POSITIONING } from "@/feature/landing/constants";

export default function PositioningSection() {
    return (
        <div className="w-full border-t border-[#F1F5F9] bg-[#FBFBF8] py-24">
            <div className="mx-auto w-full max-w-[1120px] px-6">
                <div className="max-w-[620px]">
                    <span className="text-[12px] font-semibold tracking-[0.08em] text-[#2C8D50]">
                        시장의 빈틈
                    </span>
                    <div className="mt-3 text-[30px] font-bold leading-[1.35] text-[#0F172A]">
                        학원 관리 프로그램도, 일반 그룹웨어도 아닙니다
                    </div>
                    <p className="mt-3 text-[14px] leading-[24px] text-[#64748B]">
                        학생 데이터 관리와 사내 협업을 하나로 합친 제품은 지금까지 없었습니다. 이음은 그
                        빈틈을 채웁니다.
                    </p>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
                    {POSITIONING.map((column) => (
                        <div
                            key={column.name}
                            className={`rounded-[16px] border p-6 ${column.tone} ${column.highlight ? "shadow-[0_12px_24px_rgba(44,141,80,0.12)]" : ""}`}
                        >
                            <p
                                className={`text-[15px] font-bold ${column.highlight ? "text-[#246B40]" : "text-[#0F172A]"}`}
                            >
                                {column.name}
                            </p>
                            <div className="mt-4 flex flex-col gap-2.5">
                                {column.points.map((point) => (
                                    <div key={point} className="flex items-start gap-2 text-[13px] leading-[20px] text-[#475569]">
                                        <Check
                                            className={`mt-0.5 size-3.5 shrink-0 ${column.highlight ? "text-[#2C8D50]" : "text-[#94A3B8]"}`}
                                            strokeWidth={2.5}
                                        />
                                        {point}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 rounded-[14px] border border-[#D7E8DB] bg-white px-7 py-6">
                    <p className="text-[14px] leading-[24px] text-[#0F172A]">
                        &ldquo;이음은 단순 그룹웨어가 아닌, 학원 운영 전반에 필요한 학생 관리와 직원 관리를
                        함께 해결하는 <strong>학원 전문 경량화 그룹웨어</strong>입니다.&rdquo;
                    </p>
                </div>
            </div>
        </div>
    );
}
