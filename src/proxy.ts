import { NextRequest, NextResponse } from "next/server";
import type { MyTokenPayload } from "./lib/decode";
import { jwtDecode } from "jwt-decode";
import { getCookieDomain } from "./lib/cookieDomain";
import { ReissueResponse } from "./lib/refreshType";
import { resolveApiBaseUrl } from "./lib/tenantApiResolver";

async function getRefreshToken(request: NextRequest) {
    const refreshToken = request.cookies.get('refreshToken')?.value;
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");

    if (!refreshToken || !host) {
        return null;
    }

    try {
        const baseUrl = await resolveApiBaseUrl(host);
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
    const domain = getCookieDomain();
    const response = NextResponse.redirect(new URL('/auth', request.url));
    response.cookies.delete({ name: 'accessToken', path: '/', domain });
    response.cookies.delete({ name: 'refreshToken', path: '/', domain });
    return response;
}

const APEX_HOST = 'ieum.store';

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const forwardedHost = request.headers.get('x-forwarded-host')?.split(',')[0];
    const host = (forwardedHost ?? request.headers.get('host') ?? '')
        .trim()
        .toLowerCase()
        .split(':', 1)[0];
    const isApex = host === APEX_HOST;

    if (pathname === '/') {
        if (isApex) {
            return NextResponse.next();
        }

        return NextResponse.redirect(new URL('/auth', request.url));
    }

    let response = NextResponse.next();

    if (!isApex) {
        response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    }

    let accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;

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
            domain: getCookieDomain(),
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
        '/',
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
