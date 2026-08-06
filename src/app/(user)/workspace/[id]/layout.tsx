import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-w-0 w-full">
            <header className="min-h-[0px] border-b border-[#E7EAF0] bg-white px-2 pt-3 sm:px-2.5 md:px-4 lg:px-6 lg:pt-4">
                <div className="flex items-start">
                    <div>
                        <h2 className="text-[12px] font-bold tracking-[-0.02em] md:text-[14px] lg:text-[15px]">8월 학사 운영</h2>
                        <p className="mt-0.5 text-[10px] text-[#B0B7C2] lg:mt-1 lg:text-[11px]">참여자: 김지수, 정다운, 윤예진</p>
                    </div>

                    <div className="ml-auto flex items-center gap-1 md:gap-1.5 lg:gap-2">
                        <button className="ml-1 flex h-7 items-center rounded-[7px] bg-[#1D2639] px-2 text-[10px] font-semibold text-white md:ml-1.5 md:h-8 md:px-3 md:text-[12px] lg:ml-2 lg:h-9 lg:px-4 lg:text-[13px]">
                            <span className="mr-1 text-[14px] font-light md:mr-1.5 md:text-base lg:mr-2 lg:text-lg">＋</span>
                            업무 등록
                        </button>
                    </div>
                </div>

                <nav className="mt-2 flex h-8 items-end gap-2 sm:gap-3 md:mt-3 md:h-[34px] md:gap-5 lg:mt-4 lg:h-[36px] lg:gap-7">
                    <Link
                        href="/workspace/1/daily"
                        className="h-full border-b border-[#596273] px-2 text-[10px] font-semibold leading-[35px] md:px-3 md:text-[12px] lg:px-4 lg:text-[13px]"
                    >
                        일별
                    </Link>
                    <Link
                        href="/workspace/1/repeat"
                        className="h-full px-1 text-[10px] leading-[35px] text-[#A9B0BC] md:text-[12px] lg:text-[13px]"
                    >
                        반복 템플릿
                    </Link>
                </nav>
            </header>

            <div className="w-full">{children}</div>
        </div>
    );
}
