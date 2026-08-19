"use client";

import { X } from "lucide-react";
import { areIntervalsOverlapping, endOfMonth, format, startOfMonth } from "date-fns";
import ScheduleListItem from "./ScheduleListItem";
import { formatEventDate, isDateWithinEvent } from "../scheduleFormat";
import type { ScheduleEvent } from "../scheduleTypes";

type ScheduleListProps = {
  month: Date;
  events: ScheduleEvent[];
  selectedDate: Date | undefined;
  onClearSelectedDate: () => void;
  onSelectEvent: (event: ScheduleEvent) => void;
};

export default function ScheduleList({ month, events, selectedDate, onClearSelectedDate, onSelectEvent }: ScheduleListProps) {
  const monthRange = { start: startOfMonth(month), end: endOfMonth(month) };
  // inclusive: true — 이벤트 종료일이 정확히 이번 달 1일 자정과 같을 때(전달부터 이번 달 1일까지 걸치는 일정)도
  // 겹침으로 인식해야 하므로 경계가 맞닿는 경우까지 포함한다.
  const monthEvents = events.filter((event) =>
    areIntervalsOverlapping({ start: event.startDate, end: event.endDate }, monthRange, { inclusive: true })
  );
  const filteredEvents = selectedDate ? monthEvents.filter((event) => isDateWithinEvent(selectedDate, event)) : monthEvents;

  return (
    <section
      className="flex min-w-0 flex-col rounded-xl border border-[#DCE9DF] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.02)] xl:min-h-0"
      aria-label={`${format(month, "M")}월 일정`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-bold">
          {selectedDate ? formatEventDate(selectedDate) : `${format(month, "M")}월 일정`}
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
