'use server'

import { getUserList, login } from "@/service/auth.service"
import { cookies } from "next/headers";

interface ActionState {
    success: boolean;
    message: string;
}

export interface UserActionResult<T = undefined> {
    success: boolean;
    message: string;
    data?: T;
}



export const loginAction = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!username.trim() || !password.trim()) {
        return {
            success: false,
            message: '아이디, 비밀번호를 입력해주세요'
        }
    }

    const payload: LoginRequest = { username, password }

    let response
    try {
        response = await login(payload);
    } catch (error) {
        let errorMessage: string = '알 수 없는 오류입니다. 재시도해주세요.'
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage
        }
    }

    const resData = (await response.json()) as LoginResponse;

    const cookieStore = await cookies();

    cookieStore.set('accessToken', resData.data.accessToken, {
        httpOnly: true,
        maxAge: 60 * 60,
        path: '/',
        sameSite: "lax" as const,
    });

    //백에서 보낸 쿠키 헤더 가져오기
    const setCookieHeaders: string[] = response.headers.getSetCookie?.() ?? [];


    const newRefreshToken = setCookieHeaders.find((cookie) => cookie.startsWith("refreshToken="))
    const newRefreshValue = newRefreshToken?.split(';')[0].replace('refreshToken=', '');

    if (newRefreshValue) {
        cookieStore.set('refreshToken', newRefreshValue, {
            httpOnly: true,
            maxAge: 60 * 60 * 3,
            path: '/',
            sameSite: "lax" as const,
        });
    }

    return {
        success: true,
        message: '로그인 성공'
    }

}

export const getUserListAction = async (keyword?: string): Promise<UserActionResult<UserListResponse[]>> => {
    try {
        const response: UserListApiResponse<UserListResponse[]> = await getUserList(keyword);
        return {
            success: true,
            message: response.message,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "결재 템플릿 목록 조회에 실패했습니다."
        };
    }
}
