import { fetchWithAuth, fetchWithoutAuth } from "@/lib/fetch";
import { getErrorMessage } from "@/lib/stateError";

// 현재 접속 IP 조회 API
export const getCurrentIp = async (): Promise<string> => {
    const response = await fetchWithoutAuth("/api/attendance/wifi-ips/current");

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "현재 접속 IP 조회에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as CurrentIpResponse;

    return resData.data.ipAddress;
}

// 와이파이 IP 등록 API
export const createWifiIp = async (payload: WifiIpCreateRequest): Promise<WifiIpCreateData> => {
    const response = await fetchWithAuth("/api/attendance/wifi-ips", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "와이파이 IP 등록에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as WifiIpCreateResponse;

    return resData.data;
}

// 와이파이 IP 목록조회 API
export const getWifiIpList = async (): Promise<WifiIpListItemData[]> => {
    const response = await fetchWithAuth("/api/attendance/wifi-ips");

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "와이파이 IP 목록 조회에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as WifiIpListResponse;

    return resData.data;
}

// 와이파이 IP 삭제 API
export const deleteWifiIp = async (wifiIpId: number): Promise<void> => {
    const response = await fetchWithAuth(`/api/attendance/wifi-ips/${wifiIpId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "와이파이 IP 삭제에 실패하였습니다."
        );

        throw new Error(message);
    }
}

// 근무시간 정책 저장 API
export const saveWorkingHours = async (
    payload: WorkingHoursPolicySaveRequest
): Promise<WorkingHoursSaveData> => {
    const response = await fetchWithAuth("/api/attendance/policies", {
        method: "PUT",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "근무시간 정책 저장에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as WorkingHoursSaveResponse;

    return resData.data;
}
