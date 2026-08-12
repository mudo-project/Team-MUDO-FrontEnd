import { fetchWithAuth } from "@/lib/fetch";
import { getErrorMessage } from "@/lib/stateError";
import {
    ChangeMyPasswordRequest,
    MyProfileResponse,
    UpdateMyProfileRequest,
} from "@/feature/mypage/type";

export const getMyProfile = async (): Promise<MyProfileResponse> => {
    const response = await fetchWithAuth("/api/users/me");

    if (!response.ok) {
        const message = await getErrorMessage(response, "내 정보 조회에 실패했습니다.");
        throw new Error(message);
    }

    return response.json();
};

export const updateMyProfile = async (
    payload: UpdateMyProfileRequest,
): Promise<void> => {
    const response = await fetchWithAuth("/api/users/me", {
        method: "PATCH",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(response, "내 정보 수정에 실패했습니다.");
        throw new Error(message);
    }
};

export const changeMyPassword = async (
    payload: ChangeMyPasswordRequest,
): Promise<void> => {
    const response = await fetchWithAuth("/api/users/me/password", {
        method: "PATCH",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(response, "비밀번호 변경에 실패했습니다.");
        throw new Error(message);
    }
};
