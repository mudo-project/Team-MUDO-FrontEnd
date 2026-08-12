import { fetchWithAuth } from "@/lib/fetch";
import { getErrorMessage } from "@/lib/stateError";
import {
    ChangeEmployeeRoleRequest,
    CreateEmployeeAccountRequest,
    CreateEmployeeAccountResponse,
    MemberListParams,
    MemberListResponse,
    UpdateMemberRequest,
    ChangeMemberStatusRequest,
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
    { keyword, roleId, page }: MemberListParams = {},
): Promise<MemberListResponse> => {
    const params = new URLSearchParams();

    if (keyword) params.set("keyword", keyword);
    if (roleId !== undefined) params.set("roleId", String(roleId));
    if (page !== undefined) params.set("page", String(page));

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

export const updateMember = async (
    userId: number,
    payload: UpdateMemberRequest,
): Promise<void> => {
    const response = await fetchWithAuth(`/api/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "구성원 정보 수정에 실패했습니다.",
        );
        throw new Error(message);
    }
};

export const changeMemberStatus = async (
    userId: number,
    payload: ChangeMemberStatusRequest,
): Promise<void> => {
    const response = await fetchWithAuth(`/api/users/${userId}/status`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "구성원 재직 상태 변경에 실패했습니다.",
        );
        throw new Error(message);
    }
};
