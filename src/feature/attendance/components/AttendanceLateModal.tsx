"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { attendanceCheckInSchema, type AttendanceCheckInFormValues } from "@/lib/attendanceCheckInSchema";
import { formatDateWithWeekday, formatTimeOfDate } from "../attendanceFormat";

type AttendanceLateModalProps = {
  date: Date;
  onCancel: () => void;
  onConfirm: (note: string) => void;
};

export default function AttendanceLateModal({ date, onCancel, onConfirm }: AttendanceLateModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AttendanceCheckInFormValues>({
    resolver: zodResolver(attendanceCheckInSchema),
    defaultValues: { note: "" },
  });

  const submit = (values: AttendanceCheckInFormValues) => {
    onConfirm(values.note.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <form className="w-full max-w-[420px] rounded-2xl bg-white p-6" onSubmit={handleSubmit(submit)}>
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-[#172033]">지각 출근 기록</h2>
          <button aria-label="닫기" className="text-[#94A3B8] hover:text-[#64748B]" type="button" onClick={onCancel}>
            <X className="size-5" strokeWidth={1.8} />
          </button>
        </div>

        <dl className="mt-4 space-y-2 rounded-lg bg-[#F8FAFC] px-4 py-3 text-[13px]">
          <div className="flex items-center justify-between">
            <dt className="text-[#718096]">날짜</dt>
            <dd className="font-medium text-[#172033]">{formatDateWithWeekday(date)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-[#718096]">출근 시간</dt>
            <dd className="font-medium text-[#172033]">{formatTimeOfDate(date)}</dd>
          </div>
        </dl>

        <div className="mt-4">
          <label className="text-[12px] font-medium text-[#344054]" htmlFor="attendance-late-note">
            비고 (필수 — 지각 사유)
          </label>
          <textarea
            className="mt-2 min-h-32 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px] text-[#172033] outline-none placeholder:text-[#94A3B8] focus:border-[#4D9560] focus:ring-2 focus:ring-[#4D9560]/20"
            id="attendance-late-note"
            placeholder="지각 사유를 입력하세요"
            {...register("note")}
          />
          {errors.note && <p className="mt-1 text-[11px] text-[#C65A50]">{errors.note.message}</p>}
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button className="h-10 rounded-lg border border-[#DCE9DF] bg-white px-4 text-[13px] font-medium text-[#64748B]" type="button" onClick={onCancel}>
            취소
          </button>
          <button className="h-10 rounded-lg bg-[#172033] px-4 text-[13px] font-semibold text-white" type="submit">
            출근하기
          </button>
        </div>
      </form>
    </div>
  );
}
