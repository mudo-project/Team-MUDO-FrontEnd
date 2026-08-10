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

export const getPermissionCatalog = async (): Promise<PermissionCatalogResponse> => {
    const response = await fetchWithAuth("/api/permissions");

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "권한 카탈로그 조회에 실패했습니다."
        );
        throw new Error(message);
    }

    return response.json();
};

export const getRoleList = async (): Promise<RoleListResponse> => {
    const response = await fetchWithAuth("/api/roles");

    if (!response.ok) {
        const message = await getErrorMessage(response, "역할 목록 조회에 실패했습니다.");
        throw new Error(message);
    }

    return response.json();
};

export const getRoleDetail = async (roleId: number): Promise<RoleDetailResponse> => {
    const response = await fetchWithAuth(`/api/roles/${roleId}`);

    if (!response.ok) {
        const message = await getErrorMessage(response, "역할 상세 조회에 실패했습니다.");
        throw new Error(message);
    }

    return response.json();
};

export const createRole = async (
    payload: CreateRoleRequest
): Promise<CreateRoleResponse> => {
    const response = await fetchWithAuth("/api/roles", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(response, "역할 생성에 실패했습니다.");
        throw new Error(message);
    }

    return response.json();
};

export const changeRole = async (
    roleId: number,
    payload: ChangeRoleRequest
): Promise<void> => {
    const response = await fetchWithAuth(`/api/roles/${roleId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(response, "역할 수정에 실패했습니다.");
        throw new Error(message);
    }
};

export const deleteRole = async (roleId: number): Promise<void> => {
    const response = await fetchWithAuth(`/api/roles/${roleId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const message = await getErrorMessage(response, "역할 삭제에 실패했습니다.");
        throw new Error(message);
    }
};

export const changeRolePermissions = async (
    roleId: number,
    payload: ChangeRolePermissionsRequest
): Promise<void> => {
    const response = await fetchWithAuth(`/api/roles/${roleId}/permissions`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "역할 권한 조립에 실패했습니다."
        );
        throw new Error(message);
    }
};

export const createEmployeeAccount = async (
    payload: CreateEmployeeAccountRequest
): Promise<CreateEmployeeAccountResponse> => {
    const response = await fetchWithAuth("/api/users", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "직원 계정 발급에 실패했습니다."
        );
        throw new Error(message);
    }

    return response.json();
};

export const changeEmployeeRole = async (
    userId: number,
    payload: ChangeEmployeeRoleRequest
): Promise<void> => {
    const response = await fetchWithAuth(`/api/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "직원 역할 변경에 실패했습니다."
        );
        throw new Error(message);
    }
};
