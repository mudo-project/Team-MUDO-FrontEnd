import { getTenantApiEntryPoint } from "../service/tenant-routing.service";
import { resolveApiBaseUrl } from "./tenantApiResolver";

jest.mock("../service/tenant-routing.service", () => ({
    getTenantApiEntryPoint: jest.fn(),
}));

const mockedGetTenantApiEntryPoint = getTenantApiEntryPoint as jest.Mock;

describe("resolveApiBaseUrl", () => {
    const originalRoutingOrigin = process.env.TENANT_ROUTING_ORIGIN;
    const originalLocalApiBaseUrl = process.env.LOCAL_API_BASE_URL;

    beforeEach(() => {
        process.env.TENANT_ROUTING_ORIGIN = "https://academy-a.ieum.store/";
        process.env.LOCAL_API_BASE_URL = "http://localhost:8080/";
    });

    afterEach(() => {
        jest.clearAllMocks();

        if (originalRoutingOrigin === undefined) {
            delete process.env.TENANT_ROUTING_ORIGIN;
        } else {
            process.env.TENANT_ROUTING_ORIGIN = originalRoutingOrigin;
        }

        if (originalLocalApiBaseUrl === undefined) {
            delete process.env.LOCAL_API_BASE_URL;
        } else {
            process.env.LOCAL_API_BASE_URL = originalLocalApiBaseUrl;
        }
    });

    it("루트 운영 도메인이면 Academy A Origin을 반환한다", async () => {
        await expect(resolveApiBaseUrl("ieum.store")).resolves.toBe(
            "https://academy-a.ieum.store",
        );
        expect(mockedGetTenantApiEntryPoint).not.toHaveBeenCalled();
    });

    it("테넌트 도메인이면 공개 API가 반환한 호스트에 https 스킴을 붙인다", async () => {
        mockedGetTenantApiEntryPoint.mockResolvedValue({
            data: {
                code: "academy-d",
                apiHost: "sidea-test.ieum.store",
            },
        });

        await expect(
            resolveApiBaseUrl("app-academy-d.ieum.store"),
        ).resolves.toBe("https://sidea-test.ieum.store");
        expect(mockedGetTenantApiEntryPoint).toHaveBeenCalledWith("academy-d");
    });

    it("localhost이면 개발 전용 로컬 API 주소를 반환한다", async () => {
        await expect(resolveApiBaseUrl("localhost:3000")).resolves.toBe(
            "http://localhost:8080",
        );
        expect(mockedGetTenantApiEntryPoint).not.toHaveBeenCalled();
    });

    it.each([
        "https://sidea-test.ieum.store",
        "sidea-test.ieum.store/api",
        "sidea-test.ieum.store:443",
        "attacker.example.com",
    ])("공개 API가 잘못된 호스트 %s를 반환하면 거부한다", async (apiHost) => {
        mockedGetTenantApiEntryPoint.mockResolvedValue({
            data: { code: "academy-d", apiHost },
        });

        await expect(
            resolveApiBaseUrl("app-academy-d.ieum.store"),
        ).rejects.toThrow("유효하지 않은 테넌트 API 호스트입니다.");
    });

    it("공개 API의 테넌트 코드가 요청과 다르면 거부한다", async () => {
        mockedGetTenantApiEntryPoint.mockResolvedValue({
            data: {
                code: "academy-a",
                apiHost: "academy-a.ieum.store",
            },
        });

        await expect(
            resolveApiBaseUrl("app-academy-d.ieum.store"),
        ).rejects.toThrow("테넌트 라우팅 응답이 요청과 일치하지 않습니다.");
    });

    it("로컬 API 주소가 없으면 예외를 던진다", async () => {
        delete process.env.LOCAL_API_BASE_URL;

        await expect(resolveApiBaseUrl("localhost:3000")).rejects.toThrow(
            "LOCAL_API_BASE_URL is required",
        );
    });
});
