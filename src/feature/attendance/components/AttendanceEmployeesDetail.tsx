"use client";

import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { eachDayOfInterval, format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { getEmployeeWeeklyAction } from "../actions";
import { ATTENDANCE_STATUS_DOT_CLASS, ATTENDANCE_STATUS_LABEL, ATTENDANCE_STATUS_TEXT_CLASS, formatClockTime } from "../attendanceFormat";
import type { EmployeeWeeklyRow } from "./AttendanceAllEmployeesItem";

type AttendanceEmployeesDetailProps = {
  employee: EmployeeWeeklyRow;
  date: string;
  onBack: () => void;
};

export default function AttendanceEmployeesDetail({ employee, date, onBack }: AttendanceEmployeesDetailProps) {
  const [detail, setDetail] = useState<AttendanceEmployeeWeeklyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    getEmployeeWeeklyAction(employee.userId, { date })
      .then((data) => {
        if (!cancelled) setDetail(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "직원 주간 출결 조회에 실패하였습니다.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [employee.userId, date]);

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
          {employee.name.slice(0, 1)}
        </span>
        <strong className="text-[15px] font-bold text-[#172033]">{employee.name}</strong>
        {detail?.employee.position && <span className="text-[12px] text-[#718096]">{detail.employee.position}</span>}
      </div>

      {isLoading && <p className="mt-4 py-8 text-center text-[12px] text-[#718096]">불러오는 중입니다...</p>}
      {error && <p className="mt-4 py-8 text-center text-[12px] text-[#C65A50]">{error}</p>}

      {detail && !isLoading && !error && (
        <div className="mt-4 grid grid-cols-7 divide-x divide-[#E5EEE7] overflow-hidden rounded-xl border border-[#DCE9DF] bg-white">
          {eachDayOfInterval({ start: parseISO(detail.week.startDate), end: parseISO(detail.week.endDate) }).map((dateObj, index) => {
            const dateStr = format(dateObj, "yyyy-MM-dd");
            const day = detail.days.find((item) => item.date === dateStr);
            const status: AttendanceStatus = day?.status ?? "UNRECORDED";

            return (
              <div className={`px-3 py-4 text-center ${index === 0 ? "bg-[#F1F5F2]" : ""}`} key={dateStr}>
                <p className={`text-[11px] font-medium ${index === 0 ? "font-semibold text-[#172033]" : "text-[#718096]"}`}>
                  {format(dateObj, "EEEEE", { locale: ko })} {format(dateObj, "MM.dd")}
                </p>
                <div className={`mt-3 flex items-center justify-center gap-1.5 text-[12px] ${ATTENDANCE_STATUS_TEXT_CLASS[status]}`}>
                  <i className={`size-1.5 rounded-full ${ATTENDANCE_STATUS_DOT_CLASS[status]}`} />
                  {ATTENDANCE_STATUS_LABEL[status]}
                </div>
                {(status === "NORMAL" || status === "LATE") && day && (
                  <p className="mt-1 text-[12px] text-[#172033]">
                    {formatClockTime(day.clockInAt)} · {formatClockTime(day.clockOutAt)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
