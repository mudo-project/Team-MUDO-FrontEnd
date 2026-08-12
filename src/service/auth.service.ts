import { fetchWithAuth, fetchWithoutAuth } from "@/lib/fetch";
import { getErrorMessage } from "@/lib/stateError";
import { cookies } from "next/headers";

export const login = async (user: LoginRequest): Promise<Response> => {
    const response = await fetchWithoutAuth("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(user),
    });

    if (!response.ok) {
        const message = await getErrorMessage(response, "로그인에 실패했습니다.");
        throw new Error(message);
    }

    return response;
};

export const logout = async (): Promise<LogoutResponse> => {
    const response = await fetchWithAuth("/api/auth/logout", {
        method: "POST",
    });

    if (!response.ok) {
        const message = await getErrorMessage(response, "로그아웃에 실패했습니다.");
        throw new Error(message);
    }

    return response.json();
};

export const reissueAccessToken = async (): Promise<ReissueAccessTokenResponse> => {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;
    const response = await fetchWithoutAuth("/api/token/reissue", {
        method: "POST",
        headers: refreshToken
            ? { Cookie: `refreshToken=${refreshToken}` }
            : undefined,
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "액세스 토큰 재발급에 실패했습니다."
        );
        throw new Error(message);
    }

    return response.json();
};

export const getUserList = async (
    keyword?: string
): Promise<UserListApiResponse<UserListResponse[]>> => {
    const params = new URLSearchParams();
    if (keyword) {
        params.set("keyword", keyword);
    }

    const query = params.toString();
    const response = await fetchWithAuth(`/api/users${query ? `?${query}` : ""}`);

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "구성원 조회에 실패했습니다."
        );
        throw new Error(message);
    }

    return response.json();
};
