import {
  formatEventDate,
  formatEventDateFull,
  formatEventDateRange,
  formatEventDateRangeFull,
  formatEventRangeSummary,
  formatEventTimeRange,
  formatTimeLabel,
  isDateWithinEvent,
  toScheduleEvent,
  toScheduleRequestPayload,
} from "./scheduleFormat";
import { MEMO_COLORS } from "@/feature/memo/components/MemoColorPicker";
import type { ScheduleEvent } from "./scheduleTypes";

describe("formatTimeLabel", () => {
  it("오전 시간을 오전 h:mm 형식으로 변환한다", () => {
    expect(formatTimeLabel("09:30")).toBe("오전 9:30");
  });

  it("오후 시간을 오후 h:mm 형식으로 변환한다", () => {
    expect(formatTimeLabel("14:00")).toBe("오후 2:00");
  });

  it("정오(12:00)는 오후 12:mm으로 변환한다", () => {
    expect(formatTimeLabel("12:00")).toBe("오후 12:00");
  });

  it("자정(00:00)은 오전 12:mm으로 변환한다", () => {
    expect(formatTimeLabel("00:00")).toBe("오전 12:00");
  });
});

describe("formatEventTimeRange", () => {
  const base: ScheduleEvent = {
    id: 1,
    title: "회의",
    startDate: new Date(2026, 7, 10),
    endDate: new Date(2026, 7, 10),
    allDay: false,
    color: MEMO_COLORS[0],
    content: "",
    createdAt: "2026.08.01",
  };

  it("종일 일정이면 종일을 반환한다", () => {
    expect(formatEventTimeRange({ ...base, allDay: true })).toBe("종일");
  });

  it("시작/종료 시간이 있으면 오전·오후 범위를 반환한다", () => {
    expect(formatEventTimeRange({ ...base, startTime: "09:00", endTime: "10:30" })).toBe("오전 9:00 - 오전 10:30");
  });

  it("시작 또는 종료 시간이 없으면 종일을 반환한다", () => {
    expect(formatEventTimeRange({ ...base, startTime: "09:00", endTime: undefined })).toBe("종일");
  });
});

describe("formatEventDate", () => {
  it("M월 d일 (요일) 형식으로 변환한다", () => {
    expect(formatEventDate(new Date(2026, 7, 10))).toBe("8월 10일 (월)");
  });
});

describe("formatEventDateFull", () => {
  it("yyyy년 M월 d일 (요일) 형식으로 변환한다", () => {
    expect(formatEventDateFull(new Date(2026, 7, 10))).toBe("2026년 8월 10일 (월)");
  });
});

describe("formatEventDateRange", () => {
  const base: ScheduleEvent = {
    id: 1,
    title: "회의",
    startDate: new Date(2026, 7, 10),
    endDate: new Date(2026, 7, 10),
    allDay: false,
    color: MEMO_COLORS[0],
    content: "",
    createdAt: "2026.08.01",
  };

  it("하루짜리 일정은 단일 날짜 형식을 반환한다", () => {
    expect(formatEventDateRange(base)).toBe("8월 10일 (월)");
  });

  it("여러 날 일정은 'M월 d일 ~ M월 d일' 형식을 반환한다", () => {
    expect(formatEventDateRange({ ...base, endDate: new Date(2026, 7, 12) })).toBe("8월 10일 ~ 8월 12일");
  });
});

describe("formatEventDateRangeFull", () => {
  const base: ScheduleEvent = {
    id: 1,
    title: "회의",
    startDate: new Date(2026, 7, 10),
    endDate: new Date(2026, 7, 10),
    allDay: false,
    color: MEMO_COLORS[0],
    content: "",
    createdAt: "2026.08.01",
  };

  it("하루짜리 일정은 단일 날짜(연도 포함) 형식을 반환한다", () => {
    expect(formatEventDateRangeFull(base)).toBe("2026년 8월 10일 (월)");
  });

  it("여러 날 일정은 양쪽 날짜를 모두 연도 포함으로 표기한다", () => {
    expect(formatEventDateRangeFull({ ...base, endDate: new Date(2026, 7, 12) })).toBe(
      "2026년 8월 10일 (월) ~ 2026년 8월 12일 (수)"
    );
  });
});

describe("formatEventRangeSummary", () => {
  const base: ScheduleEvent = {
    id: 1,
    title: "회의",
    startDate: new Date(2026, 7, 10),
    endDate: new Date(2026, 7, 10),
    allDay: false,
    startTime: "09:00",
    endTime: "10:00",
    color: MEMO_COLORS[0],
    content: "",
    createdAt: "2026.08.01",
  };

  it("하루짜리 일정은 '날짜 · 시간' 형식을 반환한다", () => {
    expect(formatEventRangeSummary(base)).toBe("8월 10일 (월) · 오전 9:00 - 오전 10:00");
  });

  it("여러 날 종일 일정은 날짜 범위만 반환한다", () => {
    expect(formatEventRangeSummary({ ...base, endDate: new Date(2026, 7, 12), allDay: true })).toBe("8월 10일 ~ 8월 12일");
  });

  it("여러 날 종일이 아닌 일정은 각 날짜에 시간을 붙여 반환한다", () => {
    expect(
      formatEventRangeSummary({ ...base, endDate: new Date(2026, 7, 12), startTime: "10:00", endTime: "15:00" })
    ).toBe("8월 10일 오전 10:00 ~ 8월 12일 오후 3:00");
  });
});

