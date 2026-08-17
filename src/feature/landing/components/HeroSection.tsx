import { Mail } from "lucide-react";
import { MAILTO } from "@/feature/landing/constants";

const PREVIEW_MEMBERS = [
    { name: "김지은", role: "강사", status: "출근" },
    { name: "박서준", role: "조교", status: "출근" },
    { name: "이하늘", role: "행정", status: "휴가" },
];

export default function HeroSection() {
    return (
        <div className="w-full bg-[#FBFBF8]">
            <div className="mx-auto grid w-full max-w-[1120px] grid-cols-1 items-center gap-14 px-6 py-24 lg:grid-cols-2 lg:py-28">
                <div>
                    <span className="inline-flex items-center rounded-full bg-[#EAF5EE] px-3 py-1 text-[12px] font-semibold text-[#246B40]">
                        학원 전문 경량화 그룹웨어
                    </span>
                    <div className="mt-5 text-[38px] leading-[1.25] font-bold tracking-tight text-[#0F172A] lg:text-[46px]">
                        학원의 흩어진 업무를,
                        <br />
                        하나의 흐름으로 잇다
                    </div>
                    <p className="mt-5 text-[15px] leading-[26px] text-[#64748B]">
                        카카오톡으로 새는 공지, 엑셀에 흩어진 학생 기록, 여러 시스템을 오가는 결재까지.
                        이음은 학생 데이터 관리와 사내 그룹웨어를 하나로 합쳐, 학원 운영에 실제로 필요한
                        업무만 담았습니다.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        <a
                            href={MAILTO}
                            className="flex h-12 items-center gap-2 rounded-[10px] bg-[#0F172A] px-6 text-[14px] font-semibold text-white"
                        >
                            <Mail className="size-4" strokeWidth={2} />
                            이메일로 도입 문의하기
                        </a>

                    </div>
                    <p className="mt-4 text-[12px] text-[#94A3B8]">
                        회원가입 없이, 대표 계정 발급으로 바로 시작합니다.
                    </p>
                </div>

                <div className="relative">
                    <div className="overflow-hidden rounded-[16px] border border-[#E2E8F0] bg-white shadow-[0_20px_40px_rgba(15,23,42,0.08)]">
                        <div className="flex items-center gap-1.5 border-b border-[#F1F5F9] bg-[#FAFBFC] px-4 py-3">
                            <span className="size-2.5 rounded-full bg-[#F1C0C0]" />
                            <span className="size-2.5 rounded-full bg-[#F3DFAE]" />
                            <span className="size-2.5 rounded-full bg-[#B7E9C8]" />
                            <span className="ml-3 text-[11px] text-[#94A3B8]">app.ieum.io/members</span>
                        </div>
                        <div className="p-5">
                            <div className="grid grid-cols-3 gap-3">
                                <div className="rounded-[10px] border border-[#D7E8DB] bg-[#F8FAFC] p-3">
                                    <p className="text-[10px] text-[#94A3B8]">이번 달 매출</p>
                                    <p className="mt-1 text-[15px] font-bold text-[#0F172A]">1,775,000원</p>
                                </div>
                                <div className="rounded-[10px] border border-[#D7E8DB] bg-[#F8FAFC] p-3">
                                    <p className="text-[10px] text-[#94A3B8]">진행중 결재</p>
                                    <p className="mt-1 text-[15px] font-bold text-[#0F172A]">6건</p>
                                </div>
                                <div className="rounded-[10px] border border-[#D7E8DB] bg-[#F8FAFC] p-3">
                                    <p className="text-[10px] text-[#94A3B8]">오늘 출근</p>
                                    <p className="mt-1 text-[15px] font-bold text-[#0F172A]">18명</p>
                                </div>
                            </div>

                            <div className="mt-4 overflow-hidden rounded-[10px] border border-[#E8EDF2]">
                                <div className="grid h-9 grid-cols-4 items-center bg-[#FAFBFC] px-4 text-[10px] font-semibold text-[#64748B]">
                                    <span className="col-span-2">이름</span>
                                    <span>역할</span>
                                    <span>상태</span>
                                </div>
                                {PREVIEW_MEMBERS.map((row) => (
                                    <div
                                        key={row.name}
                                        className="grid h-11 grid-cols-4 items-center border-t border-[#F1F5F9] px-4 text-[11px] text-[#475569]"
                                    >
                                        <span className="col-span-2 font-medium text-[#0F172A]">{row.name}</span>
                                        <span>{row.role}</span>
                                        <span className="inline-flex h-5 w-fit items-center rounded-full bg-[#EAF5EE] px-2 text-[10px] font-semibold text-[#246B40]">
                                            {row.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
