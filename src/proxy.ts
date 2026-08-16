import { NextRequest, NextResponse } from "next/server";
import type { MyTokenPayload } from "./lib/decode";
import { jwtDecode } from "jwt-decode";
import { getApiBaseUrl } from "./lib/apiBaseUrl";
import { ReissueResponse } from "./lib/refreshType";

async function getRefreshToken(request: NextRequest) {
    const baseUrl = getApiBaseUrl();
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
        return null;
    }

    try {
        const response = await fetch(`${baseUrl}/api/token/reissue`, {
            method: 'POST',
            body: JSON.stringify({}),
            headers: {
                'Content-Type': 'application/json',
                Cookie: `refreshToken=${refreshToken}`
            }
        });

        if (!response.ok) {
            return null;
        }

        const resData = (await response.json()) as ReissueResponse;

        return resData.data?.accessToken ?? null;
    } catch {
        return null;
    }
}

function redirectToAuth(request: NextRequest) {
    const response = NextResponse.redirect(new URL('/auth', request.url));
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
    return response;
}


export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    let accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;

    //새로운 response
    let response = NextResponse.next();

    if ((!accessToken && !refreshToken) || (accessToken && !refreshToken)) {
        //어세스랑 리프레시 둘다 없는경우
        if (pathname === '/auth') {
            return response
        } else {
            return redirectToAuth(request);
        }
    }

    if (accessToken) {
        try {
            const user = jwtDecode<MyTokenPayload>(accessToken);

            if (Date.now() >= user.exp * 1000) {
                accessToken = undefined;
            }
        } catch {
            accessToken = undefined;
        }
    }

    if (!accessToken && refreshToken) {
        //어세스가 없거나 만료된 경우
        const newToken = await getRefreshToken(request);

        if (!newToken) {
            return redirectToAuth(request);
        }
        response = NextResponse.next();

        accessToken = newToken;
        response.cookies.set("accessToken", newToken, {
            httpOnly: true,
            maxAge: 60 * 60,
            path: "/",
        });
    }

    let user: MyTokenPayload;

    try {
        if (!accessToken) {
            return redirectToAuth(request);
        }
        user = jwtDecode<MyTokenPayload>(accessToken);

        if (Date.now() >= user.exp * 1000) {
            return redirectToAuth(request);
        }
    } catch {
        return redirectToAuth(request);
    }

    if (pathname.startsWith('/admin') && false) {
        return NextResponse.redirect(new URL('/nopermission', request.url));
    }

    if (pathname.startsWith('/organization') && false) {
        return NextResponse.redirect(new URL('/nopermission', request.url));
    }

    if ((pathname.startsWith('/pt/manage') || pathname.startsWith('/pt/regist')) && false) {
        return NextResponse.redirect(new URL('/nopermission', request.url));
    }

    //세팅해놓은 응답 반환
    return response;

}
// 어디로 가려는지: request.nextUrl.pathname
// 쿠키를 들고 왔는지: request.cookies
// 어떤 URL로 왔는지: request.url

//렌더링 전에 거칠 페이지들
export const config = {
    matcher: [
        '/alarm/:path*',
        '/approval/:path*',
        '/attendance/:path*',
        '/finance/:path*',
        '/initial/:path*',
        '/lecture/:path*',
        '/members/:path*',
        '/message/:path*',
        '/messenger/:path*',
        '/mypage/:path*',
        '/notice/:path*',
        '/revenue-report/:path*',
        '/role/:path*',
        '/rollbook/:path*',
        '/schedule/:path*',
        '/setting/:path*',
        '/settings/:path*',
        '/shared-folder/:path*',
        '/student/:path*',
        '/template/:path*',
        '/timetable/:path*',
        '/workspace/:path*',
    ],
};//:path* 는 모든 페이지
