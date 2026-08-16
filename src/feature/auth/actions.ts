'use server'

import { getMyPermissionList, getUserList, login, logout } from "@/service/auth.service";
import { cookies } from "next/headers";

export interface AuthActionResult<T = undefined> {
    success: boolean;
    message: string;
    data?: T;
}

export const loginAction = async (
    prevState: AuthActionResult<AccessTokenData>,
    formData: FormData,
): Promise<AuthActionResult<AccessTokenData>> => {
    const username = String(formData.get("username") ?? "").trim();
    const password = String(formData.get("password") ?? "").trim();

    if (!username || !password) {
        return {
            success: false,
            message: "아이디, 비밀번호를 입력해주세요.",
        };
    }

    try {
        const response = await login({ username, password });
        const responseData = (await response.json()) as LoginResponse;
        const cookieStore = await cookies();

        cookieStore.set("accessToken", responseData.data.accessToken, {
            httpOnly: true,
            maxAge: 60 * 60,
            path: "/",
            sameSite: "lax",
        });

        const refreshTokenHeader = response.headers
            .getSetCookie?.()
            .find((cookie) => cookie.startsWith("refreshToken="));
        const refreshToken = refreshTokenHeader
            ?.split(";")[0]
            .replace("refreshToken=", "");

        if (refreshToken) {
            cookieStore.set("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: 60 * 60 * 3,
                path: "/",
                sameSite: "lax",
            });
        }

        return {
            success: true,
            message: "로그인에 성공했습니다.",
            data: responseData.data
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "로그인에 실패했습니다.",
        };
    }
};

export const getUserListAction = async (
    keyword?: string,
): Promise<AuthActionResult<UserListResponse[]>> => {
    try {
        const response = await getUserList(keyword);

        return {
            success: true,
            message: response.message,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "구성원 조회에 실패했습니다.",
        };
    }
};

export const getMyPermissionListAction = async (): Promise<AuthActionResult<MyPermissionListData>> => {
    try {
        const response = await getMyPermissionList();

        return {
            success: true,
            message: response.message,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "내 권한 목록 조회에 실패했습니다.",
        };
    }
};

export const logoutAction = async (): Promise<AuthActionResult> => {
    try {
        await logout();
        const cookieStore = await cookies();

        cookieStore.delete("accessToken");
        cookieStore.delete("refreshToken");

        return {
            success: true,
            message: '로그아웃되었습니다.',
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "로그아웃에 실패했습니다.",
        };
    }
};
