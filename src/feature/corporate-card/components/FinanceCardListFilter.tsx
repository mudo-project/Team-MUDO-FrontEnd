import { Search } from "lucide-react";

const FILTERS = ["전체", "미작성", "진행중", "승인됨", "반려됨"] as const;
export type FinanceCardFilter = (typeof FILTERS)[number];

interface FinanceCardListFilterProps {
    activeFilter: FinanceCardFilter;
    searchQuery: string;
    onChangeFilter: (filter: FinanceCardFilter) => void;
    onChangeSearchQuery: (query: string) => void;
}

export default function FinanceCardListFilter({ activeFilter, searchQuery, onChangeFilter, onChangeSearchQuery }: FinanceCardListFilterProps) {
    return (
        <div className="mt-5 flex items-center gap-2">
            <label className="flex h-9 w-[300px] items-center gap-2 rounded-lg border border-[#DCE9DF] bg-white px-3 text-[12px] text-[#94A3B8]">
                <Search className="size-3.5" />
                <span className="sr-only">가맹점·사용자 검색</span>
                <input
                    className="w-full outline-none placeholder:text-[#94A3B8]"
                    onChange={(event) => onChangeSearchQuery(event.target.value)}
                    placeholder="가맹점·사용자 검색"
                    value={searchQuery}
                />
            </label>
            {FILTERS.map((filter) => (
                <button
                    className={
                        `h-9 rounded-full border px-4 text-[12px] font-medium
                        ${filter === activeFilter
                            ? "border-[#172033] bg-[#172033] text-white"
                            : "border-[#DCE9DF] bg-white text-[#94A3B8]"
                        }
                    `}
                    key={filter}
                    onClick={() => onChangeFilter(filter)}
                    type="button"
                >
                    {filter}
                </button>
            ))}
        </div>
    );
}
