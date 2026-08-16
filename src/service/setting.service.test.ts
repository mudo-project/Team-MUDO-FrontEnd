import { fetchWithAuth } from "@/lib/fetch";
import { buildSignedClientIpHeaders } from "@/lib/clientIpHeaders";
import {
  checkGoogleConnection,
  createWifiIp,
  deleteWifiIp,
  disconnectGoogle,
  getCurrentIp,
  getGoogleAuthorizationUrl,
  getGoogleConnection,
  getWifiIpList,
  saveWorkingHours,
} from "./setting.service";

jest.mock("../lib/fetch");
jest.mock("../lib/clientIpHeaders");

const mockedFetch = fetchWithAuth as jest.Mock;
const mockedBuildSignedClientIpHeaders = buildSignedClientIpHeaders as jest.Mock;

const okJsonResponse = (data: unknown) => ({
  ok: true,
  json: () => Promise.resolve(data),
});

const failJsonResponse = (message: string) => ({
  ok: false,
  headers: { get: () => "application/json" },
  json: () => Promise.resolve({ message }),
});

const signedHeaders = {
  "X-Client-IP": "123.45.67.89",
  "X-Client-IP-Timestamp": "1700000000",
  "X-Client-IP-Signature": "signature",
};

describe("getCurrentIp", () => {
  beforeEach(() => {
    mockedBuildSignedClientIpHeaders.mockResolvedValue(signedHeaders);
  });

  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 현재 접속 IP를 반환한다", async () => {
    mockedFetch.mockResolvedValue(okJsonResponse({ data: { ipAddress: "123.45.67.89" } }));

    const result = await getCurrentIp();

    expect(mockedBuildSignedClientIpHeaders).toHaveBeenCalledWith("GET", "/api/attendance/wifi-ips/current");
    expect(mockedFetch).toHaveBeenCalledWith("/api/attendance/wifi-ips/current", { headers: signedHeaders });
    expect(result).toBe("123.45.67.89");
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("현재 접속 IP 조회에 실패하였습니다."));

    await expect(getCurrentIp()).rejects.toThrow("현재 접속 IP 조회에 실패하였습니다.");
  });
});

describe("createWifiIp", () => {
  const payload: WifiIpCreateRequest = { confirmedIpAddress: "123.45.67.89", note: "" };

  beforeEach(() => {
    mockedBuildSignedClientIpHeaders.mockResolvedValue(signedHeaders);
  });

  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 등록된 와이파이 IP 정보를 반환한다", async () => {
    const wifiIp = { wifiIpId: 1, ipAddress: "123.45.67.89", note: "" };
    mockedFetch.mockResolvedValue(okJsonResponse({ data: wifiIp }));

    const result = await createWifiIp(payload);

    expect(mockedBuildSignedClientIpHeaders).toHaveBeenCalledWith("POST", "/api/attendance/wifi-ips");
    expect(mockedFetch).toHaveBeenCalledWith("/api/attendance/wifi-ips", {
      method: "POST",
      headers: signedHeaders,
      body: JSON.stringify(payload),
    });
    expect(result).toEqual(wifiIp);
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("와이파이 IP 등록에 실패하였습니다."));

    await expect(createWifiIp(payload)).rejects.toThrow("와이파이 IP 등록에 실패하였습니다.");
  });
});

describe("getWifiIpList", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 와이파이 IP 목록을 반환한다", async () => {
    const list = [{ wifiIpId: 1, ipAddress: "123.45.67.89", note: "", createdAt: "2026-08-01T00:00:00.000Z" }];
    mockedFetch.mockResolvedValue(okJsonResponse({ data: list }));

    const result = await getWifiIpList();

    expect(mockedFetch).toHaveBeenCalledWith("/api/attendance/wifi-ips");
    expect(result).toEqual(list);
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("와이파이 IP 목록 조회에 실패하였습니다."));

    await expect(getWifiIpList()).rejects.toThrow("와이파이 IP 목록 조회에 실패하였습니다.");
  });
});

