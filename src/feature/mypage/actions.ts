"use server";

import {
    changeMyPassword,
    getMyProfile,
    updateMyProfile,
} from "@/service/mypage.service";
import {
    ChangeMyPasswordRequest,
    MyProfileData,
    UpdateMyProfileRequest,
} from "./type";

export interface MyPageActionResult<T = undefined> {
    success: boolean;
    message: string;
    data?: T;
}

const getActionErrorMessage = (error: unknown, fallbackMessage: string) =>
    error instanceof Error ? error.message : fallbackMessage;

export const getMyProfileAction = async (): Promise<
    MyPageActionResult<MyProfileData>
> => {
    try {
        const response = await getMyProfile();

        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "내 정보 조회에 실패했습니다."),
        };
    }
};

export const updateMyProfileAction = async (
    payload: UpdateMyProfileRequest,
): Promise<MyPageActionResult> => {
    if (payload.phone !== undefined && payload.phone.length > 20) {
        return { success: false, message: "전화번호는 20자 이하로 입력해주세요." };
    }

    if (payload.email !== undefined && payload.email.length > 100) {
        return { success: false, message: "이메일은 100자 이하로 입력해주세요." };
    }

    try {
        await updateMyProfile(payload);

        return { success: true, message: "내 정보를 수정했습니다." };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "내 정보 수정에 실패했습니다."),
        };
    }
};

export const changeMyPasswordAction = async (
    payload: ChangeMyPasswordRequest,
): Promise<MyPageActionResult> => {
    if (!payload.currentPassword || payload.currentPassword.length > 100) {
        return { success: false, message: "현재 비밀번호를 확인해주세요." };
    }

    if (payload.newPassword.length < 8 || payload.newPassword.length > 100) {
        return { success: false, message: "새 비밀번호는 8자 이상 100자 이하로 입력해주세요." };
    }

    try {
        await changeMyPassword(payload);

        return { success: true, message: "비밀번호를 변경했습니다." };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "비밀번호 변경에 실패했습니다."),
        };
    }
};
