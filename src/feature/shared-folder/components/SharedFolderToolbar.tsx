import { ChevronDown, Search } from "lucide-react";

import SharedFolderCreateMenu from "./SharedFolderCreateMenu";
import type { SharedFolderCreateOption } from "./SharedFolderCreateMenu";

type SharedFolderFilter = "ALL" | "FOLDER" | "FILE";

type SharedFolderToolbarProps = {
  filter: SharedFolderFilter;
  isCreateMenuOpen: boolean;
  searchQuery: string;
  onCreateMenuSelect: (option: SharedFolderCreateOption) => void;
  onFileUploadRequest: () => void;
  onCreateMenuToggle: () => void;
  onFilterChange: (filter: SharedFolderFilter) => void;
  onSearchQueryChange: (searchQuery: string) => void;
};

const FILTER_OPTIONS: { label: string; value: SharedFolderFilter }[] = [
  { label: "전체", value: "ALL" },
  { label: "폴더", value: "FOLDER" },
  { label: "파일", value: "FILE" },
];

export default function SharedFolderToolbar({
  filter,
  isCreateMenuOpen,
  searchQuery,
  onCreateMenuSelect,
  onCreateMenuToggle,
  onFileUploadRequest,
  onFilterChange,
  onSearchQueryChange,
}: SharedFolderToolbarProps) {
  const handleCreateMenuSelect = (option: SharedFolderCreateOption) => {
    onCreateMenuSelect(option);

    if (option === "UPLOAD") {
      onFileUploadRequest();
    }
  };

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
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
          />
        </label>

        <div className="flex overflow-hidden rounded-md border border-[#E0E6E1] text-[11px]">
          {FILTER_OPTIONS.map(({ label, value }, index) => {
            const isSelected = filter === value;

            return (
              <button
                key={value}
                aria-pressed={isSelected}
                className={
                  isSelected
                    ? "bg-[#172033] px-3 py-1.5 font-medium text-white"
                    : `${index > 0 ? "border-l border-[#E0E6E1] " : ""}px-3 py-1.5 text-[#718096]`
                }
                type="button"
                onClick={() => onFilterChange(value)}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div data-shared-folder-create-control className="relative">
        <button
          aria-expanded={isCreateMenuOpen}
          className="flex h-8 items-center gap-1.5 rounded-md bg-[#12182B] px-3.5 text-[11px] font-semibold text-white"
          type="button"
          onClick={onCreateMenuToggle}
        >
          새로 만들기
          <ChevronDown className="size-3.5" strokeWidth={2} />
        </button>
        {isCreateMenuOpen && <SharedFolderCreateMenu onSelect={handleCreateMenuSelect} />}
      </div>
    </div>
  );
}
