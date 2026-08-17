import { fetchWithAuth } from "../lib/fetch";
import { getErrorMessage } from "../lib/stateError";
import {
    getAcademyApiCallFrequency,
    getAcademyList,
    getAcademyMemberCount,
    getAcademyStorageUsage,
    getOperationalMetrics,
} from "./superadmin.service";

jest.mock("../lib/fetch");
jest.mock("../lib/stateError");

const mockedFetchWithAuth = fetchWithAuth as jest.Mock;
const mockedGetErrorMessage = getErrorMessage as jest.Mock;

afterEach(() => {
    jest.clearAllMocks();
});

describe("getAcademyList", () => {
    it("응답이 정상이면 학원 목록을 반환한다", async () => {
        const mockData = { status: 200, code: "OK", message: "조회했습니다.", data: [{ code: "academy-a" }] };
        mockedFetchWithAuth.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) });

        const result = await getAcademyList();

        expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/platform/academies");
        expect(result).toEqual(mockData);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        const response = { ok: false };
        mockedFetchWithAuth.mockResolvedValue(response);
        mockedGetErrorMessage.mockResolvedValue("학원 목록 조회에 실패했습니다.");

        await expect(getAcademyList()).rejects.toThrow("학원 목록 조회에 실패했습니다.");
        expect(mockedGetErrorMessage).toHaveBeenCalledWith(response, "학원 목록 조회에 실패했습니다.");
    });
});

describe("getOperationalMetrics", () => {
    it("조회 조건이 없으면 쿼리 없이 조회한다", async () => {
        mockedFetchWithAuth.mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: {} }) });

        await getOperationalMetrics();

        expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/platform/operational-metrics");
    });

    it("조회 조건이 있으면 쿼리스트링(scope, academyCode, period 순)에 포함해 조회한다", async () => {
        mockedFetchWithAuth.mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: {} }) });

        await getOperationalMetrics({ scope: "ACADEMY", academyCode: "academy-a", period: "TODAY" });

        expect(mockedFetchWithAuth).toHaveBeenCalledWith(
            "/api/platform/operational-metrics?scope=ACADEMY&academyCode=academy-a&period=TODAY",
        );
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        const response = { ok: false };
        mockedFetchWithAuth.mockResolvedValue(response);
        mockedGetErrorMessage.mockResolvedValue("운영 성능·자원 지표 조회에 실패했습니다.");

        await expect(getOperationalMetrics()).rejects.toThrow("운영 성능·자원 지표 조회에 실패했습니다.");
        expect(mockedGetErrorMessage).toHaveBeenCalledWith(response, "운영 성능·자원 지표 조회에 실패했습니다.");
    });
});

describe("getAcademyMemberCount", () => {
    it("응답이 정상이면 학원 회원 수 정보를 반환한다", async () => {
        const mockData = {
            status: 200,
            code: "OK",
            message: "조회했습니다.",
            data: { academyCode: "academy-a", activeMemberCount: 10, collectedAt: "2026-01-01T00:00:00" },
        };
        mockedFetchWithAuth.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) });

        const result = await getAcademyMemberCount("academy-a");

        expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/platform/academies/academy-a/member-count");
        expect(result).toEqual(mockData);
    });

    it("학원 코드는 URL 인코딩되어 요청된다", async () => {
        mockedFetchWithAuth.mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: {} }) });

        await getAcademyMemberCount("academy a/b");

        expect(mockedFetchWithAuth).toHaveBeenCalledWith(
            `/api/platform/academies/${encodeURIComponent("academy a/b")}/member-count`,
        );
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        const response = { ok: false };
        mockedFetchWithAuth.mockResolvedValue(response);
        mockedGetErrorMessage.mockResolvedValue("학원 회원 수 조회에 실패했습니다.");

        await expect(getAcademyMemberCount("academy-a")).rejects.toThrow("학원 회원 수 조회에 실패했습니다.");
        expect(mockedGetErrorMessage).toHaveBeenCalledWith(response, "학원 회원 수 조회에 실패했습니다.");
    });
});

describe("getAcademyStorageUsage", () => {
    it("응답이 정상이면 학원 데이터 보유량 정보를 반환한다", async () => {
        const mockData = {
            status: 200,
            code: "OK",
            message: "조회했습니다.",
            data: { academyCode: "academy-a", databaseBytes: 1024, s3Bytes: 2048, collectedAt: "2026-01-01T00:00:00" },
        };
        mockedFetchWithAuth.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) });

        const result = await getAcademyStorageUsage("academy-a");

        expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/platform/academies/academy-a/storage-usage");
        expect(result).toEqual(mockData);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        const response = { ok: false };
        mockedFetchWithAuth.mockResolvedValue(response);
        mockedGetErrorMessage.mockResolvedValue("학원 데이터 보유량 조회에 실패했습니다.");

        await expect(getAcademyStorageUsage("academy-a")).rejects.toThrow("학원 데이터 보유량 조회에 실패했습니다.");
        expect(mockedGetErrorMessage).toHaveBeenCalledWith(response, "학원 데이터 보유량 조회에 실패했습니다.");
    });
});

describe("getAcademyApiCallFrequency", () => {
    it("조회 조건이 없으면 쿼리 없이 조회한다", async () => {
        mockedFetchWithAuth.mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: [] }) });

        await getAcademyApiCallFrequency();

        expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/platform/api-call-frequency");
    });

    it("조회 조건이 있으면 쿼리스트링에 포함해 조회한다", async () => {
        mockedFetchWithAuth.mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: [] }) });

        await getAcademyApiCallFrequency({ scope: "ALL", period: "LAST_24_HOURS" });

        expect(mockedFetchWithAuth).toHaveBeenCalledWith(
            "/api/platform/api-call-frequency?scope=ALL&period=LAST_24_HOURS",
        );
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        const response = { ok: false };
        mockedFetchWithAuth.mockResolvedValue(response);
        mockedGetErrorMessage.mockResolvedValue("학원별 API 호출 빈도 조회에 실패했습니다.");

        await expect(getAcademyApiCallFrequency()).rejects.toThrow("학원별 API 호출 빈도 조회에 실패했습니다.");
        expect(mockedGetErrorMessage).toHaveBeenCalledWith(response, "학원별 API 호출 빈도 조회에 실패했습니다.");
    });
});
