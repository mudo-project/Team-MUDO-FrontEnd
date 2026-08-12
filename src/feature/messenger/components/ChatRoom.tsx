'use client'

import { useCallback, useEffect, useMemo, useState } from "react";
import ChatRoomHeader from "./ChatRoomHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { FeedItem, getFeedSearchText } from "../utils";
import { getChatRoomsAction, getCurrentUserIdAction, getMessagesAction, getTaskCardsAction } from "../actions";
import { useMessengerRealtime, useMessengerRealtimeSubscription } from "./MessengerRealtimeProvider";

export default function ChatRoom({ roomId }: { roomId: number }) {
    const [room, setRoom] = useState<MessengerRoomListItemData | null>(null);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [messages, setMessages] = useState<MessengerMessageItemData[]>([]);
    const [taskCards, setTaskCards] = useState<MessengerTaskCardItemData[]>([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const loadMessages = useCallback(() => {
        return getMessagesAction(roomId).then((data) => setMessages(data.content));
    }, [roomId]);

    const loadTaskCards = useCallback(() => {
        return getTaskCardsAction(roomId).then((data) => setTaskCards(data.content));
    }, [roomId]);

    useEffect(() => {
        getCurrentUserIdAction().then(setCurrentUserId);
    }, []);

    useEffect(() => {
        getChatRoomsAction().then((rooms) => {
            setRoom(rooms.find((item) => item.id === roomId) ?? null);
        });
        void loadMessages();
        void loadTaskCards();
    }, [roomId, loadMessages, loadTaskCards]);

    useMessengerRealtimeSubscription(roomId);
    useMessengerRealtime((event) => {
        if (event.chatRoomId !== roomId) return;
        if (event.eventType.startsWith("TASK_CARD_")) {
            void loadTaskCards();
        } else if (event.eventType === "MESSAGE_SENT" || event.eventType === "MESSAGE_EDITED" || event.eventType === "MESSAGE_DELETED") {
            void loadMessages();
        }
    });

    const feed: FeedItem[] = useMemo(() => {
        const textItems: FeedItem[] = messages.map((message) => ({
            kind: "text",
            id: message.id,
            senderId: message.senderId,
            senderName: message.senderName,
            content: message.content,
            fileUrl: message.fileUrl,
            fileName: message.fileName,
            messageType: message.messageType,
            createdAt: message.createdAt,
            editedAt: message.editedAt,
            deleted: message.deleted,
            unreadCount: message.unreadCount,
            own: message.senderId === currentUserId,
        }));

        const taskItems: FeedItem[] = taskCards.map((card) => ({
            kind: "task",
            id: card.id,
            card,
            createdAt: card.createdAt,
            own: card.assignerId === currentUserId,
        }));

        return [...textItems, ...taskItems].sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
    }, [messages, taskCards, currentUserId]);

    const trimmedQuery = searchQuery.trim().toLowerCase();

    const filteredFeed = useMemo(() => {
        if (!trimmedQuery) return feed;
        return feed.filter((item) => getFeedSearchText(item).toLowerCase().includes(trimmedQuery));
    }, [feed, trimmedQuery]);

    const handleToggleSearch = () => {
        setIsSearchOpen((open) => {
            if (open) setSearchQuery("");
            return !open;
        });
    };

    if (!room) return null;

    return (
        <section className="relative flex min-h-0 min-w-0 flex-1 flex-col bg-[#FCFCFC]" aria-label={`${room.name} 대화`}>
            <ChatRoomHeader
                roomId={roomId}
                roomName={room.name}
                isSearchOpen={isSearchOpen}
                onSearchQueryChange={setSearchQuery}
                onToggleSearch={handleToggleSearch}
                searchQuery={searchQuery}
            />

            {trimmedQuery && filteredFeed.length === 0
                ? (
                    <div className="flex min-h-0 flex-1 items-center justify-center text-[12px] text-[#94A3B8]">
                        검색 결과가 없습니다
                    </div>
                )
                : (
                    <MessageList
                        feed={filteredFeed}
                        currentUserId={currentUserId}
                        roomId={roomId}
                        onMessagesChange={loadMessages}
                        onTaskCardsChange={loadTaskCards}
                    />
                )
            }

            <MessageInput roomId={roomId} onMessageSent={loadMessages} onTaskCreated={loadTaskCards} />
        </section>
    );
}
