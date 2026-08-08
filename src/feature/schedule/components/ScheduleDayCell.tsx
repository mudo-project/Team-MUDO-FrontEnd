import type { DayButtonProps } from "react-day-picker";
import { isSameDay } from "date-fns";
import { scheduleEvents } from "../dummySchedules";

export default function ScheduleDayCell({ day, modifiers, ...props }: DayButtonProps) {
  const dayEvents = scheduleEvents.filter((event) => isSameDay(event.date, day.date));
  const visibleEvents = dayEvents.slice(0, 3);
  const weekday = day.date.getDay();

  return (
    <button
      {...props}
      className="flex h-full w-full flex-col items-stretch gap-1.5 rounded-md p-2 text-left align-top disabled:opacity-40"
    >
      <span
        className={`flex size-6 items-center justify-center rounded-full text-[12px] font-semibold
          ${modifiers.outside ? "text-[#A1ACBA]" : ""}
          ${!modifiers.outside && weekday === 6 ? "text-[#4D9560]" : ""}
          ${!modifiers.outside && weekday === 0 ? "text-[#B45252]" : ""}
          ${!modifiers.outside && weekday !== 6 && weekday !== 0 ? "text-[#172033]" : ""}
          ${modifiers.selected ? "bg-[#4D9560] text-white" : ""}
        `}
      >
        {day.date.getDate()}
      </span>
      <div className="flex min-w-0 flex-col gap-1">
        {visibleEvents.map((event) =>
          event.emphasis ? (
            <p
              className="truncate rounded px-1.5 py-1 text-[11px] font-semibold"
              key={event.id}
              style={{ backgroundColor: event.background, color: event.color, borderLeft: `3px solid ${event.color}` }}
            >
              {event.title}
            </p>
          ) : (
            <p className="flex min-w-0 items-center gap-1.5 text-[11px] font-medium text-[#344054]" key={event.id}>
              <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: event.color }} />
              <span className="truncate">{event.title}</span>
            </p>
          )
        )}
        {dayEvents.length > 3 && <span className="pl-3 text-[10px] text-[#718096]">+{dayEvents.length - 3}개</span>}
      </div>
    </button>
  );
}