describe("deleteWifiIp", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 예외 없이 완료된다", async () => {
    mockedFetch.mockResolvedValue({ ok: true });

    await expect(deleteWifiIp(1)).resolves.toBeUndefined();
    expect(mockedFetch).toHaveBeenCalledWith("/api/attendance/wifi-ips/1", { method: "DELETE" });
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("와이파이 IP 삭제에 실패하였습니다."));

    await expect(deleteWifiIp(1)).rejects.toThrow("와이파이 IP 삭제에 실패하였습니다.");
  });
});

describe("saveWorkingHours", () => {
  const payload: WorkingHoursPolicySaveRequest = {
    defaultStartTime: "09:00",
    defaultEndTime: "18:00",
    lateGraceMinutes: 10,
    weekdayExceptionEnabled: false,
    weekdays: [],
  };

  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 저장된 근무시간 정책을 반환한다", async () => {
    const saved = { policyId: 1, ...payload };
    mockedFetch.mockResolvedValue(okJsonResponse({ data: saved }));

    const result = await saveWorkingHours(payload);

    expect(mockedFetch).toHaveBeenCalledWith("/api/attendance/policies", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    expect(result).toEqual(saved);
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("근무시간 정책 저장에 실패하였습니다."));

    await expect(saveWorkingHours(payload)).rejects.toThrow("근무시간 정책 저장에 실패하였습니다.");
  });
});

describe("getGoogleConnection", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 연동 상태 데이터를 반환한다", async () => {
    const connection: GoogleConnectionData = {
      googleEmail: "academy@example.com",
      connectedByUserId: 1,
      connectedByUserName: "관리자",
      scope: "drive",
      connectedAt: "2026-08-01T00:00:00.000Z",
      refreshTokenExpiresAt: null,
      lastCheckedAt: "2026-08-01T00:00:00.000Z",
      status: "CONNECTED",
    };
    mockedFetch.mockResolvedValue(okJsonResponse({ data: connection }));

    const result = await getGoogleConnection();

    expect(mockedFetch).toHaveBeenCalledWith("/api/google/connections");
    expect(result).toEqual(connection);
  });

  it("연동된 계정이 없으면 null을 반환한다", async () => {
    mockedFetch.mockResolvedValue(okJsonResponse({ data: null }));

    const result = await getGoogleConnection();

    expect(result).toBeNull();
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("구글 연동 상태 조회에 실패하였습니다."));

    await expect(getGoogleConnection()).rejects.toThrow("구글 연동 상태 조회에 실패하였습니다.");
  });
});

describe("getGoogleAuthorizationUrl", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 인가 URL을 반환한다", async () => {
    mockedFetch.mockResolvedValue(
      okJsonResponse({ data: { authorizationUrl: "https://accounts.google.com/authorize" } })
    );

    const result = await getGoogleAuthorizationUrl(false);

    expect(mockedFetch).toHaveBeenCalledWith("/api/google/connections/authorize-url?switchAccount=false", {
      method: "POST",
    });
    expect(result).toBe("https://accounts.google.com/authorize");
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("구글 인증 URL 발급에 실패하였습니다."));

    await expect(getGoogleAuthorizationUrl(true)).rejects.toThrow("구글 인증 URL 발급에 실패하였습니다.");
  });
});

describe("checkGoogleConnection", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 예외 없이 완료된다", async () => {
    mockedFetch.mockResolvedValue({ ok: true });

    await expect(checkGoogleConnection()).resolves.toBeUndefined();
    expect(mockedFetch).toHaveBeenCalledWith("/api/google/connections/check", { method: "POST" });
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("구글 연동 상태 확인에 실패하였습니다."));

    await expect(checkGoogleConnection()).rejects.toThrow("구글 연동 상태 확인에 실패하였습니다.");
  });
});

describe("disconnectGoogle", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 예외 없이 완료된다", async () => {
    mockedFetch.mockResolvedValue({ ok: true });

    await expect(disconnectGoogle()).resolves.toBeUndefined();
    expect(mockedFetch).toHaveBeenCalledWith("/api/google/connections", { method: "DELETE" });
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("구글 연동 해제에 실패하였습니다."));

    await expect(disconnectGoogle()).rejects.toThrow("구글 연동 해제에 실패하였습니다.");
  });
});
