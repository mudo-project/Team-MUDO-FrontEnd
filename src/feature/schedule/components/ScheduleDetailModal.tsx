"use client";

import { Calendar, Clock, X } from "lucide-react";
import { formatEventDateFull, formatEventTimeRange } from "../scheduleFormat";
import type { ScheduleEvent } from "../scheduleTypes";

type ScheduleDetailModalProps = {
  event: ScheduleEvent;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function ScheduleDetailModal({ event, onClose, onEdit, onDelete }: ScheduleDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="flex w-full max-w-[440px] flex-col rounded-2xl bg-white p-6">
        <div className="flex items-start justify-between gap-3">
          <h2 className="flex min-w-0 items-center gap-2 text-[17px] font-bold">
            <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: event.color.accent }} />
            <span className="break-words">{event.title}</span>
          </h2>
          <button aria-label="닫기" className="shrink-0 text-[#94A3B8] hover:text-[#64748B]" type="button" onClick={onClose}>
            <X className="size-5" strokeWidth={1.8} />
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-[13px] text-[#344054]">
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-[#94A3B8]" strokeWidth={1.8} />
            {formatEventDateFull(event.date)}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-[#94A3B8]" strokeWidth={1.8} />
            {formatEventTimeRange(event)}
          </div>
        </div>

        {event.content && (
          <>
            <div className="my-4 border-t border-[#EEF2F1]" />
            <p className="whitespace-pre-wrap break-words text-[13px] text-[#344054]">{event.content}</p>
          </>
        )}

        <div className="mt-4 border-t border-[#EEF2F1] pt-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#94A3B8]">작성일 {event.createdAt}</span>
            <div className="flex items-center gap-2">
              <button className="h-9 px-2 text-[13px] font-medium text-[#C65A50]" type="button" onClick={onDelete}>
                삭제
              </button>
              <button
                className="h-9 rounded-lg border border-[#DCE9DF] bg-white px-3 text-[13px] font-medium text-[#344054]"
                type="button"
                onClick={onEdit}
              >
                수정
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
