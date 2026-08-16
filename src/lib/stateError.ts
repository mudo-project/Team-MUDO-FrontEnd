'use server'

import { cookies } from "next/headers";
import { getApiBaseUrl } from "./apiBaseUrl";
import { getCookieDomain } from "./cookieDomain";
import { ReissueResponse } from "./refreshType";

export const refreshGet = async () => {
    const baseUrl = getApiBaseUrl();
    const domain = getCookieDomain();

    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get('refreshToken')?.value

        if (!refreshToken) {
            throw new Error("로그인이 만료되었습니다. 다시 로그인해주세요.");
        }

        const response = await fetch(`${baseUrl}/api/token/reissue`, {
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

        cookieStore.set('accessToken', resData.data.accessToken, {
            httpOnly: true,
            maxAge: 60 * 60,
            path: '/',
            sameSite: "lax" as const,
            domain,
        })


        const setCookieHeaders: string[] = response.headers.getSetCookie?.() ?? [];


        const newRefreshToken = setCookieHeaders.find((cookie) => cookie.startsWith("refreshToken="))
        const newRefreshValue = newRefreshToken?.split(';')[0].replace('refreshToken=', '');

        if (newRefreshValue) {
            cookieStore.set('refreshToken', newRefreshValue, {
                httpOnly: true,
                maxAge: 60 * 60 * 3,
                path: '/',
                sameSite: "lax" as const,
                domain,
            });
        }

        return resData.data.accessToken;
    } catch (error) {
        const cookieStore = await cookies();
        cookieStore.delete({ name: 'accessToken', path: '/', domain });
        cookieStore.delete({ name: 'refreshToken', path: '/', domain });

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