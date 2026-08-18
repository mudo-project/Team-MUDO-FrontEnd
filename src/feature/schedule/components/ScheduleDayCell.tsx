import type { DayButtonProps } from "react-day-picker";
import { isDateWithinEvent } from "../scheduleFormat";
import type { ScheduleEvent } from "../scheduleTypes";

type ScheduleDayCellProps = DayButtonProps & {
  events: ScheduleEvent[];
};

export default function ScheduleDayCell({ day, modifiers, events, ...props }: ScheduleDayCellProps) {
  const dayEvents = events.filter((event) => isDateWithinEvent(day.date, event));
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
        {visibleEvents.map((event) => (
          <p
            className="truncate rounded px-1.5 py-1 text-[11px] font-semibold"
            key={event.id}
            style={{ backgroundColor: event.color.background, color: event.color.accent, borderLeft: `3px solid ${event.color.accent}` }}
          >
            {event.title}
          </p>
        ))}
        {dayEvents.length > 3 && <span className="pl-1.5 text-[10px] text-[#718096]">+{dayEvents.length - 3}개</span>}
      </div>
    </button>
  );
}
