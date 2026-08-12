"use server";

import { setupPassword } from "@/service/password-setup.service";

export interface PasswordSetupActionResult {
    success: boolean;
    message: string;
}

export const setupPasswordAction = async (payload: {
    email: string, phone: string, newPassword: string
}): Promise<PasswordSetupActionResult> => {

    try {
        await setupPassword(payload);

        return { success: true, message: "비밀번호 설정이 완료되었습니다." };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "최초 비밀번호 설정에 실패했습니다.",
        };
    }
};
