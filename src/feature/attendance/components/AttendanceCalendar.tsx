"use client";

import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addMonths, subMonths } from "date-fns";
import { ko } from "date-fns/locale";
import { DayPicker, type DayButtonProps } from "react-day-picker";
import AttendanceDayCell from "./AttendanceDayCell";

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
        <DayPicker
          components={{
            DayButton: (props: DayButtonProps) => (
              <AttendanceDayCell
                {...props}
                daysByDate={daysByDate}
                pendingCorrectionDates={pendingCorrectionDates}
                onSelectDay={onSelectDay}
              />
            ),
          }}
          locale={ko}
          mode="single"
          month={month}
          selected={undefined}
          showOutsideDays
          weekStartsOn={0}
          onSelect={() => {}}
          classNames={{
            root: "w-full",
            months: "w-full",
            month: "w-full",
            month_caption: "hidden",
            nav: "hidden",
            month_grid: "w-full border-collapse",
            weekdays: "grid grid-cols-7 border-b border-[#DCE9DF] text-center",
            weekday: "py-2.5 text-[10px] font-medium text-[#64748B]",
            week: "grid grid-cols-7",
            day: "relative min-h-[82px] border-b border-r border-[#E5EEE7] p-0 align-top [&:nth-child(7n)]:border-r-0 [&:nth-last-child(-n+7)]:border-b-0 sm:min-h-[100px]",
            outside: "text-[#718096]",
          }}
          onMonthChange={onChangeMonth}
        />
      </div>
    </section>
  );
}
