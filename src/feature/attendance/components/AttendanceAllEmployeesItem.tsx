"use client";

import { MessageSquare } from "lucide-react";
import { STATUS_DOT_CLASS, STATUS_LABEL, STATUS_TEXT_CLASS, type EmployeeWeekRow } from "../attendanceAllEmployeesDemo";

type AttendanceAllEmployeesItemProps = {
  employee: EmployeeWeekRow;
  onSelect: (employee: EmployeeWeekRow) => void;
};

export default function AttendanceAllEmployeesItem({ employee, onSelect }: AttendanceAllEmployeesItemProps) {
  return (
    <tr className="border-b border-[#E5EEE7] last:border-0">
      <td className="px-4 py-3">
        <button 
          className="flex items-center gap-2 text-left" 
          type="button" 
          onClick={() => onSelect(employee)}
        >
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#0F172A] text-[8px] font-bold text-white">
            {employee.name.slice(0, 1)}
          </span>
          <span>
            <strong className="block text-[12px] text-[#172033]">{employee.name}</strong>
            <span className="block text-[10px] text-[#718096]">{employee.role}</span>
          </span>
        </button>
      </td>

      {employee.days.map((day, index) => (
        <td className="px-2 py-3 text-center text-[11px]" key={index}>
          <div className={`flex items-center justify-center gap-1 ${STATUS_TEXT_CLASS[day.status]}`}>
            <i className={`size-1.5 rounded-full ${STATUS_DOT_CLASS[day.status]}`} />
            {day.status === "present" || day.status === "late" ? day.clockIn : STATUS_LABEL[day.status]}
          </div>
          {(day.status === "present" || day.status === "late") && <p className="mt-0.5 text-[#718096]">{day.clockOut}</p>}
          {day.hasNote && <MessageSquare className="mx-auto mt-0.5 size-3 text-[#94A3B8]" strokeWidth={1.8} />}
        </td>
      ))}

      <td className="px-4 py-3 text-center text-[12px] font-bold text-[#172033]">{employee.weeklyCount}</td>
    </tr>
  );
}