describe("isDateWithinEvent", () => {
  const event: ScheduleEvent = {
    id: 1,
    title: "워크숍",
    startDate: new Date(2026, 7, 10),
    endDate: new Date(2026, 7, 12),
    allDay: true,
    color: MEMO_COLORS[0],
    content: "",
    createdAt: "2026.08.01",
  };

  it("범위 안의 날짜는 참을 반환한다", () => {
    expect(isDateWithinEvent(new Date(2026, 7, 11), event)).toBe(true);
  });

  it("시작일과 종료일 경계도 포함한다", () => {
    expect(isDateWithinEvent(new Date(2026, 7, 10), event)).toBe(true);
    expect(isDateWithinEvent(new Date(2026, 7, 12), event)).toBe(true);
  });

  it("범위 밖의 날짜는 거짓을 반환한다", () => {
    expect(isDateWithinEvent(new Date(2026, 7, 13), event)).toBe(false);
  });
});

describe("toScheduleEvent", () => {
  it("종일이 아닌 API 응답을 화면용 모델로 변환한다", () => {
    const data: ScheduleEventData = {
      eventId: 1,
      title: "회의",
      content: "내용",
      eventStartAt: "2026-08-10T09:00:00",
      eventEndAt: "2026-08-10T10:00:00",
      allDay: false,
      color: MEMO_COLORS[1].code,
      createdBy: 1,
      createdAt: "2026-08-01T00:00:00",
      updatedAt: "2026-08-01T00:00:00",
    };

    const event = toScheduleEvent(data);

    expect(event).toMatchObject({
      id: 1,
      title: "회의",
      allDay: false,
      startTime: "09:00",
      endTime: "10:00",
      color: MEMO_COLORS[1],
      content: "내용",
      createdAt: "2026.08.01",
    });
    expect(event.startDate).toEqual(new Date(2026, 7, 10));
    expect(event.endDate).toEqual(new Date(2026, 7, 10));
  });

  it("여러 날짜에 걸치는 API 응답은 시작일/종료일을 각각 변환한다", () => {
    const data: ScheduleEventData = {
      eventId: 3,
      title: "워크숍",
      content: null,
      eventStartAt: "2026-08-10T00:00:00",
      eventEndAt: "2026-08-12T00:00:00",
      allDay: true,
      color: MEMO_COLORS[0].code,
      createdBy: 1,
      createdAt: "2026-08-01T00:00:00",
      updatedAt: "2026-08-01T00:00:00",
    };

    const event = toScheduleEvent(data);

    expect(event.startDate).toEqual(new Date(2026, 7, 10));
    expect(event.endDate).toEqual(new Date(2026, 7, 12));
  });

  it("일치하는 색상 코드가 없으면 첫 번째 팔레트 색상으로 대체한다", () => {
    const data: ScheduleEventData = {
      eventId: 2,
      title: "회의",
      content: null,
      eventStartAt: "2026-08-10T00:00:00",
      eventEndAt: null,
      allDay: true,
      color: "UNKNOWN",
      createdBy: 1,
      createdAt: "2026-08-01T00:00:00",
      updatedAt: "2026-08-01T00:00:00",
    };

    const event = toScheduleEvent(data);

    expect(event.color).toEqual(MEMO_COLORS[0]);
    expect(event.content).toBe("");
    expect(event.startTime).toBeUndefined();
    expect(event.endTime).toBeUndefined();
    expect(event.endDate).toEqual(event.startDate);
  });
});

describe("toScheduleRequestPayload", () => {
  it("종일 일정은 종료 시간 없이 00:00 시작으로 변환한다", () => {
    const payload = toScheduleRequestPayload({
      title: "회의",
      startDate: new Date(2026, 7, 10),
      endDate: new Date(2026, 7, 10),
      allDay: true,
      color: MEMO_COLORS[0],
      content: "",
    });

    expect(payload).toEqual({
      title: "회의",
      content: undefined,
      eventStartAt: "2026-08-10T00:00:00",
      allDay: true,
      color: MEMO_COLORS[0].code,
    });
  });

  it("종일이 아닌 일정은 날짜와 시작/종료 시간을 조합해 변환한다", () => {
    const payload = toScheduleRequestPayload({
      title: "회의",
      startDate: new Date(2026, 7, 10),
      endDate: new Date(2026, 7, 10),
      allDay: false,
      startTime: "09:00",
      endTime: "10:00",
      color: MEMO_COLORS[0],
      content: "  회의실 A  ",
    });

    expect(payload).toEqual({
      title: "회의",
      content: "회의실 A",
      eventStartAt: "2026-08-10T09:00:00",
      eventEndAt: "2026-08-10T10:00:00",
      allDay: false,
      color: MEMO_COLORS[0].code,
    });
  });

  it("여러 날에 걸친 일정은 시작일 시작시각과 종료일 종료시각을 조합해 변환한다", () => {
    const payload = toScheduleRequestPayload({
      title: "워크숍",
      startDate: new Date(2026, 7, 10),
      endDate: new Date(2026, 7, 12),
      allDay: false,
      startTime: "10:00",
      endTime: "15:00",
      color: MEMO_COLORS[0],
      content: "",
    });

    expect(payload).toEqual({
      title: "워크숍",
      content: undefined,
      eventStartAt: "2026-08-10T10:00:00",
      eventEndAt: "2026-08-12T15:00:00",
      allDay: false,
      color: MEMO_COLORS[0].code,
    });
  });
});
