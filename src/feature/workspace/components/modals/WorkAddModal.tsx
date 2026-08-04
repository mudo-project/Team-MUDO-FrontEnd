"use client";

export default function WorkAddModal() {
    return (
        <div
            className="fixed top-0 left-0 z-999 h-screen w-screen bg-[#202A3C]/30"
        // onClick={closeModal}
        >
            <form
                className="fixed top-1/2 left-1/2 z-1000 w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-[12px] bg-white p-6 shadow-[0_18px_45px_rgba(32,42,60,0.18)]"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-center">
                    <h2 className="text-[18px] font-bold tracking-[-0.02em] text-[#202A3C]">업무 등록</h2>
                    <button
                        className="ml-auto px-1 text-[22px] font-light leading-none text-[#B7BEC9]"
                        type="button"
                        // onClick={closeModal}
                        aria-label="업무 등록 모달 닫기"
                    >
                        ×
                    </button>
                </div>

                <div className="mt-6">
                    <label className="block text-[13px] font-medium text-[#697386]" htmlFor="work-title">
                        업무 제목
                    </label>
                    <input
                        className="mt-2 h-10 w-full rounded-[8px] border border-[#DCE1E7] px-3 text-[13px] text-[#202A3C] placeholder:text-[#A6AFBC] focus:border-[#9DA7B5] focus:outline-none"
                        id="work-title"
                        name="title"
                        placeholder="업무 내용을 간단히 입력하세요"
                    />
                </div>

                <div className="mt-4">
                    <label className="block text-[13px] font-medium text-[#697386]" htmlFor="work-due-date">
                        기한
                    </label>
                    <input
                        className="mt-2 h-10 w-full rounded-[8px] border border-[#DCE1E7] px-3 text-[13px] text-[#202A3C] focus:border-[#9DA7B5] focus:outline-none"
                        id="work-due-date"
                        name="dueDate"
                        type="date"
                    />
                </div>

                <div className="mt-4 rounded-[8px] bg-[#F7F8FA] px-3 py-3 text-[12px] leading-6 text-[#A1AAB8]">
                    등록자: <strong className="font-semibold">김지수</strong> · 등록일시:{" "}
                    <strong className="font-semibold">2026.08.03 12:10</strong> · 초기 상태:{" "}
                    <strong className="font-semibold">대기</strong> — 자동 기록
                </div>

                <button
                    className="mt-4 h-11 w-full rounded-[8px] bg-[#A9ADB5] text-[14px] font-semibold text-white"
                    type="submit"
                >
                    업무 등록
                </button>
            </form>
        </div>
    );
}
