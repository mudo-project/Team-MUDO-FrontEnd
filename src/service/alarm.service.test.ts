import { fetchWithAuth } from "../lib/fetch";
import {
  deleteNotification,
  deleteReadNotifications,
  getNotificationList,
  getUnreadNotificationCount,
  readNotification,
} from "./alarm.service";

jest.mock("../lib/fetch");

const mockedFetchWithAuth = fetchWithAuth as jest.Mock;

const okJsonResponse = (data: unknown) => ({
  ok: true,
  json: () => Promise.resolve(data),
});

const failJsonResponse = (message: string) => ({
  ok: false,
  headers: { get: () => "application/json" },
  json: () => Promise.resolve({ message }),
});

describe("getNotificationList", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("페이지 파라미터가 있으면 쿼리 스트링을 포함해 요청한다", async () => {
    const mockData: NotificationListData = { content: [], page: 1, size: 20, hasNext: false };
    mockedFetchWithAuth.mockResolvedValue(
      okJsonResponse({ status: 200, code: "OK", message: "", data: mockData })
    );

    const result = await getNotificationList({ page: 1, size: 20 });

    expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/notifications?page=1&size=20");
    expect(result).toEqual(mockData);
  });

  it("파라미터가 없으면 쿼리 스트링 없이 요청한다", async () => {
    const mockData: NotificationListData = { content: [], page: 0, size: 20, hasNext: false };
    mockedFetchWithAuth.mockResolvedValue(
      okJsonResponse({ status: 200, code: "OK", message: "", data: mockData })
    );

    await getNotificationList();

    expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/notifications");
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetchWithAuth.mockResolvedValue(failJsonResponse("알림 목록 조회에 실패하였습니다."));

    await expect(getNotificationList()).rejects.toThrow("알림 목록 조회에 실패하였습니다.");
  });
});

describe("getUnreadNotificationCount", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("응답이 정상이면 안읽은 개수를 반환한다", async () => {
    mockedFetchWithAuth.mockResolvedValue(
      okJsonResponse({ status: 200, code: "OK", message: "", data: { unreadCount: 5 } })
    );

    const result = await getUnreadNotificationCount();

    expect(result).toBe(5);
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetchWithAuth.mockResolvedValue(failJsonResponse("안읽은 알림 개수 조회에 실패하였습니다."));

    await expect(getUnreadNotificationCount()).rejects.toThrow("안읽은 알림 개수 조회에 실패하였습니다.");
  });
});

describe("readNotification", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("응답이 정상이면 읽음 처리 요청을 보낸다", async () => {
    mockedFetchWithAuth.mockResolvedValue({ ok: true });

    await readNotification(1);

    expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/notifications/1/read", { method: "PATCH" });
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetchWithAuth.mockResolvedValue(failJsonResponse("알림 읽음 처리에 실패하였습니다."));

    await expect(readNotification(1)).rejects.toThrow("알림 읽음 처리에 실패하였습니다.");
  });
});

describe("deleteNotification", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("응답이 정상이면 삭제 요청을 보낸다", async () => {
    mockedFetchWithAuth.mockResolvedValue({ ok: true });

    await deleteNotification(1);

    expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/notifications/1", { method: "DELETE" });
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetchWithAuth.mockResolvedValue(failJsonResponse("알림 삭제에 실패하였습니다."));

    await expect(deleteNotification(1)).rejects.toThrow("알림 삭제에 실패하였습니다.");
  });
});

describe("deleteReadNotifications", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("응답이 정상이면 읽은 알림 일괄 삭제 요청을 보낸다", async () => {
    mockedFetchWithAuth.mockResolvedValue({ ok: true });

    await deleteReadNotifications();

    expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/notifications?status=READ", { method: "DELETE" });
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetchWithAuth.mockResolvedValue(failJsonResponse("읽은 알림 일괄 삭제에 실패하였습니다."));

    await expect(deleteReadNotifications()).rejects.toThrow("읽은 알림 일괄 삭제에 실패하였습니다.");
  });
});
