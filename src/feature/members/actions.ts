"use server";

import {
    changeEmployeeRole,
    createEmployeeAccount,
    getMemberList,
} from "@/service/members.service";
import {
    CreateEmployeeAccountData,
    MemberListPageData,
    MemberListParams,
} from "./type";

export interface MembersActionResult<T = undefined> {
    success: boolean;
    message: string;
    data?: T;
}

const isPositiveInteger = (value: number) =>
    Number.isInteger(value) && value > 0;

const getActionErrorMessage = (error: unknown, fallbackMessage: string) =>
    error instanceof Error ? error.message : fallbackMessage;

export const createEmployeeAccountAction = async (
    prevState: MembersActionResult<CreateEmployeeAccountData>,
    formData: FormData,
): Promise<MembersActionResult<CreateEmployeeAccountData>> => {
    const username = String(formData.get("username") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const roleId = Number(formData.get("roleId"));

    if (!username || username.length > 50) {
        return { success: false, message: "아이디는 1자 이상 50자 이하로 입력해주세요." };
    }

    if (!name || name.length > 50) {
        return { success: false, message: "이름은 1자 이상 50자 이하로 입력해주세요." };
    }

    if (!phone || phone.length > 20) {
        return { success: false, message: "전화번호는 1자 이상 20자 이하로 입력해주세요." };
    }

    if (!email || email.length > 100) {
        return { success: false, message: "이메일은 1자 이상 100자 이하로 입력해주세요." };
    }

    if (!isPositiveInteger(roleId)) {
        return { success: false, message: "역할 번호가 올바르지 않습니다." };
    }

    try {
        const response = await createEmployeeAccount({
            username,
            name,
            phone,
            email,
            roleId,
        });

        return {
            success: true,
            message: response.message,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "직원 계정 발급에 실패했습니다."),
        };
    }
};

export const changeEmployeeRoleAction = async (
    userId: number,
    roleId: number,
): Promise<MembersActionResult> => {
    if (!isPositiveInteger(userId) || !isPositiveInteger(roleId)) {
        return {
            success: false,
            message: "사용자 또는 역할 번호가 올바르지 않습니다.",
        };
    }

    try {
        await changeEmployeeRole(userId, { roleId });

        return { success: true, message: "직원 역할을 변경했습니다." };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "직원 역할 변경에 실패했습니다."),
        };
    }
};

export const getMemberListAction = async (
    params: MemberListParams = {},
): Promise<MembersActionResult<MemberListPageData>> => {
    const keyword = params.keyword?.trim() || undefined;
    const roleId = params.roleId;
    const page = params.page ?? 0;

    if (roleId !== undefined && !isPositiveInteger(roleId)) {
        return { success: false, message: "역할 번호가 올바르지 않습니다." };
    }

    if (!Number.isInteger(page) || page < 0) {
        return { success: false, message: "페이지 번호가 올바르지 않습니다." };
    }


    try {
        const response = await getMemberList({ keyword, roleId, page });

        return {
            success: true,
            message: response.message,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "구성원 목록 조회에 실패했습니다."),
        };
    }
};
