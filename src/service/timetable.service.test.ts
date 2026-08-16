import { fetchWithAuth } from "@/lib/fetch";
import {
  createTimetableSet,
  createTimetableSlot,
  deleteTimetableSet,
  deleteTimetableSlot,
  exportTimetableSet,
  getTimetableSetDetail,
  getTimetableSetList,
  getTimetableSlotDetail,
  getTimetableSlotList,
  updateTimetableSet,
  updateTimetableSlot,
} from "./timetable.service";

jest.mock("../lib/fetch");

const mockedFetch = fetchWithAuth as jest.Mock;

const okJsonResponse = (data: unknown) => ({
  ok: true,
  json: () => Promise.resolve(data),
});

const failJsonResponse = (message: string) => ({
  ok: false,
  headers: { get: () => "application/json" },
  json: () => Promise.resolve({ message }),
});

const setCreateRequest: TimetableSetCreateRequest = {
  name: "2026 여름특강",
  startDate: "2026-08-01",
  endDate: "2026-08-31",
  operatingStartTime: "08:30",
  operatingEndTime: "22:00",
  operatingDays: ["MONDAY"],
  slotUnitMinutes: 30,
  classrooms: [{ floor: "1층", codes: ["101"] }],
};

const slotCreateRequest: TimetableSlotCreateRequest = {
  classType: "CLASS",
  dayOfWeek: "MONDAY",
  classroomCode: "101",
  startTime: "09:00",
  endTime: "11:00",
  grade: "HIGH_3",
  teacherName: "최T",
  subjectName: "공통미적",
  color: "90A9C6",
};

describe("createTimetableSet", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 생성된 시간표 세트 id를 반환한다", async () => {
    mockedFetch.mockResolvedValue(okJsonResponse({ data: { timetableSetId: 1 } }));

    const result = await createTimetableSet(setCreateRequest);

    expect(mockedFetch).toHaveBeenCalledWith("/api/timetables", {
      method: "POST",
      body: JSON.stringify(setCreateRequest),
    });
    expect(result).toBe(1);
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("시간표 세트 생성에 실패하였습니다."));

    await expect(createTimetableSet(setCreateRequest)).rejects.toThrow("시간표 세트 생성에 실패하였습니다.");
  });
});

describe("getTimetableSetList", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 목록을 반환한다", async () => {
    mockedFetch.mockResolvedValue(okJsonResponse({ data: [] }));

    const result = await getTimetableSetList();

    expect(mockedFetch).toHaveBeenCalledWith("/api/timetables");
    expect(result).toEqual([]);
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("시간표 세트 목록 조회에 실패하였습니다."));

    await expect(getTimetableSetList()).rejects.toThrow("시간표 세트 목록 조회에 실패하였습니다.");
  });
});

describe("getTimetableSetDetail", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 상세 정보를 반환한다", async () => {
    const detail = { timetableSetId: 1 };
    mockedFetch.mockResolvedValue(okJsonResponse({ data: detail }));

    const result = await getTimetableSetDetail(1);

    expect(mockedFetch).toHaveBeenCalledWith("/api/timetables/1");
    expect(result).toEqual(detail);
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("시간표 세트 상세 조회에 실패하였습니다."));

    await expect(getTimetableSetDetail(1)).rejects.toThrow("시간표 세트 상세 조회에 실패하였습니다.");
  });
});

describe("updateTimetableSet", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 예외 없이 완료된다", async () => {
    mockedFetch.mockResolvedValue({ ok: true });

    await expect(updateTimetableSet(1, setCreateRequest)).resolves.toBeUndefined();
    expect(mockedFetch).toHaveBeenCalledWith("/api/timetables/1", {
      method: "PATCH",
      body: JSON.stringify(setCreateRequest),
    });
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("시간표 세트 수정에 실패하였습니다."));

    await expect(updateTimetableSet(1, setCreateRequest)).rejects.toThrow("시간표 세트 수정에 실패하였습니다.");
  });
});

describe("deleteTimetableSet", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 예외 없이 완료된다", async () => {
    mockedFetch.mockResolvedValue({ ok: true });

    await expect(deleteTimetableSet(1)).resolves.toBeUndefined();
    expect(mockedFetch).toHaveBeenCalledWith("/api/timetables/1", { method: "DELETE" });
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("시간표 세트 삭제에 실패하였습니다."));

    await expect(deleteTimetableSet(1)).rejects.toThrow("시간표 세트 삭제에 실패하였습니다.");
  });
});

