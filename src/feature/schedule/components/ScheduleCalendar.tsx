"use client";

import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { addMonths, format, subMonths } from "date-fns";
import dynamic from "next/dynamic";
import ScheduleDatePicker from "./ScheduleDatePicker";
import type { ScheduleEvent } from "../scheduleTypes";

const ScheduleDayPicker = dynamic(() => import("./ScheduleDayPicker"), {
    ssr: false,
    loading: () => <div className="min-h-[400px]" />,
});

type ScheduleCalendarProps = {
  month: Date;
  events: ScheduleEvent[];
  selectedDate: Date | undefined;
  onChangeMonth: (month: Date) => void;
  onSelectDate: (date: Date | undefined) => void;
  onAddClick: () => void;
};

export default function ScheduleCalendar({
  month,
  events,
  selectedDate,
  onChangeMonth,
  onSelectDate,
  onAddClick,
}: ScheduleCalendarProps) {
  return (
    <section className="flex min-w-0 flex-col xl:min-h-0" aria-label={`${format(month, "yyyy년 M월")} 일정`}>
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
          onClick={onAddClick}
        >
          <Plus className="size-4" strokeWidth={2.2} />
          일정 추가
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-[#DCE9DF] bg-white">
        <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hide">
          <ScheduleDayPicker
            events={events}
            month={month}
            selectedDate={selectedDate}
            onChangeMonth={onChangeMonth}
            onSelectDate={onSelectDate}
          />
        </div>
      </div>
    </section>
  );
}
