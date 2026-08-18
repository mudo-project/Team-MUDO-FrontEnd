import { act, render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WorkspaceRealtimeProvider from "./WorkspaceRealtimeProvider";

type StompCallback = (message: { body: string }) => void;

const mockSubscriptions = new Map<string, StompCallback>();

jest.mock("@stomp/stompjs", () => ({
    Client: jest.fn().mockImplementation(({ onConnect }: { onConnect: () => void }) => ({
        activate: jest.fn(() => onConnect()),
        deactivate: jest.fn(),
        subscribe: jest.fn((topic: string, callback: StompCallback) => {
            mockSubscriptions.set(topic, callback);
        }),
    })),
}));

jest.mock("sockjs-client", () => jest.fn());

const renderProvider = (workspaceId = "1") => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });
    queryClient.setQueryData(["workspace", workspaceId, undefined], {
        success: true,
        message: "조회했습니다.",
        data: {},
    });
    queryClient.setQueryData(["task", workspaceId, 501], {
        success: true,
        message: "조회했습니다.",
        data: {},
    });
    queryClient.setQueryData(["my-workspace-tasks", undefined, undefined], {
        pages: [],
        pageParams: [0],
    });

    render(
        <QueryClientProvider client={queryClient}>
            <WorkspaceRealtimeProvider apiBaseUrl="http://localhost" workspaceId={workspaceId} />
        </QueryClientProvider>,
    );

    return { queryClient };
};

describe("WorkspaceRealtimeProvider", () => {
    beforeEach(() => {
        mockSubscriptions.clear();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("연결되면 워크스페이스 토픽을 구독하고 화면 전체를 동기화한다", () => {
        const { queryClient } = renderProvider();

        expect(mockSubscriptions.has("/topic/workspaces/1")).toBe(true);
        expect(
            queryClient.getQueryState(["workspace", "1", undefined])?.isInvalidated,
        ).toBe(true);
        expect(
            queryClient.getQueryState(["my-workspace-tasks", undefined, undefined])
                ?.isInvalidated,
        ).toBe(true);
    });

    it("TASK_CREATED 이벤트를 받으면 워크스페이스 목록을 갱신한다", () => {
        const { queryClient } = renderProvider();
        queryClient.getQueryCache().clear();
        queryClient.setQueryData(["workspace", "1", undefined], { success: true, data: {} });

        act(() => {
            mockSubscriptions.get("/topic/workspaces/1")?.({
                body: JSON.stringify({
                    eventType: "TASK_CREATED",
                    workspaceId: 1,
                    taskId: 501,
                    title: "새 업무",
                    status: "WAITING",
                    dueAt: "2026-09-01",
                    createdBy: 10,
                    createdAt: "2026-08-18T10:00:00",
                }),
            });
        });

        expect(
            queryClient.getQueryState(["workspace", "1", undefined])?.isInvalidated,
        ).toBe(true);
    });

    it("TASK_UPDATED 이벤트를 받으면 워크스페이스 목록과 업무 상세를 갱신한다", () => {
        const { queryClient } = renderProvider();
        queryClient.getQueryCache().clear();
        queryClient.setQueryData(["workspace", "1", undefined], { success: true, data: {} });
        queryClient.setQueryData(["task", "1", 501], { success: true, data: {} });

        act(() => {
            mockSubscriptions.get("/topic/workspaces/1")?.({
                body: JSON.stringify({
                    eventType: "TASK_UPDATED",
                    workspaceId: 1,
                    taskId: 501,
                    status: "COMPLETED",
                    dueAt: null,
                }),
            });
        });

        expect(
            queryClient.getQueryState(["workspace", "1", undefined])?.isInvalidated,
        ).toBe(true);
        expect(
            queryClient.getQueryState(["task", "1", 501])?.isInvalidated,
        ).toBe(true);
    });

    it("COMMENT_CREATED 이벤트를 받으면 업무 상세(댓글 포함)를 갱신한다", () => {
        const { queryClient } = renderProvider();
        queryClient.getQueryCache().clear();
        queryClient.setQueryData(["task", "1", 501], { success: true, data: {} });

        act(() => {
            mockSubscriptions.get("/topic/workspaces/1")?.({
                body: JSON.stringify({
                    eventType: "COMMENT_CREATED",
                    workspaceId: 1,
                    taskId: 501,
                    commentId: 88,
                    authorId: 10,
                    content: "댓글 내용",
                    createdAt: "2026-08-18T11:00:00",
                }),
            });
        });

        expect(
            queryClient.getQueryState(["task", "1", 501])?.isInvalidated,
        ).toBe(true);
    });

    it("파싱할 수 없는 메시지는 무시한다", () => {
        renderProvider();

        expect(() => {
            act(() => {
                mockSubscriptions.get("/topic/workspaces/1")?.({ body: "not-json" });
            });
        }).not.toThrow();
    });

    it("언마운트되면 STOMP 연결을 해제한다", () => {
        const queryClient = new QueryClient();

        const { unmount } = render(
            <QueryClientProvider client={queryClient}>
                <WorkspaceRealtimeProvider apiBaseUrl="http://localhost" workspaceId="1" />
            </QueryClientProvider>,
        );

        expect(() => unmount()).not.toThrow();
    });
});
