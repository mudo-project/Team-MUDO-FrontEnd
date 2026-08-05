import { ChevronDown, X } from "lucide-react";

export default function ViewMembersModal() {
    return (
        <div className="fixed top-0 left-0 z-999 h-screen w-screen bg-[#162236]/45">
            <form className="fixed top-1/2 left-1/2 z-1000 w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-[12px] bg-white p-7 shadow-[0_8px_12px_rgba(22,34,54,0.12)]">
                <div className="flex w-full items-center gap-3.5">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#D7E8DB] text-[15px] font-semibold tracking-[-0.3px] text-[#0F172A]">
                        CH
                    </span>

                    <div>
                        <h2 className="text-[18px] font-bold leading-[27px] text-[#0F172A]">최현우</h2>
                        <p className="pt-0.5 text-[13px] leading-[19.5px] text-[#64748B]">강사</p>
                    </div>

                    <button
                        aria-label="구성원 정보 모달 닫기"
                        className="ml-auto flex size-[18px] items-center justify-center text-[#64748B]"
                        type="button"
                    >
                        <X className="size-[18px]" strokeWidth={1.5} />
                    </button>
                </div>

                <div className="my-5 h-px w-full bg-[#D7E8DB]" />

                <div className="grid w-full grid-cols-2 gap-4">
                    <label className="col-span-2 text-[12px] font-medium leading-[18px] text-[#64748B]">
                        이름 <span className="text-[#C0483F]">*</span>
                        <input
                            className="mt-1.5 h-11 w-full rounded-[8px] border border-[#D7E8DB] px-3 text-[14px] font-normal text-[#0F172A] outline-none"
                            defaultValue="최현우"
                        />
                    </label>

                    <label className="relative col-span-2 text-[12px] font-medium leading-[18px] text-[#64748B]">
                        역할
                        <select
                            className="mt-1.5 h-11 w-full appearance-none rounded-[8px] border border-[#D7E8DB] bg-white px-4 text-[14px] font-normal text-[#0F172A] outline-none"
                            defaultValue="강사"
                        >
                            <option>강사</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 bottom-[17px] size-3 text-[#64748B]" strokeWidth={1.5} />
                    </label>

                    <label className="text-[12px] font-medium leading-[18px] text-[#64748B]">
                        연락처
                        <input
                            className="mt-1.5 h-11 w-full rounded-[8px] border border-[#D7E8DB] px-3 text-[14px] font-normal text-[#0F172A] outline-none"
                            defaultValue="010-4567-8901"
                        />
                    </label>

                    <label className="text-[12px] font-medium leading-[18px] text-[#64748B]">
                        이메일
                        <input
                            className="mt-1.5 h-11 w-full rounded-[8px] border border-[#D7E8DB] px-3 text-[14px] font-normal text-[#0F172A] outline-none"
                            defaultValue="hwchoi@academy.kr"
                        />
                    </label>

                    <label className="col-span-2 text-[12px] font-medium leading-[18px] text-[#64748B]">
                        입사일
                        <input
                            className="mt-1.5 h-11 w-full rounded-[8px] border border-[#D7E8DB] px-3 text-[14px] font-normal text-[#0F172A] outline-none"
                            defaultValue="2023.03.02"
                        />
                    </label>
                </div>

                <div className="mt-5 flex w-full items-center gap-3 rounded-[10px] border border-[#D7E8DB] bg-[#EDF0F4] px-4 py-3.5">
                    <div>
                        <strong className="block text-[13px] font-semibold leading-[19.5px] text-[#0F172A]">활성 계정</strong>
                        <p className="pt-0.5 text-[12px] leading-[18px] text-[#64748B]">이 계정은 현재 정상 활성 상태입니다.</p>
                    </div>
                    <button
                        className="ml-auto h-9 shrink-0 rounded-[7px] border border-[#C0483F] bg-white px-3.5 text-[12px] font-medium text-[#C0483F]"
                        type="button"
                    >
                        계정 비활성화
                    </button>
                </div>

                <div className="mt-5 flex w-full justify-end gap-2">
                    <button
                        className="h-11 rounded-[8px] border border-[#D7E8DB] bg-white px-5 text-[14px] text-[#0F172A]"
                        type="button"
                    >
                        취소
                    </button>
                    <button
                        className="h-11 rounded-[8px] bg-[#0F172A] px-5 text-[14px] font-semibold text-white"
                        type="submit"
                    >
                        저장
                    </button>
                </div>
            </form>
        </div>
    );
}
