"use server";

import {
    changeRole,
    changeRolePermissions,
    createRole,
    deleteRole,
    getPermissionCatalog,
    getRoleDetail,
    getRoleList,
} from "@/service/role.service";

export interface RoleActionResult<T = undefined> {
    success: boolean;
    message: string;
    data?: T;
}

const isPositiveInteger = (value: number) =>
    Number.isInteger(value) && value > 0;

const isValidColor = (color: string) => /^#[0-9A-Fa-f]{6}$/.test(color);

const getActionErrorMessage = (error: unknown, fallbackMessage: string) =>
    error instanceof Error ? error.message : fallbackMessage;


const validateRoleForm = (formData: FormData): string | null => {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const color = formData.get('color') as string;
    if (!name.trim() || name.length > 50) {
        return "역할 이름은 1자 이상 50자 이하로 입력해주세요.";
    }

    if (description.trim().length > 255) {
        return "역할 설명은 255자 이하로 입력해주세요.";
    }

    if (color.trim() && !isValidColor(color)) {
        return "역할 색상은 #RRGGBB 형식으로 입력해주세요.";
    }

    return null;
};

export const getPermissionCatalogAction = async (): Promise<
    RoleActionResult<PermissionData[]>
> => {
    try {
        const response = await getPermissionCatalog();

        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "권한 카탈로그 조회에 실패했습니다."),
        };
    }
};

export const getRoleListAction = async (): Promise<
    RoleActionResult<RoleListData[]>
> => {
    try {
        const response = await getRoleList();

        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "역할 목록 조회에 실패했습니다."),
        };
    }
};

export const getRoleDetailAction = async (
    roleId: number,
): Promise<RoleActionResult<RoleDetailData>> => {
    if (!isPositiveInteger(roleId)) {
        return { success: false, message: "역할 번호가 올바르지 않습니다." };
    }

    try {
        const response = await getRoleDetail(roleId);

        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "역할 상세 조회에 실패했습니다."),
        };
    }
};

export const createRoleAction = async (
    prevState: RoleActionResult<CreateRoleData>,
    formData: FormData,
): Promise<RoleActionResult<CreateRoleData>> => {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const color = formData.get('color') as string;
    const validationMessage = validateRoleForm(formData);

    if (validationMessage) {
        return { success: false, message: validationMessage };
    }

    const payload = {
        name, description, color
    }

    try {
        const response = await createRole(payload);

        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "역할 생성에 실패했습니다."),
        };
    }
};

export const changeRoleAction = async (
    roleId: number,
    prevState: RoleActionResult,
    formData: FormData,
): Promise<RoleActionResult> => {
    if (!isPositiveInteger(roleId)) {
        return { success: false, message: "역할 번호가 올바르지 않습니다." };
    }

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const color = formData.get('color') as string;
    const validationMessage = validateRoleForm(formData);

    if (validationMessage) {
        return { success: false, message: validationMessage };
    }

    const payload = {
        name, description, color
    }


    try {
        await changeRole(roleId, payload);

        return { success: true, message: "역할을 수정했습니다." };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "역할 수정에 실패했습니다."),
        };
    }
};

export const deleteRoleAction = async (
    roleId: number,
): Promise<RoleActionResult> => {
    if (!isPositiveInteger(roleId)) {
        return { success: false, message: "역할 번호가 올바르지 않습니다." };
    }

    try {
        await deleteRole(roleId);

        return { success: true, message: "역할을 삭제했습니다." };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "역할 삭제에 실패했습니다."),
        };
    }
};

export const changeRolePermissionsAction = async (
    roleId: number,
    permissionCodes: string[],
): Promise<RoleActionResult> => {
    if (!isPositiveInteger(roleId)) {
        return { success: false, message: "역할 번호가 올바르지 않습니다." };
    }

    if (permissionCodes.some((code) => !code.trim())) {
        return { success: false, message: "권한 코드가 올바르지 않습니다." };
    }

    try {
        await changeRolePermissions(roleId, { permissionCodes });

        return { success: true, message: "역할 권한을 저장했습니다." };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "역할 권한 조립에 실패했습니다."),
        };
    }
};
