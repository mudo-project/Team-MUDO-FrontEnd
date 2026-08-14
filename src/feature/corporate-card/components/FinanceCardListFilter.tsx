'use client'

import { Search } from "lucide-react";
import { useState } from "react";

const FILTERS = ["전체", "미작성", "대기", "결재중", "승인", "반려"] as const;

export default function FinanceCardListFilter() {
    const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>("전체");

    return (
        <div className="mt-4 flex items-center gap-2">
            <label className="flex h-9 w-[298px] items-center gap-2 rounded-lg border border-[#DCE9DF] bg-white px-3 text-[12px] text-[#94A3B8]">
                <Search className="size-3.5" />
                <span className="sr-only">가맹점·사용자 검색</span>
                <input
                    className="w-full outline-none placeholder:text-[#94A3B8]"
                    placeholder="가맹점·사용자 검색"
                />
            </label>
            {FILTERS.map((filter) => (
                <button
                    className={
                        `h-9 rounded-full border px-4 text-[12px]
                        ${filter === activeFilter
                            ? "border-[#172033] bg-[#172033] text-white"
                            : "border-[#DCE9DF] bg-white text-[#94A3B8]"
                        }
                    `}
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    type="button"
                >
                    {filter}
                </button>
            ))}
        </div>
    );
}
