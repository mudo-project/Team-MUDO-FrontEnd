import { X } from "lucide-react";

export default function ApprovalTemplateModal() {
    return (
        <div className="fixed top-0 left-0 z-999 h-screen w-screen bg-[#162236]/35">
            <div className="fixed top-1/2 left-1/2 z-1000 h-[432px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-[14px] bg-white p-8 shadow-[0_8px_20px_rgba(22,34,54,0.18)]">
                <div className="flex h-[49px] w-full items-start gap-3">
                    <div className="w-full">
                        <h2 className="text-[18px] font-bold leading-[27px] text-[#0F172A]">
                            지출결의서
                        </h2>
                        <p className="pt-1 text-[12px] font-normal leading-[18px] text-[#B0B8C1]">
                            생성자: 정다은 · 2025.01.02
                        </p>
                    </div>
                    <button
                        aria-label="결재 템플릿 상세 모달 닫기"
                        className="flex size-[22px] shrink-0 items-center justify-center text-[#C0C8D0]"
                        type="button"
                    >
                        <X className="size-3.5" strokeWidth={1.5} />
                    </button>
                </div>

                <section className="mt-5 h-[118px] w-full rounded-[10px] bg-[#F7F8FA] px-5 py-4">
                    <h3 className="text-[11px] font-semibold leading-[16.5px] tracking-[0.55px] text-[#64748B]">
                        결재 라인
                    </h3>
                    <div className="mt-3 flex w-full items-center">
                        <div className="flex flex-col items-center gap-1">
                            <span className="flex size-9 items-center justify-center rounded-full bg-[#0F172A] text-[13px] font-semibold leading-[19.5px] text-white">
                                정
                            </span>
                            <span className="text-[11px] font-normal leading-[16.5px] text-[#0F172A]">
                                1차 · 정다은
                            </span>
                        </div>

                        <span className="h-[37px] w-[30px] px-2 text-[14px] font-normal leading-[21px] text-[#D0D5DC]">
                            →
                        </span>

                        <div className="flex flex-col items-center gap-1">
                            <span className="flex size-9 items-center justify-center rounded-full bg-[#0F172A] text-[13px] font-semibold leading-[19.5px] text-white">
                                김
                            </span>
                            <span className="text-[11px] font-normal leading-[16.5px] text-[#0F172A]">
                                2차 · 김지수
                            </span>
                        </div>
                    </div>
                </section>

                <section className="h-[103px] w-full pt-5">
                    <h3 className="text-[11px] font-semibold leading-[16.5px] tracking-[0.55px] text-[#64748B]">
                        첨부 파일
                    </h3>
                    <div className="mt-2 flex h-[58px] w-full items-center gap-2 rounded-[8px] border border-[#D7E8DB] bg-[#FCFCFC] px-3">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-[6px] bg-[#2C8D50] text-[9px] font-bold leading-[13.5px] text-white">
                            XLSX
                        </span>
                        <span className="w-full">
                            <strong className="block text-[13px] font-normal leading-[19.5px] text-[#0F172A]">
                                지출결의서_양식.xlsx
                            </strong>
                            <span className="block text-[11px] font-normal leading-[16.5px] text-[#64748B]">
                                42 KB
                            </span>
                        </span>
                        <button
                            className="shrink-0 text-[12px] font-normal leading-[18px] text-[#64748B]"
                            type="button"
                        >
                            미리보기
                        </button>
                    </div>
                </section>

                <div className="mt-5 flex h-[58px] w-full items-start gap-2 border-t border-[#D7E8DB] pt-4">
                    <button
                        className="h-[41px] shrink-0 rounded-[8px] border border-[#D7E8DB] bg-white px-5 text-[13px] font-normal leading-[19.5px] text-[#6B7280]"
                        type="button"
                    >
                        닫기
                    </button>
                    <button
                        className="h-[41px] w-full rounded-[8px] bg-[#0F172A] text-[13px] font-semibold leading-[19.5px] text-white"
                        type="button"
                    >
                        이 양식으로 결재 상신
                    </button>
                </div>
            </div>
        </div>
    );
}
