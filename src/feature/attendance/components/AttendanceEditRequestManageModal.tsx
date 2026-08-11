"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { ManagedEditRequest } from "../attendanceEditRequestManageDemo";

const STATUS_BADGE_CLASS: Record<ManagedEditRequest["status"], string> = {
  대기: "bg-slate-100 text-slate-600",
  승인: "bg-emerald-50 text-emerald-700",
  반려: "bg-red-50 text-red-700",
};

type AttendanceEditRequestManageModalProps = {
  request: ManagedEditRequest;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
};

export default function AttendanceEditRequestManageModal({
  request,
  onClose,
  onApprove,
  onReject,
}: AttendanceEditRequestManageModalProps) {
  const isPending = request.status === "대기";
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-[556px] rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-bold text-[#172033]">근태 수정 요청</h2>
          <div className="flex items-center gap-4">
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${STATUS_BADGE_CLASS[request.status]}`}>
              {request.status}
            </span>
            <button aria-label="닫기" className="text-[#718096] hover:text-[#172033]" type="button" onClick={onClose}>
              <X className="size-5" strokeWidth={1.8} />
            </button>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3 border-b border-[#DCE9DF] pb-5">
          <span className="flex size-10 items-center justify-center rounded-full bg-[#F1F5F2] text-[12px] font-semibold text-[#718096]">
            {request.requesterName.slice(0, 2)}
          </span>
          <div>
            <strong className="block text-[15px] text-[#172033]">{request.requesterName}</strong>
            <span className="block text-[12px] text-[#718096]">{request.requesterRole}</span>
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-x-10 gap-y-5 text-[13px]">
          <div>
            <dt className="text-[11px] text-[#718096]">대상 일자</dt>
            <dd className="mt-1 font-medium text-[#172033]">{request.targetDate}</dd>
          </div>
          <div>
            <dt className="text-[11px] text-[#718096]">요청 구분</dt>
            <dd className="mt-1 font-medium text-[#172033]">{request.requestType}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-[11px] text-[#718096]">변경 내용</dt>
            <dd className="mt-1 flex items-center gap-2 font-medium text-[#172033]">
              <span className="text-[#94A3B8] line-through">{request.previousValue}</span>
              <span className="text-[#94A3B8]">→</span>
              <span>{request.nextValue}</span>
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="text-[11px] text-[#718096]">사유</dt>
            <dd className="mt-1 whitespace-pre-wrap break-words leading-6 text-[#344054]">{request.reason}</dd>
          </div>
        </dl>

        <p className="mt-5 text-[11px] text-[#718096]">요청일시 {request.requestedAt}</p>

        <div className="mt-5 flex items-center justify-end gap-5">
          {isRejecting ? (
            <div className="w-full">
              <textarea
                aria-label="반려 사유"
                className="min-h-28 w-full resize-none rounded-lg border border-[#DCE9DF] px-3 py-2.5 text-[12px] text-[#172033] outline-none placeholder:text-[#94A3B8] focus:border-[#4D9560]"
                placeholder="반려 사유를 입력해주세요 (필수)"
                value={rejectReason}
                onChange={(event) => setRejectReason(event.target.value)}
              />
              <div className="mt-2 flex justify-end">
                <button
                  className="h-9 rounded-lg bg-[#172033] px-4 text-[12px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#E5E7EB] disabled:text-[#94A3B8]"
                  disabled={!rejectReason.trim()}
                  type="button"
                  onClick={() => {
                    onReject(request.id);
                    onClose();
                  }}
                >
                  반려 처리
                </button>
              </div>
            </div>
          ) : isPending ? (
            <>
              <button
                className="text-[13px] font-medium text-[#C65A50]"
                type="button"
                onClick={() => setIsRejecting(true)}
              >
                반려
              </button>
              <button
                className="h-10 rounded-lg bg-[#172033] px-5 text-[13px] font-semibold text-white"
                type="button"
                onClick={() => {
                  onApprove(request.id);
                  onClose();
                }}
              >
                승인
              </button>
            </>
          ) : (
            <button className="h-10 rounded-lg border border-[#DCE9DF] px-5 text-[13px] font-medium text-[#64748B]" type="button" onClick={onClose}>
              닫기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
