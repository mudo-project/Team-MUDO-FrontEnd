"use client";

import { X } from "lucide-react";
import { formatClockTime, formatDateLabel } from "../attendanceFormat";

type AttendanceDetailModalProps = {
  dayDetail: AttendanceDayDetailData;
  onClose: () => void;
  onEditRequest: () => void;
};

export default function AttendanceDetailModal({ dayDetail, onClose, onEditRequest }: AttendanceDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-[420px] rounded-2xl bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-[#172033]">근태 상세조회</h2>
          <button aria-label="닫기" className="text-[#94A3B8] hover:text-[#64748B]" type="button" onClick={onClose}>
            <X className="size-5" strokeWidth={1.8} />
          </button>
        </div>

        <dl className="mt-4 space-y-2 rounded-lg bg-[#F8FAFC] px-4 py-3 text-[13px]">
          <div className="flex items-center justify-between">
            <dt className="text-[#718096]">날짜</dt>
            <dd className="font-medium text-[#172033]">{formatDateLabel(dayDetail.date)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-[#718096]">출근시간</dt>
            <dd className="font-medium text-[#172033]">{formatClockTime(dayDetail.clockInAt)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-[#718096]">퇴근시간</dt>
            <dd className="font-medium text-[#172033]">{formatClockTime(dayDetail.clockOutAt)}</dd>
          </div>
        </dl>

        {dayDetail.clockInNote && (
          <div className="mt-3">
            <p className="text-[11px] font-medium text-[#718096]">출근 비고사유</p>
            <p className="mt-1 whitespace-pre-wrap break-words text-[13px] text-[#344054]">{dayDetail.clockInNote}</p>
          </div>
        )}

        {dayDetail.clockOutNote && (
          <div className="mt-3">
            <p className="text-[11px] font-medium text-[#718096]">퇴근 비고사유</p>
            <p className="mt-1 whitespace-pre-wrap break-words text-[13px] text-[#344054]">{dayDetail.clockOutNote}</p>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-[#EEF2F1] pt-4">
          <span className={`text-[12px] font-medium ${dayDetail.correctionRequestPending ? "text-[#B78236]" : "text-[#718096]"}`}>
            {dayDetail.correctionRequestPending ? "수정 요청 처리 중" : "수정 요청 없음"}
          </span>
          <button
            className="h-9 rounded-lg border border-[#DCE9DF] bg-white px-3 text-[13px] font-medium text-[#344054]"
            type="button"
            onClick={onEditRequest}
          >
            수정
          </button>
        </div>
      </div>
    </div>
  );
}
