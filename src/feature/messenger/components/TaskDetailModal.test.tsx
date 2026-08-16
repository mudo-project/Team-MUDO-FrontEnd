import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import {
    completeTaskCardAction,
    createTaskCardAction,
    deleteTaskCardAction,
    getChatRoomMembersAction,
    getCurrentUserIdAction,
    updateTaskCardAction,
} from "../actions";
import TaskDetailModal from "./TaskDetailModal";

jest.mock("sonner", () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

jest.mock("../actions", () => ({
    completeTaskCardAction: jest.fn(),
    createTaskCardAction: jest.fn(),
    deleteTaskCardAction: jest.fn(),
    getChatRoomMembersAction: jest.fn(),
    getCurrentUserIdAction: jest.fn(),
    updateTaskCardAction: jest.fn(),
}));

const mockedCompleteTaskCardAction = completeTaskCardAction as jest.MockedFunction<typeof completeTaskCardAction>;
const mockedDeleteTaskCardAction = deleteTaskCardAction as jest.MockedFunction<typeof deleteTaskCardAction>;
const mockedGetChatRoomMembersAction = getChatRoomMembersAction as jest.MockedFunction<typeof getChatRoomMembersAction>;
const mockedGetCurrentUserIdAction = getCurrentUserIdAction as jest.MockedFunction<typeof getCurrentUserIdAction>;

beforeEach(() => {
    mockedGetChatRoomMembersAction.mockResolvedValue([]);
    mockedGetCurrentUserIdAction.mockResolvedValue(1);
});

afterEach(() => {
    jest.clearAllMocks();
});

const buildCard = (overrides: Partial<MessengerTaskCardItemData>): MessengerTaskCardItemData => ({
    id: 1,
    assignerId: 1,
    assignerName: "로그인 사용자",
    content: "보강 교실 변경 안내 부탁드립니다",
    dueDate: "2026-08-20",
    assignees: [{ userId: 1, name: "로그인 사용자", completedAt: null }],
    completedCount: 0,
    assigneeCount: 1,
    fullyCompleted: false,
    createdAt: "2026-08-01T00:00:00",
    ...overrides,
});

describe("TaskDetailModal", () => {
    it("로그인 사용자가 등록자가 아니면 수정/삭제 버튼을 노출하지 않는다", () => {
        render(
            <TaskDetailModal
                card={buildCard({ assignerId: 999, assignees: [] })}
                currentUserId={1}
                roomId={1}
                onClose={jest.fn()}
                onTaskCardsChange={jest.fn()}
            />
        );

        expect(screen.queryByRole("button", { name: "수정" })).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "삭제" })).not.toBeInTheDocument();
    });

    it("로그인 사용자가 등록자면 수정/삭제 버튼을 노출한다", () => {
        render(
            <TaskDetailModal
                card={buildCard({ assignerId: 1 })}
                currentUserId={1}
                roomId={1}
                onClose={jest.fn()}
                onTaskCardsChange={jest.fn()}
            />
        );

        expect(screen.getByRole("button", { name: "수정" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "삭제" })).toBeInTheDocument();
    });

    it("미완료 담당자 본인이면 완료 처리 버튼을 노출하고, 클릭 시 완료 액션을 호출한다", async () => {
        mockedCompleteTaskCardAction.mockResolvedValue({ success: true, message: "업무를 완료 처리했습니다." });
        const onClose = jest.fn();
        const onTaskCardsChange = jest.fn();
        render(
            <TaskDetailModal
                card={buildCard({ assignerId: 999, assignees: [{ userId: 1, name: "로그인 사용자", completedAt: null }] })}
                currentUserId={1}
                roomId={5}
                onClose={onClose}
                onTaskCardsChange={onTaskCardsChange}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "완료 처리" }));

        await waitFor(() => {
            expect(completeTaskCardAction).toHaveBeenCalledWith(5, 1);
        });
        expect(onTaskCardsChange).toHaveBeenCalled();
        expect(onClose).toHaveBeenCalled();
    });

    it("이미 완료한 담당자면 완료 처리 버튼을 노출하지 않는다", () => {
        render(
            <TaskDetailModal
                card={buildCard({ assignees: [{ userId: 1, name: "로그인 사용자", completedAt: "2026-08-02T00:00:00" }] })}
                currentUserId={1}
                roomId={1}
                onClose={jest.fn()}
                onTaskCardsChange={jest.fn()}
            />
        );

        expect(screen.queryByRole("button", { name: "완료 처리" })).not.toBeInTheDocument();
    });

    it("삭제 버튼 클릭 후 확인하면 삭제 액션을 호출하고 모달을 닫는다", async () => {
        mockedDeleteTaskCardAction.mockResolvedValue({ success: true, message: "업무지시가 삭제되었습니다." });
        const onClose = jest.fn();
        const onTaskCardsChange = jest.fn();
        render(
            <TaskDetailModal
                card={buildCard({ assignerId: 1 })}
                currentUserId={1}
                roomId={5}
                onClose={onClose}
                onTaskCardsChange={onTaskCardsChange}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "삭제" }));
        fireEvent.click(screen.getByRole("button", { name: "확인" }));

        await waitFor(() => {
            expect(deleteTaskCardAction).toHaveBeenCalledWith(5, 1);
        });
        expect(toast.success).toHaveBeenCalledWith("업무지시가 삭제되었습니다.");
        expect(onTaskCardsChange).toHaveBeenCalled();
        expect(onClose).toHaveBeenCalled();
    });

    it("삭제에 실패하면 에러 토스트를 노출하고 모달을 유지한다", async () => {
        mockedDeleteTaskCardAction.mockResolvedValue({ success: false, message: "업무지시 삭제에 실패하였습니다." });
        const onClose = jest.fn();
        render(
            <TaskDetailModal
                card={buildCard({ assignerId: 1 })}
                currentUserId={1}
                roomId={5}
                onClose={onClose}
                onTaskCardsChange={jest.fn()}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "삭제" }));
        fireEvent.click(screen.getByRole("button", { name: "확인" }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("업무지시 삭제에 실패하였습니다.");
        });
        expect(onClose).not.toHaveBeenCalled();
    });

    it("수정 버튼을 클릭하면 업무지시 수정 모달로 전환된다", async () => {
        render(
            <TaskDetailModal
                card={buildCard({ assignerId: 1 })}
                currentUserId={1}
                roomId={1}
                onClose={jest.fn()}
                onTaskCardsChange={jest.fn()}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "수정" }));

        expect(await screen.findByRole("heading", { name: "업무지시 수정" })).toBeInTheDocument();
    });
});
