import type { DayButtonProps } from "react-day-picker";
import { format } from "date-fns";
import { ATTENDANCE_STATUS_DOT_CLASS, formatClockTime } from "../attendanceFormat";

type AttendanceDayCellProps = DayButtonProps & {
  daysByDate: Record<string, AttendanceMonthlyDayData>;
  pendingCorrectionDates: Set<string>;
  onSelectDay: (dateStr: string) => void;
};

export default function AttendanceDayCell({ day, modifiers, daysByDate, pendingCorrectionDates, onSelectDay, ...props }: AttendanceDayCellProps) {
  const weekday = day.date.getDay();
  const dateStr = format(day.date, "yyyy-MM-dd");
  const dayData = daysByDate[dateStr];
  const hasRecord = Boolean(dayData?.clockInAt);
  const hasPendingRequest = pendingCorrectionDates.has(dateStr);

  return (
    <button
      {...props}
      className={`flex h-full w-full flex-col items-stretch gap-1 rounded-md p-2 text-left align-top disabled:opacity-40 ${modifiers.outside ? "opacity-40" : ""}`}
      type="button"
      onClick={hasRecord ? () => onSelectDay(dateStr) : undefined}
    >
      <span
        className={`flex size-6 items-center justify-center rounded-full text-[12px] font-semibold
          ${weekday === 6 ? "text-[#4D9560]" : ""}
          ${weekday === 0 ? "text-[#B45252]" : ""}
          ${weekday !== 6 && weekday !== 0 ? "text-[#172033]" : ""}
          ${modifiers.today ? "bg-[#4D9560] text-white" : ""}
        `}
      >
        {day.date.getDate()}
      </span>

      {hasPendingRequest && <span className="text-[8px] font-medium text-[#B78236]">수정 요청</span>}

      {dayData && dayData.status !== "UNRECORDED" ? (
        <div className="mt-0.5 space-y-0.5 text-[9px] font-medium text-[#172033]">
          <div className="flex items-center gap-1">
            <i className={`size-1.5 rounded-full ${ATTENDANCE_STATUS_DOT_CLASS[dayData.status]}`} />
            <span>{formatClockTime(dayData.clockInAt)}</span>
          </div>
          {dayData.clockOutAt && <p className="pl-2.5 text-[#718096]">{formatClockTime(dayData.clockOutAt)}</p>}
        </div>
      ) : (
        <i className="ml-auto mt-0.5 size-1 rounded-full border border-[#DCE9DF]" />
      )}
    </button>
  );
}
