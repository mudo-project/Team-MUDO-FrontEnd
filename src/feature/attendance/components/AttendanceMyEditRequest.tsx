"use client";

import { useState } from "react";
import AttendanceCard from "./AttendanceCard";
import AttendanceEditRequestModal from "./AttendanceEditRequestModal";
import { CORRECTION_STATUS_LABEL, formatDateLabel } from "../attendanceFormat";

type AttendanceMyEditRequestProps = {
  requests: AttendanceMyCorrectionRequestData[];
  onViewAll: () => void;
};

export default function AttendanceMyEditRequest({ requests, onViewAll }: AttendanceMyEditRequestProps) {
  const [selectedRequest, setSelectedRequest] = useState<AttendanceMyCorrectionRequestData | null>(null);
  const latestRequests = [...requests]
    .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime())
    .slice(0, 3);

  return (
    <AttendanceCard label="내 수정 요청">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold">내 수정 요청</p>
        <button type="button" className="text-[9px] text-[#718096]" onClick={onViewAll}>
          전체 보기
        </button>
      </div>
      {latestRequests.length === 0 ? (
        <p className="py-7 text-center text-[10px] text-[#718096]">처리할 요청이 없습니다</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {latestRequests.map((request) => (
            <li key={request.requestId}>
              <button
                className="w-full rounded-lg border border-[#E0E9E2] bg-[#FBFCFB] px-2.5 py-2 text-left"
                type="button"
                onClick={() => setSelectedRequest(request)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-[#172033]">{formatDateLabel(request.date)}</span>
                  <span className="text-[9px] font-medium text-[#B78236]">{CORRECTION_STATUS_LABEL[request.status]}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-[9px] text-[#718096]">{request.reason}</p>
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedRequest && <AttendanceEditRequestModal request={selectedRequest} onClose={() => setSelectedRequest(null)} />}
    </AttendanceCard>
  );
}
