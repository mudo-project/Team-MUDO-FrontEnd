import { cookies } from "next/headers";
import { getApiBaseUrl } from "./apiBaseUrl";
import { refreshGet } from "./stateError";

jest.mock("next/headers", () => ({
    cookies: jest.fn(),
}));

jest.mock("./apiBaseUrl", () => ({
    getApiBaseUrl: jest.fn(),
}));

jest.mock("./cookieDomain", () => ({
    getCookieDomain: jest.fn().mockReturnValue(".ieum.store"),
}));

const mockedCookies = cookies as jest.Mock;
const mockedGetApiBaseUrl = getApiBaseUrl as jest.Mock;
const mockedFetch = jest.fn();

describe("refreshGet", () => {
    const cookieStore = {
        get: jest.fn(),
        set: jest.fn(),
        delete: jest.fn(),
    };

    beforeEach(() => {
        mockedGetApiBaseUrl.mockResolvedValue("https://sidea-test.ieum.store");
        cookieStore.get.mockReturnValue({ value: "refresh-token" });
        mockedCookies.mockResolvedValue(cookieStore);
        global.fetch = mockedFetch;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("현재 요청의 API Base URL로 Access Token을 재발급한다", async () => {
        mockedFetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ data: { accessToken: "new-access-token" } }),
            headers: { getSetCookie: () => [] },
        });

        await expect(refreshGet()).resolves.toBe("new-access-token");
        expect(mockedFetch).toHaveBeenCalledWith(
            "https://sidea-test.ieum.store/api/token/reissue",
            expect.objectContaining({ method: "POST" }),
        );
    });
});