describe("createTimetableSlot", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 생성된 수업 슬롯 id를 반환한다", async () => {
    mockedFetch.mockResolvedValue(okJsonResponse({ data: { timetableSlotId: 10 } }));

    const result = await createTimetableSlot(1, slotCreateRequest);

    expect(mockedFetch).toHaveBeenCalledWith("/api/timetables/1/slots", {
      method: "POST",
      body: JSON.stringify(slotCreateRequest),
    });
    expect(result).toBe(10);
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("수업 슬롯 등록에 실패하였습니다."));

    await expect(createTimetableSlot(1, slotCreateRequest)).rejects.toThrow("수업 슬롯 등록에 실패하였습니다.");
  });
});

describe("getTimetableSlotList", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 목록을 반환한다", async () => {
    mockedFetch.mockResolvedValue(okJsonResponse({ data: [] }));

    const result = await getTimetableSlotList(1);

    expect(mockedFetch).toHaveBeenCalledWith("/api/timetables/1/slots");
    expect(result).toEqual([]);
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("수업 슬롯 목록 조회에 실패하였습니다."));

    await expect(getTimetableSlotList(1)).rejects.toThrow("수업 슬롯 목록 조회에 실패하였습니다.");
  });
});

describe("getTimetableSlotDetail", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 상세 정보를 반환한다", async () => {
    const slot = { timetableSlotId: 10 };
    mockedFetch.mockResolvedValue(okJsonResponse({ data: slot }));

    const result = await getTimetableSlotDetail(1, 10);

    expect(mockedFetch).toHaveBeenCalledWith("/api/timetables/1/slots/10");
    expect(result).toEqual(slot);
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("수업 슬롯 상세 조회에 실패하였습니다."));

    await expect(getTimetableSlotDetail(1, 10)).rejects.toThrow("수업 슬롯 상세 조회에 실패하였습니다.");
  });
});

describe("updateTimetableSlot", () => {
  afterEach(() => jest.clearAllMocks());

  const payload: TimetableSlotUpdateRequest = { scope: "ALL", ...slotCreateRequest };

  it("응답이 정상이면 예외 없이 완료된다", async () => {
    mockedFetch.mockResolvedValue({ ok: true });

    await expect(updateTimetableSlot(1, 10, payload)).resolves.toBeUndefined();
    expect(mockedFetch).toHaveBeenCalledWith("/api/timetables/1/slots/10", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("수업 슬롯 수정에 실패하였습니다."));

    await expect(updateTimetableSlot(1, 10, payload)).rejects.toThrow("수업 슬롯 수정에 실패하였습니다.");
  });
});

describe("deleteTimetableSlot", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 예외 없이 완료된다", async () => {
    mockedFetch.mockResolvedValue({ ok: true });

    await expect(deleteTimetableSlot(1, 10, "ALL")).resolves.toBeUndefined();
    expect(mockedFetch).toHaveBeenCalledWith("/api/timetables/1/slots/10?scope=ALL", { method: "DELETE" });
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("수업 슬롯 삭제에 실패하였습니다."));

    await expect(deleteTimetableSlot(1, 10, "ALL")).rejects.toThrow("수업 슬롯 삭제에 실패하였습니다.");
  });
});

describe("exportTimetableSet", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 파일 Blob을 반환한다", async () => {
    const blob = new Blob(["file"]);
    mockedFetch.mockResolvedValue({ ok: true, blob: () => Promise.resolve(blob) });

    const result = await exportTimetableSet(1, { format: "EXCEL", density: "NORMAL", floor: "1층" });

    const expectedQuery = new URLSearchParams({ format: "EXCEL" });
    expectedQuery.set("density", "NORMAL");
    expectedQuery.set("floor", "1층");

    expect(mockedFetch).toHaveBeenCalledWith(`/api/timetables/1/export?${expectedQuery.toString()}`);
    expect(result).toBe(blob);
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("시간표 세트 내보내기에 실패하였습니다."));

    await expect(exportTimetableSet(1, { format: "PDF" })).rejects.toThrow("시간표 세트 내보내기에 실패하였습니다.");
  });
});
