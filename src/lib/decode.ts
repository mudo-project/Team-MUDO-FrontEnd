'use server'

import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers"
import { refreshGet } from "./stateError";

export interface MyTokenPayload {
    sub: string;
    username: string;
    roleId: number;
    accountType: 'ADMIN' | 'MEMBER';
    adminScope: 'PLATFORM' | 'ACADEMY' | 'null';
    role?: string;
    mustChangePw: boolean;
    iat: number; //발급시간
    exp: number; //만료 시간
}

const defaultUserInfo: MyTokenPayload = {
    sub: '',
    username: '',
    roleId: 0,
    accountType: 'MEMBER',
    adminScope: 'null',
    role: undefined,
    mustChangePw: true,
    iat: 0,
    exp: 0
}

export const decodeJWT = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
        return defaultUserInfo
    }
    if (refreshToken && !token) {
        try {
            const newToken = await refreshGet();

            if (!newToken) return defaultUserInfo
            return jwtDecode<MyTokenPayload>(newToken);
        } catch (error) {
            return defaultUserInfo
        }
    }
    if (refreshToken && token) {
        const decoded = jwtDecode<MyTokenPayload>(token);

        if (Date.now() >= decoded.exp * 1000) {
            const newToken = await refreshGet();
            if (!newToken) return defaultUserInfo;
            return jwtDecode<MyTokenPayload>(newToken);
        }

        return decoded;
    }

}