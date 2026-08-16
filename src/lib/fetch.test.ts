import { cookies } from "next/headers";
import { getApiBaseUrl } from "./apiBaseUrl";
import {
    fetchWithAuth,
    fetchWithAuthAi,
    fetchWithAuthGet,
    fetchWithoutAuth,
} from "./fetch";
import { refreshGet } from "./stateError";

jest.mock("next/headers", () => ({
    cookies: jest.fn(),
}));

jest.mock("./apiBaseUrl", () => ({
    getApiBaseUrl: jest.fn(),
}));

jest.mock("./stateError", () => ({
    refreshGet: jest.fn(),
}));

const mockedCookies = cookies as jest.Mock;
const mockedGetApiBaseUrl = getApiBaseUrl as jest.Mock;
const mockedRefreshGet = refreshGet as jest.Mock;
const mockedFetch = jest.fn();

describe("API fetch helper", () => {
    beforeEach(() => {
        mockedGetApiBaseUrl.mockResolvedValue("https://sidea-test.ieum.store");
        mockedCookies.mockResolvedValue({
            get: jest.fn().mockReturnValue({ value: "access-token" }),
        });
        global.fetch = mockedFetch;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("fetchWithoutAuth는 현재 요청의 API Base URL을 사용한다", async () => {
        mockedFetch.mockResolvedValue({ ok: true, status: 200 });

        await fetchWithoutAuth("/api/auth/login", { method: "POST" });

        expect(mockedFetch).toHaveBeenCalledWith(
            "https://sidea-test.ieum.store/api/auth/login",
            expect.objectContaining({ method: "POST" }),
        );
    });

    it("fetchWithAuth는 현재 요청의 API Base URL과 Access Token을 사용한다", async () => {
        mockedFetch.mockResolvedValue({ ok: true, status: 200 });

        await fetchWithAuth("/api/members");

        expect(mockedFetch).toHaveBeenCalledWith(
            "https://sidea-test.ieum.store/api/members",
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: "Bearer access-token",
                }),
            }),
        );
    });

    it("401 재요청도 처음 결정한 API Base URL을 유지한다", async () => {
        mockedFetch
            .mockResolvedValueOnce({ ok: false, status: 401 })
            .mockResolvedValueOnce({ ok: true, status: 200 });
        mockedRefreshGet.mockResolvedValue("renewed-token");

        await fetchWithAuth("/api/members");

        expect(mockedFetch).toHaveBeenNthCalledWith(
            2,
            "https://sidea-test.ieum.store/api/members",
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: "Bearer renewed-token",
                }),
            }),
        );
        expect(mockedGetApiBaseUrl).toHaveBeenCalledTimes(1);
    });

    it.each([
        ["fetchWithAuthGet", fetchWithAuthGet],
        ["fetchWithAuthAi", fetchWithAuthAi],
    ])("%s는 현재 요청의 API Base URL을 사용한다", async (_name, helper) => {
        mockedFetch.mockResolvedValue({ ok: true, status: 200 });

        await helper("/api/example");

        expect(mockedFetch).toHaveBeenCalledWith(
            "https://sidea-test.ieum.store/api/example",
            expect.any(Object),
        );
    });
});
