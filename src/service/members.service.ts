import { fetchWithAuth } from "@/lib/fetch";
import { getErrorMessage } from "@/lib/stateError";
import {
    ChangeEmployeeRoleRequest,
    CreateEmployeeAccountRequest,
    CreateEmployeeAccountResponse,
    MemberListParams,
    MemberListResponse,
} from "@/feature/members/type";

export const createEmployeeAccount = async (
    payload: CreateEmployeeAccountRequest,
): Promise<CreateEmployeeAccountResponse> => {
    const response = await fetchWithAuth("/api/users", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "직원 계정 발급에 실패했습니다.",
        );
        throw new Error(message);
    }

    return response.json();
};

export const changeEmployeeRole = async (
    userId: number,
    payload: ChangeEmployeeRoleRequest,
): Promise<void> => {
    const response = await fetchWithAuth(`/api/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "직원 역할 변경에 실패했습니다.",
        );
        throw new Error(message);
    }
};

export const getMemberList = async (
    { keyword, roleId, page, size }: MemberListParams = {},
): Promise<MemberListResponse> => {
    const params = new URLSearchParams();

    if (keyword) params.set("keyword", keyword);
    if (roleId !== undefined) params.set("roleId", String(roleId));
    if (page !== undefined) params.set("page", String(page));
    if (size !== undefined) params.set("size", String(size));

    const query = params.toString();
    const response = await fetchWithAuth(
        `/api/users/members${query ? `?${query}` : ""}`,
    );

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "구성원 목록 조회에 실패했습니다.",
        );
        throw new Error(message);
    }

    return response.json();
};
