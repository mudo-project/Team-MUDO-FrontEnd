"use client";

import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { addMonths, subMonths } from "date-fns";
import { ko } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import ScheduleDatePicker from "./ScheduleDatePicker";
import ScheduleDayCell from "./ScheduleDayCell";

type ScheduleCalendarProps = {
  month: Date;
  selectedDate: Date | undefined;
  onChangeMonth: (month: Date) => void;
  onSelectDate: (date: Date | undefined) => void;
};

export default function ScheduleCalendar({ month, selectedDate, onChangeMonth, onSelectDate }: ScheduleCalendarProps) {
  return (
    <section className="flex min-w-0 flex-col xl:min-h-0" aria-label={`${month.getFullYear()}년 ${month.getMonth() + 1}월 일정`}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <button
            aria-label="이전 달"
            className="flex size-9 items-center justify-center rounded-md text-[#718096] hover:bg-[#F1F5F9]"
            type="button"
            onClick={() => onChangeMonth(subMonths(month, 1))}
          >
            <ChevronLeft className="size-5" strokeWidth={1.8} />
          </button>
          <ScheduleDatePicker
            month={month.getMonth() + 1}
            year={month.getFullYear()}
            onChange={(year, nextMonth) => onChangeMonth(new Date(year, nextMonth - 1, 1))}
          />
          <button
            aria-label="다음 달"
            className="flex size-9 items-center justify-center rounded-md text-[#718096] hover:bg-[#F1F5F9]"
            type="button"
            onClick={() => onChangeMonth(addMonths(month, 1))}
          >
            <ChevronRight className="size-5" strokeWidth={1.8} />
          </button>
          <button
            className="ml-1 h-9 rounded-lg border border-[#DCE9DF] bg-white px-3 text-[12px] font-medium text-[#64748B]"
            type="button"
            onClick={() => {
              onChangeMonth(new Date());
              onSelectDate(undefined);
            }}
          >
            오늘
          </button>
        </div>
        <button
          className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg bg-[#12182B] px-4 text-[12px] font-semibold text-white"
          type="button"
        >
          <Plus className="size-4" strokeWidth={2.2} />
          일정 추가
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#DCE9DF] bg-white">
        <DayPicker
          components={{ DayButton: ScheduleDayCell }}
          locale={ko}
          mode="single"
          month={month}
          selected={selectedDate}
          showOutsideDays
          weekStartsOn={1}
          classNames={{
            root: "w-full",
            months: "w-full",
            month: "w-full",
            month_caption: "hidden",
            nav: "hidden",
            month_grid: "w-full border-collapse",
            weekdays: "grid grid-cols-7 border-b border-[#DCE9DF]",
            weekday: "py-3 text-center text-[11px] font-semibold text-[#718096]",
            week: "grid grid-cols-7 [&:last-child>td]:border-b-0",
            day: "min-h-[128px] border-b border-r border-[#E5EEE7] p-0 align-top last:border-r-0",
            outside: "text-[#A1ACBA]",
          }}
          onMonthChange={onChangeMonth}
          onSelect={onSelectDate}
        />
      </div>
    </section>
  );
}
