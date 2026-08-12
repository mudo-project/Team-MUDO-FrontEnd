'use server'

import {
    checkGoogleConnection,
    createWifiIp,
    deleteWifiIp,
    disconnectGoogle,
    getCurrentIp,
    getGoogleAuthorizationUrl,
    getGoogleConnection,
    getWifiIpList,
    saveWorkingHours,
} from "@/service/setting.service";

interface SettingActionState {
    success: boolean;
    message: string;
}

// 현재 접속 IP 조회 액션
export const getCurrentIpAction = async (): Promise<string> => {
    return getCurrentIp();
}

// 와이파이 IP 목록조회 액션
export const getWifiIpListAction = async (): Promise<WifiIpListItemData[]> => {
    return getWifiIpList();
}

// 와이파이 IP 등록 액션
export const createWifiIpAction = async (
    confirmedIpAddress: string,
    note: string
): Promise<SettingActionState & { wifiIpId?: number }> => {
    if (!confirmedIpAddress.trim()) {
        return {
            success: false,
            message: "등록할 IP 주소를 입력해주세요."
        };
    }

    try {
        const wifiIp = await createWifiIp({ confirmedIpAddress, note });

        return {
            success: true,
            message: "와이파이 IP가 등록되었습니다.",
            wifiIpId: wifiIp.wifiIpId,
        };
    } catch (error) {
        let errorMessage = "와이파이 IP 등록에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}

// 와이파이 IP 삭제 액션
export const deleteWifiIpAction = async (wifiIpId: number): Promise<SettingActionState> => {
    try {
        await deleteWifiIp(wifiIpId);

        return {
            success: true,
            message: "와이파이 IP가 삭제되었습니다."
        };
    } catch (error) {
        let errorMessage = "와이파이 IP 삭제에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}

// 구글 연동 상태 조회 액션
export const getGoogleConnectionAction = async (): Promise<GoogleConnectionData | null> => {
    return getGoogleConnection();
}

// 구글 계정 연동 시작(인가 URL 발급) 액션
export const getGoogleAuthorizationUrlAction = async (
    switchAccount: boolean
): Promise<SettingActionState & { authorizationUrl?: string }> => {
    try {
        const authorizationUrl = await getGoogleAuthorizationUrl(switchAccount);

        return {
            success: true,
            message: "구글 인증 URL이 발급되었습니다.",
            authorizationUrl,
        };
    } catch (error) {
        let errorMessage = "구글 인증 URL 발급에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}

// 구글 연동 상태 확인 액션
export const checkGoogleConnectionAction = async (): Promise<SettingActionState> => {
    try {
        await checkGoogleConnection();

        return {
            success: true,
            message: "구글 연동 상태를 확인했습니다."
        };
    } catch (error) {
        let errorMessage = "구글 연동 상태 확인에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}

// 구글 연동 해제 액션
export const disconnectGoogleAction = async (): Promise<SettingActionState> => {
    try {
        await disconnectGoogle();

        return {
            success: true,
            message: "구글 연동이 해제되었습니다."
        };
    } catch (error) {
        let errorMessage = "구글 연동 해제에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}

// 근무시간 정책 저장 액션
export const saveWorkingHoursPolicyAction = async (
    payload: WorkingHoursPolicySaveRequest
): Promise<SettingActionState> => {
    if (!payload.defaultStartTime || !payload.defaultEndTime) {
        return {
            success: false,
            message: "출근·퇴근 시각을 선택해주세요."
        };
    }

    if (payload.lateGraceMinutes < 0 || payload.lateGraceMinutes > 60) {
        return {
            success: false,
            message: "지각 유예는 0분에서 60분 사이로 설정해주세요."
        };
    }

    try {
        await saveWorkingHours(payload);

        return {
            success: true,
            message: "근무시간 정책이 저장되었습니다."
        };
    } catch (error) {
        let errorMessage = "근무시간 정책 저장에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}
