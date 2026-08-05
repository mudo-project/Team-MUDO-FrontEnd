import { Check, X } from "lucide-react";

export default function ReceivedApprovalModal() {
    return (
        <div className="fixed top-0 left-0 z-999 h-screen w-screen bg-[#162236]/35">
            <div className="fixed top-1/2 left-1/2 z-1000 h-[823px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-[14px] bg-white p-8 shadow-[0_8px_20px_rgba(22,34,54,0.18)]">
                <div className="flex w-full items-start gap-3">
                    <div className="w-full">
                        <div className="flex items-center gap-2.5">
                            <span className="rounded-[20px] bg-[#DCFCE7] px-[9px] py-0.5 text-[11px] font-medium leading-[16.5px] text-[#2C8D50]">
                                진행중
                            </span>
                            <span className="text-[11px] font-normal leading-[16.5px] text-[#B0B8C1]">
                                연가 신청서
                            </span>
                        </div>
                        <h2 className="pt-1.5 text-[18px] font-bold leading-[27px] text-[#0F172A]">
                            2025년 1월 연가 신청
                        </h2>
                        <p className="pt-1 text-[12px] font-normal leading-[18px] text-[#B0B8C1]">
                            기안자: 박서연 · 2025.01.15 09:10
                        </p>
                    </div>
                    <button
                        aria-label="결재 확인 모달 닫기"
                        className="flex size-[22px] shrink-0 items-center justify-center text-[#C0C8D0]"
                        type="button"
                    >
                        <X className="size-3.5" strokeWidth={1.5} />
                    </button>
                </div>

                <section className="mt-6 w-full rounded-[10px] bg-[#F7F8FA] px-5 py-4">
                    <h3 className="text-[11px] font-semibold leading-[16.5px] tracking-[0.55px] text-[#64748B]">
                        결재 라인
                    </h3>
                    <div className="flex h-[107px] w-full items-start pt-5 pb-2">
                        <div className="flex min-w-[72px] flex-col items-center gap-1.5">
                            <div className="flex size-6 items-center justify-center rounded-full bg-[#0F172A] text-white">
                                <Check className="size-3" strokeWidth={2.5} />
                            </div>
                            <div className="text-center">
                                <p className="text-[12px] font-medium leading-[18px] text-[#0F172A]">이민준</p>
                                <p className="pt-px text-[10px] font-normal leading-[15px] text-[#64748B]">승인</p>
                                <p className="pt-px text-[9px] font-normal leading-[13.5px] text-[#C0C8D0]">01.15 11:20</p>
                            </div>
                        </div>
                        <div className="mt-[11px] h-[1.5px] w-full bg-[#0F172A]" />
                        <div className="flex min-w-[72px] flex-col items-center gap-1.5">
                            <div className="flex size-6 items-center justify-center rounded-full border-[1.5px] border-[#2C8D50] bg-[#DCFCE7]">
                                <span className="size-2 rounded-full bg-[#2C8D50]" />
                            </div>
                            <div className="text-center">
                                <p className="text-[12px] font-medium leading-[18px] text-[#0F172A]">김지수</p>
                                <p className="pt-px text-[10px] font-normal leading-[15px] text-[#2C8D50]">검토중</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-5 w-full rounded-[8px] border border-[#D7E8DB] bg-[#F7F8FA] px-3.5 py-2.5">
                    <div className="flex items-center">
                        <p className="text-[12px] font-medium leading-[18px] text-[#0F172A]">1차 · 이민준 · 승인</p>
                        <p className="ml-auto text-[11px] font-normal leading-[16.5px] text-[#C0C8D0]">2025.01.15 11:20</p>
                    </div>
                    <p className="pt-1 text-[12px] font-normal leading-[18px] text-[#6B7280]">&quot;확인했습니다.&quot;</p>
                </section>

                <section className="pt-5">
                    <h3 className="text-[11px] font-semibold leading-[16.5px] tracking-[0.55px] text-[#64748B]">요약</h3>
                    <div className="mt-2 w-full rounded-[8px] border border-[#D7E8DB] bg-[#FAFBFC] px-4 py-3.5">
                        <p className="text-[13px] font-normal leading-[22.1px] text-[#3D4A5A]">AI 요약입니다.</p>
                    </div>
                </section>

                <section className="pt-5">
                    <h3 className="text-[11px] font-semibold leading-[16.5px] tracking-[0.55px] text-[#64748B]">내용</h3>
                    <div className="mt-2 w-full rounded-[8px] border border-[#D7E8DB] bg-[#FAFBFC] px-4 py-3.5">
                        <p className="text-[13px] font-normal leading-[22.1px] text-[#3D4A5A]">
                            1월 20일(월) ~ 1월 22일(수) 3일간 연가 신청드립니다.
                        </p>
                    </div>
                </section>

                <section className="pt-5">
                    <h3 className="text-[11px] font-semibold leading-[16.5px] tracking-[0.55px] text-[#64748B]">파일</h3>
                    <div className="mt-2 h-[100px] w-full rounded-[8px] border border-[#D7E8DB] bg-[#FAFBFC] px-4 py-3.5">
                        <p className="text-[13px] font-normal leading-[22.1px] text-[#3D4A5A]">구글 들어갈 자리</p>
                    </div>
                </section>

                <div className="mt-5 flex h-[58px] w-full gap-2 border-t border-[#D7E8DB] pt-4">
                    <button className="h-full w-full rounded-[8px] bg-[#0F172A] text-[13px] font-semibold leading-[19.5px] text-white" type="button">
                        승인
                    </button>
                    <button className="h-full w-full rounded-[8px] border border-[#D7E8DB] bg-[#FCFCFC] text-[13px] font-semibold leading-[19.5px] text-[#0F172A]" type="button">
                        반려
                    </button>
                </div>
            </div>
        </div>
    );
}
