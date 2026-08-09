import { fetchWithAuth, fetchWithoutAuth } from "@/lib/fetch";
import { getErrorMessage } from "@/lib/stateError";

export const login = async (user: LoginRequest) => {
    const response = await fetchWithoutAuth('/api/auth/login', {
        method: "POST",
        body: JSON.stringify(user)
    })

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            '로그인에 실패하였습니다.'
        );

        throw new Error(message);
    }

    return response;
}


export const getUserList = async (keyword?: string) => {
    const params = new URLSearchParams();
    if (keyword) {
        params.set("keyword", keyword);
    }
    const response = await fetchWithAuth(`/api/users?${params.toString()}`)

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            '구성원 조회에 실패하였습니다.'
        );

        throw new Error(message);
    }

    return response.json();
}
