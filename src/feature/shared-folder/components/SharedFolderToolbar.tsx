import { ChevronDown, Search } from "lucide-react";

const FILTER_LABELS = ["전체", "폴더", "파일"];

export default function SharedFolderToolbar() {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <label className="flex h-9 w-[220px] items-center rounded-lg border border-[#DCE9DF] bg-white px-3">
          <Search className="h-3.5 w-3.5 shrink-0 text-[#94A3B8]" strokeWidth={1.8} />
          <input
            aria-label="파일명 검색"
            className="min-w-0 flex-1 border-0 bg-transparent pl-2 text-[12px] outline-none placeholder:text-[#94A3B8]"
            placeholder="파일명 검색"
            type="search"
          />
        </label>

        <div className="flex overflow-hidden rounded-md border border-[#E0E6E1] text-[11px]">
          {FILTER_LABELS.map((label, index) => (
            <span
              key={label}
              className={
                index === 0
                  ? "bg-[#172033] px-3 py-1.5 font-medium text-white"
                  : "border-l border-[#E0E6E1] px-3 py-1.5 text-[#718096]"
              }
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <span className="flex h-8 items-center gap-1.5 rounded-md bg-[#12182B] px-3.5 text-[11px] font-semibold text-white">
        새로 만들기
        <ChevronDown className="size-3.5" strokeWidth={2} />
      </span>
    </div>
  );
}
