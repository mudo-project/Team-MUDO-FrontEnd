import { AcademyApiCallRow, DashboardPeriod, HostResourceData } from "./type";

export const PERIOD_OPTIONS: { label: string; value: DashboardPeriod }[] = [
    { label: "최근 1시간", value: "LAST_HOUR" },
    { label: "최근 24시간", value: "LAST_24_HOURS" },
    { label: "오늘", value: "TODAY" },
];

export const API_LABELS = [
    "초기 데이터 조회", "계정 발급", "출근 체크", "출결 내보내기", "공지 생성", "업무 생성",
    "업무 상태 변경", "결재 상신", "정산 제출", "일정 생성", "메모 생성",
];

export const ALL_API_METRICS = [
    ["업무 상태 변경", 3505], ["업무 생성", 3325], ["계정 발급", 3252], ["일정 생성", 3137],
    ["초기 데이터 조회", 2754], ["결재 상신", 2034], ["공지 생성", 1954], ["메모 생성", 1767],
    ["출근 체크", 1698], ["정산 제출", 952], ["출결 내보내기", 662],
] as const;

export const ACADEMY_API_METRICS = [
    ["초기 데이터 조회", 3674], ["출근 체크", 3667], ["일정 생성", 3248], ["계정 발급", 2977],
    ["메모 생성", 2487], ["출결 내보내기", 1736], ["정산 제출", 970], ["공지 생성", 899],
    ["업무 상태 변경", 827], ["결재 상신", 615], ["업무 생성", 514],
] as const;

export const ALL_ACADEMY_ROWS: AcademyApiCallRow[] = [
    { academyCode: "academy-a", values: [277, 804, 362, 252, 1192, 145, 526, 1186, 61, 923, 148] },
    { academyCode: "academy-b", values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    { academyCode: "academy-c", values: [2914, 2410, 580, 1639, 1589, 1639, 3648, 3102, 283, 2827, 770] },
    { academyCode: "academy-d", values: [479, 3167, 3723, 3574, 4944, 3521, 953, 3779, 4957, 4076, 2068] },
];

export const SELECTED_ACADEMY_ROW: AcademyApiCallRow = {
    academyCode: "academy-a",
    values: [250, 292, 1164, 285, 938, 114, 265, 843, 556, 1048, 782],
};

export const HOSTS: HostResourceData[] = [
    {
        academyCodes: ["academy-a", "academy-b"],
        cpu: 50,
        cpuText: "2,048 / 4,096 남음",
        hostId: "i-0a1b2c3d4e5f",
        memory: 59,
        memoryText: "3,200 / 7,800 MiB 남음",
    },
    {
        academyCodes: ["academy-c", "academy-d"],
        cpu: 87.5,
        cpuText: "512 / 4,096 남음",
        hostId: "i-9f8e7d6c5b4a",
        memory: 89.7,
        memoryText: "800 / 7,800 MiB 남음",
    },
];

export const PROGRESS_CLASS_NAME = "gap-0 [&_[data-slot=progress-track]]:h-1 [&_[data-slot=progress-track]]:bg-[#E6EFE9] [&_[data-slot=progress-indicator]]:bg-[#2C8D50]";
