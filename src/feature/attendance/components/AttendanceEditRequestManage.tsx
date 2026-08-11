"use client";

import { useMemo, useState } from "react";
import AttendanceEditRequestManageItem from "./AttendanceEditRequestManageItem";
import { INITIAL_MANAGED_EDIT_REQUESTS, type ManagedEditRequest } from "../attendanceEditRequestManageDemo";

type FilterTab = "대기" | "전체";

function formatProcessedDate(date: Date): string {
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

export default function AttendanceEditRequestManage() {
  const [requests, setRequests] = useState<ManagedEditRequest[]>(INITIAL_MANAGED_EDIT_REQUESTS);
  const [filter, setFilter] = useState<FilterTab>("대기");

  const pendingCount = useMemo(() => requests.filter((request) => request.status === "대기").length, [requests]);
  const visibleRequests = filter === "대기" ? requests.filter((request) => request.status === "대기") : requests;

  function updateStatus(id: string, status: ManagedEditRequest["status"]) {
    setRequests((prev) =>
      prev.map((request) => (request.id === id ? { ...request, status, processedAt: formatProcessedDate(new Date()) } : request)),
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <button
          className={`flex h-9 items-center gap-1.5 rounded-lg px-3 text-[12px] font-medium ${
            filter === "대기" ? "bg-[#172033] text-white" : "border border-[#DCE9DF] bg-white text-[#64748B]"
          }`}
          type="button"
          onClick={() => setFilter("대기")}
        >
          대기
          <span className={`rounded-full px-1.5 py-0.5 text-[9px] ${filter === "대기" ? "bg-white/20" : "bg-[#F1F5F2] text-[#718096]"}`}>
            {pendingCount}
          </span>
        </button>
        <button
          className={`h-9 rounded-lg px-3 text-[12px] font-medium ${
            filter === "전체" ? "bg-[#172033] text-white" : "border border-[#DCE9DF] bg-white text-[#64748B]"
          }`}
          type="button"
          onClick={() => setFilter("전체")}
        >
          전체
        </button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-[#DCE9DF] bg-white">
        <table className="w-full min-w-[920px] text-left">
          <thead>
            <tr className="border-b border-[#DCE9DF] text-[11px] text-[#64748B]">
              <th className="px-4 py-3 font-medium">요청자</th>
              <th className="px-4 py-3 font-medium">대상 일자</th>
              <th className="px-4 py-3 font-medium">요청 구분</th>
              <th className="px-4 py-3 font-medium">변경 내용</th>
              <th className="px-4 py-3 font-medium">사유</th>
              <th className="px-4 py-3 font-medium">요청일시</th>
              <th className="px-4 py-3 font-medium">상태</th>
              <th className="px-4 py-3 font-medium">처리</th>
            </tr>
          </thead>
          <tbody>
            {visibleRequests.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-[12px] text-[#718096]" colSpan={8}>
                  처리할 요청이 없습니다
                </td>
              </tr>
            ) : (
              visibleRequests.map((request) => (
                <AttendanceEditRequestManageItem
                  key={request.id}
                  request={request}
                  onApprove={(id) => updateStatus(id, "승인")}
                  onReject={(id) => updateStatus(id, "반려")}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
