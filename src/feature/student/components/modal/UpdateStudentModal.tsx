export default function UpdateStudentModal({ closeModal }: { closeModal: () => void }) {
    return (
        <div className="fixed top-0 left-0 z-1001 flex h-screen w-screen items-center justify-center bg-black/35" onClick={closeModal}>
            <form className="relative z-1002 w-[460px] rounded-[14px] bg-white px-7 pt-7 pb-6 shadow-[0_8px_20px_rgba(0,0,0,0.18)]" onClick={(event) => event.stopPropagation()}>
                <h2 className="text-[16px] leading-6 font-bold text-[#1D2B3A]">
                    원생 정보 수정
                </h2>

                <div className="mt-5 space-y-[13px]">
                    <label className="block">
                        <span className="block pb-[5px] text-[12px] leading-[18px] font-medium text-[#64748B]">
                            이름 *
                        </span>
                        <input
                            className="h-[39px] w-full rounded-[8px] border border-[#DCE8E2] px-3 py-[9px] text-[13px] leading-[19.5px] text-[#1D2B3A] focus:outline-none"
                            defaultValue="강다은"
                            type="text"
                        />
                    </label>

                    <label className="block">
                        <span className="block pb-[5px] text-[12px] leading-[18px] font-medium text-[#64748B]">
                            학교
                        </span>
                        <input
                            className="h-[39px] w-full rounded-[8px] border border-[#DCE8E2] px-3 py-[9px] text-[13px] leading-[19.5px] text-[#1D2B3A] focus:outline-none"
                            defaultValue="서울중학교"
                            type="text"
                        />
                    </label>

                    <label className="block">
                        <span className="block pb-[5px] text-[12px] leading-[18px] font-medium text-[#64748B]">
                            학생 연락처 *
                        </span>
                        <input
                            className="h-[39px] w-full rounded-[8px] border border-[#DCE8E2] px-3 py-[9px] text-[13px] leading-[19.5px] text-[#1D2B3A] focus:outline-none"
                            defaultValue="010-1234-5678"
                            type="tel"
                        />
                    </label>

                    <label className="block">
                        <span className="block pb-[5px] text-[12px] leading-[18px] font-medium text-[#64748B]">
                            학부모 연락처
                        </span>
                        <input
                            className="h-[39px] w-full rounded-[8px] border border-[#DCE8E2] px-3 py-[9px] text-[13px] leading-[19.5px] text-[#1D2B3A] focus:outline-none"
                            defaultValue="010-9876-5432"
                            type="tel"
                        />
                    </label>

                    <label className="block">
                        <span className="block pb-[5px] text-[12px] leading-[18px] font-medium text-[#64748B]">
                            학년 *
                        </span>
                        <select
                            className="h-[37px] w-full rounded-[8px] border border-[#DCE8E2] bg-white px-3 text-[13px] text-[#1D2B3A] focus:outline-none"
                            defaultValue="중3"
                        >
                            <option>중1</option>
                            <option>중2</option>
                            <option>중3</option>
                            <option>고1</option>
                            <option>고2</option>
                            <option>고3</option>
                        </select>
                    </label>

                    <label className="block">
                        <span className="block pb-[5px] text-[12px] leading-[18px] font-medium text-[#64748B]">
                            특이사항
                        </span>
                        <textarea
                            className="h-[78px] w-full resize-none rounded-[8px] border border-[#DCE8E2] px-3 py-[9px] text-[13px] leading-[19.5px] text-[#1D2B3A] focus:outline-none"
                            defaultValue=""
                        />
                    </label>
                </div>

                <div className="mt-[22px] flex justify-end gap-2">
                    <button className="h-[39px] rounded-[8px] border border-[#DCE8E2] px-[18px] py-[9px] text-[13px] leading-[19.5px] text-[#64748B]" onClick={closeModal} type="button">
                        취소
                    </button>
                    <button className="h-[39px] rounded-[8px] bg-[#2A3A4A] px-5 py-[9px] text-[13px] leading-[19.5px] font-semibold text-white" type="button">
                        저장
                    </button>
                </div>
            </form>
        </div>
    );
}
