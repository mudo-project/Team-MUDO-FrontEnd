import { Search } from "lucide-react";

export default function NoticeSearch({ defaultValue }: { defaultValue?: string }) {
    return (
        <form className="w-full sm:w-auto">
            <label className="flex h-8 w-full items-center rounded-lg border border-[#DCE9DF] bg-white px-3 sm:w-[175px]">
                <Search className="h-3.5 w-3.5 shrink-0 text-[#94A3B8]" strokeWidth={1.8} />
                <input
                    aria-label="공지 검색"
                    className="min-w-0 flex-1 border-0 bg-transparent pl-2 text-[11px] outline-none placeholder:text-[#94A3B8]"
                    defaultValue={defaultValue}
                    id="notice-search"
                    name="keyword"
                    placeholder="검색"
                    type="search"
                />
            </label>
        </form>
    );
}
