import { format } from "date-fns";
import { ko } from "date-fns/locale";

export function formatClockTime(value: string | null | undefined): string {
  if (!value) return "--:--";

  const bareTimeMatch = value.match(/^(\d{2}):(\d{2})/);
  if (bareTimeMatch && !value.includes("-")) {
    return `${bareTimeMatch[1]}:${bareTimeMatch[2]}`;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--:--";

  return format(date, "HH:mm");
}

export function formatDateLabel(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return format(new Date(year, month - 1, day), "yyyy년 M월 d일 (EEEEE)", { locale: ko });
}

export function formatDateTimeLabel(value: string | null | undefined): string {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return format(date, "yyyy년 M월 d일 (EEEEE) HH:mm", { locale: ko });
}

export function formatDateWithWeekday(date: Date): string {
  return format(date, "yyyy년 M월 d일 (EEEEE)", { locale: ko });
}

export function formatTimeOfDate(date: Date): string {
  return format(date, "HH:mm");
}

export function formatElapsed(fromMs: number, toMs: number): string {
  const totalSeconds = Math.max(0, Math.floor((toMs - fromMs) / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function formatDuration(ms: number): string {
  const totalMinutes = Math.max(0, Math.floor(ms / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes}분`;
  if (minutes === 0) return `${hours}시간`;
  return `${hours}시간 ${minutes}분`;
}

export function formatClockNow(date: Date): string {
  return format(date, "HH:mm:ss");
}

// 06:00 ~ 22:00까지 5분 단위 시각 선택지("오전/오후 h:mm" 라벨) — 근태 수정 요청 모달의 시각 select에 사용
export function generateTimeOptions(): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = [];

  for (let totalMinutes = 6 * 60; totalMinutes <= 22 * 60; totalMinutes += 5) {
    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    const time = new Date(2000, 0, 1, hour, minute);
    const value = format(time, "HH:mm");
    options.push({ value, label: format(time, "a h:mm", { locale: ko }) });
  }

  return options;
}

export const ATTENDANCE_STATUS_LABEL: Record<AttendanceStatus, string> = {
  NORMAL: "출근",
  LATE: "지각",
  ABSENT: "결근",
  UNRECORDED: "미기록",
};

export const ATTENDANCE_STATUS_DOT_CLASS: Record<AttendanceStatus, string> = {
  NORMAL: "bg-[#0F172A]",
  LATE: "bg-[#B78236]",
  ABSENT: "bg-[#B45252]",
  UNRECORDED: "border border-[#DCE9DF]",
};

export const ATTENDANCE_STATUS_TEXT_CLASS: Record<AttendanceStatus, string> = {
  NORMAL: "text-[#172033]",
  LATE: "text-[#B78236]",
  ABSENT: "text-[#B45252]",
  UNRECORDED: "text-[#94A3B8]",
};

export const TEAM_TODAY_STATUS_LABEL: Record<string, string> = {
  PRESENT: "출근",
  LEAVE: "연가",
  ABSENT: "결근",
  OFF: "휴무",
};

export type CorrectionRequestType = "CLOCK_IN_TIME" | "CLOCK_OUT_TIME" | "MISSING_RECORD" | "NOTE_CORRECTION";

export const CORRECTION_TYPE_LABEL: Record<string, string> = {
    CLOCK_IN_TIME: "출근 시각",
    CLOCK_OUT_TIME: "퇴근 시각",
    MISSING_RECORD: "누락 기록 추가",
    NOTE_CORRECTION: "비고 수정",
};

export function getCorrectionTypeLabel(type: string): string {
  return CORRECTION_TYPE_LABEL[type] ?? type;
}

export const CORRECTION_STATUS_LABEL: Record<AttendanceCorrectionStatus, string> = {
  PENDING: "대기",
  APPROVED: "승인",
  REJECTED: "반려",
};

export const CORRECTION_STATUS_BADGE_CLASS: Record<AttendanceCorrectionStatus, string> = {
  PENDING: "bg-slate-100 text-slate-600",
  APPROVED: "bg-emerald-50 text-emerald-700",
  REJECTED: "bg-red-50 text-red-700",
};

type CorrectionChangeFields = {
  type: string;
  originalClockInAt: string | null;
  originalClockOutAt: string | null;
  originalClockInNote: string | null;
  originalClockOutNote: string | null;
  requestedClockInAt: string | null;
  requestedClockOutAt: string | null;
  requestedClockInNote: string | null;
  requestedClockOutNote: string | null;
};

// 요청 구분에 따라 원본값 → 요청값을 사람이 읽을 수 있는 한 줄로 조합합니다.
export function formatCorrectionChangeSummary(request: CorrectionChangeFields): string {
  if (request.type === "CLOCK_IN_TIME") {
    return `출근 ${formatClockTime(request.originalClockInAt)} → ${formatClockTime(request.requestedClockInAt)}`;
  }

  if (request.type === "CLOCK_OUT_TIME") {
    return `퇴근 ${formatClockTime(request.originalClockOutAt)} → ${formatClockTime(request.requestedClockOutAt)}`;
  }

  if (request.type === "MISSING_RECORD") {
    return `출근 ${formatClockTime(request.requestedClockInAt)} · 퇴근 ${formatClockTime(request.requestedClockOutAt)} 추가`;
  }

  if (request.type === "NOTE_CORRECTION") {
    const note = request.requestedClockInNote ?? request.requestedClockOutNote ?? "";
    return `비고 수정: "${note || "(내용 없음)"}"`;
  }

  return request.type;
}
