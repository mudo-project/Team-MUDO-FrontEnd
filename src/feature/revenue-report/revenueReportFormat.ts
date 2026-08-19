import { format, parse } from "date-fns";

// "yyyy-MM" 형태의 리포트 대상월을 "yyyy년 M월"로 표시합니다.
export function formatTargetMonth(targetMonth: string): string {
    return format(parse(targetMonth, "yyyy-MM", new Date()), "yyyy년 M월");
}
