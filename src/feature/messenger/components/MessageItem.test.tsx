import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { deleteMessageAction, updateMessageAction } from "../actions";
import { FeedItem } from "../utils";
import MessageItem from "./MessageItem";

jest.mock("../actions", () => ({
    completeTaskCardAction: jest.fn(),
    deleteMessageAction: jest.fn(),
    deleteTaskCardAction: jest.fn(),
    updateMessageAction: jest.fn(),
}));

const mockedDeleteMessageAction = deleteMessageAction as jest.MockedFunction<typeof deleteMessageAction>;
const mockedUpdateMessageAction = updateMessageAction as jest.MockedFunction<typeof updateMessageAction>;

const buildTextItem = (overrides: Partial<Extract<FeedItem, { kind: "text" }>>): FeedItem => ({
    kind: "text",
    id: 1,
    senderId: 1,
    senderName: "로그인 사용자",
    content: "안녕하세요",
    fileId: null,
    fileDownloadUrl: null,
    fileName: null,
    messageType: "TEXT",
    createdAt: "2026-08-01T09:00:00",
    editedAt: null,
    deleted: false,
    unreadCount: 0,
    own: true,
    ...overrides,
});

describe("MessageItem", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("삭제된 메시지는 삭제 안내 문구를 노출한다", () => {
        render(
            <MessageItem
                item={buildTextItem({ deleted: true })}
                currentUserId={1}
                roomId={1}
                onMessagesChange={jest.fn()}
                onTaskCardsChange={jest.fn()}
            />
        );

        expect(screen.getByText("삭제된 채팅입니다")).toBeInTheDocument();
    });

    it("상대방 메시지는 발신자 이름과 안읽음 수를 노출한다", () => {
        render(
            <MessageItem
                item={buildTextItem({ own: false, senderName: "김지수", unreadCount: 2 })}
                currentUserId={1}
                roomId={1}
                onMessagesChange={jest.fn()}
                onTaskCardsChange={jest.fn()}
            />
        );

        expect(screen.getByText("김지수")).toBeInTheDocument();
        expect(screen.getByText("· 안읽음 2")).toBeInTheDocument();
    });

    it("업무지시 항목은 업무지시 카드로 위임되어 렌더링된다", () => {
        const item: FeedItem = {
            kind: "task",
            id: 1,
            createdAt: "2026-08-01T09:00:00",
            own: true,
            card: {
                id: 1,
                assignerId: 1,
                assignerName: "로그인 사용자",
                content: "업무지시 내용",
                dueDate: null,
                assignees: [],
                completedCount: 0,
                assigneeCount: 0,
                fullyCompleted: false,
                createdAt: "2026-08-01T09:00:00",
            },
        };
        render(
            <MessageItem item={item} currentUserId={1} roomId={1} onMessagesChange={jest.fn()} onTaskCardsChange={jest.fn()} />
        );

        expect(screen.getByText("업무지시 내용")).toBeInTheDocument();
    });

    it("내 메시지를 우클릭하면 메뉴가 열리고, TEXT 메시지는 수정 항목을 노출한다", () => {
        render(
            <MessageItem
                item={buildTextItem({})}
                currentUserId={1}
                roomId={1}
                onMessagesChange={jest.fn()}
                onTaskCardsChange={jest.fn()}
            />
        );

        fireEvent.contextMenu(screen.getByText("안녕하세요"));

        expect(screen.getByRole("button", { name: "수정" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "삭제" })).toBeInTheDocument();
    });

    it("IMAGE 메시지는 메뉴에 수정 항목을 노출하지 않는다", () => {
        render(
            <MessageItem
                item={buildTextItem({ messageType: "IMAGE", content: null, fileDownloadUrl: "https://example.com/a.png" })}
                currentUserId={1}
                roomId={1}
                onMessagesChange={jest.fn()}
                onTaskCardsChange={jest.fn()}
            />
        );

        fireEvent.contextMenu(screen.getByRole("link"));

        expect(screen.queryByRole("button", { name: "수정" })).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: "삭제" })).toBeInTheDocument();
    });

    it("수정을 선택해 내용을 저장하면 수정 액션을 호출한다", async () => {
        mockedUpdateMessageAction.mockResolvedValue({ success: true, message: "메시지를 수정했습니다." });
        const onMessagesChange = jest.fn();
        render(
            <MessageItem
                item={buildTextItem({ id: 3 })}
                currentUserId={1}
                roomId={7}
                onMessagesChange={onMessagesChange}
                onTaskCardsChange={jest.fn()}
            />
        );

        fireEvent.contextMenu(screen.getByText("안녕하세요"));
        fireEvent.click(screen.getByRole("button", { name: "수정" }));
        fireEvent.change(screen.getByRole("textbox"), { target: { value: "수정된 내용" } });
        fireEvent.click(screen.getByRole("button", { name: "저장" }));

        await waitFor(() => {
            expect(updateMessageAction).toHaveBeenCalledWith(7, 3, "수정된 내용");
        });
        expect(onMessagesChange).toHaveBeenCalled();
    });

    it("삭제를 선택하면 삭제 액션을 호출한다", async () => {
        mockedDeleteMessageAction.mockResolvedValue({ success: true, message: "메시지를 삭제했습니다." });
        const onMessagesChange = jest.fn();
        render(
            <MessageItem
                item={buildTextItem({ id: 4 })}
                currentUserId={1}
                roomId={8}
                onMessagesChange={onMessagesChange}
                onTaskCardsChange={jest.fn()}
            />
        );

        fireEvent.contextMenu(screen.getByText("안녕하세요"));
        fireEvent.click(screen.getByRole("button", { name: "삭제" }));

        await waitFor(() => {
            expect(deleteMessageAction).toHaveBeenCalledWith(8, 4);
        });
        expect(onMessagesChange).toHaveBeenCalled();
    });
});
