// 수정 요청 관리 탭 데모용 더미데이터입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.

export type ManagedEditRequestStatus = "대기" | "승인" | "반려";

export type ManagedEditRequest = {
  id: string;
  requesterName: string;
  requesterRole: string;
  targetDate: string;
  requestType: string;
  previousValue: string;
  nextValue: string;
  reason: string;
  requestedAt: string;
  status: ManagedEditRequestStatus;
  processedAt?: string;
};

export const INITIAL_MANAGED_EDIT_REQUESTS: ManagedEditRequest[] = [
  {
    id: "req-1",
    requesterName: "이민준",
    requesterRole: "강사",
    targetDate: "08.05",
    requestType: "출근 시각",
    previousValue: "09:35",
    nextValue: "09:05",
    reason: "지하철 운행 지연으로 실제 출근 시각과 다르게 기록되었습니다. 지연 증빙 첨부.",
    requestedAt: "2026.08.05 20:15",
    status: "대기",
  },
  {
    id: "req-2",
    requesterName: "최현우",
    requesterRole: "강사",
    targetDate: "08.04",
    requestType: "퇴근 시각",
    previousValue: "19:20",
    nextValue: "18:30",
    reason: "퇴근 후 체크아웃을 깜박해 시스템 기록이 늦게 찍혔습니다.",
    requestedAt: "2026.08.04 21:30",
    status: "대기",
  },
  {
    id: "req-3",
    requesterName: "강도현",
    requesterRole: "강사",
    targetDate: "08.03",
    requestType: "누락 기록 추가",
    previousValue: "기록없음",
    nextValue: "출근 09:10 / 퇴근 18:30",
    reason: "체크인 기기 오류로 기록이 누락되었습니다. 당일 수업 진행 확인 부탁드립니다.",
    requestedAt: "2026.08.03 22:00",
    status: "대기",
  },
];
