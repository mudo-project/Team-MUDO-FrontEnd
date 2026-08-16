import { cookies } from "next/headers";
import {
    getMyPermissionList,
    getUserList,
    login,
    logout,
} from "../../service/auth.service";
import {
    getMyPermissionListAction,
    getUserListAction,
    loginAction,
    logoutAction,
} from "./actions";

jest.mock("../../service/auth.service", () => ({
    login: jest.fn(),
    logout: jest.fn(),
    getUserList: jest.fn(),
    getMyPermissionList: jest.fn(),
}));

jest.mock("next/headers", () => ({
    cookies: jest.fn(),
}));

const mockedLogin = login as jest.Mock;
const mockedLogout = logout as jest.Mock;
const mockedGetUserList = getUserList as jest.Mock;
const mockedGetMyPermissionList = getMyPermissionList as jest.Mock;
const mockedCookies = cookies as jest.Mock;

const prevState = { success: false, message: "", data: undefined };

const buildFormData = (fields: Record<string, string>) => {
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => formData.set(key, value));
    return formData;
};

afterEach(() => {
    jest.clearAllMocks();
});

describe("loginAction", () => {
    it("아이디 또는 비밀번호가 비어있으면 실패 결과를 반환한다", async () => {
        const result = await loginAction(prevState, buildFormData({ username: "", password: "" }));

        expect(result).toEqual({
            success: false,
            message: "아이디, 비밀번호를 입력해주세요.",
        });
        expect(mockedLogin).not.toHaveBeenCalled();
    });

    it("공백만 입력하면 실패 결과를 반환한다", async () => {
        const result = await loginAction(
            prevState,
            buildFormData({ username: "  ", password: "  " }),
        );

        expect(result).toEqual({
            success: false,
            message: "아이디, 비밀번호를 입력해주세요.",
        });
        expect(mockedLogin).not.toHaveBeenCalled();
    });

    it("로그인에 성공하면 토큰을 쿠키에 저장하고 성공 결과를 반환한다", async () => {
        const setMock = jest.fn();
        mockedCookies.mockResolvedValue({ set: setMock });
        const responseData = {
            status: 200,
            code: "OK",
            message: "로그인에 성공했습니다.",
            data: { accessToken: "access-token", mustChangePw: false, permissions: ["A"] },
        };
        mockedLogin.mockResolvedValue({
            json: () => Promise.resolve(responseData),
            headers: {
                getSetCookie: () => [
                    "refreshToken=refresh-token; Path=/; HttpOnly",
                    "other=1",
                ],
            },
        });

        const result = await loginAction(
            prevState,
            buildFormData({ username: "kim", password: "pw1234" }),
        );

        expect(mockedLogin).toHaveBeenCalledWith({ username: "kim", password: "pw1234" });
        expect(setMock).toHaveBeenCalledWith(
            "accessToken",
            "access-token",
            expect.objectContaining({ httpOnly: true, path: "/" }),
        );
        expect(setMock).toHaveBeenCalledWith(
            "refreshToken",
            "refresh-token",
            expect.objectContaining({ httpOnly: true, path: "/" }),
        );
        expect(result).toEqual({
            success: true,
            message: "로그인에 성공했습니다.",
            data: responseData.data,
        });
    });

    it("응답에 refreshToken 쿠키가 없으면 refreshToken은 저장하지 않는다", async () => {
        const setMock = jest.fn();
        mockedCookies.mockResolvedValue({ set: setMock });
        mockedLogin.mockResolvedValue({
            json: () =>
                Promise.resolve({
                    status: 200,
                    code: "OK",
                    message: "로그인에 성공했습니다.",
                    data: { accessToken: "access-token", mustChangePw: false, permissions: [] },
                }),
            headers: { getSetCookie: () => ["other=1"] },
        });

        await loginAction(prevState, buildFormData({ username: "kim", password: "pw1234" }));

        expect(setMock).toHaveBeenCalledTimes(1);
        expect(setMock).toHaveBeenCalledWith("accessToken", "access-token", expect.any(Object));
    });

    it("service 호출이 실패하면 에러 메시지와 함께 실패 결과를 반환한다", async () => {
        mockedLogin.mockRejectedValue(new Error("아이디 또는 비밀번호가 일치하지 않습니다."));

        const result = await loginAction(
            prevState,
            buildFormData({ username: "kim", password: "wrong" }),
        );

        expect(result).toEqual({
            success: false,
            message: "아이디 또는 비밀번호가 일치하지 않습니다.",
        });
    });

    it("Error가 아닌 값이 던져지면 기본 실패 메시지를 반환한다", async () => {
        mockedLogin.mockImplementation(() => {
            throw "unexpected";
        });

        const result = await loginAction(
            prevState,
            buildFormData({ username: "kim", password: "pw1234" }),
        );

        expect(result).toEqual({ success: false, message: "로그인에 실패했습니다." });
    });
});

