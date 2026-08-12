import { FileText, X } from "lucide-react";

export default function ViewAcademyModal() {
    return (
        <div className="fixed top-0 left-0 z-999 h-screen w-screen bg-[#0F172A]/35">
            <form className="fixed top-1/2 left-1/2 z-1000 flex w-[560px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-[12px] bg-white shadow-[0_8px_20px_rgba(15,23,42,0.18)]">
                <header className="flex w-full items-center gap-3 border-b border-[#D7E8DB] px-6 py-5">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h2 className="text-[17px] font-bold leading-[25.5px] text-[#0F172A]">
                                성원 영어학원
                            </h2>
                            <span className="rounded-full bg-[#FEF3C7] px-2.5 py-[3px] text-[11px] font-semibold leading-[16.5px] text-[#92400E]">
                                대기중
                            </span>
                        </div>
                        <p className="pt-[3px] text-[12px] font-normal leading-[18px] text-[#64748B]">
                            신청일시 2026.08.01 14:22
                        </p>
                    </div>

                    <button
                        aria-label="학원 신청 상세 모달 닫기"
                        className="ml-auto flex size-[18px] items-center justify-center text-[#64748B]"
                        type="button"
                    >
                        <X className="size-[18px]" strokeWidth={1.5} />
                    </button>
                </header>

                <div className="w-full px-6 py-1">
                    <div className="grid h-12 w-full grid-cols-[130px_1fr] items-center border-b border-[#F1F5F9]">
                        <p className="text-[12px] font-normal leading-[18px] text-[#64748B]">로그인 아이디</p>
                        <p className="text-[14px] font-semibold leading-[21px] text-[#0F172A]">sungwon_edu</p>
                    </div>
                    <div className="grid h-12 w-full grid-cols-[130px_1fr] items-center border-b border-[#F1F5F9]">
                        <p className="text-[12px] font-normal leading-[18px] text-[#64748B]">학원명</p>
                        <p className="text-[14px] font-normal leading-[21px] text-[#0F172A]">성원 영어학원</p>
                    </div>
                    <div className="grid h-12 w-full grid-cols-[130px_1fr] items-center border-b border-[#F1F5F9]">
                        <p className="text-[12px] font-normal leading-[18px] text-[#64748B]">사업자 등록번호</p>
                        <p className="text-[14px] font-normal leading-[21px] text-[#0F172A]">234-56-78901</p>
                    </div>
                    <div className="grid h-12 w-full grid-cols-[130px_1fr] items-center border-b border-[#F1F5F9]">
                        <p className="text-[12px] font-normal leading-[18px] text-[#64748B]">대표자 이름</p>
                        <p className="text-[14px] font-normal leading-[21px] text-[#0F172A]">박지영</p>
                    </div>
                    <div className="grid h-12 w-full grid-cols-[130px_1fr] items-center border-b border-[#F1F5F9]">
                        <p className="text-[12px] font-normal leading-[18px] text-[#64748B]">대표자 이메일</p>
                        <p className="text-[14px] font-normal leading-[21px] text-[#0F172A]">jypark@sungwon.co.kr</p>
                    </div>
                    <div className="grid h-12 w-full grid-cols-[130px_1fr] items-center border-b border-[#F1F5F9]">
                        <p className="text-[12px] font-normal leading-[18px] text-[#64748B]">대표자 전화번호</p>
                        <p className="text-[14px] font-normal leading-[21px] text-[#0F172A]">010-5524-8831</p>
                    </div>

                    <div className="w-full border-b border-[#F1F5F9] py-[13px]">
                        <p className="text-[12px] font-normal leading-[18px] text-[#64748B]">사업자등록증</p>
                        <div className="mt-2.5 flex w-full items-center gap-2.5 rounded-[8px] border border-[#D7E8DB] bg-[#F8FAFC] px-3.5 py-2.5">
                            <FileText className="size-4 shrink-0 text-[#64748B]" strokeWidth={1.5} />
                            <p className="text-[13px] font-normal leading-[19.5px] text-[#0F172A]">
                                사업자등록증_성원영어.pdf
                            </p>
                            <button
                                className="ml-auto text-[12px] font-medium leading-[18px] text-[#3D7A6A]"
                                type="button"
                            >
                                다운로드
                            </button>
                        </div>
                    </div>
                </div>

                <footer className="flex w-full gap-2.5 border-t border-[#D7E8DB] px-6 py-4">
                    <button
                        className="h-[42px] w-1/3 rounded-[8px] border border-[#D7E8DB] bg-white text-[13px] font-medium leading-[19.5px] text-[#0F172A]"
                        type="button"
                    >
                        반려
                    </button>
                    <button
                        className="h-[42px] w-2/3 rounded-[8px] bg-[#0F172A] text-[13px] font-medium leading-[19.5px] text-white"
                        type="submit"
                    >
                        승인
                    </button>
                </footer>
            </form>
        </div>
    );
}
