import { fetchWithAuth } from "@/lib/fetch";
import { getErrorMessage } from "@/lib/stateError";

// 알림 목록조회 API
export const getNotificationList = async (params?: NotificationListParams): Promise<NotificationListData> => {
    const query = new URLSearchParams();
    if (params?.page !== undefined) query.set("page", String(params.page));
    if (params?.size !== undefined) query.set("size", String(params.size));
    const queryString = query.toString();

    const response = await fetchWithAuth(`/api/notifications${queryString ? `?${queryString}` : ""}`);

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "알림 목록 조회에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as NotificationListResponse;

    return resData.data;
}

// 안읽은 알림 개수조회 API
export const getUnreadNotificationCount = async (): Promise<number> => {
    const response = await fetchWithAuth("/api/notifications/unread-count");

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "안읽은 알림 개수 조회에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as NotificationUnreadCountResponse;

    return resData.data.unreadCount;
}

// 알림 읽음 처리 API
export const readNotification = async (notificationId: number): Promise<void> => {
    const response = await fetchWithAuth(`/api/notifications/${notificationId}/read`, {
        method: "PATCH",
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "알림 읽음 처리에 실패하였습니다."
        );

        throw new Error(message);
    }
}

// 알림 개별 삭제 API
export const deleteNotification = async (notificationId: number): Promise<void> => {
    const response = await fetchWithAuth(`/api/notifications/${notificationId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "알림 삭제에 실패하였습니다."
        );

        throw new Error(message);
    }
}

// 읽은 알림 일괄 삭제 API
export const deleteReadNotifications = async (): Promise<void> => {
    const response = await fetchWithAuth("/api/notifications?status=READ", {
        method: "DELETE",
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "읽은 알림 일괄 삭제에 실패하였습니다."
        );

        throw new Error(message);
    }
}
