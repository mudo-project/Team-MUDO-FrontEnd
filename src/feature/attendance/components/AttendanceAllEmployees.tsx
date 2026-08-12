"use client";

import { useEffect, useState } from "react";
import { addWeeks, eachDayOfInterval, format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import AttendanceAllEmployeesItem, { type EmployeeWeeklyRow } from "./AttendanceAllEmployeesItem";
import AttendanceEmployeesDetail from "./AttendanceEmployeesDetail";
import { getEmployeesWeeklyAction } from "../actions";

type StatusFilter = "전체" | "LATE" | "ABSENT";

const STATUS_FILTERS: { label: StatusFilter; status?: AttendanceStatus }[] = [
  { label: "전체" },
  { label: "LATE", status: "LATE" },
  { label: "ABSENT", status: "ABSENT" },
];

const STATUS_FILTER_LABEL: Record<StatusFilter, string> = {
  전체: "전체",
  LATE: "지각",
  ABSENT: "결근",
};

const LEGEND = [
  ["출근", "bg-[#0F172A]"],
  ["지각", "bg-[#B78236]"],
  ["결근", "bg-[#B45252]"],
  ["미기록", "border border-[#DCE9DF]"],
] as const;

function today(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export default function AttendanceAllEmployees() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("전체");
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeWeeklyRow | null>(null);
  const [weekData, setWeekData] = useState<AttendanceEmployeesWeeklyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const activeFilter = STATUS_FILTERS.find((filter) => filter.label === statusFilter);

    getEmployeesWeeklyAction({
      date: selectedDate,
      keyword: search.trim() || undefined,
      status: activeFilter?.status,
    })
      .then((data) => {
        if (!cancelled) setWeekData(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "전 직원 주간 출결 현황 조회에 실패하였습니다.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedDate, search, statusFilter]);

  if (selectedEmployee) {
    return (
      <AttendanceEmployeesDetail
        key={`${selectedEmployee.userId}:${selectedDate}`}
        date={selectedDate}
        employee={selectedEmployee}
        onBack={() => setSelectedEmployee(null)}
      />
    );
  }

  const weekDays = weekData ? eachDayOfInterval({ start: parseISO(weekData.week.startDate), end: parseISO(weekData.week.endDate) }) : [];
  const weekLabel = weekData ? `${format(parseISO(weekData.week.startDate), "MM.dd")} ~ ${format(parseISO(weekData.week.endDate), "MM.dd")}` : "";

  return (
    <div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <button
            aria-label="이전 주"
            type="button"
            onClick={() => {
              setIsLoading(true);
              setError(null);
              setSelectedDate((prev) => format(addWeeks(parseISO(prev), -1), "yyyy-MM-dd"));
            }}
          >
            <ChevronLeft className="size-4 text-[#718096]" />
          </button>
          <label className="flex items-center gap-2 text-[13px] font-semibold text-[#172033]">
            <span>{weekLabel}</span>
            <span className="sr-only">조회 날짜</span>
            <input
              aria-label="조회 날짜"
              className="h-8 rounded-lg border border-[#DCE9DF] bg-white px-2 text-[12px] font-medium text-[#172033] outline-none focus:border-[#4D9560]"
              type="date"
              value={selectedDate}
              onChange={(event) => {
                setIsLoading(true);
                setError(null);
                setSelectedDate(event.target.value);
              }}
            />
          </label>
          <button
            aria-label="다음 주"
            type="button"
            onClick={() => {
              setIsLoading(true);
              setError(null);
              setSelectedDate((prev) => format(addWeeks(parseISO(prev), 1), "yyyy-MM-dd"));
            }}
          >
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
              onChange={(event) => {
                setIsLoading(true);
                setError(null);
                setSearch(event.target.value);
              }}
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
                onClick={() => {
                  if (statusFilter === filter.label) return;

                  setIsLoading(true);
                  setError(null);
                  setStatusFilter(filter.label);
                }}
              >
                {STATUS_FILTER_LABEL[filter.label]}
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
              {weekDays.map((date, index) => (
                <th className="px-2 py-3 text-center font-medium" key={date.toISOString()}>
                  <span className={index === 6 ? "text-[#4D9560]" : ""}>{format(date, "EEEEE", { locale: ko })}</span>
                  <span className="block">{format(date, "MM.dd")}</span>
                </th>
              ))}
              <th className="px-4 py-3 text-center font-medium">주간 요약</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="px-4 py-8 text-center text-[12px] text-[#718096]" colSpan={9}>
                  불러오는 중입니다...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td className="px-4 py-8 text-center text-[12px] text-[#C65A50]" colSpan={9}>
                  {error}
                </td>
              </tr>
            ) : !weekData || weekData.employees.content.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-[12px] text-[#718096]" colSpan={9}>
                  조건에 맞는 직원이 없습니다
                </td>
              </tr>
            ) : (
              weekData.employees.content.map((employee) => {
                const rowDays = weekDays.map((date) => {
                  const dateStr = format(date, "yyyy-MM-dd");
                  const found = employee.days.find((day) => day.date === dateStr);
                  return found ?? { date: dateStr, status: "UNRECORDED" as AttendanceStatus, clockInAt: null };
                });

                return (
                  <AttendanceAllEmployeesItem employee={{ ...employee, days: rowDays }} key={employee.userId} onSelect={setSelectedEmployee} />
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
