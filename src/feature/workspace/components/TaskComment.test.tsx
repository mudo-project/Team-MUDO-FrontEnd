import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { toggleWorkspaceTaskCommentCompleteAction } from "../actions";
import TaskComment from "./TaskComment";
import { toast } from "sonner";
import { WorkspaceTaskCommentListItemData } from "../type";

jest.mock("../actions", () => ({
    toggleWorkspaceTaskCommentCompleteAction: jest.fn(),
    deleteWorkspaceTaskCommentAction: jest.fn(),
}));

jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

const mockedToggle = toggleWorkspaceTaskCommentCompleteAction as jest.MockedFunction<
    typeof toggleWorkspaceTaskCommentCompleteAction
>;

const buildComment = (
    overrides: Partial<WorkspaceTaskCommentListItemData> = {},
): WorkspaceTaskCommentListItemData => ({
    commentId: 1,
    content: "일반 댓글 내용입니다",
    author: { userId: 1, name: "홍길동" },
    completed: false,
    createdAt: "2026-08-16",
    ...overrides,
});

const renderComment = (comment = buildComment()) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });

    queryClient.setQueryData(["workspace", "1"], {
        success: true,
        message: "조회했습니다.",
        data: { workspaceId: 1 },
    });
    queryClient.setQueryData(["task", "1", 1], {
        success: true,
        message: "조회했습니다.",
        data: { taskId: 1 },
    });

    render(
        <QueryClientProvider client={queryClient}>
            <TaskComment comment={comment} taskId={1} workspaceId="1" />
        </QueryClientProvider>,
    );

    return { queryClient };
};

describe("TaskComment", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("댓글 내용과 작성자 정보를 표시한다", () => {
        renderComment(buildComment({ content: "확인 부탁드립니다", author: { userId: 2, name: "김철수" } }));

        expect(screen.getByText("확인 부탁드립니다")).toBeInTheDocument();
        expect(screen.getByText(/김철수/)).toBeInTheDocument();
    });

    it("@멘션이 포함된 내용은 강조 표시한다", () => {
        renderComment(buildComment({ content: "@김철수 확인해주세요" }));

        expect(screen.getByText("@김철수")).toBeInTheDocument();
    });

    it("완료 체크박스를 클릭하면 완료 처리 후 관련 캐시를 갱신한다", async () => {
        mockedToggle.mockResolvedValue({
            success: true,
            message: "완료 처리했습니다.",
            data: {
                commentId: 1,
                taskId: 1,
                authorId: 1,
                content: "일반 댓글 내용입니다",
                completed: true,
                completedBy: 1,
                completedAt: "2026-08-16",
                mentionedUserIds: [],
                createdAt: "2026-08-16",
                updatedAt: "2026-08-16",
            },
        });
        const { queryClient } = renderComment();

        fireEvent.click(screen.getByRole("checkbox"));

        await waitFor(() => {
            expect(mockedToggle).toHaveBeenCalledWith(1, 1, 1);
        });
        expect(toast.success).toHaveBeenCalledWith("완료 처리했습니다.");
        expect(
            queryClient.getQueryState(["task", "1", 1])?.isInvalidated,
        ).toBe(true);
    });

    it("완료 처리에 실패하면 에러 메시지를 표시한다", async () => {
        mockedToggle.mockResolvedValue({
            success: false,
            message: "완료 처리에 실패했습니다.",
        });
        renderComment();

        fireEvent.click(screen.getByRole("checkbox"));

        expect(
            await screen.findByText("완료 처리에 실패했습니다."),
        ).toBeInTheDocument();
    });

    it("메뉴 버튼을 클릭하면 수정/삭제 메뉴가 열린다", () => {
        renderComment();

        fireEvent.click(screen.getByLabelText("댓글 메뉴 열기"));

        expect(screen.getByText("수정")).toBeInTheDocument();
        expect(screen.getByText("삭제")).toBeInTheDocument();
    });
});
