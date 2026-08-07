//fetch => 인증 처리를 위한 fetch 개조
'use server'

import { cookies } from "next/headers";
import { refreshGet } from "./stateError";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


export async function fetchWithoutAuth(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    return response;
}

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<Response> {
    //쿠키 accessToken 꺼내고 
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    const isFormData = options.body instanceof FormData;
    //Header 설정
    const headers = {
        ...(!isFormData && { "Content-Type": "application/json" }),
        ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
        ...options.headers
    }

    //api 통신
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    //어세스 토큰 재발급 로직
    if (response.status !== 401) {
        //401이 아니면 바로 리턴
        return response;
    }

    const newAccessToken = await refreshGet();

    if (!newAccessToken) {
        //새로운 어세스가 없으면 바로 리턴
        return response;
    }

    const newResponse = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            ...(!isFormData && { "Content-Type": "application/json" }),
            ...options.headers,
            Authorization: `Bearer ${newAccessToken}`,

        },
    });


    return newResponse;
}

export async function fetchWithAuthGet(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    const headers = {
        'Content-Type': 'application/json',
        ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
        ...options.headers
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    return response;
}


export async function fetchWithAuthAi(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    const headers = {
        ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
        ...options.headers
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    return response;
}