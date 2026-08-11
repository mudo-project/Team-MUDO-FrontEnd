"use client";

import type { ManagedEditRequest } from "../attendanceEditRequestManageDemo";

const STATUS_BADGE_CLASS: Record<ManagedEditRequest["status"], string> = {
  대기: "bg-slate-100 text-slate-600",
  승인: "bg-emerald-50 text-emerald-700",
  반려: "bg-red-50 text-red-700",
};

type AttendanceEditRequestManageItemProps = {
  request: ManagedEditRequest;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
};

export default function AttendanceEditRequestManageItem({ request, onApprove, onReject }: AttendanceEditRequestManageItemProps) {
  return (
    <tr className="border-b border-[#E5EEE7] last:border-0 text-[12px]">
      <td className="px-4 py-3">
        <span className="flex items-center gap-2">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#0F172A] text-[8px] font-bold text-white">
            {request.requesterName.slice(0, 1)}
          </span>
          <span>
            <strong className="block text-[#172033]">{request.requesterName}</strong>
            <span className="block text-[10px] text-[#718096]">{request.requesterRole}</span>
          </span>
        </span>
      </td>
      <td className="px-4 py-3 text-[#344054]">{request.targetDate}</td>
      <td className="px-4 py-3 text-[#344054]">{request.requestType}</td>
      <td className="px-4 py-3 text-[#344054]">
        <span className="text-[#94A3B8] line-through">{request.previousValue}</span>
        <span className="mx-1 text-[#94A3B8]">→</span>
        <span className="font-medium text-[#172033]">{request.nextValue}</span>
      </td>
      <td className="max-w-[260px] px-4 py-3 text-[#344054]">
        <p className="break-words">{request.reason}</p>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-[#718096]">{request.requestedAt}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_BADGE_CLASS[request.status]}`}>{request.status}</span>
      </td>
      <td className="px-4 py-3">
        {request.status === "대기" ? (
          <span className="flex items-center gap-2 whitespace-nowrap">
            <button 
              className="text-[12px] font-medium text-[#C65A50]" 
              type="button" 
              onClick={() => onReject(request.id)}
            >
              반려
            </button>
            <button 
              className="h-8 rounded-md bg-[#172033] px-3 text-[12px] font-semibold text-white" 
              type="button" 
              onClick={() => onApprove(request.id)}
            >
              승인
            </button>
          </span>
        ) : (
          <span className="text-[11px] text-[#718096]">{request.processedAt}</span>
        )}
      </td>
    </tr>
  );
}
