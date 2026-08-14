import { weekDayNames } from "@/feature/timetable/constants";
import type { ClassItem, FloorConfig, TimetableTemplate } from "@/feature/timetable/viewModel";
import type { ClassRegistrationFormValues } from "@/lib/classRegistrationSchema";

// weekDayNames(["일", "월", ..., "토"]) 인덱스 <-> API DayOfWeek 매핑
export const indexToDayOfWeek: DayOfWeek[] = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

const dayOfWeekToIndex: Record<DayOfWeek, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

export function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function formatMinutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

// 수업 슬롯의 그리드 시작 슬롯(1부터 시작) 기준 시각을 구한다.
export function getClassStartTime(template: TimetableTemplate, classItem: ClassItem): string {
  const baseMinutes = parseTimeToMinutes(template.operatingStartTime);
  return formatMinutesToTime(baseMinutes + (classItem.start - 1) * template.slotMinutes);
}

// 수업 슬롯의 종료 시각을 구한다.
export function getClassEndTime(template: TimetableTemplate, classItem: ClassItem): string {
  const startMinutes = parseTimeToMinutes(getClassStartTime(template, classItem));
  return formatMinutesToTime(startMinutes + classItem.duration * template.slotMinutes);
}

// API 시간표 세트 상세 + 수업 슬롯 목록을 화면에서 쓰는 TimetableTemplate 형태로 변환한다.
export function toTimetableTemplate(
  detail: TimetableSetDetailData,
  slots: TimetableSlotData[]
): TimetableTemplate {
  const classroomGroups: FloorConfig[] = detail.classrooms.map((group) => ({
    floor: group.floor,
    rooms: [...group.codes],
  }));
  const rooms = classroomGroups.flatMap((group) => group.rooms);
  const roomsByDay = weekDayNames.map((name) => ({ name, rooms: [...rooms] }));
  const baseMinutes = parseTimeToMinutes(detail.operatingStartTime);
  const slotMinutes = detail.slotUnitMinutes as 10 | 30 | 60;

  const classes: ClassItem[] = slots.map((slot) => {
    const startMinutes = parseTimeToMinutes(slot.startTime);
    const endMinutes = parseTimeToMinutes(slot.endTime);

    return {
      slotId: slot.timetableSlotId,
      classType: slot.classType,
      day: dayOfWeekToIndex[slot.dayOfWeek],
      room: rooms.indexOf(slot.classroomCode),
      start: (startMinutes - baseMinutes) / slotMinutes + 1,
      duration: (endMinutes - startMinutes) / slotMinutes,
      grade: slot.grade,
      course: slot.subjectName ?? "",
      teacher: slot.teacherName ?? "",
      color: slot.color,
    };
  });

  return {
    id: detail.timetableSetId,
    title: detail.name,
    startDate: new Date(detail.startDate),
    endDate: new Date(detail.endDate),
    status: detail.status,
    operatingStartTime: detail.operatingStartTime,
    operatingEndTime: detail.operatingEndTime,
    operatingDays: detail.operatingDays,
    roomsByDay,
    classroomGroups,
    classes,
    slotMinutes,
  };
}

// 수업 등록/수정 폼 값을 수업 슬롯 등록·수정 요청 바디로 변환한다.
export function toTimetableSlotRequestPayload(
  values: ClassRegistrationFormValues,
  classType: TimetableClassType
): TimetableSlotCreateRequest {
  return {
    classType,
    dayOfWeek: indexToDayOfWeek[weekDayNames.indexOf(values.day)],
    classroomCode: values.room,
    startTime: values.startTime,
    endTime: values.endTime,
    grade: values.grade,
    teacherName: values.teacher,
    subjectName: values.course,
    color: values.color,
  };
}
