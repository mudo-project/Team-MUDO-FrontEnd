import { X } from "lucide-react";

export default function MyApprovalModal() {
    return (
        <div className="fixed top-0 left-0 z-999 h-screen w-screen bg-[#162236]/35">
            <div className="fixed top-1/2 left-1/2 z-1000 h-[500px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-[14px] bg-white p-8 shadow-[0_8px_20px_rgba(22,34,54,0.18)]">
                <div className="flex h-[76px] w-full items-start gap-3">
                    <div className="w-full">
                        <div className="flex items-center gap-2.5">
                            <span className="rounded-[20px] bg-[#DCFCE7] px-[9px] py-0.5 text-[11px] font-medium leading-[16.5px] text-[#2C8D50]">
                                진행중
                            </span>
                            <span className="text-[11px] font-normal leading-[16.5px] text-[#B0B8C1]">
                                초과근무 신청
                            </span>
                        </div>
                        <h2 className="pt-1.5 text-[18px] font-bold leading-[27px] text-[#0F172A]">
                            0
                        </h2>
                        <p className="pt-1 text-[12px] font-normal leading-[18px] text-[#B0B8C1]">
                            기안자: 김지수 · 2026.08.04 14:34
                        </p>
                    </div>
                    <button
                        aria-label="내가 신청한 결재 모달 닫기"
                        className="flex size-[22px] shrink-0 items-center justify-center text-[#C0C8D0]"
                        type="button"
                    >
                        <X className="size-3.5" strokeWidth={1.5} />
                    </button>
                </div>

                <section className="mt-6 h-[141px] w-full rounded-[10px] bg-[#F7F8FA] px-5 py-4">
                    <h3 className="text-[11px] font-semibold leading-[16.5px] tracking-[0.55px] text-[#64748B]">
                        결재 라인
                    </h3>
                    <div className="flex h-[92px] w-full items-start pt-5 pb-2">
                        <div className="flex min-w-[72px] flex-col items-center gap-1.5">
                            <div className="flex size-6 items-center justify-center rounded-full border-[1.5px] border-[#2C8D50] bg-[#DCFCE7]">
                                <span className="size-2 rounded-full bg-[#2C8D50]" />
                            </div>
                            <div className="text-center">
                                <p className="text-[12px] font-medium leading-[18px] text-[#0F172A]">
                                    이민준
                                </p>
                                <p className="pt-px text-[10px] font-normal leading-[15px] text-[#2C8D50]">
                                    검토중
                                </p>
                            </div>
                        </div>

                        <div className="mt-[11px] h-[1.5px] w-full min-w-6 bg-[#D7E8DB]" />

                        <div className="flex min-w-[72px] flex-col items-center gap-1.5">
                            <div className="size-6 rounded-full border border-[#D0D5DC] bg-white" />
                            <div className="text-center">
                                <p className="text-[12px] font-medium leading-[18px] text-[#B0B8C1]">
                                    김지수
                                </p>
                                <p className="pt-px text-[10px] font-normal leading-[15px] text-[#C0C8D0]">
                                    대기
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-10 w-full">
                    <h3 className="text-[11px] font-semibold leading-[16.5px] tracking-[0.55px] text-[#64748B]">
                        내용
                    </h3>
                    <div className="mt-2 w-full rounded-[8px] border border-[#D7E8DB] bg-[#FAFBFC] px-4 py-3.5 text-[13px] font-normal leading-[22.1px] text-[#3D4A5A]">
                        12
                    </div>
                </section>

                <div className="mt-5 flex h-[58px] w-full items-start border-t border-[#D7E8DB] pt-4">
                    <button
                        className="h-[41px] rounded-[8px] border border-[#D7E8DB] bg-white px-4 text-[13px] font-normal leading-[19.5px] text-[#0F172A]"
                        type="button"
                    >
                        결재라인 수정
                    </button>
                </div>
            </div>
        </div>
    );
}
