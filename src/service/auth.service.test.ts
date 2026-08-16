import { fetchWithAuth, fetchWithoutAuth } from "../lib/fetch";
import { getErrorMessage } from "../lib/stateError";
import { cookies } from "next/headers";
import {
    getMyPermissionList,
    getUserList,
    login,
    logout,
    reissueAccessToken,
} from "./auth.service";

jest.mock("../lib/fetch");
jest.mock("../lib/stateError");
jest.mock("next/headers", () => ({
    cookies: jest.fn(),
}));

const mockedFetchWithAuth = fetchWithAuth as jest.Mock;
const mockedFetchWithoutAuth = fetchWithoutAuth as jest.Mock;
const mockedGetErrorMessage = getErrorMessage as jest.Mock;
const mockedCookies = cookies as jest.Mock;

afterEach(() => {
    jest.clearAllMocks();
});

describe("login", () => {
    it("응답이 정상이면 응답 객체를 그대로 반환한다", async () => {
        const response = { ok: true };
        mockedFetchWithoutAuth.mockResolvedValue(response);

        const result = await login({ username: "kim", password: "pw1234" });

        expect(mockedFetchWithoutAuth).toHaveBeenCalledWith("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ username: "kim", password: "pw1234" }),
        });
        expect(result).toBe(response);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        const response = { ok: false };
        mockedFetchWithoutAuth.mockResolvedValue(response);
        mockedGetErrorMessage.mockResolvedValue("아이디 또는 비밀번호가 일치하지 않습니다.");

        await expect(
            login({ username: "kim", password: "wrong" }),
        ).rejects.toThrow("아이디 또는 비밀번호가 일치하지 않습니다.");
        expect(mockedGetErrorMessage).toHaveBeenCalledWith(response, "로그인에 실패했습니다.");
    });
});

describe("logout", () => {
    it("응답이 정상이면 예외 없이 완료된다", async () => {
        mockedFetchWithAuth.mockResolvedValue({ ok: true });

        await expect(logout()).resolves.toBeUndefined();
        expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/auth/logout", {
            method: "POST",
        });
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        const response = { ok: false };
        mockedFetchWithAuth.mockResolvedValue(response);
        mockedGetErrorMessage.mockResolvedValue("로그아웃에 실패했습니다.");

        await expect(logout()).rejects.toThrow("로그아웃에 실패했습니다.");
        expect(mockedGetErrorMessage).toHaveBeenCalledWith(response, "로그아웃에 실패했습니다.");
    });
});

describe("reissueAccessToken", () => {
    it("refreshToken 쿠키가 있으면 Cookie 헤더를 포함해 요청한다", async () => {
        mockedCookies.mockResolvedValue({
            get: jest.fn((name: string) =>
                name === "refreshToken" ? { value: "refresh-value" } : undefined,
            ),
        });
        const mockData = {
            status: 200,
            code: "OK",
            message: "재발급했습니다.",
            data: { accessToken: "new-token", mustChangePw: false, permissions: [] },
        };
        mockedFetchWithoutAuth.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockData),
        });

        const result = await reissueAccessToken();

        expect(mockedFetchWithoutAuth).toHaveBeenCalledWith("/api/token/reissue", {
            method: "POST",
            headers: { Cookie: "refreshToken=refresh-value" },
        });
        expect(result).toEqual(mockData);
    });

    it("refreshToken 쿠키가 없으면 헤더 없이 요청한다", async () => {
        mockedCookies.mockResolvedValue({
            get: jest.fn(() => undefined),
        });
        mockedFetchWithoutAuth.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({}),
        });

        await reissueAccessToken();

        expect(mockedFetchWithoutAuth).toHaveBeenCalledWith("/api/token/reissue", {
            method: "POST",
            headers: undefined,
        });
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedCookies.mockResolvedValue({ get: jest.fn(() => undefined) });
        const response = { ok: false };
        mockedFetchWithoutAuth.mockResolvedValue(response);
        mockedGetErrorMessage.mockResolvedValue("액세스 토큰 재발급에 실패했습니다.");

        await expect(reissueAccessToken()).rejects.toThrow(
            "액세스 토큰 재발급에 실패했습니다.",
        );
        expect(mockedGetErrorMessage).toHaveBeenCalledWith(
            response,
            "액세스 토큰 재발급에 실패했습니다.",
        );
    });
});

describe("getUserList", () => {
    it("keyword 없이 호출하면 쿼리 없이 조회한다", async () => {
        const mockData = { status: 200, code: "OK", message: "조회했습니다.", data: [] };
        mockedFetchWithAuth.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockData),
        });

        const result = await getUserList();

        expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/users");
        expect(result).toEqual(mockData);
    });

    it("keyword를 전달하면 쿼리스트링에 포함해 조회한다", async () => {
        mockedFetchWithAuth.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ data: [] }),
        });

        await getUserList("김민수");

        const params = new URLSearchParams();
        params.set("keyword", "김민수");
        expect(mockedFetchWithAuth).toHaveBeenCalledWith(`/api/users?${params.toString()}`);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        const response = { ok: false };
        mockedFetchWithAuth.mockResolvedValue(response);
        mockedGetErrorMessage.mockResolvedValue("구성원 조회에 실패했습니다.");

        await expect(getUserList()).rejects.toThrow("구성원 조회에 실패했습니다.");
        expect(mockedGetErrorMessage).toHaveBeenCalledWith(response, "구성원 조회에 실패했습니다.");
    });
});

describe("getMyPermissionList", () => {
    it("응답이 정상이면 권한 목록을 반환한다", async () => {
        const mockData = {
            status: 200,
            code: "OK",
            message: "조회했습니다.",
            data: { permissions: ["APPROVAL:TEMPLATE_MANAGE"] },
        };
        mockedFetchWithAuth.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockData),
        });

        const result = await getMyPermissionList();

        expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/users/me/permissions");
        expect(result).toEqual(mockData);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        const response = { ok: false };
        mockedFetchWithAuth.mockResolvedValue(response);
        mockedGetErrorMessage.mockResolvedValue("내 권한 목록 조회에 실패했습니다.");

        await expect(getMyPermissionList()).rejects.toThrow(
            "내 권한 목록 조회에 실패했습니다.",
        );
        expect(mockedGetErrorMessage).toHaveBeenCalledWith(
            response,
            "내 권한 목록 조회에 실패했습니다.",
        );
    });
});
