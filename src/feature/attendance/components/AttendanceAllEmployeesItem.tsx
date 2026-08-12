import { ATTENDANCE_STATUS_DOT_CLASS, ATTENDANCE_STATUS_LABEL, ATTENDANCE_STATUS_TEXT_CLASS, formatClockTime } from "../attendanceFormat";

export type EmployeeWeeklyDayCell = {
  date: string;
  status: AttendanceStatus;
  clockInAt: string | null;
};

export type EmployeeWeeklyRow = {
  userId: number;
  name: string;
  attendedDays: number;
  scheduledWorkDays: number;
  days: EmployeeWeeklyDayCell[];
};

type AttendanceAllEmployeesItemProps = {
  employee: EmployeeWeeklyRow;
  onSelect: (employee: EmployeeWeeklyRow) => void;
};

export default function AttendanceAllEmployeesItem({ employee, onSelect }: AttendanceAllEmployeesItemProps) {
  return (
    <tr className="border-b border-[#E5EEE7] last:border-0">
      <td className="px-4 py-3">
        <button className="flex items-center gap-2 text-left" type="button" onClick={() => onSelect(employee)}>
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#0F172A] text-[8px] font-bold text-white">
            {employee.name.slice(0, 1)}
          </span>
          <strong className="block text-[12px] text-[#172033]">{employee.name}</strong>
        </button>
      </td>

      {employee.days.map((day) => (
        <td className="px-2 py-3 text-center text-[11px]" key={day.date}>
          <div className={`flex items-center justify-center gap-1 ${ATTENDANCE_STATUS_TEXT_CLASS[day.status]}`}>
            <i className={`size-1.5 rounded-full ${ATTENDANCE_STATUS_DOT_CLASS[day.status]}`} />
            {day.status === "NORMAL" || day.status === "LATE" ? formatClockTime(day.clockInAt) : ATTENDANCE_STATUS_LABEL[day.status]}
          </div>
        </td>
      ))}

      <td className="px-4 py-3 text-center text-[12px] font-bold text-[#172033]">
        {employee.attendedDays}/{employee.scheduledWorkDays}
      </td>
    </tr>
  );
}