describe("getUserListAction", () => {
    it("keyword 없이 호출하면 목록을 담아 성공 결과를 반환한다", async () => {
        mockedGetUserList.mockResolvedValue({ message: "조회했습니다.", data: [] });

        const result = await getUserListAction();

        expect(mockedGetUserList).toHaveBeenCalledWith(undefined);
        expect(result).toEqual({ success: true, message: "조회했습니다.", data: [] });
    });

    it("keyword를 전달하면 그대로 service에 전달한다", async () => {
        mockedGetUserList.mockResolvedValue({ message: "조회했습니다.", data: [] });

        await getUserListAction("김민수");

        expect(mockedGetUserList).toHaveBeenCalledWith("김민수");
    });

    it("service 호출이 실패하면 에러 메시지와 함께 실패 결과를 반환한다", async () => {
        mockedGetUserList.mockRejectedValue(new Error("구성원 조회에 실패했습니다."));

        const result = await getUserListAction();

        expect(result).toEqual({ success: false, message: "구성원 조회에 실패했습니다." });
    });

    it("Error가 아닌 값이 던져지면 기본 실패 메시지를 반환한다", async () => {
        mockedGetUserList.mockImplementation(() => {
            throw "unexpected";
        });

        const result = await getUserListAction();

        expect(result).toEqual({ success: false, message: "구성원 조회에 실패했습니다." });
    });
});

describe("getMyPermissionListAction", () => {
    it("service 호출이 성공하면 권한 목록을 담아 성공 결과를 반환한다", async () => {
        mockedGetMyPermissionList.mockResolvedValue({
            message: "조회했습니다.",
            data: { permissions: ["A"] },
        });

        const result = await getMyPermissionListAction();

        expect(result).toEqual({
            success: true,
            message: "조회했습니다.",
            data: { permissions: ["A"] },
        });
    });

    it("service 호출이 실패하면 에러 메시지와 함께 실패 결과를 반환한다", async () => {
        mockedGetMyPermissionList.mockRejectedValue(
            new Error("내 권한 목록 조회에 실패했습니다."),
        );

        const result = await getMyPermissionListAction();

        expect(result).toEqual({
            success: false,
            message: "내 권한 목록 조회에 실패했습니다.",
        });
    });

    it("Error가 아닌 값이 던져지면 기본 실패 메시지를 반환한다", async () => {
        mockedGetMyPermissionList.mockImplementation(() => {
            throw "unexpected";
        });

        const result = await getMyPermissionListAction();

        expect(result).toEqual({
            success: false,
            message: "내 권한 목록 조회에 실패했습니다.",
        });
    });
});

describe("logoutAction", () => {
    it("성공하면 쿠키를 삭제하고 성공 결과를 반환한다", async () => {
        const deleteMock = jest.fn();
        mockedCookies.mockResolvedValue({ delete: deleteMock });
        mockedLogout.mockResolvedValue(undefined);

        const result = await logoutAction();

        expect(mockedLogout).toHaveBeenCalledTimes(1);
        expect(deleteMock).toHaveBeenCalledWith(
            expect.objectContaining({ name: "accessToken", path: "/" }),
        );
        expect(deleteMock).toHaveBeenCalledWith(
            expect.objectContaining({ name: "refreshToken", path: "/" }),
        );
        expect(result).toEqual({ success: true, message: "로그아웃되었습니다." });
    });

    it("실패하면 쿠키를 삭제하지 않고 에러 메시지와 함께 실패 결과를 반환한다", async () => {
        mockedLogout.mockRejectedValue(new Error("로그아웃에 실패했습니다."));

        const result = await logoutAction();

        expect(mockedCookies).not.toHaveBeenCalled();
        expect(result).toEqual({ success: false, message: "로그아웃에 실패했습니다." });
    });

    it("Error가 아닌 값이 던져지면 기본 실패 메시지를 반환한다", async () => {
        mockedLogout.mockImplementation(() => {
            throw "unexpected";
        });

        const result = await logoutAction();

        expect(result).toEqual({ success: false, message: "로그아웃에 실패했습니다." });
    });
});
