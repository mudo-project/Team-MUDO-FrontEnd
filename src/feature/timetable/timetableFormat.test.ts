import {
  formatMinutesToTime,
  getClassEndTime,
  getClassStartTime,
  indexToDayOfWeek,
  parseTimeToMinutes,
  toTimetableSlotRequestPayload,
  toTimetableTemplate,
} from "./timetableFormat";
import type { ClassItem, TimetableTemplate } from "./viewModel";
import type { ClassRegistrationFormValues } from "@/lib/classRegistrationSchema";

describe("parseTimeToMinutes", () => {
  it("HH:mm 문자열을 분 단위로 변환한다", () => {
    expect(parseTimeToMinutes("09:30")).toBe(570);
  });
});

describe("formatMinutesToTime", () => {
  it("분 단위 숫자를 HH:mm 문자열로 변환한다", () => {
    expect(formatMinutesToTime(570)).toBe("09:30");
  });
});

describe("getClassStartTime", () => {
  it("슬롯 시작 그리드 좌표를 기준으로 시작 시각을 구한다", () => {
    const template = { operatingStartTime: "08:00", slotMinutes: 30 } as TimetableTemplate;
    const classItem = { start: 3 } as ClassItem;

    expect(getClassStartTime(template, classItem)).toBe("09:00");
  });
});

describe("getClassEndTime", () => {
  it("시작 시각에 소요 시간을 더해 종료 시각을 구한다", () => {
    const template = { operatingStartTime: "08:00", slotMinutes: 30 } as TimetableTemplate;
    const classItem = { start: 3, duration: 2 } as ClassItem;

    expect(getClassEndTime(template, classItem)).toBe("10:00");
  });
});

describe("toTimetableTemplate", () => {
  const detail: TimetableSetDetailData = {
    timetableSetId: 1,
    name: "2026 여름특강",
    startDate: "2026-08-01",
    endDate: "2026-08-31",
    operatingStartTime: "08:00",
    operatingEndTime: "22:00",
    operatingDays: ["MONDAY"],
    slotUnitMinutes: 30,
    classrooms: [
      { floor: "1층", codes: ["101"] },
      { floor: "2층", codes: ["201"] },
    ],
    status: "ACTIVE",
  };

  it("강의실을 층 내림차순으로 정렬한다", () => {
    const template = toTimetableTemplate(detail, []);

    expect(template.classroomGroups.map((group) => group.floor)).toEqual(["2층", "1층"]);
  });

  it("같은 층 이름을 가진 그룹이 여러 개면 하나로 합친다", () => {
    const duplicatedDetail: TimetableSetDetailData = {
      ...detail,
      classrooms: [
        { floor: "1층", codes: ["101"] },
        { floor: "1층", codes: ["102"] },
        { floor: "2층", codes: ["201"] },
      ],
    };

    const template = toTimetableTemplate(duplicatedDetail, []);

    expect(template.classroomGroups).toEqual([
      { floor: "2층", rooms: ["201"] },
      { floor: "1층", rooms: ["101", "102"] },
    ]);
  });

  it("수업 슬롯을 그리드 좌표를 가진 ClassItem으로 변환한다", () => {
    const slot: TimetableSlotData = {
      timetableSlotId: 10,
      classType: "CLASS",
      dayOfWeek: "MONDAY",
      classroomCode: "101",
      startTime: "09:00",
      endTime: "10:00",
      grade: "HIGH_3",
      teacherName: "최T",
      subjectName: "공통미적",
      color: "90A9C6",
    };

    const template = toTimetableTemplate(detail, [slot]);

    expect(template.classes[0]).toMatchObject({
      slotId: 10,
      day: 1,
      room: template.roomsByDay[1].rooms.indexOf("101"),
      start: 3,
      duration: 2,
      course: "공통미적",
      teacher: "최T",
      color: "90A9C6",
    });
  });

  it("강사·과목명이 없으면 빈 문자열로 채운다", () => {
    const slot: TimetableSlotData = {
      timetableSlotId: 11,
      classType: "CLASS",
      dayOfWeek: "MONDAY",
      classroomCode: "101",
      startTime: "09:00",
      endTime: "10:00",
      grade: "HIGH_3",
      teacherName: null,
      subjectName: null,
      color: "90A9C6",
    };

    const template = toTimetableTemplate(detail, [slot]);

    expect(template.classes[0].teacher).toBe("");
    expect(template.classes[0].course).toBe("");
  });
});

describe("toTimetableSlotRequestPayload", () => {
  it("등록 폼 값을 수업 슬롯 요청 바디로 변환한다", () => {
    const values: ClassRegistrationFormValues = {
      day: "월",
      room: "101",
      startTime: "09:00",
      endTime: "11:00",
      grade: "HIGH_3",
      teacher: "최T",
      course: "공통미적",
      color: "90A9C6",
    };

    const payload = toTimetableSlotRequestPayload(values, "CLASS");

    expect(payload).toEqual({
      classType: "CLASS",
      dayOfWeek: "MONDAY",
      classroomCode: "101",
      startTime: "09:00",
      endTime: "11:00",
      grade: "HIGH_3",
      teacherName: "최T",
      subjectName: "공통미적",
      color: "90A9C6",
    });
  });
});

describe("indexToDayOfWeek", () => {
  it("weekDayNames 인덱스 순서와 동일한 DayOfWeek 배열을 제공한다", () => {
    expect(indexToDayOfWeek).toEqual([
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ]);
  });
});
