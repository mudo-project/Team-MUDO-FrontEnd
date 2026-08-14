import { Trash2, X } from "lucide-react";

interface CreateLectureModalProps {
    closeModal: () => void;
}

export default function CreateLectureModal({ closeModal }: CreateLectureModalProps) {
    return (
        <div className="fixed top-0 left-0 z-999 h-screen w-screen bg-[#162236]/45" onClick={closeModal}>
            <form className="fixed top-1/2 left-1/2 z-1000 flex max-h-[calc(100dvh-48px)] w-[580px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[14px] bg-white shadow-[0_8px_40px_rgba(0,0,0,0.18)]" onClick={(event) => event.stopPropagation()}>
                <header className="flex shrink-0 items-center px-7 pt-[22px] pb-[18px]">
                    <h2 className="text-[17px] leading-[25.5px] font-bold text-[#0F172A]">
                        강의 등록
                    </h2>
                    <button
                        aria-label="강의 등록 모달 닫기"
                        className="ml-auto flex size-[18px] items-center justify-center text-[#94A3B8]"
                        onClick={closeModal}
                        type="button"
                    >
                        <X className="size-[18px]" strokeWidth={1.5} />
                    </button>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto px-7 py-6">
                    <section>
                        <h3 className="text-[12px] leading-[18px] font-semibold tracking-[0.6px] text-[#94A3B8]">
                            기본 정보
                        </h3>

                        <div className="pt-3.5">
                            <label
                                className="block pb-[5px] text-[12px] leading-[18px] font-medium text-[#64748B]"
                                htmlFor="lecture-name"
                            >
                                강의명 *
                            </label>
                            <input
                                className="h-[39px] w-full rounded-[8px] border border-[#DCE8E2] px-3 text-[13px] text-[#0F172A] placeholder:text-[#0F172A]/50 focus:outline-none"
                                id="lecture-name"
                                name="name"
                                placeholder="예: 고1 수학 정규반"
                                type="text"
                            />
                        </div>

                        <div className="mt-3.5 flex gap-3">
                            <div className="w-full">
                                <label
                                    className="block pb-[5px] text-[12px] leading-[18px] font-medium text-[#64748B]"
                                    htmlFor="lecture-type"
                                >
                                    강의 유형 *
                                </label>
                                <select
                                    className="h-[39px] w-full rounded-[8px] border border-[#DCE8E2] bg-white px-3 text-[13px] text-[#0F172A] focus:outline-none"
                                    defaultValue="REGULAR"
                                    id="lecture-type"
                                    name="type"
                                >
                                    <option value="REGULAR">정규반</option>
                                    <option value="ADVANCED">심화반</option>
                                    <option value="CLINIC">클리닉</option>
                                </select>
                            </div>

                            <div className="w-full">
                                <label
                                    className="block pb-[5px] text-[12px] leading-[18px] font-medium text-[#64748B]"
                                    htmlFor="lecture-grade"
                                >
                                    학년 *
                                </label>
                                <select
                                    className="h-[39px] w-full rounded-[8px] border border-[#DCE8E2] bg-white px-3 text-[13px] text-[#0F172A] focus:outline-none"
                                    defaultValue="HIGH_1"
                                    id="lecture-grade"
                                    name="grade"
                                >
                                    <option value="MIDDLE_1">중1</option>
                                    <option value="MIDDLE_2">중2</option>
                                    <option value="MIDDLE_3">중3</option>
                                    <option value="HIGH_1">고1</option>
                                    <option value="HIGH_2">고2</option>
                                    <option value="HIGH_3">고3</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-3.5 flex gap-3">
                            <div className="w-full">
                                <label
                                    className="block pb-[5px] text-[12px] leading-[18px] font-medium text-[#64748B]"
                                    htmlFor="lecture-subject"
                                >
                                    과목 *
                                </label>
                                <input
                                    className="h-[39px] w-full rounded-[8px] border border-[#DCE8E2] px-3 text-[13px] text-[#0F172A] placeholder:text-[#0F172A]/50 focus:outline-none"
                                    id="lecture-subject"
                                    name="subject"
                                    placeholder="수학"
                                    type="text"
                                />
                            </div>

                            <div className="w-full">
                                <label
                                    className="block pb-[5px] text-[12px] leading-[18px] font-medium text-[#64748B]"
                                    htmlFor="lecture-semester"
                                >
                                    학기
                                </label>
                                <input
                                    className="h-[39px] w-full rounded-[8px] border border-[#DCE8E2] px-3 text-[13px] text-[#0F172A] placeholder:text-[#0F172A]/50 focus:outline-none"
                                    id="lecture-semester"
                                    name="semester"
                                    placeholder="2026 여름학기"
                                    type="text"
                                />
                            </div>
                        </div>

                        <div className="mt-3.5 flex gap-3">
                            <div className="w-full">
                                <label
                                    className="block pb-[5px] text-[12px] leading-[18px] font-medium text-[#64748B]"
                                    htmlFor="lecture-teacher"
                                >
                                    담당 선생님 *
                                </label>
                                <input
                                    className="h-[39px] w-full rounded-[8px] border border-[#DCE8E2] px-3 text-[13px] text-[#0F172A] placeholder:text-[#0F172A]/50 focus:outline-none"
                                    id="lecture-teacher"
                                    name="teacher"
                                    placeholder="김선생"
                                    type="text"
                                />
                            </div>

                            <div className="w-full">
                                <label
                                    className="block pb-[5px] text-[12px] leading-[18px] font-medium text-[#64748B]"
                                    htmlFor="lecture-room"
                                >
                                    강의실 코드 *
                                </label>
                                <input
                                    className="h-[39px] w-full rounded-[8px] border border-[#DCE8E2] px-3 text-[13px] text-[#0F172A] placeholder:text-[#0F172A]/50 focus:outline-none"
                                    id="lecture-room"
                                    name="roomCode"
                                    placeholder="A101"
                                    type="text"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="mt-[18px]">
                        <h3 className="text-[12px] leading-[18px] font-semibold tracking-[0.6px] text-[#94A3B8]">
                            수강료
                        </h3>

                        <div className="mt-3.5 flex gap-3">
                            <div className="w-full">
                                <label
                                    className="block pb-[5px] text-[12px] leading-[18px] font-medium text-[#64748B]"
                                    htmlFor="tuition-type"
                                >
                                    수강료 유형 *
                                </label>
                                <select
                                    className="h-[39px] w-full rounded-[8px] border border-[#DCE8E2] bg-white px-3 text-[13px] text-[#0F172A] focus:outline-none"
                                    defaultValue="MONTHLY"
                                    id="tuition-type"
                                    name="tuitionType"
                                >
                                    <option value="MONTHLY">월정액</option>
                                    <option value="PER_SESSION">회당</option>
                                </select>
                            </div>

                            <div className="w-full">
                                <label
                                    className="block pb-[5px] text-[12px] leading-[18px] font-medium text-[#64748B]"
                                    htmlFor="tuition-amount"
                                >
                                    금액 (원) *
                                </label>
                                <input
                                    className="h-[39px] w-full rounded-[8px] border border-[#DCE8E2] px-3 text-[13px] text-[#0F172A] placeholder:text-[#0F172A]/50 focus:outline-none"
                                    id="tuition-amount"
                                    name="tuitionAmount"
                                    placeholder="300000"
                                    type="number"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="mt-[18px]">
                        <div className="flex items-center">
                            <h3 className="text-[12px] leading-[18px] font-semibold tracking-[0.6px] text-[#94A3B8]">
                                시간표 *
                            </h3>
                            <button
                                className="ml-auto h-[28px] rounded-[6px] border border-[#DCE8E2] px-2.5 text-[12px] leading-[18px] text-[#0F172A]"
                                type="button"
                            >
                                + 추가
                            </button>
                        </div>

                        <div className="mt-3.5 flex items-center gap-2">
                            <select
                                aria-label="수업 요일"
                                className="h-[39px] w-full rounded-[8px] border border-[#DCE8E2] bg-white px-3 text-[13px] text-[#0F172A] focus:outline-none"
                                defaultValue="MONDAY"
                                name="dayOfWeek"
                            >
                                <option value="MONDAY">월요일</option>
                                <option value="TUESDAY">화요일</option>
                                <option value="WEDNESDAY">수요일</option>
                                <option value="THURSDAY">목요일</option>
                                <option value="FRIDAY">금요일</option>
                                <option value="SATURDAY">토요일</option>
                                <option value="SUNDAY">일요일</option>
                            </select>
                            <input
                                aria-label="수업 시작 시간"
                                className="h-[39px] w-full rounded-[8px] border border-[#DCE8E2] px-3 text-[13px] text-[#0F172A] focus:outline-none"
                                name="startTime"
                                type="time"
                            />
                            <input
                                aria-label="수업 종료 시간"
                                className="h-[39px] w-full rounded-[8px] border border-[#DCE8E2] px-3 text-[13px] text-[#0F172A] focus:outline-none"
                                name="endTime"
                                type="time"
                            />
                            <button
                                aria-label="시간표 삭제"
                                className="flex size-9 shrink-0 items-center justify-center rounded-[7px] border border-[#F1D0CE] bg-[#FEF2F2] text-[#C0483F] opacity-40"
                                type="button"
                            >
                                <Trash2 className="size-[13px]" strokeWidth={1.5} />
                            </button>
                        </div>
                    </section>
                </div>

                <footer className="flex shrink-0 gap-2 px-7 pb-6">
                    <button
                        className="h-11 w-1/3 rounded-[8px] border border-[#DCE8E2] bg-white text-[13px] leading-[19.5px] text-[#64748B]"
                        onClick={closeModal}
                        type="button"
                    >
                        취소
                    </button>
                    <button
                        className="h-11 w-full rounded-[8px] bg-[#2A3A4A] text-[13px] leading-[19.5px] font-semibold text-white"
                        type="submit"
                    >
                        강의 등록
                    </button>
                </footer>
            </form>
        </div>
    );
}
