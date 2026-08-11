"use client";

import { ChevronLeft, MessageSquare } from "lucide-react";
import {
  STATUS_DOT_CLASS,
  STATUS_LABEL,
  STATUS_TEXT_CLASS,
  WEEKDAY_LABELS,
  WEEK_DATES,
  type EmployeeWeekRow,
} from "../attendanceAllEmployeesDemo";

type AttendanceEmployeesDetailProps = {
  employee: EmployeeWeekRow;
  onBack: () => void;
};

export default function AttendanceEmployeesDetail({ employee, onBack }: AttendanceEmployeesDetailProps) {
  const days = employee.days.slice(1);
  const dates = WEEK_DATES.slice(1);
  const weekdays = WEEKDAY_LABELS.slice(1);

  return (
    <div>
      <div className="flex items-center gap-2 text-[12px] text-[#718096]">
        <button 
          aria-label="전직원 현황으로 돌아가기" 
          className="flex items-center gap-1 text-[#718096] hover:text-[#172033]" 
          type="button" 
          onClick={onBack}
        >
          <ChevronLeft className="size-4" />
          전직원 현황
        </button>
        <span className="flex size-6 items-center justify-center rounded-full bg-[#0F172A] text-[9px] font-bold text-white">
          {employee.id.slice(0, 2).toUpperCase()}
        </span>
        <strong className="text-[15px] font-bold text-[#172033]">{employee.name}</strong>
        <span className="text-[12px] text-[#718096]">{employee.role}</span>
      </div>

      <div className="mt-4 grid grid-cols-6 divide-x divide-[#E5EEE7] overflow-hidden rounded-xl border border-[#DCE9DF] bg-white">
        {days.map((day, index) => (
          <div className={`px-3 py-4 text-center ${index === 0 ? "bg-[#F1F5F2]" : ""}`} key={dates[index]}>
            <p className={`text-[11px] font-medium ${index === 0 ? "font-semibold text-[#172033]" : "text-[#718096]"}`}>
              {weekdays[index]} {dates[index]}
            </p>
            <div className={`mt-3 flex items-center justify-center gap-1.5 text-[12px] ${STATUS_TEXT_CLASS[day.status]}`}>
              <i className={`size-1.5 rounded-full ${STATUS_DOT_CLASS[day.status]}`} />
              {STATUS_LABEL[day.status]}
            </div>
            {day.status === "present" || day.status === "late" ? (
              <p className="mt-1 text-[12px] text-[#172033]">
                {day.clockIn} · {day.clockOut}
              </p>
            ) : null}
            {day.hasNote && (
              <div className="mt-1 flex items-center justify-center">
                <MessageSquare className="size-3 text-[#94A3B8]" strokeWidth={1.8} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
