import { fetchWithoutAuth } from "@/lib/fetch";
import { getErrorMessage } from "@/lib/stateError";

interface PasswordSetupRequest {
    username: string;
    tempPassword: string;
    newPassword: string;
}

export const setupPassword = async (
    payload: PasswordSetupRequest,
): Promise<void> => {
    const response = await fetchWithoutAuth("/api/users/password-setup", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "비밀번호 설정에 실패했습니다.",
        );
        throw new Error(message);
    }
};
