'use client'

import { useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { toast } from "sonner";
import { getCurrentUserIdAction } from "@/feature/messenger/actions";
import { useAlarmStore } from "@/store/useAlarmStore";

interface MentionEvent {
    eventType: "TASK_COMMENT_MENTIONED";
    taskTitle: string;
}

interface ApprovalLineActivatedEvent {
    eventType: "APPROVAL_LINE_ACTIVATED";
    documentTitle: string;
}

export default function AlarmRealtimeProvider({ apiBaseUrl }: { apiBaseUrl: string }) {
    const incrementUnreadCount = useAlarmStore((state) => state.incrementUnreadCount);

    useEffect(() => {
        let cancelled = false;
        let client: Client | null = null;

        const connect = async () => {
            const userId = await getCurrentUserIdAction();
            if (!userId || cancelled) return;

            client = new Client({
                webSocketFactory: () => new SockJS(`${apiBaseUrl}/ws`),
                reconnectDelay: 5000,
                onConnect: () => {
                    client?.subscribe(`/topic/workspaces/users/${userId}`, (message) => {
                        try {
                            const event = JSON.parse(message.body) as MentionEvent;
                            incrementUnreadCount();
                            toast(`[${event.taskTitle}] 업무에 회원님을 멘션했습니다`);
                        } catch {
                            // 파싱할 수 없는 메시지는 무시한다.
                        }
                    });

                    client?.subscribe(`/topic/approvals/users/${userId}`, (message) => {
                        try {
                            const event = JSON.parse(message.body) as ApprovalLineActivatedEvent;
                            incrementUnreadCount();
                            toast(`결재 문서 [${event.documentTitle}] 결재 차례가 되었습니다`);
                        } catch {
                            // 파싱할 수 없는 메시지는 무시한다.
                        }
                    });
                },
            });

            client.activate();
        };

        connect();

        return () => {
            cancelled = true;
            client?.deactivate();
        };
    }, [apiBaseUrl, incrementUnreadCount]);

    return null;
}
