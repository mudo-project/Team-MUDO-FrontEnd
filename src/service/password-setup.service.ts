import { fetchWithAuth } from "@/lib/fetch";
import { getErrorMessage } from "@/lib/stateError";
import { PasswordSetupRequest } from "@/feature/password-setup/type";

export const setupPassword = async (
    payload: PasswordSetupRequest,
): Promise<void> => {
    const response = await fetchWithAuth("/api/users/password-setup", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "최초 비밀번호 설정에 실패했습니다.",
        );
        throw new Error(message);
    }
};
