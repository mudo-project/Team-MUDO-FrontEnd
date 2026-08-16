'use client'

import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export type MessengerRealtimeEvent = {
    eventType: string;
    chatRoomId: number;
    [key: string]: unknown;
};

type Listener = (event: MessengerRealtimeEvent) => void;

type MessengerRealtimeContextValue = {
    addListener: (listener: Listener) => () => void;
    ensureSubscribed: (roomId: number) => void;
};

const MessengerRealtimeContext = createContext<MessengerRealtimeContextValue | null>(null);

export function useMessengerRealtime(onEvent: Listener) {
    const context = useContext(MessengerRealtimeContext);
    const onEventRef = useRef(onEvent);

    useEffect(() => {
        onEventRef.current = onEvent;
    }, [onEvent]);

    useEffect(() => {
        if (!context) return;
        return context.addListener((event) => onEventRef.current(event));
    }, [context]);
}

export function useMessengerRealtimeSubscription(roomId: number | undefined) {
    const context = useContext(MessengerRealtimeContext);

    useEffect(() => {
        if (!context || roomId === undefined) return;
        context.ensureSubscribed(roomId);
    }, [context, roomId]);
}

export function useMessengerRealtimeRoomList(roomIds: number[]) {
    const context = useContext(MessengerRealtimeContext);
    const key = roomIds.join(",");

    useEffect(() => {
        if (!context) return;
        roomIds.forEach((roomId) => context.ensureSubscribed(roomId));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context, key]);
}

export default function MessengerRealtimeProvider({
    apiBaseUrl,
    children,
}: {
    apiBaseUrl: string;
    children: ReactNode;
}) {
    const listenersRef = useRef<Set<Listener>>(new Set());
    const clientRef = useRef<Client | null>(null);
    const subscribedRoomIdsRef = useRef<Set<number>>(new Set());
    const pendingRoomIdsRef = useRef<Set<number>>(new Set());

    const addListener = useCallback((listener: Listener) => {
        listenersRef.current.add(listener);
        return () => {
            listenersRef.current.delete(listener);
        };
    }, []);

    const subscribeRoom = useCallback((roomId: number) => {
        const client = clientRef.current;
        if (!client?.connected || subscribedRoomIdsRef.current.has(roomId)) return;

        subscribedRoomIdsRef.current.add(roomId);
        client.subscribe(`/topic/messenger/rooms/${roomId}`, (message) => {
            try {
                const event = JSON.parse(message.body) as MessengerRealtimeEvent;
                listenersRef.current.forEach((listener) => listener(event));
            } catch {
                // 파싱할 수 없는 메시지는 무시한다.
            }
        });
    }, []);

    const ensureSubscribed = useCallback((roomId: number) => {
        if (subscribedRoomIdsRef.current.has(roomId)) return;
        if (clientRef.current?.connected) {
            subscribeRoom(roomId);
        } else {
            pendingRoomIdsRef.current.add(roomId);
        }
    }, [subscribeRoom]);

    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS(`${apiBaseUrl}/ws`),
            reconnectDelay: 5000,
            onConnect: () => {
                pendingRoomIdsRef.current.forEach((roomId) => subscribeRoom(roomId));
                pendingRoomIdsRef.current.clear();
            },
        });

        clientRef.current = client;
        client.activate();

        return () => {
            client.deactivate();
            clientRef.current = null;
            subscribedRoomIdsRef.current.clear();
        };
    }, [apiBaseUrl, subscribeRoom]);

    return (
        <MessengerRealtimeContext.Provider value={{ addListener, ensureSubscribed }}>
            {children}
        </MessengerRealtimeContext.Provider>
    );
}
