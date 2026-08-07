import { Search } from "lucide-react";

export default function NoticeSearch() {
    return (
        <form>
            <label className="flex h-8 w-[175px] items-center rounded-lg border border-[#DCE9DF] bg-white px-3">
                <Search className="h-3.5 w-3.5 shrink-0 text-[#94A3B8]" strokeWidth={1.8} />
                <input
                    aria-label="공지 검색"
                    className="min-w-0 flex-1 border-0 bg-transparent pl-2 text-[11px] outline-none placeholder:text-[#94A3B8]"
                    id="notice-search"
                    placeholder="검색"
                    type="search"
                />
            </label>
        </form>
    );
}
