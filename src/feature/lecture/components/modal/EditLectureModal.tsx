import { Plus, Trash2, X } from "lucide-react";

const inputClassName =
    "mt-[5px] h-10 w-full rounded-[8px] border border-[#DCE8E2] bg-white px-3 text-[13px] text-[#0F172A] outline-none";

const selectClassName =
    "mt-[5px] h-10 w-full rounded-[8px] border border-[#DCE8E2] bg-white px-3 text-[13px] text-[#0F172A] outline-none";

interface EditLectureModalProps {
    closeModal: () => void;
}

export default function EditLectureModal({ closeModal }: EditLectureModalProps) {
    return (
        <div className="fixed top-0 left-0 z-1001 flex h-screen w-screen items-center justify-center bg-black/35 p-5" onClick={closeModal}>
            <form className="z-1002 max-h-full w-[580px] overflow-y-auto rounded-[10px] bg-white shadow-[0_8px_20px_rgba(0,0,0,0.18)]" onClick={(event) => event.stopPropagation()}>
                <header className="flex h-[56px] items-center  px-7">
                    <h2 className="text-[16px] leading-6 font-bold text-[#1D2B3A]">
                        강의 수정
                    </h2>
                    <button
                        aria-label="강의 수정 모달 닫기"
                        className="ml-auto text-[#94A3B8]"
                        onClick={closeModal}
                        type="button"
                    >
                        <X className="size-4" strokeWidth={1.5} />
                    </button>
                </header>

                <div className="flex flex-col gap-5 px-7 py-5">
                    <section>
                        <h3 className="text-[12px] leading-[18px] font-semibold tracking-[0.6px] text-[#94A3B8]">
                            기본 정보
                        </h3>

                        <div className="mt-3.5 flex flex-col gap-3">
                            <label className="text-[12px] leading-[18px] font-medium text-[#64748B]">
                                강의명 <span aria-hidden="true">*</span>
                                <input
                                    className={inputClassName}
                                    defaultValue="고3 수학 특강"
                                    name="title"
                                    type="text"
                                />
                            </label>

                            <div className="grid grid-cols-2 gap-3">
                                <label className="text-[12px] leading-[18px] font-medium text-[#64748B]">
                                    강의 유형 <span aria-hidden="true">*</span>
                                    <select className={selectClassName} defaultValue="특강" name="type">
                                        <option value="정규">정규</option>
                                        <option value="특강">특강</option>
                                    </select>
                                </label>
                                <label className="text-[12px] leading-[18px] font-medium text-[#64748B]">
                                    학년 <span aria-hidden="true">*</span>
                                    <select className={selectClassName} defaultValue="고3" name="grade">
                                        <option value="중1">중1</option>
                                        <option value="중2">중2</option>
                                        <option value="중3">중3</option>
                                        <option value="고1">고1</option>
                                        <option value="고2">고2</option>
                                        <option value="고3">고3</option>
                                    </select>
                                </label>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <label className="text-[12px] leading-[18px] font-medium text-[#64748B]">
                                    과목 <span aria-hidden="true">*</span>
                                    <input className={inputClassName} defaultValue="수학" name="subject" type="text" />
                                </label>
                                <label className="text-[12px] leading-[18px] font-medium text-[#64748B]">
                                    학기
                                    <input className={inputClassName} defaultValue="2026 여름학기" name="semester" type="text" />
                                </label>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <label className="text-[12px] leading-[18px] font-medium text-[#64748B]">
                                    담당 선생님 <span aria-hidden="true">*</span>
                                    <input className={inputClassName} defaultValue="이선생" name="teacher" type="text" />
                                </label>
                                <label className="text-[12px] leading-[18px] font-medium text-[#64748B]">
                                    강의실 코드 <span aria-hidden="true">*</span>
                                    <input className={inputClassName} defaultValue="B201" name="classroomCode" type="text" />
                                </label>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-[12px] leading-[18px] font-semibold tracking-[0.6px] text-[#94A3B8]">
                            수강료
                        </h3>
                        <div className="mt-3.5 grid grid-cols-2 gap-3">
                            <label className="text-[12px] leading-[18px] font-medium text-[#64748B]">
                                수강료 유형 <span aria-hidden="true">*</span>
                                <select className={selectClassName} defaultValue="회당" name="feeType">
                                    <option value="회당">회당</option>
                                    <option value="월정액">월정액</option>
                                </select>
                            </label>
                            <label className="text-[12px] leading-[18px] font-medium text-[#64748B]">
                                금액 (원) <span aria-hidden="true">*</span>
                                <input className={inputClassName} defaultValue="50000" name="fee" type="number" />
                            </label>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center">
                            <h3 className="text-[12px] leading-[18px] font-semibold tracking-[0.6px] text-[#94A3B8]">
                                시간표 <span aria-hidden="true">*</span>
                            </h3>
                            <button
                                className="ml-auto flex h-[27px] items-center gap-1 rounded-[6px] border border-[#DCE8E2] px-2.5 text-[12px] text-[#0F172A]"
                                type="button"
                            >
                                <Plus className="size-3" strokeWidth={1.5} />
                                추가
                            </button>
                        </div>

                        <div className="mt-3.5 flex flex-col gap-2.5">
                            <div className="grid grid-cols-[156px_156px_156px_32px] items-center gap-2">
                                <select className="h-10 rounded-[8px] border border-[#DCE8E2] bg-white px-3 text-[13px] text-[#0F172A] outline-none" defaultValue="화요일" name="day">
                                    <option value="화요일">화요일</option>
                                </select>
                                <input className="h-10 rounded-[8px] border border-[#DCE8E2] px-3 outline-none" name="startTime" type="time" />
                                <input className="h-10 rounded-[8px] border border-[#DCE8E2] px-3 outline-none" name="endTime" type="time" />
                                <button aria-label="화요일 시간표 삭제" className="flex size-8 items-center justify-center rounded-[7px] border border-[#F1D0CE] bg-[#FEF2F2] text-[#C0483F]" type="button">
                                    <Trash2 className="size-3.5" strokeWidth={1.5} />
                                </button>
                            </div>

                            <div className="grid grid-cols-[156px_156px_156px_32px] items-center gap-2">
                                <select className="h-10 rounded-[8px] border border-[#DCE8E2] bg-white px-3 text-[13px] text-[#0F172A] outline-none" defaultValue="목요일" name="day">
                                    <option value="목요일">목요일</option>
                                </select>
                                <input className="h-10 rounded-[8px] border border-[#DCE8E2] px-3 outline-none" name="startTime" type="time" />
                                <input className="h-10 rounded-[8px] border border-[#DCE8E2] px-3 outline-none" name="endTime" type="time" />
                                <button aria-label="목요일 시간표 삭제" className="flex size-8 items-center justify-center rounded-[7px] border border-[#F1D0CE] bg-[#FEF2F2] text-[#C0483F]" type="button">
                                    <Trash2 className="size-3.5" strokeWidth={1.5} />
                                </button>
                            </div>
                        </div>
                    </section>
                </div>

                <footer className="flex gap-2 px-7 pb-6">
                    <button className="h-11 w-1/3 rounded-[8px] border border-[#DCE8E2] bg-white text-[13px] text-[#64748B]" onClick={closeModal} type="button">
                        취소
                    </button>
                    <button className="h-11 w-full rounded-[8px] bg-[#2A3A4A] text-[13px] font-semibold text-white" type="submit">
                        수정 완료
                    </button>
                </footer>
            </form>
        </div>
    );
}
