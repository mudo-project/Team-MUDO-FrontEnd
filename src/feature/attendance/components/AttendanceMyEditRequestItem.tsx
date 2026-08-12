"use client";

import { CORRECTION_STATUS_BADGE_CLASS, CORRECTION_STATUS_LABEL, formatCorrectionChangeSummary, formatDateLabel, formatDateTimeLabel, getCorrectionTypeLabel } from "../attendanceFormat";

type AttendanceMyEditRequestItemProps = {
  request: AttendanceMyCorrectionRequestData;
  onSelect: (request: AttendanceMyCorrectionRequestData) => void;
};

export default function AttendanceMyEditRequestItem({ request, onSelect }: AttendanceMyEditRequestItemProps) {
  return (
    <tr className="border-b border-[#E5EEE7] text-[12px] last:border-0 hover:bg-[#FBFCFB]">
      <td className="px-4 py-3 text-[#344054]">
        <button className="text-left font-medium text-[#172033] underline-offset-2 hover:underline" type="button" onClick={() => onSelect(request)}>
          {formatDateLabel(request.date)}
        </button>
      </td>
      <td className="px-4 py-3 text-[#344054]">{getCorrectionTypeLabel(request.type)}</td>
      <td className="px-4 py-3 text-[#344054]">{formatCorrectionChangeSummary(request)}</td>
      <td className="max-w-[260px] px-4 py-3 text-[#344054]">
        <p className="truncate">{request.reason}</p>
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-[#718096]">{formatDateTimeLabel(request.requestedAt)}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${CORRECTION_STATUS_BADGE_CLASS[request.status]}`}>
          {CORRECTION_STATUS_LABEL[request.status]}
        </span>
      </td>
    </tr>
  );
}
