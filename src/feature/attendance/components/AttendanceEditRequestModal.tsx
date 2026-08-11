"use client";

import { X } from "lucide-react";
import { EDIT_REQUEST_TYPE_LABEL, formatDateWithWeekday, type AttendanceEditRequest } from "../attendanceDemo";

const STATUS_TEXT_CLASS: Record<AttendanceEditRequest["status"], string> = {
  대기: "text-[#718096]",
  승인: "text-[#4D9560]",
  반려: "text-[#C65A50]",
};

type AttendanceEditRequestModalProps = {
  request: AttendanceEditRequest;
  onClose: () => void;
};

// 내 수정 요청 카드 · 내 근태수정 탭이 공용으로 사용하는 상세조회 모달입니다.
// 승인/반려 처리는 수정 요청 관리 탭 테이블에서 바로 이루어지므로, 여기서는 조회만 제공합니다.
export default function AttendanceEditRequestModal({ request, onClose }: AttendanceEditRequestModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-[420px] rounded-2xl bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-[#172033]">내 근태 수정 상세조회</h2>
          <button 
            aria-label="닫기"
            className="text-[#94A3B8] hover:text-[#64748B]"
            type="button"
            onClick={onClose}
          >
            <X className="size-5" strokeWidth={1.8} />
          </button>
        </div>

        <dl className="mt-4 space-y-2 rounded-lg bg-[#F8FAFC] px-4 py-3 text-[13px]">
          <div className="flex items-center justify-between">
            <dt className="text-[#718096]">요청 상태</dt>
            <dd className={`font-semibold ${STATUS_TEXT_CLASS[request.status]}`}>{request.status}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-[#718096]">대상일자</dt>
            <dd className="font-medium text-[#172033]">{formatDateWithWeekday(request.targetDate)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-[#718096]">요청 구분</dt>
            <dd className="font-medium text-[#172033]">{EDIT_REQUEST_TYPE_LABEL[request.type]}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-[#718096]">변경 내용</dt>
            <dd className="font-medium text-[#172033]">{request.changeSummary}</dd>
          </div>
        </dl>

        <div className="mt-4">
          <p className="text-[11px] font-medium text-[#718096]">사유</p>
          <p className="mt-1 whitespace-pre-wrap break-words text-[13px] text-[#344054]">{request.reason}</p>
        </div>

        <p className="mt-4 border-t border-[#EEF2F1] pt-4 text-[11px] text-[#94A3B8]">
          요청일시 {formatDateWithWeekday(request.requestedAt)}
        </p>
      </div>
    </div>
  );
}
