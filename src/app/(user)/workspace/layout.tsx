import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-[#FCFDFE] text-[#202A3C]">
            <aside className="w-[228px] shrink-0 border-r border-[#E7EAF0] bg-white">
                <div className="flex h-[58px] items-center border-b border-[#EEF0F3] px-4">
                    <h1 className="text-[14px] font-bold tracking-[-0.02em]">워크스페이스</h1>
                    <button
                        className="ml-auto flex h-6 w-6 items-center justify-center rounded-[6px] border border-[#DDE2E8] text-[18px] font-light text-[#A6AFBD]"
                        aria-label="워크스페이스 추가"
                    >
                        +
                    </button>
                </div>

                <nav className="px-2 py-3">
                    <Link
                        href="/workspace"
                        className="flex h-10 items-center rounded-[6px] px-3 text-[13px] text-[#6F7988]"
                    >
                        <span className="mr-2 flex h-3.5 w-3.5 items-center justify-center rounded-[2px] border border-[#AAB3C0] text-[9px]">
                            ✓
                        </span>
                        내 업무 모아보기
                    </Link>

                    <div className="my-2 border-t border-[#EFF1F4]" />

                    <Link
                        href="/workspace/daily"
                        className="block rounded-[7px] bg-[#F5F6F8] px-3 py-3"
                    >
                        <strong className="block text-[13px] font-semibold">8월 학사 운영</strong>
                        <span className="mt-1 block text-[11px] text-[#AEB6C2]">참여자 3명 · 7건</span>
                    </Link>

                    <Link href="/workspace/repeat" className="block rounded-[7px] px-3 py-3">
                        <strong className="block text-[13px] font-medium">신규 강사 온보딩</strong>
                        <span className="mt-1 block text-[11px] text-[#AEB6C2]">참여자 3명 · 4건</span>
                    </Link>
                </nav>
            </aside>
            <div className="w-full">{children}</div>
        </div>
    );
}
