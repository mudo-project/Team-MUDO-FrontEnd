"use client";

import useDebounce from "@/components/hooks/useDebounce";
import { Search } from "lucide-react";
import { useState } from "react";

interface MemberSearchInputProps {
    keyword: string;
}

export default function MemberSearchInput({ keyword }: MemberSearchInputProps) {
    const [searchInput, setSearchInput] = useState(keyword);

    useDebounce(searchInput, true);

    return (
        <label className="flex h-10 w-[260px] shrink-0 items-center gap-2 rounded-[8px] border border-[#D7E8DB] bg-white px-3">
            <Search
                className="size-3.5 shrink-0 text-[#94A3B8]"
                strokeWidth={1.7}
            />
            <input
                aria-label="이름 또는 역할 검색"
                className="w-full bg-transparent text-[13px] leading-normal outline-none placeholder:text-[#0F172A]/50"
                name="search"
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="이름·역할 검색"
                type="search"
                value={searchInput}
            />
        </label>
    );
}
