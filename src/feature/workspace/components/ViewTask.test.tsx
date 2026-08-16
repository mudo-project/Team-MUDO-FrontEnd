import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
    changeWorkspaceTaskAction,
    getWorkspaceTaskCommentListAction,
    getWorkspaceTaskDetailAction,
} from "../actions";
import ViewTask from "./ViewTask";
import { toast } from "sonner";

jest.mock("../actions", () => ({
    changeWorkspaceTaskAction: jest.fn(),
    getWorkspaceTaskCommentListAction: jest.fn(),
    getWorkspaceTaskDetailAction: jest.fn(),
}));

jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

jest.mock("./CommentBar", () => function MockCommentBar() {
    return <div data-testid="mock-comment-bar" />;
});

jest.mock("./TaskComment", () => function MockTaskComment({ comment }: { comment: { commentId: number } }) {
    return <div data-testid={`mock-task-comment-${comment.commentId}`} />;
});

jest.mock("./TaskDeleteButton", () => function MockTaskDeleteButton() {
    return <button type="button">업무 삭제</button>;
});

const mockedGetWorkspaceTaskDetailAction = getWorkspaceTaskDetailAction as jest.MockedFunction<
    typeof getWorkspaceTaskDetailAction
>;
const mockedGetWorkspaceTaskCommentListAction = getWorkspaceTaskCommentListAction as jest.MockedFunction<
    typeof getWorkspaceTaskCommentListAction
>;
const mockedChangeWorkspaceTaskAction = changeWorkspaceTaskAction as jest.MockedFunction<
    typeof changeWorkspaceTaskAction
>;

const taskDetail = {
    taskId: 1,
    title: "발표 자료 준비",
    creator: { userId: 1, name: "홍길동" },
    createdAt: "2026-08-16",
    status: "WAITING" as const,
    dueAt: "2026-08-20",
};

const renderViewTask = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });

    render(
        <QueryClientProvider client={queryClient}>
            <ViewTask
                selectedTask={1}
                setSelectedTask={jest.fn()}
                workspaceId="1"
                workspaceMembers={[]}
            />
        </QueryClientProvider>,
    );

    return { queryClient };
};

describe("ViewTask", () => {
    beforeEach(() => {
        mockedGetWorkspaceTaskCommentListAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: { content: [], page: 0, size: 20, hasNext: false },
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("조회한 업무 상세 정보를 표시한다", async () => {
        mockedGetWorkspaceTaskDetailAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: taskDetail,
        });

        renderViewTask();

        expect(await screen.findByText("발표 자료 준비")).toBeInTheDocument();
        expect(screen.getByText(/홍길동/)).toBeInTheDocument();
    });

    it("업무 조회에 실패하면 에러 메시지를 표시한다", async () => {
        mockedGetWorkspaceTaskDetailAction.mockResolvedValue({
            success: false,
            message: "업무 상세 조회에 실패했습니다.",
        });

        renderViewTask();

        expect(
            await screen.findByText("업무 상세 조회에 실패했습니다."),
        ).toHaveAttribute("role", "alert");
    });

    it("댓글이 있으면 댓글 개수를 표시한다", async () => {
        mockedGetWorkspaceTaskDetailAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: taskDetail,
        });
        mockedGetWorkspaceTaskCommentListAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: {
                content: [
                    {
                        commentId: 1,
                        content: "댓글1",
                        author: { userId: 1, name: "홍길동" },
                        completed: true,
                        createdAt: "2026-08-16",
                    },
                    {
                        commentId: 2,
                        content: "댓글2",
                        author: { userId: 2, name: "김철수" },
                        completed: false,
                        createdAt: "2026-08-16",
                    },
                ],
                page: 0,
                size: 20,
                hasNext: false,
            },
        });

        renderViewTask();

        expect(await screen.findByText("1/2 완료")).toBeInTheDocument();
        expect(screen.getByTestId("mock-task-comment-1")).toBeInTheDocument();
        expect(screen.getByTestId("mock-task-comment-2")).toBeInTheDocument();
    });

    it("상태를 변경하면 changeWorkspaceTaskAction이 호출되고 성공 토스트를 표시한다", async () => {
        mockedGetWorkspaceTaskDetailAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: taskDetail,
        });
        mockedChangeWorkspaceTaskAction.mockResolvedValue({
            success: true,
            message: "업무 상태를 변경했습니다.",
            data: { taskId: 1, status: "IN_PROGRESS", dueAt: "2026-08-20" },
        });

        renderViewTask();

        const select = await screen.findByDisplayValue("대기");
        fireEvent.change(select, { target: { value: "IN_PROGRESS" } });

        await waitFor(() => {
            expect(mockedChangeWorkspaceTaskAction).toHaveBeenCalledWith(1, 1, {
                status: "IN_PROGRESS",
            });
        });
        expect(toast.success).toHaveBeenCalledWith("업무 상태를 변경했습니다.");
    });
});
