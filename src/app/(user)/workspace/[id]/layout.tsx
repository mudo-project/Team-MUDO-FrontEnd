import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-w-0 w-full">
            <header className="h-[112px] border-b border-[#E7EAF0] bg-white px-6 pt-4">
                <div className="flex items-start">
                    <div>
                        <h2 className="text-[15px] font-bold tracking-[-0.02em]">8월 학사 운영</h2>
                        <p className="mt-1 text-[11px] text-[#B0B7C2]">참여자: 김지수, 정다운, 윤예진</p>
                    </div>

                    <div className="ml-auto flex items-center gap-2">
                        <div className="flex items-center -space-x-1">
                            {[
                                ["김지", "김지수"],
                                ["정다", "정다운"],
                                ["윤예", "윤예진"],
                            ].map(([initials, name]) => (
                                <span
                                    className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#E9EDF2] text-[8px] font-semibold text-[#3F4856]"
                                    title={name}
                                    key={name}
                                >
                                    {initials}
                                </span>
                            ))}
                        </div>
                        <button className="ml-2 flex h-9 items-center rounded-[7px] bg-[#1D2639] px-4 text-[13px] font-semibold text-white">
                            <span className="mr-2 text-lg font-light">＋</span>
                            업무 등록
                        </button>
                    </div>
                </div>

                <nav className="mt-4 flex h-[36px] items-end gap-7">
                    <Link
                        href="/workspace/1/daily"
                        className="h-full border-b border-[#596273] px-4 text-[13px] font-semibold leading-[35px]"
                    >
                        일별
                    </Link>
                    <Link
                        href="/workspace/1/repeat"
                        className="h-full px-1 text-[13px] leading-[35px] text-[#A9B0BC]"
                    >
                        반복 템플릿
                    </Link>
                </nav>
            </header>

            <div className="w-full">{children}</div>
        </div>
    );
}