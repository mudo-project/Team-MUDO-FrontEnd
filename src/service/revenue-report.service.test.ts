import { fetchWithAuth } from "@/lib/fetch";
import { getRevenueReportDetail, getRevenueReportList, getRevenueReportUnreadCount } from "./revenue-report.service";

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

describe("getRevenueReportList", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 목록을 반환한다", async () => {
    const list = [{ reportId: 1, targetMonth: "2026-08", read: false }];
    mockedFetch.mockResolvedValue(okJsonResponse({ data: list }));

    const result = await getRevenueReportList();

    expect(mockedFetch).toHaveBeenCalledWith("/api/revenue-reports");
    expect(result).toEqual(list);
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("매출 리포트 목록 조회에 실패하였습니다."));

    await expect(getRevenueReportList()).rejects.toThrow("매출 리포트 목록 조회에 실패하였습니다.");
  });
});

describe("getRevenueReportDetail", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 상세 정보를 반환한다", async () => {
    const detail = { reportId: 1, targetMonth: "2026-08", report: "리포트 내용", dataSnapshot: "{}" };
    mockedFetch.mockResolvedValue(okJsonResponse({ data: detail }));

    const result = await getRevenueReportDetail(1);

    expect(mockedFetch).toHaveBeenCalledWith("/api/revenue-reports/1");
    expect(result).toEqual(detail);
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("매출 리포트 상세 조회에 실패하였습니다."));

    await expect(getRevenueReportDetail(1)).rejects.toThrow("매출 리포트 상세 조회에 실패하였습니다.");
  });
});

describe("getRevenueReportUnreadCount", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 안읽은 리포트 수를 반환한다", async () => {
    mockedFetch.mockResolvedValue(okJsonResponse({ data: { unreadCount: 3 } }));

    const result = await getRevenueReportUnreadCount();

    expect(mockedFetch).toHaveBeenCalledWith("/api/revenue-reports/unread-count");
    expect(result).toBe(3);
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("안읽은 매출 리포트 수 조회에 실패하였습니다."));

    await expect(getRevenueReportUnreadCount()).rejects.toThrow("안읽은 매출 리포트 수 조회에 실패하였습니다.");
  });
});
