type TimetableExportMenuProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export default function TimetableExportMenu({
  isOpen,
  onToggle,
}: TimetableExportMenuProps) {
  return (
    <div className="relative">
      <button
        aria-controls="timetable-export-menu"
        aria-expanded={isOpen}
        className="h-10 rounded-lg border border-[#DCE9DF] bg-white px-4 text-[13px] font-medium text-[#526071]"
        onClick={onToggle}
        type="button"
      >
        내보내기
      </button>
      {isOpen && (
        <div 
          id="timetable-export-menu"
          aria-label="시간표 내보내기 옵션"
          className="absolute right-0 top-12 z-30 w-[284px] overflow-hidden rounded-xl border border-[#DCE9DF] bg-white shadow-[0_12px_24px_rgba(28,42,34,0.12)]"
        >
          <div className="divide-y divide-[#E5EEE7]">
            <button 
              className="flex w-full items-center justify-between px-4 py-3 text-left text-[13px] font-medium text-[#526071]" 
              type="button"
            >
              <span>엑셀(.xlsx)</span>
              <span className="text-[11px] text-[#94A3B8]">필터 적용 상태</span>
            </button>
            <button 
              className="flex w-full items-center justify-between px-4 py-3 text-left text-[13px] font-medium text-[#526071]" 
              type="button"
            >
              <span>PDF(A3 가로)</span>
              <span className="text-[11px] text-[#94A3B8]">인쇄용</span>
            </button>
            <button 
              className="flex w-full items-center justify-between px-4 py-3 text-left text-[13px] font-medium text-[#526071]" 
              type="button"
            >
              <span>이미지(PNG)</span>
              <span className="text-[11px] text-[#94A3B8]">필터 적용 상태</span>
            </button>
          </div>
          <p className="border-t border-[#E5EEE7] px-4 py-3 text-[11px] leading-4 text-[#94A3B8]">현재 필터·밀도·색 기준이 적용된 상태로 내보냅니다.</p>
        </div>
      )}
    </div>
  );
}
