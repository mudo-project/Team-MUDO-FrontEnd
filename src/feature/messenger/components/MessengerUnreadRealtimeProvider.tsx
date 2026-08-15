'use client'

import { useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getChatRoomsAction, getCurrentUserIdAction } from "../actions";
import { useMessengerUnreadStore } from "@/store/useMessengerUnreadStore";

// 사이드바 메신저 뱃지용 전체 안읽음 합계를 구독한다.
// MessengerRealtimeProvider와 별개로 루트 레이아웃에 상시 마운트되어, 메신저 화면 밖에서도 갱신된다.
export default function MessengerUnreadRealtimeProvider() {
    const setUnreadCount = useMessengerUnreadStore((state) => state.setUnreadCount);

    useEffect(() => {
        let cancelled = false;
        let client: Client | null = null;
        const subscribedRoomIds = new Set<number>();

        const refreshUnreadCount = async () => {
            const rooms = await getChatRoomsAction();
            if (cancelled) return;

            setUnreadCount(rooms.reduce((sum, room) => sum + room.unreadCount, 0));

            rooms.forEach((room) => {
                if (!client?.connected || subscribedRoomIds.has(room.id)) return;
                subscribedRoomIds.add(room.id);
                client.subscribe(`/topic/messenger/rooms/${room.id}`, () => {
                    void refreshUnreadCount();
                });
            });
        };

        const connect = async () => {
            const userId = await getCurrentUserIdAction();
            if (!userId || cancelled) return;

            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

            client = new Client({
                webSocketFactory: () => new SockJS(`${baseUrl}/ws`),
                reconnectDelay: 5000,
                onConnect: () => {
                    void refreshUnreadCount();
                },
            });

            client.activate();
        };

        void refreshUnreadCount();
        void connect();

        return () => {
            cancelled = true;
            client?.deactivate();
        };
    }, [setUnreadCount]);

    return null;
}
