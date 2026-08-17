import {
    getAcademyApiCallFrequency,
    getAcademyList,
    getAcademyMemberCount,
    getAcademyStorageUsage,
    getOperationalMetrics,
} from "../../service/superadmin.service";
import {
    getAcademyApiCallFrequencyAction,
    getAcademyListAction,
    getAcademyMemberCountAction,
    getAcademyStorageUsageAction,
    getOperationalMetricsAction,
} from "./actions";

jest.mock("../../service/superadmin.service", () => ({
    getAcademyApiCallFrequency: jest.fn(),
    getAcademyList: jest.fn(),
    getAcademyMemberCount: jest.fn(),
    getAcademyStorageUsage: jest.fn(),
    getOperationalMetrics: jest.fn(),
}));

const mockedGetAcademyList = getAcademyList as jest.Mock;
const mockedGetOperationalMetrics = getOperationalMetrics as jest.Mock;
const mockedGetAcademyMemberCount = getAcademyMemberCount as jest.Mock;
const mockedGetAcademyStorageUsage = getAcademyStorageUsage as jest.Mock;
const mockedGetAcademyApiCallFrequency = getAcademyApiCallFrequency as jest.Mock;

afterEach(() => {
    jest.clearAllMocks();
});

describe("getAcademyListAction", () => {
    it("service 호출이 성공하면 학원 목록을 담아 성공 결과를 반환한다", async () => {
        mockedGetAcademyList.mockResolvedValue({ message: "조회했습니다.", data: [{ code: "academy-a" }] });

        const result = await getAcademyListAction();

        expect(result).toEqual({ success: true, message: "조회했습니다.", data: [{ code: "academy-a" }] });
    });

    it("service 호출이 실패하면 에러 메시지와 함께 실패 결과를 반환한다", async () => {
        mockedGetAcademyList.mockRejectedValue(new Error("학원 목록 조회에 실패했습니다."));

        const result = await getAcademyListAction();

        expect(result).toEqual({ success: false, message: "학원 목록 조회에 실패했습니다." });
    });

    it("Error가 아닌 값이 던져지면 기본 실패 메시지를 반환한다", async () => {
        mockedGetAcademyList.mockImplementation(() => {
            throw "unexpected";
        });

        const result = await getAcademyListAction();

        expect(result).toEqual({ success: false, message: "학원 목록 조회에 실패했습니다." });
    });
});

describe("getOperationalMetricsAction", () => {
    it("조회 범위가 올바르지 않으면 조회하지 않고 실패 결과를 반환한다", async () => {
        const result = await getOperationalMetricsAction({ scope: "UNKNOWN" as never });

        expect(result).toEqual({ success: false, message: "조회 범위가 올바르지 않습니다." });
        expect(mockedGetOperationalMetrics).not.toHaveBeenCalled();
    });

    it("조회 기간이 올바르지 않으면 조회하지 않고 실패 결과를 반환한다", async () => {
        const result = await getOperationalMetricsAction({ period: "LAST_WEEK" as never });

        expect(result).toEqual({ success: false, message: "조회 기간이 올바르지 않습니다." });
        expect(mockedGetOperationalMetrics).not.toHaveBeenCalled();
    });

    it("scope가 ACADEMY인데 학원 코드가 없으면 실패 결과를 반환한다", async () => {
        const result = await getOperationalMetricsAction({ scope: "ACADEMY" });

        expect(result).toEqual({ success: false, message: "학원 코드가 필요합니다." });
        expect(mockedGetOperationalMetrics).not.toHaveBeenCalled();
    });

    it("scope가 ACADEMY이고 학원 코드가 공백만 있으면 실패 결과를 반환한다", async () => {
        const result = await getOperationalMetricsAction({ scope: "ACADEMY", academyCode: "   " });

        expect(result).toEqual({ success: false, message: "학원 코드가 필요합니다." });
        expect(mockedGetOperationalMetrics).not.toHaveBeenCalled();
    });

    it("조회 조건이 올바르면 운영 지표를 담아 성공 결과를 반환한다", async () => {
        mockedGetOperationalMetrics.mockResolvedValue({ message: "조회했습니다.", data: { scope: "ALL" } });

        const result = await getOperationalMetricsAction({ scope: "ALL", period: "TODAY" });

        expect(mockedGetOperationalMetrics).toHaveBeenCalledWith({ scope: "ALL", period: "TODAY" });
        expect(result).toEqual({ success: true, message: "조회했습니다.", data: { scope: "ALL" } });
    });

    it("service 호출이 실패하면 에러 메시지와 함께 실패 결과를 반환한다", async () => {
        mockedGetOperationalMetrics.mockRejectedValue(new Error("운영 성능·자원 지표 조회에 실패했습니다."));

        const result = await getOperationalMetricsAction();

        expect(result).toEqual({ success: false, message: "운영 성능·자원 지표 조회에 실패했습니다." });
    });

    it("Error가 아닌 값이 던져지면 기본 실패 메시지를 반환한다", async () => {
        mockedGetOperationalMetrics.mockImplementation(() => {
            throw "unexpected";
        });

        const result = await getOperationalMetricsAction();

        expect(result).toEqual({ success: false, message: "운영 성능·자원 지표 조회에 실패했습니다." });
    });
});

