import { fetchWithAuth } from "@/lib/fetch";
import { getErrorMessage } from "@/lib/stateError";

export const getPermissionCatalog = async (): Promise<PermissionCatalogResponse> => {
    const response = await fetchWithAuth("/api/permissions");

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "권한 카탈로그 조회에 실패했습니다.",
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
    payload: CreateRoleRequest,
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
    payload: ChangeRoleRequest,
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
    payload: ChangeRolePermissionsRequest,
): Promise<void> => {
    const response = await fetchWithAuth(`/api/roles/${roleId}/permissions`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "역할 권한 조립에 실패했습니다.",
        );
        throw new Error(message);
    }
};
