"use client";

import { EDIT_REQUEST_TYPE_LABEL, formatDateWithWeekday, type AttendanceEditRequest } from "../attendanceDemo";

const STATUS_BADGE_CLASS: Record<AttendanceEditRequest["status"], string> = {
  대기: "bg-slate-100 text-slate-600",
  승인: "bg-emerald-50 text-emerald-700",
  반려: "bg-red-50 text-red-700",
};

type AttendanceMyEditRequestItemProps = {
  request: AttendanceEditRequest;
  onSelect: (request: AttendanceEditRequest) => void;
};

export default function AttendanceMyEditRequestItem({ request, onSelect }: AttendanceMyEditRequestItemProps) {
  return (
    <tr className="border-b border-[#E5EEE7] text-[12px] last:border-0 hover:bg-[#FBFCFB]">
      <td className="px-4 py-3 text-[#344054]">
        <button 
          className="text-left font-medium text-[#172033] underline-offset-2 hover:underline" 
          type="button" 
          onClick={() => onSelect(request)}
        >
          {formatDateWithWeekday(request.targetDate)}
        </button>
      </td>
      <td className="px-4 py-3 text-[#344054]">{EDIT_REQUEST_TYPE_LABEL[request.type]}</td>
      <td className="px-4 py-3 text-[#344054]">{request.changeSummary}</td>
      <td className="max-w-[260px] px-4 py-3 text-[#344054]">
        <p className="truncate">{request.reason}</p>
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-[#718096]">{formatDateWithWeekday(request.requestedAt)}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_BADGE_CLASS[request.status]}`}>
          {request.status}
        </span>
      </td>
    </tr>
  );
}
