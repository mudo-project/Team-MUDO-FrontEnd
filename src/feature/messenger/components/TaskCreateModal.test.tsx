import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import {
    createTaskCardAction,
    getChatRoomMembersAction,
    getCurrentUserIdAction,
    updateTaskCardAction,
} from "../actions";
import TaskCreateModal from "./TaskCreateModal";

jest.mock("sonner", () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

jest.mock("../actions", () => ({
    createTaskCardAction: jest.fn(),
    getChatRoomMembersAction: jest.fn(),
    getCurrentUserIdAction: jest.fn(),
    updateTaskCardAction: jest.fn(),
}));

const mockedGetChatRoomMembersAction = getChatRoomMembersAction as jest.MockedFunction<typeof getChatRoomMembersAction>;
const mockedGetCurrentUserIdAction = getCurrentUserIdAction as jest.MockedFunction<typeof getCurrentUserIdAction>;
const mockedCreateTaskCardAction = createTaskCardAction as jest.MockedFunction<typeof createTaskCardAction>;
const mockedUpdateTaskCardAction = updateTaskCardAction as jest.MockedFunction<typeof updateTaskCardAction>;

const members: MessengerRoomMemberData[] = [
    { userId: 1, name: "로그인 사용자", lastReadAt: null },
    { userId: 2, name: "김지수", lastReadAt: null },
    { userId: 3, name: "박민준", lastReadAt: null },
];

describe("TaskCreateModal", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("담당자 후보 목록에서 로그인 사용자 본인은 제외한다", async () => {
        mockedGetChatRoomMembersAction.mockResolvedValue(members);
        mockedGetCurrentUserIdAction.mockResolvedValue(1);
        render(<TaskCreateModal roomId={1} onClose={jest.fn()} onCreated={jest.fn()} />);

        fireEvent.click(screen.getByRole("button", { name: "추가" }));

        expect(await screen.findByText("김지수")).toBeInTheDocument();
        expect(screen.queryByText("로그인 사용자")).not.toBeInTheDocument();
    });

    it("담당자를 선택하면 칩으로 추가되고 드롭다운이 닫힌다", async () => {
        mockedGetChatRoomMembersAction.mockResolvedValue(members);
        mockedGetCurrentUserIdAction.mockResolvedValue(1);
        render(<TaskCreateModal roomId={1} onClose={jest.fn()} onCreated={jest.fn()} />);

        fireEvent.click(screen.getByRole("button", { name: "추가" }));
        fireEvent.click(await screen.findByText("김지수"));

        expect(screen.getByRole("button", { name: "김지수 담당자 제거" })).toBeInTheDocument();
        expect(screen.queryByText("박민준")).not.toBeInTheDocument();
    });

    it("담당자 칩의 제거 버튼을 클릭하면 담당자에서 제외된다", async () => {
        mockedGetChatRoomMembersAction.mockResolvedValue(members);
        mockedGetCurrentUserIdAction.mockResolvedValue(1);
        render(<TaskCreateModal roomId={1} onClose={jest.fn()} onCreated={jest.fn()} />);

        fireEvent.click(screen.getByRole("button", { name: "추가" }));
        fireEvent.click(await screen.findByText("김지수"));
        fireEvent.click(screen.getByRole("button", { name: "김지수 담당자 제거" }));

        expect(screen.queryByRole("button", { name: "김지수 담당자 제거" })).not.toBeInTheDocument();
    });

    it("필수값을 입력하고 등록하면 등록 액션을 호출한다", async () => {
        mockedGetChatRoomMembersAction.mockResolvedValue(members);
        mockedGetCurrentUserIdAction.mockResolvedValue(1);
        mockedCreateTaskCardAction.mockResolvedValue({ success: true, message: "업무지시가 등록되었습니다.", cardId: 5 });
        const onClose = jest.fn();
        const onCreated = jest.fn();
        render(<TaskCreateModal roomId={1} onClose={onClose} onCreated={onCreated} />);

        fireEvent.change(screen.getByLabelText("내용"), { target: { value: "보강 안내 부탁드립니다" } });
        fireEvent.click(screen.getByRole("button", { name: "추가" }));
        fireEvent.click(await screen.findByText("김지수"));
        fireEvent.click(screen.getByRole("button", { name: "등록" }));

        await waitFor(() => {
            expect(createTaskCardAction).toHaveBeenCalledWith(1, "보강 안내 부탁드립니다", [2], undefined);
        });
        expect(toast.success).toHaveBeenCalledWith("업무지시가 등록되었습니다.");
        expect(onCreated).toHaveBeenCalled();
        expect(onClose).toHaveBeenCalled();
    });

    it("editingCard가 있으면 수정 모드로 값이 채워지고 수정 액션을 호출한다", async () => {
        mockedGetChatRoomMembersAction.mockResolvedValue(members);
        mockedGetCurrentUserIdAction.mockResolvedValue(1);
        mockedUpdateTaskCardAction.mockResolvedValue({ success: true, message: "업무지시가 수정되었습니다." });
        const editingCard: MessengerTaskCardItemData = {
            id: 7,
            assignerId: 1,
            assignerName: "로그인 사용자",
            content: "기존 내용",
            dueDate: "2026-08-20",
            assignees: [{ userId: 2, name: "김지수", completedAt: null }],
            completedCount: 0,
            assigneeCount: 1,
            fullyCompleted: false,
            createdAt: "2026-08-01T00:00:00",
        };
        render(<TaskCreateModal roomId={1} onClose={jest.fn()} onCreated={jest.fn()} editingCard={editingCard} />);

        expect(await screen.findByRole("heading", { name: "업무지시 수정" })).toBeInTheDocument();
        expect(screen.getByDisplayValue("기존 내용")).toBeInTheDocument();
        expect(await screen.findByRole("button", { name: "김지수 담당자 제거" })).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "수정 완료" }));

        await waitFor(() => {
            expect(updateTaskCardAction).toHaveBeenCalledWith(1, 7, "기존 내용", [2], "2026-08-20");
        });
        expect(toast.success).toHaveBeenCalledWith("업무지시가 수정되었습니다.");
    });

    it("등록에 실패하면 에러 토스트를 노출하고 모달을 유지한다", async () => {
        mockedGetChatRoomMembersAction.mockResolvedValue(members);
        mockedGetCurrentUserIdAction.mockResolvedValue(1);
        mockedCreateTaskCardAction.mockResolvedValue({ success: false, message: "담당자를 1명 이상 선택해주세요." });
        const onClose = jest.fn();
        render(<TaskCreateModal roomId={1} onClose={onClose} onCreated={jest.fn()} />);

        fireEvent.change(screen.getByLabelText("내용"), { target: { value: "보강 안내 부탁드립니다" } });
        fireEvent.click(screen.getByRole("button", { name: "등록" }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("담당자를 1명 이상 선택해주세요.");
        });
        expect(onClose).not.toHaveBeenCalled();
    });
});
