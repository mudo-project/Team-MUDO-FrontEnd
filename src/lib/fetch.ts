import "server-only";
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
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    const isFormData = options.body instanceof FormData;
    const headers = {
        ...(!isFormData && { "Content-Type": "application/json" }),
        ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
        ...options.headers
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status !== 401) {
        return response;
    }

    const newAccessToken = await refreshGet();

    if (!newAccessToken) {
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