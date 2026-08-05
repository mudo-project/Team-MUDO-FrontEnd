import { X } from "lucide-react";

export default function ReceivedReasonModal() {
    return (
        <div className="fixed top-0 left-0 z-999 h-screen w-screen bg-[#162236]/30">
            <form className="fixed top-1/2 left-1/2 z-1000 w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-[12px] bg-white p-6 shadow-[0_8px_16px_rgba(22,34,54,0.16)]">
                <div className="flex h-[23px] items-center">
                    <h2 className="text-[15px] font-bold leading-[22.5px] text-[#0F172A]">
                        결재 승인
                    </h2>
                    <button
                        aria-label="결재 승인 모달 닫기"
                        className="ml-auto flex size-3.5 items-center justify-center text-[#C0C8D0]"
                        type="button"
                    >
                        <X className="size-3.5" strokeWidth={1.5} />
                    </button>
                </div>

                <div className="flex w-full flex-col gap-3.5 pt-5">
                    <div className="w-full rounded-[8px] bg-[#FCFCFC] px-3.5 py-2.5">
                        <p className="text-[13px] font-normal leading-[19.5px] text-[#0F172A]">
                            2025년 1월 연가 신청
                        </p>
                    </div>

                    <div className="w-full">
                        <label
                            className="block pb-1.5 text-[12px] font-medium leading-[18px] text-[#6B7280]"
                            htmlFor="received-approval-reason"
                        >
                            사유 <span className="text-[#C0C8D0]">(선택)</span>
                        </label>
                        <textarea
                            className="block h-[78px] w-full resize-none rounded-[8px] border border-[#D7E8DB] px-3 py-[9px] text-[13px] font-normal leading-[19.5px] text-[#0F172A] placeholder:text-[#0F172A]/50 focus:outline-none"
                            id="received-approval-reason"
                            name="reason"
                            placeholder="승인 의견 (선택)"
                        />
                    </div>

                    <button
                        className="h-10 w-full rounded-[8px] bg-[#0F172A] text-[13px] font-semibold leading-[19.5px] text-white"
                        type="submit"
                    >
                        승인 처리
                    </button>
                </div>
            </form>
        </div>
    );
}
