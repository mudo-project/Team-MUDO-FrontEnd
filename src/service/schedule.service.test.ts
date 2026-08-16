import { fetchWithAuth } from "@/lib/fetch";
import { createSchedule, deleteSchedule, getScheduleDetail, getScheduleList, updateSchedule } from "./schedule.service";

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

const createRequest: ScheduleCreateRequest = {
  title: "전체 교직원 회의",
  content: "회의실 A",
  eventStartAt: "2026-08-10T09:00:00",
  eventEndAt: "2026-08-10T10:00:00",
  allDay: false,
  color: "B9827F",
};

describe("createSchedule", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 생성된 일정 id를 반환한다", async () => {
    mockedFetch.mockResolvedValue(okJsonResponse({ data: { eventId: 1 } }));

    const result = await createSchedule(createRequest);

    expect(mockedFetch).toHaveBeenCalledWith("/api/calendars", {
      method: "POST",
      body: JSON.stringify(createRequest),
    });
    expect(result).toBe(1);
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("일정 생성에 실패하였습니다."));

    await expect(createSchedule(createRequest)).rejects.toThrow("일정 생성에 실패하였습니다.");
  });

  it("네트워크 요청 자체가 실패하면 안내 메시지로 예외를 던진다", async () => {
    mockedFetch.mockRejectedValue(new Error("network error"));

    await expect(createSchedule(createRequest)).rejects.toThrow("일정 생성에 실패하였습니다.");
  });
});

describe("getScheduleList", () => {
  afterEach(() => jest.clearAllMocks());

  it("yearMonth 파라미터로 목록을 조회한다", async () => {
    mockedFetch.mockResolvedValue(okJsonResponse({ data: [] }));

    const result = await getScheduleList({ yearMonth: "2026-08" });

    expect(mockedFetch).toHaveBeenCalledWith("/api/calendars?yearMonth=2026-08", {});
    expect(result).toEqual([]);
  });

  it("date 파라미터로 목록을 조회한다", async () => {
    mockedFetch.mockResolvedValue(okJsonResponse({ data: [] }));

    await getScheduleList({ date: "2026-08-10" });

    expect(mockedFetch).toHaveBeenCalledWith("/api/calendars?date=2026-08-10", {});
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("일정 목록 조회에 실패하였습니다."));

    await expect(getScheduleList({ yearMonth: "2026-08" })).rejects.toThrow("일정 목록 조회에 실패하였습니다.");
  });
});

describe("getScheduleDetail", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 상세 정보를 반환한다", async () => {
    const detail = { eventId: 1 };
    mockedFetch.mockResolvedValue(okJsonResponse({ data: detail }));

    const result = await getScheduleDetail(1);

    expect(mockedFetch).toHaveBeenCalledWith("/api/calendars/1", {});
    expect(result).toEqual(detail);
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("일정 상세 조회에 실패하였습니다."));

    await expect(getScheduleDetail(1)).rejects.toThrow("일정 상세 조회에 실패하였습니다.");
  });
});

describe("updateSchedule", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 예외 없이 완료된다", async () => {
    mockedFetch.mockResolvedValue({ ok: true });

    await expect(updateSchedule(1, createRequest)).resolves.toBeUndefined();
    expect(mockedFetch).toHaveBeenCalledWith("/api/calendars/1", {
      method: "PATCH",
      body: JSON.stringify(createRequest),
    });
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("일정 수정에 실패하였습니다."));

    await expect(updateSchedule(1, createRequest)).rejects.toThrow("일정 수정에 실패하였습니다.");
  });
});

describe("deleteSchedule", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 예외 없이 완료된다", async () => {
    mockedFetch.mockResolvedValue({ ok: true });

    await expect(deleteSchedule(1)).resolves.toBeUndefined();
    expect(mockedFetch).toHaveBeenCalledWith("/api/calendars/1", { method: "DELETE" });
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("일정 삭제에 실패하였습니다."));

    await expect(deleteSchedule(1)).rejects.toThrow("일정 삭제에 실패하였습니다.");
  });
});