describe("getAcademyMemberCountAction", () => {
    it("학원 코드가 비어있으면 실패 결과를 반환한다", async () => {
        const result = await getAcademyMemberCountAction("");

        expect(result).toEqual({ success: false, message: "학원 코드가 필요합니다." });
        expect(mockedGetAcademyMemberCount).not.toHaveBeenCalled();
    });

    it("학원 코드가 공백만 있으면 실패 결과를 반환한다", async () => {
        const result = await getAcademyMemberCountAction("   ");

        expect(result).toEqual({ success: false, message: "학원 코드가 필요합니다." });
        expect(mockedGetAcademyMemberCount).not.toHaveBeenCalled();
    });

    it("service 호출이 성공하면 학원 회원 수를 담아 성공 결과를 반환한다", async () => {
        mockedGetAcademyMemberCount.mockResolvedValue({
            message: "조회했습니다.",
            data: { academyCode: "academy-a", activeMemberCount: 10, collectedAt: "2026-01-01T00:00:00" },
        });

        const result = await getAcademyMemberCountAction("academy-a");

        expect(mockedGetAcademyMemberCount).toHaveBeenCalledWith("academy-a");
        expect(result).toEqual({
            success: true,
            message: "조회했습니다.",
            data: { academyCode: "academy-a", activeMemberCount: 10, collectedAt: "2026-01-01T00:00:00" },
        });
    });

    it("service 호출이 실패하면 에러 메시지와 함께 실패 결과를 반환한다", async () => {
        mockedGetAcademyMemberCount.mockRejectedValue(new Error("학원 회원 수 조회에 실패했습니다."));

        const result = await getAcademyMemberCountAction("academy-a");

        expect(result).toEqual({ success: false, message: "학원 회원 수 조회에 실패했습니다." });
    });
});

describe("getAcademyStorageUsageAction", () => {
    it("학원 코드가 비어있으면 실패 결과를 반환한다", async () => {
        const result = await getAcademyStorageUsageAction("");

        expect(result).toEqual({ success: false, message: "학원 코드가 필요합니다." });
        expect(mockedGetAcademyStorageUsage).not.toHaveBeenCalled();
    });

    it("service 호출이 성공하면 학원 데이터 보유량을 담아 성공 결과를 반환한다", async () => {
        mockedGetAcademyStorageUsage.mockResolvedValue({
            message: "조회했습니다.",
            data: { academyCode: "academy-a", databaseBytes: 1024, s3Bytes: 2048, collectedAt: "2026-01-01T00:00:00" },
        });

        const result = await getAcademyStorageUsageAction("academy-a");

        expect(mockedGetAcademyStorageUsage).toHaveBeenCalledWith("academy-a");
        expect(result).toEqual({
            success: true,
            message: "조회했습니다.",
            data: { academyCode: "academy-a", databaseBytes: 1024, s3Bytes: 2048, collectedAt: "2026-01-01T00:00:00" },
        });
    });

    it("service 호출이 실패하면 에러 메시지와 함께 실패 결과를 반환한다", async () => {
        mockedGetAcademyStorageUsage.mockRejectedValue(new Error("학원 데이터 보유량 조회에 실패했습니다."));

        const result = await getAcademyStorageUsageAction("academy-a");

        expect(result).toEqual({ success: false, message: "학원 데이터 보유량 조회에 실패했습니다." });
    });
});

describe("getAcademyApiCallFrequencyAction", () => {
    it("조회 범위가 올바르지 않으면 조회하지 않고 실패 결과를 반환한다", async () => {
        const result = await getAcademyApiCallFrequencyAction({ scope: "UNKNOWN" as never });

        expect(result).toEqual({ success: false, message: "조회 범위가 올바르지 않습니다." });
        expect(mockedGetAcademyApiCallFrequency).not.toHaveBeenCalled();
    });

    it("scope가 ACADEMY인데 학원 코드가 없으면 실패 결과를 반환한다", async () => {
        const result = await getAcademyApiCallFrequencyAction({ scope: "ACADEMY" });

        expect(result).toEqual({ success: false, message: "학원 코드가 필요합니다." });
        expect(mockedGetAcademyApiCallFrequency).not.toHaveBeenCalled();
    });

    it("조회 조건이 올바르면 학원별 API 호출 빈도를 담아 성공 결과를 반환한다", async () => {
        mockedGetAcademyApiCallFrequency.mockResolvedValue({
            message: "조회했습니다.",
            data: [{ academyCode: "academy-a", apiCallMetrics: [] }],
        });

        const result = await getAcademyApiCallFrequencyAction({ scope: "ALL" });

        expect(mockedGetAcademyApiCallFrequency).toHaveBeenCalledWith({ scope: "ALL" });
        expect(result).toEqual({
            success: true,
            message: "조회했습니다.",
            data: [{ academyCode: "academy-a", apiCallMetrics: [] }],
        });
    });

    it("service 호출이 실패하면 에러 메시지와 함께 실패 결과를 반환한다", async () => {
        mockedGetAcademyApiCallFrequency.mockRejectedValue(new Error("학원별 API 호출 빈도 조회에 실패했습니다."));

        const result = await getAcademyApiCallFrequencyAction();

        expect(result).toEqual({ success: false, message: "학원별 API 호출 빈도 조회에 실패했습니다." });
    });

    it("Error가 아닌 값이 던져지면 기본 실패 메시지를 반환한다", async () => {
        mockedGetAcademyApiCallFrequency.mockImplementation(() => {
            throw "unexpected";
        });

        const result = await getAcademyApiCallFrequencyAction();

        expect(result).toEqual({ success: false, message: "학원별 API 호출 빈도 조회에 실패했습니다." });
    });
});
