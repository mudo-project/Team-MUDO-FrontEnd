export function generateHalfHourOptions(): string[] {
    const options: string[] = [];

    for (let hour = 0; hour < 24; hour++) {
        for (const minute of [0, 30]) {
            options.push(`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`);
        }
    }

    return options;
}

export function generatePaydayOptions(): string[] {
    return Array.from({ length: 30 }, (_, index) => `${index + 1}일`);
}

export type Weekday = "일" | "월" | "화" | "수" | "목" | "금" | "토";

export type WeekdayException = {
    day: Weekday;
    enabled: boolean;
    startTime: string;
    endTime: string;
};

export const DEFAULT_WEEKDAY_EXCEPTIONS: WeekdayException[] = [
    { day: "일", enabled: false, startTime: "09:00", endTime: "18:00" },
    { day: "월", enabled: true, startTime: "09:00", endTime: "18:00" },
    { day: "화", enabled: true, startTime: "09:00", endTime: "18:00" },
    { day: "수", enabled: true, startTime: "09:00", endTime: "18:00" },
    { day: "목", enabled: true, startTime: "09:00", endTime: "18:00" },
    { day: "금", enabled: true, startTime: "09:00", endTime: "18:00" },
    { day: "토", enabled: false, startTime: "09:00", endTime: "18:00" },
];

// 서버(java.time.DayOfWeek)의 dayOfWeek 표기: 월요일 1 ~ 일요일 7
export const WEEKDAY_TO_DAY_OF_WEEK: Record<Weekday, number> = {
    월: 1,
    화: 2,
    수: 3,
    목: 4,
    금: 5,
    토: 6,
    일: 7,
};

export function toWorkingHoursPolicyWeekdays(exceptions: WeekdayException[]): WorkingHoursWeekday[] {
    return exceptions.map((exception) => ({
        dayOfWeek: WEEKDAY_TO_DAY_OF_WEEK[exception.day],
        isWorkday: exception.enabled,
        startTime: exception.enabled ? exception.startTime : null,
        endTime: exception.enabled ? exception.endTime : null,
    }));
}

// 설정 화면의 구글 연동 카드에서 쓰는 상태 배지(레이블 + 색상). 연동 안 됨(null)도 포함한다.
export function getGoogleConnectionBadge(status: GoogleConnectionStatus | null): { label: string; className: string } {
    switch (status) {
        case "CONNECTED":
            return { label: "연결됨", className: "bg-[#EDF5EE] text-[#4D9560]" };
        case "EXPIRING":
            return { label: "갱신 필요", className: "bg-[#FFFBEB] text-[#D97706]" };
        case "EXPIRED":
            return { label: "연결 만료", className: "bg-[#FEF2F2] text-[#DC2626]" };
        case "FAILED":
            return { label: "연결 실패", className: "bg-[#FEF2F2] text-[#DC2626]" };
        default:
            return { label: "연결되지 않음", className: "bg-[#F1F4F8] text-[#64748B]" };
    }
}

// 구글 연동 응답의 ISO 시각(연결일시/토큰만료일시/마지막확인일시)을 "YYYY.MM.DD HH:mm"로 표시
export function formatGoogleDateTime(iso: string): string {
    const date = new Date(iso);
    const pad = (value: number) => value.toString().padStart(2, "0");

    return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
