// 알림 목록조회 요청 파라미터
interface NotificationListParams {
    page?: number;
    size?: number;
}

// 알림 목록조회 응답 항목
interface NotificationItemData {
    notificationId: number;
    type: string;
    targetId: number;
    message: string;
    read: boolean;
    createdAt: string;
}

// 알림 목록조회 데이터값
interface NotificationListData {
    content: NotificationItemData[];
    page: number;
    size: number;
    hasNext: boolean;
}

// 알림 목록조회 응답값
interface NotificationListResponse {
    status: number;
    code: string;
    message: string;
    data: NotificationListData;
}

// 안읽은 알림 개수조회 데이터값
interface NotificationUnreadCountData {
    unreadCount: number;
}

// 안읽은 알림 개수조회 응답값
interface NotificationUnreadCountResponse {
    status: number;
    code: string;
    message: string;
    data: NotificationUnreadCountData;
}
