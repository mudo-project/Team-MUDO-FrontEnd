const lectures = [
    { name: "수학A반", teacher: "이민준 선생님", enrolled: true },
    { name: "영어B반", teacher: "박서연 선생님" },
    { name: "국어C반", teacher: "강도현 선생님" },
    { name: "과학D반", teacher: "최성호 선생님" },
    { name: "수학심화반", teacher: "이민준 선생님" },
];

export default function AddStudentLectureModal({ closeModal }: { closeModal: () => void }) {
    return (
        <div className="fixed top-0 left-0 z-1001 flex h-screen w-screen items-center justify-center bg-black/35" onClick={closeModal}>
            <section className="relative z-1002 w-[460px] rounded-[14px] bg-white px-7 pt-7 pb-6 shadow-[0_8px_20px_rgba(0,0,0,0.18)]" onClick={(event) => event.stopPropagation()}>
                <h2 className="text-[16px] leading-6 font-bold text-[#1D2B3A]">
                    수강 등록
                </h2>
                <p className="pt-1.5 text-[12px] leading-[18px] text-[#64748B]">
                    강다은 원생의 강의를 선택하세요
                </p>

                <div className="mt-[18px] flex h-[345px] w-full flex-col gap-2">
                    {lectures.map((lecture) => (
                        <button
                            className={`flex w-full items-center justify-between rounded-[10px] border border-[#DCE8E2] px-3.5 py-3 text-left ${lecture.enrolled ? "cursor-not-allowed bg-[#F7FAF8] opacity-60" : "bg-white"}`}
                            disabled={lecture.enrolled}
                            key={lecture.name}
                            type="button"
                        >
                            <span>
                                <strong className="block text-[13px] leading-[19.5px] font-semibold text-[#1D2B3A]">
                                    {lecture.name}
                                </strong>
                                <span className="block text-[11px] leading-[16.5px] text-[#64748B]">
                                    {lecture.teacher}
                                </span>
                            </span>
                        </button>
                    ))}
                </div>

                <div className="mt-5 flex justify-end gap-2">
                    <button
                        className="h-[40px] rounded-[8px] border border-[#DCE8E2] bg-white px-[18px] text-[13px] leading-[19.5px] text-[#64748B]"
                        onClick={closeModal}
                        type="button"
                    >
                        취소
                    </button>
                    <button
                        className="h-[40px] cursor-not-allowed rounded-[8px] bg-[#DCE8E2] px-5 text-[13px] leading-[19.5px] font-semibold text-white"
                        disabled
                        type="button"
                    >
                        다음
                    </button>
                </div>
            </section>
        </div>
    );
}
