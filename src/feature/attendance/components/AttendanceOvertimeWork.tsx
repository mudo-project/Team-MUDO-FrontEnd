"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AlertTriangle, X } from "lucide-react";
import { attendanceOvertimeSchema, type AttendanceOvertimeFormValues } from "@/lib/attendanceOvertimeSchema";
import { formatClockTime, formatDateWithWeekday, formatTimeOfDate } from "../attendanceFormat";

type AttendanceOvertimeWorkProps = {
  now: Date;
  today: AttendanceTodayData;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
};

export default function AttendanceOvertimeWork({ now, today, onCancel, onConfirm }: AttendanceOvertimeWorkProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AttendanceOvertimeFormValues>({
    resolver: zodResolver(attendanceOvertimeSchema),
    defaultValues: { reason: "" },
  });

  const submit = (values: AttendanceOvertimeFormValues) => {
    onConfirm(values.reason.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <form className="w-full max-w-[420px] rounded-2xl bg-white p-6" onSubmit={handleSubmit(submit)}>
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-[#172033]">초과근무 기록</h2>
          <button aria-label="닫기" className="text-[#94A3B8] hover:text-[#64748B]" type="button" onClick={onCancel}>
            <X className="size-5" strokeWidth={1.8} />
          </button>
        </div>

        <div className="mt-4 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] text-amber-700">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" strokeWidth={1.8} />
          <p>정규 근무 시간({formatClockTime(today.workEndTime)})이 종료되었습니다. 초과근무로 퇴근을 기록합니다.</p>
        </div>

        <div className="mt-4 rounded-lg bg-[#F8FAFC] px-4 py-3 text-[13px] text-[#344054]">
          초과근무 퇴근 · {formatDateWithWeekday(now)} {formatTimeOfDate(now)}
        </div>

        <div className="mt-4">
          <label className="text-[12px] font-medium text-[#344054]" htmlFor="attendance-overtime-reason">
            초과근무 사유 (필수)
          </label>
          <textarea
            className="mt-2 min-h-32 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px] text-[#172033] outline-none placeholder:text-[#94A3B8] focus:border-[#4D9560] focus:ring-2 focus:ring-[#4D9560]/20"
            id="attendance-overtime-reason"
            placeholder="예: 학부모 상담 연장, 시험 문제 출제"
            {...register("reason")}
          />
          {errors.reason && <p className="mt-1 text-[11px] text-[#C65A50]">{errors.reason.message}</p>}
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button className="h-10 rounded-lg border border-[#DCE9DF] bg-white px-4 text-[13px] font-medium text-[#64748B]" type="button" onClick={onCancel}>
            취소
          </button>
          <button className="h-10 rounded-lg bg-[#172033] px-4 text-[13px] font-semibold text-white" type="submit">
            초과근무 기록
          </button>
        </div>
      </form>
    </div>
  );
}
