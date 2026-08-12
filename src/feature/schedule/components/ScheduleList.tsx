"use client";

import { X } from "lucide-react";
import { isSameDay, isSameMonth } from "date-fns";
import ScheduleListItem from "./ScheduleListItem";
import { formatEventDate } from "../scheduleFormat";
import type { ScheduleEvent } from "../scheduleTypes";

type ScheduleListProps = {
  month: Date;
  events: ScheduleEvent[];
  selectedDate: Date | undefined;
  onClearSelectedDate: () => void;
  onSelectEvent: (event: ScheduleEvent) => void;
};

export default function ScheduleList({ month, events, selectedDate, onClearSelectedDate, onSelectEvent }: ScheduleListProps) {
  const monthEvents = events.filter((event) => isSameMonth(event.date, month));
  const filteredEvents = selectedDate ? monthEvents.filter((event) => isSameDay(event.date, selectedDate)) : monthEvents;

  return (
    <section
      className="flex min-w-0 flex-col rounded-xl border border-[#DCE9DF] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.02)] xl:min-h-0"
      aria-label={`${month.getMonth() + 1}월 일정`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-bold">
          {selectedDate ? formatEventDate(selectedDate) : `${month.getMonth() + 1}월 일정`}
        </h2>
        {selectedDate ? (
          <button aria-label="날짜 선택 해제" className="text-[#718096]" type="button" onClick={onClearSelectedDate}>
            <X className="size-4" strokeWidth={1.8} />
          </button>
        ) : (
          <span className="text-[11px] text-[#718096]">총 {monthEvents.length}건</span>
        )}
      </div>

      {filteredEvents.length === 0 ? (
        <p className="mt-4 flex flex-1 items-center justify-center text-center text-[13px] text-[#718096]">
          {selectedDate ? "이 날짜에 등록된 일정이 없습니다." : "이 달에 등록된 일정이 없습니다."}
        </p>
      ) : (
        <ol className="mt-4 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
          {filteredEvents.map((event) => (
            <ScheduleListItem event={event} key={event.id} onClick={() => onSelectEvent(event)} />
          ))}
        </ol>
      )}
    </section>
  );
}
