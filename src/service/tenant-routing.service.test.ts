import { getErrorMessage } from "../lib/responseError";
import {
    getTenantApiEntryPoint,
    TenantEntryPointError,
} from "./tenant-routing.service";

jest.mock("../lib/responseError", () => ({
    getErrorMessage: jest.fn(),
}));

const mockedGetErrorMessage = getErrorMessage as jest.Mock;
const mockedFetch = jest.fn();

describe("getTenantApiEntryPoint", () => {
    const originalRoutingOrigin = process.env.TENANT_ROUTING_ORIGIN;

    beforeEach(() => {
        process.env.TENANT_ROUTING_ORIGIN = "https://academy-a.ieum.store/";
        global.fetch = mockedFetch;
    });

    afterEach(() => {
        jest.clearAllMocks();

        if (originalRoutingOrigin === undefined) {
            delete process.env.TENANT_ROUTING_ORIGIN;
        } else {
            process.env.TENANT_ROUTING_ORIGIN = originalRoutingOrigin;
        }
    });

    it("응답이 정상이면 테넌트 API 진입점 정보를 반환한다", async () => {
        const responseBody = {
            status: 200,
            code: "PLATFORM_200_6",
            message: "테넌트 API 진입점 조회에 성공했습니다.",
            data: {
                code: "academy-d",
                apiHost: "sidea-test.ieum.store",
            },
        };
        mockedFetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(responseBody),
        });

        const result = await getTenantApiEntryPoint("academy-d");

        expect(mockedFetch).toHaveBeenCalledWith(
            "https://academy-a.ieum.store/api/public/tenants/academy-d",
        );
        expect(result).toEqual(responseBody);
    });

    it("테넌트 코드를 URL 경로에 안전하게 인코딩한다", async () => {
        mockedFetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ data: {} }),
        });

        await getTenantApiEntryPoint("academy/d");

        expect(mockedFetch).toHaveBeenCalledWith(
            "https://academy-a.ieum.store/api/public/tenants/academy%2Fd",
        );
    });

    it.each([
        [404, "PLATFORM_404_1", "조회할 학원을 찾을 수 없습니다."],
        [503, "PLATFORM_503_1", "운영 지표를 현재 조회할 수 없습니다."],
    ])(
        "%i 응답이면 상태와 서비스 코드를 포함한 예외를 던진다",
        async (status, serviceCode, message) => {
            const failedResponse = { ok: false, status };
            mockedFetch.mockResolvedValue(failedResponse);
            mockedGetErrorMessage.mockResolvedValue(message);

            const promise = getTenantApiEntryPoint("academy-d");

            await expect(promise).rejects.toMatchObject({
                name: "TenantEntryPointError",
                message,
                status,
                serviceCode,
            });
            expect(mockedGetErrorMessage).toHaveBeenCalledWith(
                failedResponse,
                "테넌트 API 진입점 조회에 실패했습니다.",
            );
        },
    );

    it("기준 Origin이 없으면 API를 호출하지 않고 예외를 던진다", async () => {
        delete process.env.TENANT_ROUTING_ORIGIN;

        await expect(getTenantApiEntryPoint("academy-d")).rejects.toThrow(
            "TENANT_ROUTING_ORIGIN is required",
        );
        expect(mockedFetch).not.toHaveBeenCalled();
    });

    it("네트워크 요청이 실패하면 원래 예외를 전달한다", async () => {
        mockedFetch.mockRejectedValue(new Error("network failed"));

        await expect(getTenantApiEntryPoint("academy-d")).rejects.toThrow(
            "network failed",
        );
    });

    it("공개 API 오류 타입을 구분할 수 있다", () => {
        const error = new TenantEntryPointError(
            "조회할 학원을 찾을 수 없습니다.",
            404,
            "PLATFORM_404_1",
        );

        expect(error).toBeInstanceOf(Error);
        expect(error.name).toBe("TenantEntryPointError");
    });
});
