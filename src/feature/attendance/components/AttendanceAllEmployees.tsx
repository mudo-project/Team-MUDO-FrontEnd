"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import AttendanceAllEmployeesItem from "./AttendanceAllEmployeesItem";
import AttendanceEmployeesDetail from "./AttendanceEmployeesDetail";
import {
  EMPLOYEE_WEEK_ROWS,
  WEEKDAY_LABELS,
  WEEK_DATES,
  WEEK_LABEL,
  type EmployeeDayStatus,
  type EmployeeWeekRow,
} from "../attendanceAllEmployeesDemo";

type StatusFilter = "전체" | "지각" | "결근" | "연가";

const STATUS_FILTERS: { label: StatusFilter; status?: EmployeeDayStatus }[] = [
  { label: "전체" },
  { label: "지각", status: "late" },
  { label: "결근", status: "absent" },
  { label: "연가", status: "leave" },
];

const LEGEND = [
  ["출근", "bg-[#0F172A]"],
  ["지각", "bg-[#B78236]"],
  ["연가", "bg-[#4D9560]"],
  ["결근", "bg-[#B45252]"],
  ["미기록", "border border-[#DCE9DF]"],
] as const;

export default function AttendanceAllEmployees() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("전체");
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeWeekRow | null>(null);

  const filteredEmployees = useMemo(() => {
    const activeFilter = STATUS_FILTERS.find((filter) => filter.label === statusFilter);

    return EMPLOYEE_WEEK_ROWS.filter((employee) => {
      const matchesSearch = employee.name.includes(search.trim());
      const matchesStatus = !activeFilter?.status || employee.days.some((day) => day.status === activeFilter.status);
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  if (selectedEmployee) {
    return <AttendanceEmployeesDetail employee={selectedEmployee} onBack={() => setSelectedEmployee(null)} />;
  }

  return (
    <div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <button aria-label="이전 주" type="button">
            <ChevronLeft className="size-4 text-[#718096]" />
          </button>
          <span className="text-[13px] font-semibold text-[#172033]">{WEEK_LABEL}</span>
          <button aria-label="다음 주" type="button">
            <ChevronRight className="size-4 text-[#718096]" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#94A3B8]" />
            <input
              aria-label="이름 검색"
              className="h-9 w-40 rounded-lg border border-[#DCE9DF] bg-white pl-8 pr-3 text-[12px] text-[#172033] outline-none placeholder:text-[#94A3B8] focus:border-[#4D9560]"
              placeholder="이름 검색"
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="flex items-center gap-1">
            {STATUS_FILTERS.map((filter) => (
              <button
                className={`h-9 rounded-lg px-3 text-[12px] font-medium ${
                  statusFilter === filter.label ? "bg-[#172033] text-white" : "border border-[#DCE9DF] bg-white text-[#64748B]"
                }`}
                key={filter.label}
                type="button"
                onClick={() => setStatusFilter(filter.label)}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[9px] text-[#718096]">
            {LEGEND.map(([label, dotClass]) => (
              <span className="flex items-center gap-1" key={label}>
                <i className={`size-1.5 rounded-full ${dotClass}`} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-[#DCE9DF] bg-white">
        <table className="w-full min-w-[720px] text-left">
          <thead>
            <tr className="border-b border-[#DCE9DF] text-[11px] text-[#64748B]">
              <th className="px-4 py-3 font-medium">직원</th>
              {WEEK_DATES.map((date, index) => (
                <th className="px-2 py-3 text-center font-medium" key={date}>
                  <span className={index === 0 ? "text-[#B45252]" : index === 6 ? "text-[#4D9560]" : ""}>{WEEKDAY_LABELS[index]}</span>
                  <span className="block">{date}</span>
                </th>
              ))}
              <th className="px-4 py-3 text-center font-medium">주간 요약</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-[12px] text-[#718096]" colSpan={9}>
                  조건에 맞는 직원이 없습니다
                </td>
              </tr>
            ) : (
              filteredEmployees.map((employee) => (
                <AttendanceAllEmployeesItem 
                  employee={employee} 
                  key={employee.id} 
                  onSelect={setSelectedEmployee} 
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
