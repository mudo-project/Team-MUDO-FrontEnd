import { ChevronDown } from "lucide-react";

const inputClassName =
    "mt-[5px] h-[40px] w-full rounded-[8px] border border-[#DCE8E2] bg-white px-3 text-[13px] text-[#1D2B3A] outline-none placeholder:text-[#1D2B3A]/50";

export default function CreateStudentModal({ closeModal }: { closeModal: () => void }) {
    return (
        <div className="fixed top-0 left-0 z-999 flex h-screen w-screen items-center justify-center bg-black/35" onClick={closeModal}>
            <form className="w-[460px] rounded-[14px] bg-white px-7 pt-7 pb-6 shadow-[0_8px_20px_rgba(0,0,0,0.18)]" onClick={(event) => event.stopPropagation()}>
                <h2 className="text-[16px] leading-6 font-bold text-[#1D2B3A]">
                    원생 등록
                </h2>

                <div className="mt-5 flex w-full flex-col gap-[13px]">
                    <label className="text-[12px] leading-[18px] font-medium text-[#64748B]">
                        이름 <span aria-hidden="true">*</span>
                        <input
                            className={inputClassName}
                            name="name"
                            placeholder="홍길동"
                            type="text"
                        />
                    </label>

                    <label className="text-[12px] leading-[18px] font-medium text-[#64748B]">
                        학교
                        <input
                            className={inputClassName}
                            name="school"
                            placeholder="서울중학교"
                            type="text"
                        />
                    </label>

                    <label className="text-[12px] leading-[18px] font-medium text-[#64748B]">
                        학생 연락처 <span aria-hidden="true">*</span>
                        <input
                            className={inputClassName}
                            name="studentPhone"
                            placeholder="010-0000-0000"
                            type="tel"
                        />
                    </label>

                    <label className="text-[12px] leading-[18px] font-medium text-[#64748B]">
                        학부모 연락처
                        <input
                            className={inputClassName}
                            name="parentPhone"
                            placeholder="010-0000-0000"
                            type="tel"
                        />
                    </label>

                    <label className="relative text-[12px] leading-[18px] font-medium text-[#64748B]">
                        학년 <span aria-hidden="true">*</span>
                        <select
                            className="mt-[5px] h-[38px] w-full appearance-none rounded-[8px] border border-[#DCE8E2] bg-white px-4 text-[13px] text-[#1D2B3A] outline-none"
                            defaultValue="중1"
                            name="grade"
                        >
                            <option value="중1">중1</option>
                            <option value="중2">중2</option>
                            <option value="중3">중3</option>
                            <option value="고1">고1</option>
                            <option value="고2">고2</option>
                            <option value="고3">고3</option>
                        </select>
                        <ChevronDown
                            aria-hidden="true"
                            className="pointer-events-none absolute right-3 bottom-[13px] size-3 text-[#64748B]"
                            strokeWidth={1.5}
                        />
                    </label>

                    <label className="text-[12px] leading-[18px] font-medium text-[#64748B]">
                        특이사항
                        <textarea
                            className="mt-[5px] h-[78px] w-full resize-none rounded-[8px] border border-[#DCE8E2] bg-white px-3 py-2 text-[13px] text-[#1D2B3A] outline-none"
                            name="note"
                        />
                    </label>
                </div>

                <div className="mt-[22px] flex justify-end gap-2">
                    <button
                        className="h-[40px] rounded-[8px] border border-[#DCE8E2] bg-white px-[18px] text-[13px] leading-[19.5px] text-[#64748B]"
                        onClick={closeModal}
                        type="button"
                    >
                        취소
                    </button>
                    <button
                        className="h-[40px] rounded-[8px] bg-[#2A3A4A] px-5 text-[13px] leading-[19.5px] font-semibold text-white"
                        type="submit"
                    >
                        등록
                    </button>
                </div>
            </form>
        </div>
    );
}
