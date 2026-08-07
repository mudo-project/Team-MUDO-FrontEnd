type MemoFilterProps = {
  sortOrder: "latest" | "oldest";
  onChangeSortOrder: (sortOrder: "latest" | "oldest") => void;
};

export default function MemoFilter({ sortOrder, onChangeSortOrder }: MemoFilterProps) {
    return (
        <div className="flex h-9 shrink-0 items-center justify-between border-b border-[#E6EBE7] px-3">
          <div className="flex overflow-hidden rounded-md border border-[#E0E6E1] text-[10px]">
            <button
              aria-pressed={sortOrder === "latest"}
              className={sortOrder === "latest" ? "bg-[#172033] px-2.5 py-1 font-medium text-white" : "px-2.5 py-1 text-[#718096]"}
              type="button"
              onClick={() => onChangeSortOrder("latest")}
            >
              최신순
            </button>
            <button
              aria-pressed={sortOrder === "oldest"}
              className={sortOrder === "oldest" ? "border-l border-[#172033] bg-[#172033] px-2.5 py-1 font-medium text-white" : "border-l border-[#E0E6E1] px-2.5 py-1 text-[#718096]"}
              type="button"
              onClick={() => onChangeSortOrder("oldest")}
            >
              오래된순
            </button>
          </div>
        </div>
    )
}
