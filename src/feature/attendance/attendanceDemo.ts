// 백엔드 연동 전, 근태 도메인 페이지 데모를 위한 타입과 시간 계산 헬퍼입니다.
// 추후 API 연동을 진행하면서 실제 타입/서비스로 교체될 예정입니다.

export type AttendanceRecordState = {
  clockInAt: Date | null;
  isLate: boolean;
  clockInNote: string;
  clockOutAt: Date | null;
  clockOutNote: string;
  overtimeStartedAt: Date | null;
  overtimeReason: string;
};

export const STANDARD_START_HOUR = 9;
export const STANDARD_END_HOUR = 18;

export function createEmptyAttendanceRecord(): AttendanceRecordState {
  return {
    clockInAt: null,
    isLate: false,
    clockInNote: "",
    clockOutAt: null,
    clockOutNote: "",
    overtimeStartedAt: null,
    overtimeReason: "",
  };
}

export function getStandardStart(base: Date): Date {
  const start = new Date(base);
  start.setHours(STANDARD_START_HOUR, 0, 0, 0);
  return start;
}

export function getStandardEnd(base: Date): Date {
  const end = new Date(base);
  end.setHours(STANDARD_END_HOUR, 0, 0, 0);
  return end;
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export function formatDateWithWeekday(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${WEEKDAYS[date.getDay()]})`;
}

export function formatTime(date: Date): string {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export function formatClock(date: Date): string {
  return `${formatTime(date)}:${String(date.getSeconds()).padStart(2, "0")}`;
}

export function formatElapsed(fromMs: number, toMs: number): string {
  const totalSeconds = Math.max(0, Math.floor((toMs - fromMs) / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function formatDuration(ms: number): string {
  const totalMinutes = Math.max(0, Math.floor(ms / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes}분`;
  if (minutes === 0) return `${hours}시간`;
  return `${hours}시간 ${minutes}분`;
}

export type EditRequestType = "clockIn" | "clockOut" | "missing" | "note";

export const EDIT_REQUEST_TYPE_LABEL: Record<EditRequestType, string> = {
  clockIn: "출근 시각",
  clockOut: "퇴근 시각",
  missing: "누락 기록 추가",
  note: "비고 수정",
};

export type AttendanceEditRequest = {
  id: string;
  targetDate: Date;
  type: EditRequestType;
  changeSummary: string;
  reason: string;
  requestedAt: Date;
  status: "대기" | "승인" | "반려";
};

// 06:00 ~ 22:00까지 5분 단위 시각 선택지입니다. "오전/오후 h:mm" 형식으로 표시합니다.
// 실제 출퇴근 기록은 30분 단위로 정렬되지 않으므로, select의 value가 항상 실제 기록 시각과
// 일치하는 옵션을 가질 수 있도록 촘촘한 간격을 씁니다(일치하는 옵션이 없으면 브라우저가
// 첫 옵션으로 조용히 되돌아가 값이 뒤바뀌는 문제가 있었습니다).
export function generateTimeOptions(): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = [];

  for (let totalMinutes = 6 * 60; totalMinutes <= 22 * 60; totalMinutes += 5) {
    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    const value = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    const period = hour < 12 ? "오전" : "오후";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    options.push({ value, label: `${period} ${displayHour}:${String(minute).padStart(2, "0")}` });
  }

  return options;
}

export function timeValueToDate(base: Date, timeValue: string): Date {
  const [hour, minute] = timeValue.split(":").map(Number);
  const result = new Date(base);
  result.setHours(hour, minute, 0, 0);
  return result;
}

export function dateToTimeValue(date: Date): string {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export function isSameDate(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
