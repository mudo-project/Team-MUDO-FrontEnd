"use client";

import { ChevronLeft } from "lucide-react";
import {
  STATUS_DOT_CLASS,
  STATUS_LABEL,
  STATUS_TEXT_CLASS,
  type EmployeeWeekRow,
} from "../attendanceAllEmployeesDemo";

type AttendanceEmployeesDetailProps = {
  employee: EmployeeWeekRow;
  weekDates: string[];
  weekdayLabels: string[];
  onBack: () => void;
};

export default function AttendanceEmployeesDetail({ employee, weekDates, weekdayLabels, onBack }: AttendanceEmployeesDetailProps) {
  const days = employee.days.slice(1);
  const dates = weekDates.slice(1);
  const weekdays = weekdayLabels.slice(1);

  return (
    <div>
      <div className="space-y-3">
        <button 
          aria-label="전직원 현황으로 돌아가기"
          className="flex items-center gap-1 text-[#718096] hover:text-[#172033]" 
          type="button" 
          onClick={onBack}
        >
          <ChevronLeft className="size-4" />
          전직원 현황
        </button>
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-[#0F172A] text-[9px] font-bold text-white">
            {employee.id.slice(0, 2).toUpperCase()}
          </span>
          <div>
            <strong className="block text-[15px] font-bold text-[#172033]">{employee.name}</strong>
            <span className="block text-[12px] text-[#718096]">{employee.role}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-6 divide-x divide-[#E5EEE7] overflow-hidden rounded-xl border border-[#DCE9DF] bg-white">
        {days.map((day, index) => (
          <div className={`py-4 text-center ${index === 0 ? "bg-[#F1F5F2]" : ""}`} key={dates[index]}>
            <p className={`px-3 text-[11px] font-medium ${index === 0 ? "font-semibold text-[#172033]" : "text-[#718096]"}`}>
              {weekdays[index]} {dates[index]}
            </p>
            <div className="mt-3 border-t border-[#E5EEE7] px-3 pt-3">
              <div className={`flex items-center justify-center gap-1.5 text-[12px] ${STATUS_TEXT_CLASS[day.status]}`}>
                <i className={`size-1.5 rounded-full ${STATUS_DOT_CLASS[day.status]}`} />
                {STATUS_LABEL[day.status]}
              </div>
              {day.status === "present" || day.status === "late" ? (
                <p className="mt-1 text-[12px] text-[#172033]">
                  {day.clockIn} · {day.clockOut}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
