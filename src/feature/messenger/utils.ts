import { format, isSameDay as dateFnsIsSameDay } from "date-fns";
import { ko } from "date-fns/locale";

export type TaskCompletionMessage = {
    kind: "task-completion";
    id: number;
    assigneeName: string;
    time: string;
    content: string;
    completed: number;
    total: number;
};

// 채팅방 내 메시지/업무카드를 등록 시각 기준으로 합친 통합 피드 항목입니다.
export type FeedTextItem = {
    kind: "text";
    id: number;
    senderId: number;
    senderName: string;
    content: string | null;
    fileId: number | null;
    fileDownloadUrl: string | null;
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

// 여러 채팅방의 업무카드를 하나로 모아 보여줄 때 쓰는 항목입니다.
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

    if (dateFnsIsSameDay(date, new Date())) return formatTimeOnly(iso);

    return format(date, "M.d a h:mm", { locale: ko });
}

// 채팅방 대화 피드에서 쓰는, 날짜 없이 시각만 표시하는 포맷입니다(날짜는 별도 구분선으로 표시).
export function formatTimeOnly(iso: string | null): string {
    if (!iso) return "";

    return format(new Date(iso), "a h:mm", { locale: ko });
}

// 채팅방 대화 피드의 날짜 구분선에 쓰는 "YYYY년 M월 D일 (요일)" 포맷입니다.
export function formatFeedDateDivider(iso: string): string {
    return format(new Date(iso), "yyyy'년' M'월' d'일' (EEEEE)", { locale: ko });
}

// 두 ISO 시각이 같은 날짜인지 비교합니다.
export function isSameDay(isoA: string, isoB: string): boolean {
    return dateFnsIsSameDay(new Date(isoA), new Date(isoB));
}


