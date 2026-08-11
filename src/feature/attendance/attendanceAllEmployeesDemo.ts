// 전직원 현황 탭 데모용 더미데이터입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.

export type EmployeeDayStatus = "present" | "late" | "leave" | "absent" | "none";

export type EmployeeDay = {
  status: EmployeeDayStatus;
  clockIn?: string;
  clockOut?: string;
  hasNote?: boolean;
};

export type EmployeeWeekRow = {
  id: string;
  name: string;
  role: string;
  days: [EmployeeDay, EmployeeDay, EmployeeDay, EmployeeDay, EmployeeDay, EmployeeDay, EmployeeDay];
  weeklyCount: string;
};

export const WEEK_LABEL = "08.02 ~ 08.08";
export const WEEK_DATES = ["08.02", "08.03", "08.04", "08.05", "08.06", "08.07", "08.08"];
export const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export const STATUS_LABEL: Record<EmployeeDayStatus, string> = {
  present: "출근",
  late: "지각",
  leave: "연가",
  absent: "결근",
  none: "미기록",
};

export const STATUS_DOT_CLASS: Record<EmployeeDayStatus, string> = {
  present: "bg-[#0F172A]",
  late: "bg-[#B78236]",
  leave: "bg-[#4D9560]",
  absent: "bg-[#B45252]",
  none: "border border-[#DCE9DF]",
};

export const STATUS_TEXT_CLASS: Record<EmployeeDayStatus, string> = {
  present: "text-[#172033]",
  late: "text-[#B78236]",
  leave: "text-[#4D9560]",
  absent: "text-[#B45252]",
  none: "text-[#94A3B8]",
};

const none: EmployeeDay = { status: "none" };

export const EMPLOYEE_WEEK_ROWS: EmployeeWeekRow[] = [
  {
    id: "lm",
    name: "이민준",
    role: "강사",
    days: [
      none,
      { status: "present", clockIn: "09:05", clockOut: "18:30" },
      { status: "present", clockIn: "09:10", clockOut: "18:20" },
      { status: "late", clockIn: "09:35", clockOut: "18:40", hasNote: true },
      { status: "present", clockIn: "09:02", clockOut: "18:30" },
      { status: "present", clockIn: "08:55", clockOut: "18:15" },
      none,
    ],
    weeklyCount: "5/5",
  },
  {
    id: "ps",
    name: "박서연",
    role: "강사",
    days: [
      none,
      { status: "leave" },
      { status: "leave" },
      { status: "present", clockIn: "09:00", clockOut: "18:30" },
      { status: "present", clockIn: "09:05", clockOut: "18:25" },
      { status: "present", clockIn: "09:00", clockOut: "18:30" },
      none,
    ],
    weeklyCount: "3/5",
  },
  {
    id: "ch",
    name: "최현우",
    role: "강사",
    days: [
      none,
      { status: "present", clockIn: "09:00", clockOut: "18:30" },
      { status: "late", clockIn: "10:15", clockOut: "19:20", hasNote: true },
      { status: "present", clockIn: "09:05", clockOut: "18:30" },
      { status: "present", clockIn: "09:00", clockOut: "18:20" },
      { status: "present", clockIn: "09:05", clockOut: "18:30" },
      none,
    ],
    weeklyCount: "5/5",
  },
  {
    id: "jd",
    name: "정다은",
    role: "행정",
    days: [
      none,
      { status: "present", clockIn: "08:50", clockOut: "18:00" },
      { status: "present", clockIn: "08:55", clockOut: "18:10" },
      { status: "present", clockIn: "09:00", clockOut: "18:00" },
      { status: "present", clockIn: "09:00", clockOut: "18:05" },
      { status: "present", clockIn: "09:00", clockOut: "18:00" },
      none,
    ],
    weeklyCount: "5/5",
  },
  {
    id: "kd",
    name: "강도현",
    role: "강사",
    days: [
      none,
      { status: "absent" },
      { status: "present", clockIn: "09:10", clockOut: "18:30" },
      { status: "present", clockIn: "09:05", clockOut: "18:30" },
      { status: "present", clockIn: "09:00", clockOut: "18:20" },
      { status: "present", clockIn: "09:05", clockOut: "18:30" },
      none,
    ],
    weeklyCount: "4/5",
  },
  {
    id: "yy",
    name: "윤예진",
    role: "조교",
    days: [
      none,
      { status: "present", clockIn: "09:00", clockOut: "18:00" },
      { status: "present", clockIn: "09:05", clockOut: "18:10" },
      { status: "present", clockIn: "09:00", clockOut: "18:00" },
      { status: "present", clockIn: "09:00", clockOut: "18:00" },
      { status: "present", clockIn: "09:00", clockOut: "18:00" },
      none,
    ],
    weeklyCount: "5/5",
  },
  {
    id: "ls",
    name: "임성훈",
    role: "조교",
    days: [
      none,
      { status: "present", clockIn: "09:05", clockOut: "18:30" },
      { status: "present", clockIn: "09:00", clockOut: "18:20" },
      { status: "present", clockIn: "09:05", clockOut: "18:30" },
      { status: "present", clockIn: "09:00", clockOut: "18:30" },
      { status: "present", clockIn: "09:05", clockOut: "18:20" },
      none,
    ],
    weeklyCount: "5/5",
  },
];
