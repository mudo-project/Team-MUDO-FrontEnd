'use client'

import { Search } from "lucide-react";
import { useState } from "react";
import useDebounce from "../hooks/useDebounce";

interface SearchBarProps {
    page?: boolean;
}

export default function SearchBar({ page = true }: SearchBarProps) {
    const [searchInput, setSearchInput] = useState<string>('')

    useDebounce(searchInput, page);

    return (
        <form>

            <label className="flex h-9 w-[220px] items-center gap-2 rounded-lg border border-[#DCE8E2] bg-white px-3">
                <Search className="size-4 text-[#64748B]" strokeWidth={1.7} />
                <input
                    onChange={(e) => setSearchInput(e.target.value)}
                    value={searchInput}
                    type="search"
                    aria-label="검색"
                    placeholder="검색어를 입력해주세요"
                    className="w-full bg-transparent text-[13px] text-[#1D2B3A] outline-none placeholder:text-[#1D2B3A]/50"
                />
            </label>
        </form>
    )
}