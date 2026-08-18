"use client";

import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addMonths, subMonths } from "date-fns";
import dynamic from "next/dynamic";

const AttendanceDayPicker = dynamic(() => import("./AttendanceDayPicker"), {
    ssr: false,
    loading: () => <div className="min-h-[400px]" />,
});

type AttendanceCalendarProps = {
  month: Date;
  days: AttendanceMonthlyDayData[];
  pendingCorrectionDates: Set<string>;
  onChangeMonth: (month: Date) => void;
  onSelectDay: (dateStr: string) => void;
};

const LEGEND = [
  ["출근", "bg-[#0F172A]"],
  ["지각", "bg-[#B78236]"],
  ["결근", "bg-[#B45252]"],
  ["미기록", "border border-[#DCE9DF]"],
] as const;

export default function AttendanceCalendar({ month, days, pendingCorrectionDates, onChangeMonth, onSelectDay }: AttendanceCalendarProps) {
  const daysByDate = useMemo(() => {
    const map: Record<string, AttendanceMonthlyDayData> = {};
    days.forEach((day) => {
      map[day.date] = day;
    });
    return map;
  }, [days]);

  return (
    <section aria-labelledby="calendar-title" className="min-w-0">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <button aria-label="이전 달" type="button" onClick={() => onChangeMonth(subMonths(month, 1))}>
            <ChevronLeft className="size-4 text-[#718096]" />
          </button>
          <h2 id="calendar-title" className="text-[17px] font-bold">
            {month.getFullYear()}년 {month.getMonth() + 1}월
          </h2>
          <button aria-label="다음 달" type="button" onClick={() => onChangeMonth(addMonths(month, 1))}>
            <ChevronRight className="size-4 text-[#718096]" />
          </button>
        </div>
        <div className="flex flex-wrap gap-x-2 gap-y-1 text-[9px] text-[#718096]">
          {LEGEND.map(([label, dotClass]) => (
            <span className="flex items-center gap-1" key={label}>
              <i className={`size-1 rounded-full ${dotClass}`} />
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#DCE9DF] bg-white">
        <AttendanceDayPicker
          daysByDate={daysByDate}
          month={month}
          pendingCorrectionDates={pendingCorrectionDates}
          onChangeMonth={onChangeMonth}
          onSelectDay={onSelectDay}
        />
      </div>
    </section>
  );
}
