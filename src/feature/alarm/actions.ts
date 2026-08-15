'use server'

import {
    deleteNotification,
    deleteReadNotifications,
    getNotificationList,
    getUnreadNotificationCount,
    readNotification,
} from "@/service/alarm.service";

interface AlarmActionState {
    success: boolean;
    message: string;
}

// 알림 목록조회 액션
export const getNotificationListAction = async (params?: NotificationListParams): Promise<NotificationListData> => {
    return getNotificationList(params);
}

// 안읽은 알림 개수조회 액션
export const getUnreadNotificationCountAction = async (): Promise<number> => {
    return getUnreadNotificationCount();
}

// 알림 읽음 처리 액션
export const readNotificationAction = async (notificationId: number): Promise<AlarmActionState> => {
    try {
        await readNotification(notificationId);

        return {
            success: true,
            message: "알림을 읽음 처리하였습니다."
        };
    } catch (error) {
        let errorMessage = "알림 읽음 처리에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}

// 알림 개별 삭제 액션
export const deleteNotificationAction = async (notificationId: number): Promise<AlarmActionState> => {
    try {
        await deleteNotification(notificationId);

        return {
            success: true,
            message: "알림이 삭제되었습니다."
        };
    } catch (error) {
        let errorMessage = "알림 삭제에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}

// 읽은 알림 일괄 삭제 액션
export const deleteReadNotificationsAction = async (): Promise<AlarmActionState> => {
    try {
        await deleteReadNotifications();

        return {
            success: true,
            message: "읽은 알림이 모두 삭제되었습니다."
        };
    } catch (error) {
        let errorMessage = "읽은 알림 일괄 삭제에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}
