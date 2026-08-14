"use client";

import {
  CORRECTION_STATUS_BADGE_CLASS,
  CORRECTION_STATUS_LABEL,
  formatCorrectionChangeSummary,
  formatDateTimeLabel,
  getCorrectionTypeLabel,
} from "../attendanceFormat";

type AttendanceEditRequestManageItemProps = {
  request: AttendanceAdminCorrectionRequestData;
  canProcess: boolean;
  onApprove: (id: number) => void;
  onSelect: (request: AttendanceAdminCorrectionRequestData) => void;
};

export default function AttendanceEditRequestManageItem({ request, canProcess, onApprove, onSelect }: AttendanceEditRequestManageItemProps) {
  return (
    <tr
      className="cursor-pointer border-b border-[#E5EEE7] text-[12px] transition hover:bg-[#FBFCFB] last:border-0"
      tabIndex={0}
      onClick={() => onSelect(request)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(request);
        }
      }}
    >
      <td className="px-4 py-3">
        <span className="flex items-center gap-2">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#0F172A] text-[8px] font-bold text-white">
            {request.requester.name.slice(0, 1)}
          </span>
          <span>
            <strong className="block text-[#172033]">{request.requester.name}</strong>
            <span className="block text-[10px] text-[#718096]">{request.requester.position}</span>
          </span>
        </span>
      </td>
      <td className="px-4 py-3 text-[#344054]">{request.workDate}</td>
      <td className="px-4 py-3 text-[#344054]">{getCorrectionTypeLabel(request.type)}</td>
      <td className="px-4 py-3 text-[#344054]">{formatCorrectionChangeSummary(request)}</td>
      <td className="max-w-[260px] px-4 py-3 text-[#344054]">
        <p className="break-words">{request.reason}</p>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-[#718096]">{formatDateTimeLabel(request.requestedAt)}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${CORRECTION_STATUS_BADGE_CLASS[request.status]}`}>
          {CORRECTION_STATUS_LABEL[request.status]}
        </span>
      </td>
      <td className="px-4 py-3">
        {request.status === "PENDING" ? (
          canProcess ? (
            <span className="flex items-center gap-2 whitespace-nowrap">
              {/* 반려는 사유가 필수라 테이블에서 바로 처리하지 않고, 상세 모달의 반려 사유 입력으로 이동시킨다 */}
              <button
                className="text-[12px] font-medium text-[#C65A50]"
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onSelect(request);
                }}
              >
                반려
              </button>
              <button
                className="h-8 rounded-md bg-[#172033] px-3 text-[12px] font-semibold text-white"
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onApprove(request.requestId);
                }}
              >
                승인
              </button>
            </span>
          ) : (
            <span className="text-[11px] text-[#718096]">대기중</span>
          )
        ) : (
          <span className="text-[11px] text-[#718096]">{formatDateTimeLabel(request.processedAt)}</span>
        )}
      </td>
    </tr>
  );
}
