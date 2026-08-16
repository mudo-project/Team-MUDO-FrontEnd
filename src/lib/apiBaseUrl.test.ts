import { headers } from "next/headers";
import { getApiBaseUrl } from "./apiBaseUrl";
import { resolveApiBaseUrl } from "./tenantApiResolver";

jest.mock("next/headers", () => ({
    headers: jest.fn(),
}));

jest.mock("./tenantApiResolver", () => ({
    resolveApiBaseUrl: jest.fn(),
}));

const mockedHeaders = headers as jest.Mock;
const mockedResolveApiBaseUrl = resolveApiBaseUrl as jest.Mock;

describe("getApiBaseUrl", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("x-forwarded-host를 우선해 API Base URL을 결정한다", async () => {
        mockedHeaders.mockResolvedValue(
            new Headers({
                host: "127.0.0.1:3000",
                "x-forwarded-host": "app-academy-d.ieum.store",
            }),
        );
        mockedResolveApiBaseUrl.mockResolvedValue(
            "https://sidea-test.ieum.store",
        );

        await expect(getApiBaseUrl()).resolves.toBe(
            "https://sidea-test.ieum.store",
        );
        expect(mockedResolveApiBaseUrl).toHaveBeenCalledWith(
            "app-academy-d.ieum.store",
        );
    });

    it("x-forwarded-host가 없으면 host로 API Base URL을 결정한다", async () => {
        mockedHeaders.mockResolvedValue(
            new Headers({ host: "app-academy-a.ieum.store" }),
        );
        mockedResolveApiBaseUrl.mockResolvedValue(
            "https://academy-a.ieum.store",
        );

        await getApiBaseUrl();

        expect(mockedResolveApiBaseUrl).toHaveBeenCalledWith(
            "app-academy-a.ieum.store",
        );
    });

    it("요청 Host가 없으면 예외를 던진다", async () => {
        mockedHeaders.mockResolvedValue(new Headers());

        await expect(getApiBaseUrl()).rejects.toThrow(
            "요청 Host를 확인할 수 없습니다.",
        );
        expect(mockedResolveApiBaseUrl).not.toHaveBeenCalled();
    });
});
