"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

type WorkspaceRealtimeEvent =
    | { eventType: "TASK_CREATED"; taskId: number }
    | { eventType: "TASK_UPDATED"; taskId: number }
    | { eventType: "TASK_DELETED"; taskId: number }
    | { eventType: "COMMENT_CREATED"; taskId: number; commentId: number }
    | { eventType: "COMMENT_UPDATED"; taskId: number; commentId: number }
    | { eventType: "COMMENT_TOGGLED"; taskId: number; commentId: number }
    | { eventType: "COMMENT_DELETED"; taskId: number; commentId: number };

export default function WorkspaceRealtimeProvider({
    apiBaseUrl,
    workspaceId,
}: {
    apiBaseUrl: string;
    workspaceId: string;
}) {
    const queryClient = useQueryClient();

    useEffect(() => {
        let client: Client | null = null;

        const syncWorkspace = () => {
            void queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId] });
            void queryClient.invalidateQueries({ queryKey: ["my-workspace-tasks"] });
        };

        const syncTask = (taskId: number) => {
            void queryClient.invalidateQueries({ queryKey: ["task", workspaceId, taskId] });
        };

        client = new Client({
            webSocketFactory: () => new SockJS(`${apiBaseUrl}/ws`),
            reconnectDelay: 5000,
            heartbeatOutgoing: 10000,
            heartbeatIncoming: 10000,
            onConnect: () => {
                syncWorkspace();

                client?.subscribe(`/topic/workspaces/${workspaceId}`, (message) => {
                    try {
                        const event = JSON.parse(message.body) as WorkspaceRealtimeEvent;

                        switch (event.eventType) {
                            case "TASK_CREATED":
                                syncWorkspace();
                                break;
                            case "TASK_UPDATED":
                            case "TASK_DELETED":
                                syncWorkspace();
                                syncTask(event.taskId);
                                break;
                            case "COMMENT_CREATED":
                            case "COMMENT_UPDATED":
                            case "COMMENT_TOGGLED":
                            case "COMMENT_DELETED":
                                syncWorkspace();
                                syncTask(event.taskId);
                                break;
                        }
                    } catch {
                    }
                });

            },
            debug: (str) => console.log(str),

        });

        client.activate();

        return () => {
            client?.deactivate();
        };
    }, [apiBaseUrl, queryClient, workspaceId]);

    return null;
}
