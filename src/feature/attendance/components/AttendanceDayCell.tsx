import type { DayButtonProps } from "react-day-picker";
import { isToday } from "date-fns";
import { formatTime, type AttendanceRecordState } from "../attendanceDemo";

type AttendanceDayCellProps = DayButtonProps & {
  record: AttendanceRecordState;
  hasEditRequest: boolean;
  onSelectToday: () => void;
};

export default function AttendanceDayCell({ day, modifiers, record, hasEditRequest, onSelectToday, ...props }: AttendanceDayCellProps) {
  const weekday = day.date.getDay();
  const isTodayCell = isToday(day.date);
  const isClickable = isTodayCell && record.clockInAt !== null;

  return (
    <button
      {...props}
      className={`flex h-full w-full flex-col items-stretch gap-1 rounded-md p-2 text-left align-top disabled:opacity-40 ${modifiers.outside ? "opacity-40" : ""}`}
      type="button"
      onClick={isClickable ? onSelectToday : undefined}
    >
      <span
        className={`flex size-6 items-center justify-center rounded-full text-[12px] font-semibold
          ${weekday === 6 ? "text-[#4D9560]" : ""}
          ${weekday === 0 ? "text-[#B45252]" : ""}
          ${weekday !== 6 && weekday !== 0 ? "text-[#172033]" : ""}
          ${isTodayCell ? "bg-[#4D9560] text-white" : ""}
        `}
      >
        {day.date.getDate()}
      </span>

      {isTodayCell && hasEditRequest && <span className="text-[8px] font-medium text-[#B78236]">수정 요청</span>}

      {isTodayCell && record.clockInAt ? (
        <div className="mt-0.5 space-y-0.5 text-[9px] font-medium text-[#172033]">
          <p>{formatTime(record.clockInAt)}</p>
          {record.clockOutAt && <p className="text-[#718096]">{formatTime(record.clockOutAt)}</p>}
        </div>
      ) : (
        <i className="ml-auto mt-0.5 size-1 rounded-full border border-[#DCE9DF]" />
      )}
    </button>
  );
}
