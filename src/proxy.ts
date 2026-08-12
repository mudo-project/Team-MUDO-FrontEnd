import { NextRequest, NextResponse } from "next/server";
import { MyTokenPayload } from "./lib/decode";
import { jwtDecode } from "jwt-decode";
import { ReissueResponse } from "./lib/refreshType";

async function getRefreshToken(request: NextRequest) {
    const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;
    const refreshToken = request.cookies.get('refreshToken')?.value;

    try {
        const response = await fetch(`${base_url}/api/token/reissue`, {
            method: 'POST',
            body: JSON.stringify({}),
            headers: {
                'Content-Type': 'application/json',
                Cookie: `refreshToken=${refreshToken}`
            }
        });

        const resData = (await response.json()) as ReissueResponse;

        return resData.data.accessToken;
    } catch (error) {
        return null;
    }
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
            return NextResponse.redirect(new URL('/auth', request.url));
        }
    } else if (!accessToken && refreshToken) {
        //어세스만 없는 경우
        const newToken = await getRefreshToken(request);

        if (!newToken) {
            return NextResponse.redirect(new URL('/auth', request.url));
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
            return NextResponse.redirect(new URL('/auth', request.url));
        }
        user = jwtDecode<MyTokenPayload>(accessToken);
    } catch {
        return NextResponse.redirect(new URL("/auth", request.url));
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
    matcher: ['/(user)/:path*'],
};//:path* 는 모든 페이지