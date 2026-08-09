export type TaskCompletionMessage = {
    kind: "task-completion";
    id: number;
    assigneeName: string;
    time: string;
    content: string;
    completed: number;
    total: number;
};

// 채팅방 내 메시지/업무지시 카드를 등록 시각 기준으로 합친 통합 피드 항목입니다.
export type FeedTextItem = {
    kind: "text";
    id: number;
    senderId: number;
    senderName: string;
    content: string | null;
    fileUrl: string | null;
    fileName: string | null;
    messageType: "TEXT" | "IMAGE" | "FILE";
    createdAt: string;
    editedAt: string | null;
    deleted: boolean;
    unreadCount: number;
    own: boolean;
};

export type FeedTaskItem = {
    kind: "task";
    id: number;
    card: MessengerTaskCardItemData;
    createdAt: string;
    own: boolean;
};

export type FeedItem = FeedTextItem | FeedTaskItem;

export function getFeedSearchText(item: FeedItem): string {
    if (item.kind === "text") return item.deleted ? "" : (item.content ?? "");
    return item.card.content;
}

// 여러 채팅방의 업무지시 카드를 하나로 모아 보여줄 때 쓰는 항목입니다.
export type RoomTaskCard = {
    roomId: number;
    roomName: string;
    card: MessengerTaskCardItemData;
};

// 이름에서 아바타용 이니셜(앞 2글자)을 만듭니다.
export function getInitials(name: string): string {
    return name.slice(0, 2);
}

// 백엔드가 보내는 ISO 시각(createdAt/lastMessageAt)을 화면 표시용 시각 문자열로 바꿉니다.
export function formatChatTime(iso: string | null): string {
    if (!iso) return "";

    const date = new Date(iso);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const period = hours < 12 ? "오전" : "오후";
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;

    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) return `${period} ${displayHours}:${minutes}`;

    return `${date.getMonth() + 1}.${date.getDate()} ${period} ${displayHours}:${minutes}`;
}


