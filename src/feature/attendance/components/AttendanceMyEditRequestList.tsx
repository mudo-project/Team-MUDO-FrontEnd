"use client";

import { useState } from "react";
import AttendanceMyEditRequestItem from "./AttendanceMyEditRequestItem";
import AttendanceEditRequestModal from "./AttendanceEditRequestModal";
import { CORRECTION_STATUS_LABEL } from "../attendanceFormat";

type FilterTab = "전체" | "PENDING" | "APPROVED" | "REJECTED";

const FILTERS: FilterTab[] = ["전체", "PENDING", "APPROVED", "REJECTED"];

type AttendanceMyEditRequestListProps = {
  requests: AttendanceMyCorrectionRequestData[];
};

export default function AttendanceMyEditRequestList({ requests }: AttendanceMyEditRequestListProps) {
  const [filter, setFilter] = useState<FilterTab>("전체");
  const [selectedRequest, setSelectedRequest] = useState<AttendanceMyCorrectionRequestData | null>(null);

  const visibleRequests = filter === "전체" ? requests : requests.filter((request) => request.status === filter);

  return (
    <div>
      <div className="flex items-center gap-1">
        {FILTERS.map((item) => (
          <button
            className={`h-9 rounded-lg px-3 text-[12px] font-medium ${
              filter === item ? "bg-[#172033] text-white" : "border border-[#DCE9DF] bg-white text-[#64748B]"
            }`}
            key={item}
            type="button"
            onClick={() => setFilter(item)}
          >
            {item === "전체" ? item : CORRECTION_STATUS_LABEL[item]}
          </button>
        ))}
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-[#DCE9DF] bg-white">
        <table className="w-full min-w-[720px] text-left">
          <thead>
            <tr className="border-b border-[#DCE9DF] text-[11px] text-[#64748B]">
              <th className="px-4 py-3 font-medium">대상 일자</th>
              <th className="px-4 py-3 font-medium">요청 구분</th>
              <th className="px-4 py-3 font-medium">변경 내용</th>
              <th className="px-4 py-3 font-medium">사유</th>
              <th className="px-4 py-3 font-medium">요청일시</th>
              <th className="px-4 py-3 font-medium">상태</th>
            </tr>
          </thead>
          <tbody>
            {visibleRequests.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-[12px] text-[#718096]" colSpan={6}>
                  처리할 요청이 없습니다
                </td>
              </tr>
            ) : (
              visibleRequests.map((request) => <AttendanceMyEditRequestItem key={request.requestId} request={request} onSelect={setSelectedRequest} />)
            )}
          </tbody>
        </table>
      </div>

      {selectedRequest && <AttendanceEditRequestModal request={selectedRequest} onClose={() => setSelectedRequest(null)} />}
    </div>
  );
}
