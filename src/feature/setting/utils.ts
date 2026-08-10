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
