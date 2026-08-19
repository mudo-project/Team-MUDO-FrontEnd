import { format, parse } from "date-fns";

// 급여 연월("yyyy-MM" 또는 "yyyy-MM-dd")을 "yyyy년 M월"로 표시합니다.
export function formatYearMonth(yearMonth: string): string {
    return format(parse(yearMonth.slice(0, 7), "yyyy-MM", new Date()), "yyyy년 M월");
}

// 급여 정책 적용 기간을 "yyyy.MM.dd ~ yyyy.MM.dd"(종료일 없으면 "무기한")로 표시합니다.
export function formatPeriod(from: string, to: string | null): string {
    const fromLabel = format(new Date(from), "yyyy.MM.dd");
    const toLabel = to ? format(new Date(to), "yyyy.MM.dd") : "무기한";
    return `${fromLabel} ~ ${toLabel}`;
}
