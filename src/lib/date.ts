import { format } from "date-fns";

// 목록 화면 날짜 표시(예: 08.01)
export function formatListDate(date: string | Date) {
    return format(new Date(date), "MM.dd");
}

// 상세조회 화면 날짜·시간 표시(예: 2026.08.01 14:30)
export function formatDetailDate(date: string | Date) {
    return format(new Date(date), "yyyy.MM.dd HH:mm");
}
