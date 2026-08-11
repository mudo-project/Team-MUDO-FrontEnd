import { ChevronDown, Search } from "lucide-react";

type TimetableFilterBarProps = {
  courseSearch: string;
  days: readonly { name: string }[];
  floorOptions: string[];
  onCourseSearchChange: (value: string) => void;
  onDayChange: (value: string) => void;
  onFloorChange: (value: string) => void;
  selectedDay: string;
  selectedFloor: string;
};

export default function TimetableFilterBar({
  courseSearch,
  days,
  floorOptions,
  onCourseSearchChange,
  onDayChange,
  onFloorChange,
  selectedDay,
  selectedFloor,
}: TimetableFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <label className="relative">
          <span className="sr-only">요일 선택</span>
          <select
            aria-label="요일 선택"
            className="h-9 appearance-none rounded-md border border-[#DCE9DF] bg-white py-0 pl-3 pr-8 text-[12px] text-[#526071] outline-none"
            onChange={(event) => onDayChange(event.target.value)}
            value={selectedDay}
          >
            <option value="전체">전체 요일</option>
            {days.map((day) => <option key={day.name} value={day.name}>{day.name}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-[#94A3B8]" />
        </label>
        <label className="relative">
          <span className="sr-only">층 선택</span>
          <select
            aria-label="층 선택"
            className="h-9 appearance-none rounded-md border border-[#DCE9DF] bg-white py-0 pl-3 pr-8 text-[12px] text-[#526071] outline-none"
            onChange={(event) => onFloorChange(event.target.value)}
            value={selectedFloor}
          >
            <option value="전체">전체 층</option>
            {floorOptions.map((floor) => <option key={floor} value={floor}>{floor}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-[#94A3B8]" />
        </label>
      </div>
      <label className="relative block w-full md:w-[220px]">
        <span className="sr-only">강의 검색</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#94A3B8]" />
        <input
          aria-label="강의 검색"
          className="h-9 w-full rounded-md border border-[#DCE9DF] bg-white pl-9 pr-3 text-[12px] text-[#526071] outline-none placeholder:text-[#A1ACBA]"
          onChange={(event) => onCourseSearchChange(event.target.value)}
          placeholder="강의 검색"
          value={courseSearch}
        />
      </label>
    </div>
  );
}
