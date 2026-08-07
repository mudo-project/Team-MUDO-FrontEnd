'use server'

import { cookies } from "next/headers";
import { ReissueResponse } from "./refreshType";

export const refreshGet = async () => {
    const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get('refreshToken')?.value

        if (!refreshToken) {
            throw new Error("로그인이 만료되었습니다. 다시 로그인해주세요.");
        }

        const response = await fetch(`${base_url}/api/token/reissue`, {
            method: 'POST',
            body: JSON.stringify({}),
            headers: {
                'Content-Type': 'application/json',
                Cookie: `refreshToken=${refreshToken}`
            }
        });

        const resData = (await response.json()) as ReissueResponse;


        if (!response.ok) {
            const message = await getErrorMessage(
                response,
                '로그인이 만료되었습니다. 다시 로그인해주세요.'
            );

            throw new Error(message);
        }

        //어세스 토큰 재발급시 저장
        cookieStore.set('accessToken', resData.data.accessToken, {
            httpOnly: true,   // 자바스크립트 접근 불가(xss 방지)
            maxAge: 60 * 60,   // 15분
            path: '/'
        })

        //만약 리프레시도 같이 새로 건너온다면 저장
        //getSetCookie()는 응답 헤더에 들어있는 Set-Cookie 값들을 배열로 꺼내는 함수
        const setCookieHeaders: string[] =
            response.headers.getSetCookie?.() ?? [];


        const newRefreshToken = setCookieHeaders.find((cookie) => cookie.startsWith("refreshToken="))
        const newRefreshValue = newRefreshToken?.split(';')[0].replace('refreshToken=', '');

        if (newRefreshValue) {
            cookieStore.set('refreshToken', newRefreshValue, {
                httpOnly: true,
                maxAge: 60 * 60 * 3,
                path: '/'
            });
        }

        return resData.data.accessToken;
    } catch (error) {
        const cookieStore = await cookies();
        cookieStore.delete('accessToken');
        cookieStore.delete('refreshToken');

        return null;
    }
}

//에러 메세지가 json이 아닌 경우를 대비
export async function getErrorMessage(
    response: Response,
    fallbackMessage: string
) {
    try {
        const contentType = response.headers.get("content-type");

        if (contentType?.includes("application/json")) {
            const errorData = await response.json();
            return errorData?.message || fallbackMessage;
        }

        const text = await response.text();
        return text || fallbackMessage;
    } catch {
        return fallbackMessage;
    }
}