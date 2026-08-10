"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { format } from "date-fns";
import { X } from "lucide-react";
import { scheduleCreateSchema, type ScheduleCreateFormValues } from "@/lib/scheduleCreateSchema";
import MemoColorPicker, { MEMO_COLORS, type MemoColor } from "@/feature/memo/components/MemoColorPicker";
import { TIME_OPTIONS } from "../scheduleFormat";
import type { ScheduleEvent } from "../scheduleTypes";

export type ScheduleFormSubmitValues = {
  title: string;
  date: Date;
  allDay: boolean;
  startTime?: string;
  endTime?: string;
  color: MemoColor;
  content: string;
};

type ScheduleCreateFormProps = {
  mode: "create" | "edit";
  initialDate?: Date;
  schedule?: ScheduleEvent;
  isSubmitting?: boolean;
  onCancel: () => void;
  onSubmit: (values: ScheduleFormSubmitValues) => void;
};

function parseDateInput(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export default function ScheduleCreateForm({
  mode,
  initialDate,
  schedule,
  isSubmitting = false,
  onCancel,
  onSubmit,
}: ScheduleCreateFormProps) {
  const [selectedColor, setSelectedColor] = useState<MemoColor>(schedule?.color ?? MEMO_COLORS[0]);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ScheduleCreateFormValues>({
    resolver: zodResolver(scheduleCreateSchema),
    defaultValues: {
      title: schedule?.title ?? "",
      date: format(schedule?.date ?? initialDate ?? new Date(), "yyyy-MM-dd"),
      allDay: schedule?.allDay ?? false,
      startTime: schedule?.startTime ?? "",
      endTime: schedule?.endTime ?? "",
      content: schedule?.content ?? "",
    },
  });

  const allDay = useWatch({ control, name: "allDay" });

  const submit = (values: ScheduleCreateFormValues) => {
    onSubmit({
      title: values.title,
      date: parseDateInput(values.date),
      allDay: values.allDay,
      startTime: values.allDay ? undefined : values.startTime,
      endTime: values.allDay ? undefined : values.endTime,
      color: selectedColor,
      content: values.content,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <form
        className="flex max-h-[85vh] w-full max-w-[440px] flex-col overflow-y-auto rounded-2xl bg-white p-6"
        onSubmit={handleSubmit(submit)}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[18px] font-bold">{mode === "create" ? "일정 작성" : "일정 수정"}</h2>
          <button aria-label="닫기" className="text-[#94A3B8] hover:text-[#64748B]" type="button" onClick={onCancel}>
            <X className="size-5" strokeWidth={1.8} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-[#344054]" htmlFor="schedule-title">
              제목
            </label>
            <input
              className="h-11 w-full rounded-lg border border-[#DCE9DF] px-3 text-[13px] outline-none placeholder:text-[#A1ACBA] focus:border-[#4D9560]"
              id="schedule-title"
              placeholder="예: 전체 교직원 회의"
              {...register("title")}
            />
            {errors.title && <p className="mt-1 text-[11px] text-[#C65A50]">{errors.title.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-[#344054]" htmlFor="schedule-date">
              날짜
            </label>
            <input
              className="h-11 w-full rounded-lg border border-[#DCE9DF] px-3 text-[13px] outline-none focus:border-[#4D9560]"
              id="schedule-date"
              type="date"
              {...register("date")}
            />
            {errors.date && <p className="mt-1 text-[11px] text-[#C65A50]">{errors.date.message}</p>}
          </div>

          <label className="flex items-center gap-2 text-[13px] font-medium text-[#344054]">
            <input className="size-4 rounded border-[#DCE9DF] accent-[#4D9560]" type="checkbox" {...register("allDay")} />
            종일
          </label>

          {!allDay && (
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-[#344054]">시간</label>
              <div className="flex items-center gap-2">
                <select
                  aria-label="시작 시간"
                  className="h-11 flex-1 rounded-lg border border-[#DCE9DF] px-2 text-[13px] outline-none focus:border-[#4D9560]"
                  {...register("startTime")}
                >
                  <option value="">선택</option>
                  {TIME_OPTIONS.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                <span className="text-[#94A3B8]">~</span>
                <select
                  aria-label="종료 시간"
                  className="h-11 flex-1 rounded-lg border border-[#DCE9DF] px-2 text-[13px] outline-none focus:border-[#4D9560]"
                  {...register("endTime")}
                >
                  <option value="">선택</option>
                  {TIME_OPTIONS.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              {(errors.startTime ?? errors.endTime) && (
                <p className="mt-1 text-[11px] text-[#C65A50]">{errors.startTime?.message ?? errors.endTime?.message}</p>
              )}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-[#344054]">색상</label>
            <MemoColorPicker selectedColor={selectedColor} onChange={setSelectedColor} />
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-[#344054]" htmlFor="schedule-content">
              내용
            </label>
            <textarea
              className="min-h-24 w-full resize-y rounded-lg border border-[#DCE9DF] p-3 text-[13px] outline-none placeholder:text-[#A1ACBA] focus:border-[#4D9560]"
              id="schedule-content"
              placeholder="일정에 대한 설명을 입력하세요"
              {...register("content")}
            />
          </div>

          {mode === "create" && <p className="text-[11px] text-[#94A3B8]">작성일자는 등록 시 자동으로 기록됩니다</p>}
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            className="h-10 rounded-lg border border-[#DCE9DF] bg-white px-4 text-[13px] font-medium text-[#64748B] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSubmitting}
            type="button"
            onClick={onCancel}
          >
            취소
          </button>
          <button
            className="h-10 rounded-lg bg-[#12182B] px-4 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "처리 중..." : mode === "create" ? "등록" : "수정"}
          </button>
        </div>
      </form>
    </div>
  );
}
