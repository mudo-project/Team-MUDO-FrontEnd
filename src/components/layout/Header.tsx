import { Menu, Search } from "lucide-react";

export default function Header() {
    return (
        <header className="flex h-13 w-full items-center border-b border-[#D7E8DB] bg-white px-5 text-[#0F172A]">
            <button
                className="flex h-8 w-8 items-center justify-center text-[#64748B]"
                type="button"
                aria-label="사이드바 메뉴 열기"
            >
                <Menu className="h-5 w-5" strokeWidth={1.8} />
            </button>


            <span className="ml-auto text-[12px] text-[#64748B]">2026년 8월 4일 화요일</span>

            <button
                className="ml-3 flex h-[30px] items-center rounded-[6px] border border-[#D7E8DB] bg-white px-3 text-[10px] text-[#64748B]"
                type="button"
            >
                <Search className="mr-1.5 h-3.5 w-3.5" strokeWidth={1.8} />
                검색
            </button>
        </header>
    );
}
