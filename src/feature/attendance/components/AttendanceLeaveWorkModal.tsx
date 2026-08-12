"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { attendanceCheckOutSchema, type AttendanceCheckOutFormValues } from "@/lib/attendanceCheckOutSchema";
import { formatClockTime, formatDateWithWeekday, formatDuration, formatTimeOfDate } from "../attendanceFormat";

type AttendanceLeaveWorkModalProps = {
  now: Date;
  today: AttendanceTodayData;
  onCancel: () => void;
  onConfirm: (note: string) => void;
};

export default function AttendanceLeaveWorkModal({ now, today, onCancel, onConfirm }: AttendanceLeaveWorkModalProps) {
  const { register, handleSubmit } = useForm<AttendanceCheckOutFormValues>({
    resolver: zodResolver(attendanceCheckOutSchema),
    defaultValues: { note: "" },
  });

  const workedMs = today.clockInAt ? now.getTime() - new Date(today.clockInAt).getTime() : 0;

  const submit = (values: AttendanceCheckOutFormValues) => {
    onConfirm(values.note.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <form className="w-full max-w-[420px] rounded-2xl bg-white p-6" onSubmit={handleSubmit(submit)}>
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-[#172033]">퇴근 기록</h2>
          <button aria-label="닫기" className="text-[#94A3B8] hover:text-[#64748B]" type="button" onClick={onCancel}>
            <X className="size-5" strokeWidth={1.8} />
          </button>
        </div>

        <div className="mt-4 rounded-lg bg-[#F8FAFC] px-4 py-3 text-[13px] text-[#344054]">
          {formatDateWithWeekday(now)} {formatTimeOfDate(now)}
        </div>

        <div className="mt-4 space-y-2 rounded-lg bg-[#F8FAFC] px-4 py-3 text-[13px]">
          <div className="flex items-center justify-between">
            <span className="text-[#718096]">출근</span>
            <span className="font-medium text-[#172033]">{formatClockTime(today.clockInAt)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#718096]">퇴근</span>
            <span className="font-medium text-[#172033]">{formatTimeOfDate(now)}</span>
          </div>
          <p className="pt-1 text-[12px] font-semibold text-[#172033]">정규 근무 {formatDuration(workedMs)}</p>
        </div>

        <div className="mt-4">
          <label className="text-[12px] font-medium text-[#344054]" htmlFor="attendance-leave-note">
            비고 (선택)
          </label>
          <textarea
            className="mt-2 min-h-32 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px] text-[#172033] outline-none placeholder:text-[#94A3B8] focus:border-[#4D9560] focus:ring-2 focus:ring-[#4D9560]/20"
            id="attendance-leave-note"
            placeholder="특이사항이 있다면 입력하세요"
            {...register("note")}
          />
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button className="h-10 rounded-lg border border-[#DCE9DF] bg-white px-4 text-[13px] font-medium text-[#64748B]" type="button" onClick={onCancel}>
            취소
          </button>
          <button className="h-10 rounded-lg bg-[#172033] px-4 text-[13px] font-semibold text-white" type="submit">
            퇴근하기
          </button>
        </div>
      </form>
    </div>
  );
}
