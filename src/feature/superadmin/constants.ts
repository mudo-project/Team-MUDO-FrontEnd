import { DashboardPeriod } from "./type";

export const PERIOD_OPTIONS: { label: string; value: DashboardPeriod }[] = [
    { label: "최근 1시간", value: "LAST_HOUR" },
    { label: "최근 24시간", value: "LAST_24_HOURS" },
    { label: "오늘", value: "TODAY" },
];

export const API_LABELS = [
    "초기 데이터 조회", "계정 발급", "출근 체크", "출결 내보내기", "공지 생성", "업무 생성",
    "업무 상태 변경", "결재 상신", "정산 제출", "일정 생성", "메모 생성",
];

export const PROGRESS_CLASS_NAME = "gap-0 [&_[data-slot=progress-track]]:h-1 [&_[data-slot=progress-track]]:bg-[#E6EFE9] [&_[data-slot=progress-indicator]]:bg-[#2C8D50]";
