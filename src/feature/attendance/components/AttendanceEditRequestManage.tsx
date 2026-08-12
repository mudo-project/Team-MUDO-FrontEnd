"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import AttendanceEditRequestManageItem from "./AttendanceEditRequestManageItem";
import AttendanceEditRequestManageModal from "./AttendanceEditRequestManageModal";
import { approveCorrectionRequestAction, getAdminCorrectionRequestListAction, rejectCorrectionRequestAction } from "../actions";

type FilterTab = "전체" | "PENDING" | "APPROVED" | "REJECTED";

const FILTERS: FilterTab[] = ["전체", "PENDING", "APPROVED", "REJECTED"];
const FILTER_LABEL: Record<FilterTab, string> = { 전체: "전체", PENDING: "대기", APPROVED: "승인", REJECTED: "반려" };

export default function AttendanceEditRequestManage() {
  const [requests, setRequests] = useState<AttendanceAdminCorrectionRequestData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>("전체");
  const [selectedRequest, setSelectedRequest] = useState<AttendanceAdminCorrectionRequestData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAdminCorrectionRequestListAction({ size: 100 });
      setRequests(data.content);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "근태 수정 요청 목록 조회에 실패하였습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const pendingCount = useMemo(() => requests.filter((request) => request.status === "PENDING").length, [requests]);
  const visibleRequests = filter === "전체" ? requests : requests.filter((request) => request.status === filter);

  async function handleApprove(requestId: number) {
    setIsSubmitting(true);
    const result = await approveCorrectionRequestAction(requestId);
    setIsSubmitting(false);

    if (result.success) {
      toast.success(result.message);
      setSelectedRequest(null);
      loadRequests();
    } else {
      toast.error(result.message);
    }
  }

  async function handleReject(requestId: number, reason: string) {
    setIsSubmitting(true);
    const result = await rejectCorrectionRequestAction(requestId, { reason });
    setIsSubmitting(false);

    if (result.success) {
      toast.success(result.message);
      setSelectedRequest(null);
      loadRequests();
    } else {
      toast.error(result.message);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        {FILTERS.map((item) => (
          <button
            className={`flex h-9 items-center gap-1.5 rounded-lg px-3 text-[12px] font-medium ${
              filter === item ? "bg-[#172033] text-white" : "border border-[#DCE9DF] bg-white text-[#64748B]"
            }`}
            key={item}
            type="button"
            onClick={() => setFilter(item)}
          >
            {FILTER_LABEL[item]}
            {item === "PENDING" && (
              <span className={`rounded-full px-1.5 py-0.5 text-[9px] ${filter === item ? "bg-white/20" : "bg-[#F1F5F2] text-[#718096]"}`}>
                {pendingCount}
              </span>
            )}
          </button>
        ))}
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
            {isLoading ? (
              <tr>
                <td className="px-4 py-8 text-center text-[12px] text-[#718096]" colSpan={8}>
                  불러오는 중입니다...
                </td>
              </tr>
            ) : visibleRequests.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-[12px] text-[#718096]" colSpan={8}>
                  처리할 요청이 없습니다
                </td>
              </tr>
            ) : (
              visibleRequests.map((request) => (
                <AttendanceEditRequestManageItem key={request.requestId} request={request} onApprove={handleApprove} onSelect={setSelectedRequest} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedRequest && (
        <AttendanceEditRequestManageModal
          isSubmitting={isSubmitting}
          request={selectedRequest}
          onApprove={handleApprove}
          onClose={() => setSelectedRequest(null)}
          onReject={handleReject}
        />
      )}
    </div>
  );
}
