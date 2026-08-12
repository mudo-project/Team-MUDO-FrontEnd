"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { X } from "lucide-react";
import { attendanceEditRequestCreateSchema, type AttendanceEditRequestCreateFormValues } from "@/lib/attendanceEditRequestCreateSchema";
import { CORRECTION_TYPE_LABEL, formatClockTime, formatDateLabel, generateTimeOptions, type CorrectionRequestType } from "../attendanceFormat";

const REQUEST_TYPES: CorrectionRequestType[] = ["CLOCK_IN_TIME", "CLOCK_OUT_TIME", "MISSING_RECORD", "NOTE_CORRECTION"];
const TIME_OPTIONS = generateTimeOptions();

type AttendanceCreateEditRequestModalProps = {
  dayDetail: AttendanceDayDetailData;
  onCancel: () => void;
  onSubmit: (payload: Omit<AttendanceCorrectionCreateRequest, "date">) => void;
};

function toTimeValue(clockAt: string | null): string {
  if (!clockAt) return "09:00";
  const match = clockAt.match(/^(\d{2}:\d{2})/);
  return match ? match[1] : "09:00";
}

export default function AttendanceCreateEditRequestModal({ dayDetail, onCancel, onSubmit }: AttendanceCreateEditRequestModalProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AttendanceEditRequestCreateFormValues>({
    resolver: zodResolver(attendanceEditRequestCreateSchema),
    defaultValues: {
      type: "CLOCK_IN_TIME",
      clockInTime: toTimeValue(dayDetail.clockInAt),
      clockOutTime: toTimeValue(dayDetail.clockOutAt),
      missingClockInTime: "09:00",
      missingClockOutTime: "18:00",
      noteContent: dayDetail.clockInNote || dayDetail.clockOutNote || "",
      reason: "",
    },
  });

  const type = useWatch({ control, name: "type" });

  const submit = (values: AttendanceEditRequestCreateFormValues) => {
    if (values.type === "CLOCK_IN_TIME") {
      onSubmit({ type: values.type, requestedClockInTime: values.clockInTime, reason: values.reason });
    } else if (values.type === "CLOCK_OUT_TIME") {
      onSubmit({ type: values.type, requestedClockOutTime: values.clockOutTime, reason: values.reason });
    } else if (values.type === "MISSING_RECORD") {
      onSubmit({
        type: values.type,
        requestedClockInTime: values.missingClockInTime,
        requestedClockOutTime: values.missingClockOutTime,
        reason: values.reason,
      });
    } else {
      onSubmit({ type: values.type, requestedClockInNote: values.noteContent.trim(), reason: values.reason });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <form className="w-full max-w-[440px] rounded-2xl bg-white p-6" onSubmit={handleSubmit(submit)}>
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-[#172033]">근태 수정 요청</h2>
          <button aria-label="닫기" className="text-[#94A3B8] hover:text-[#64748B]" type="button" onClick={onCancel}>
            <X className="size-5" strokeWidth={1.8} />
          </button>
        </div>

        <div className="mt-4 rounded-lg bg-[#F8FAFC] px-4 py-3 text-[13px] text-[#344054]">
          <p className="font-medium">{formatDateLabel(dayDetail.date)}</p>
          <p className="mt-1 text-[12px] text-[#718096]">
            현재 기록: 출근 {formatClockTime(dayDetail.clockInAt)} · 퇴근 {formatClockTime(dayDetail.clockOutAt)}
          </p>
        </div>

        <fieldset className="mt-4">
          <legend className="text-[12px] font-medium text-[#344054]">요청 구분</legend>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-[#344054]">
            {REQUEST_TYPES.map((option) => (
              <label className="flex items-center gap-1.5" key={option}>
                <input className="size-3.5 accent-[#172033]" type="radio" value={option} {...register("type")} />
                {CORRECTION_TYPE_LABEL[option]}
              </label>
            ))}
          </div>
        </fieldset>

        {(type === "CLOCK_IN_TIME" || type === "CLOCK_OUT_TIME") && (
          <div className="mt-4">
            <label className="text-[12px] font-medium text-[#344054]" htmlFor="attendance-edit-request-time">
              요청 시각
            </label>
            <select
              className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13px] text-[#172033] outline-none focus:border-[#4D9560] focus:ring-2 focus:ring-[#4D9560]/20"
              id="attendance-edit-request-time"
              {...register(type === "CLOCK_IN_TIME" ? "clockInTime" : "clockOutTime")}
            >
              {TIME_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {type === "MISSING_RECORD" && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-medium text-[#344054]" htmlFor="attendance-edit-request-missing-in">
                출근 시간
              </label>
              <select
                className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13px] text-[#172033] outline-none focus:border-[#4D9560] focus:ring-2 focus:ring-[#4D9560]/20"
                id="attendance-edit-request-missing-in"
                {...register("missingClockInTime")}
              >
                {TIME_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[12px] font-medium text-[#344054]" htmlFor="attendance-edit-request-missing-out">
                퇴근 시간
              </label>
              <select
                className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-[13px] text-[#172033] outline-none focus:border-[#4D9560] focus:ring-2 focus:ring-[#4D9560]/20"
                id="attendance-edit-request-missing-out"
                {...register("missingClockOutTime")}
              >
                {TIME_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {type === "NOTE_CORRECTION" && (
          <div className="mt-4">
            <p className="text-[12px] font-medium text-[#344054]">현재 비고 내용</p>
            <p className="mt-1 rounded-lg bg-[#F8FAFC] px-3 py-2 text-[13px] text-[#718096]">
              {dayDetail.clockInNote || dayDetail.clockOutNote || "등록된 비고가 없습니다"}
            </p>
            <label className="mt-3 block text-[12px] font-medium text-[#344054]" htmlFor="attendance-edit-request-note">
              수정할 비고 내용
            </label>
            <textarea
              className="mt-2 min-h-24 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px] text-[#172033] outline-none placeholder:text-[#94A3B8] focus:border-[#4D9560] focus:ring-2 focus:ring-[#4D9560]/20"
              id="attendance-edit-request-note"
              {...register("noteContent")}
            />
            {errors.noteContent && <p className="mt-1 text-[11px] text-[#C65A50]">{errors.noteContent.message}</p>}
          </div>
        )}

        <div className="mt-4">
          <label className="text-[12px] font-medium text-[#344054]" htmlFor="attendance-edit-request-reason">
            사유 (필수)
          </label>
          <textarea
            className="mt-2 min-h-24 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px] text-[#172033] outline-none placeholder:text-[#94A3B8] focus:border-[#4D9560] focus:ring-2 focus:ring-[#4D9560]/20"
            id="attendance-edit-request-reason"
            placeholder="수정이 필요한 사유를 구체적으로 입력해주세요"
            {...register("reason")}
          />
          {errors.reason && <p className="mt-1 text-[11px] text-[#C65A50]">{errors.reason.message}</p>}
          <p className="mt-2 text-[11px] text-[#94A3B8]">요청일시는 자동으로 기록되며, 관리자 승인 후 반영됩니다</p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button className="h-10 rounded-lg border border-[#DCE9DF] bg-white px-4 text-[13px] font-medium text-[#64748B]" type="button" onClick={onCancel}>
            취소
          </button>
          <button className="h-10 rounded-lg bg-[#172033] px-4 text-[13px] font-semibold text-white" type="submit">
            요청하기
          </button>
        </div>
      </form>
    </div>
  );
}
