"use server";

import { setupPassword } from "@/service/password-setup.service";

export interface PasswordSetupActionResult {
    success: boolean;
    message: string;
}

export const setupPasswordAction = async (
    prevState: PasswordSetupActionResult,
    formData: FormData,
): Promise<PasswordSetupActionResult> => {
    const username = String(formData.get("username") ?? "").trim();
    const tempPassword = String(formData.get("tempPassword") ?? "");
    const newPassword = String(formData.get("newPassword") ?? "");

    if (!username || username.length > 50) {
        return { success: false, message: "아이디는 1자 이상 50자 이하로 입력해주세요." };
    }

    if (!tempPassword || tempPassword.length > 100) {
        return { success: false, message: "임시 비밀번호가 올바르지 않습니다." };
    }

    if (newPassword.length < 8 || newPassword.length > 100) {
        return { success: false, message: "새 비밀번호는 8자 이상 100자 이하로 입력해주세요." };
    }

    try {
        await setupPassword({ username, tempPassword, newPassword });

        return { success: true, message: "비밀번호 설정이 완료되었습니다." };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "최초 비밀번호 설정에 실패했습니다.",
        };
    }
};
