export default function Header() {
    return (
        <header className="fixed flex h-16 w-full items-center border-b border-[#E4E7EB] bg-white text-[#202A3C] px-4">

            <button
                className="flex h-7 w-7 items-center justify-center text-[#626C7A]"
                type="button"
                aria-label="메뉴 열기"
            >
                <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    aria-hidden="true"
                >
                    <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
            </button>

            <div className="ml-1 flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#1D2638]">

            </div>

            <div className="ml-2 leading-none">
                <strong className="block text-[13px] font-bold">아카데미</strong>
                <span className="mt-1 block text-[10px] text-[#B1B8C2]">그룹웨어</span>
            </div>

            <div className="ml-auto flex items-center">
                <span className="text-[11px] text-[#A5ADBA]">2026년 8월 3일 월요일</span>
                <div
                    className="ml-3 flex h-9 w-40 items-center rounded-[5px] border border-[#E0E4E9] bg-[#F7F8FA] px-3 text-[9px] text-[#7E8795]"
                >
                    <svg
                        className="mr-1.5 h-3 w-3"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                    >
                        <circle cx="11" cy="11" r="7" />
                        <path d="m20 20-4-4" />
                    </svg>
                    <input
                        className="focus:outline-none"
                        placeholder="검색" />
                </div>
            </div>
        </header>
    );
}
