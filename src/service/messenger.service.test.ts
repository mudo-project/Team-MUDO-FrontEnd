import { fetchWithAuth } from "@/lib/fetch";
import {
    completeTaskCard,
    createChatRoom,
    createTaskCard,
    deleteMessage,
    deleteTaskCard,
    getChatRoomMembers,
    getChatRooms,
    getMessages,
    getTaskCards,
    searchUsers,
    sendMessage,
    updateMessage,
    updateTaskCard,
} from "./messenger.service";

jest.mock("../lib/fetch");

const mockedFetch = fetchWithAuth as jest.Mock;

const okJsonResponse = (data: unknown) => ({
    ok: true,
    json: () => Promise.resolve(data),
});

const failJsonResponse = (message: string) => ({
    ok: false,
    headers: { get: () => "application/json" },
    json: () => Promise.resolve({ message }),
});

const member: MessengerRoomMemberData = { userId: 1, name: "김지수", lastReadAt: null };

const messageItem: MessengerMessageItemData = {
    id: 1,
    senderId: 1,
    senderName: "김지수",
    messageType: "TEXT",
    content: "안녕하세요",
    fileId: null,
    fileDownloadUrl: null,
    fileName: null,
    createdAt: "2026-08-01T09:00:00",
    editedAt: null,
    deletedAt: null,
    deleted: false,
    unreadCount: 0,
};

const taskCardItem: MessengerTaskCardItemData = {
    id: 1,
    assignerId: 1,
    assignerName: "김지수",
    content: "보강 안내",
    dueDate: null,
    assignees: [],
    completedCount: 0,
    assigneeCount: 0,
    fullyCompleted: false,
    createdAt: "2026-08-01T09:00:00",
};

describe("createChatRoom", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 생성된 채팅방 아이디를 반환한다", async () => {
        mockedFetch.mockResolvedValue(okJsonResponse({ data: { chatRoomId: 5 } }));

        const payload = { participantIds: [1, 2], name: "1반 공지방" };
        const result = await createChatRoom(payload);

        expect(mockedFetch).toHaveBeenCalledWith("/api/messenger/rooms", {
            method: "POST",
            body: JSON.stringify(payload),
        });
        expect(result).toBe(5);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("채팅방 생성에 실패하였습니다."));

        await expect(createChatRoom({ participantIds: [1] })).rejects.toThrow("채팅방 생성에 실패하였습니다.");
    });
});

describe("getChatRooms", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 채팅방 목록을 반환한다", async () => {
        const rooms: MessengerRoomListItemData[] = [
            { id: 1, name: "1반 공지방", type: "GROUP", unreadCount: 0, lastMessagePreview: null, lastMessageAt: null, createdAt: "2026-08-01" },
        ];
        mockedFetch.mockResolvedValue(okJsonResponse({ data: rooms }));

        const result = await getChatRooms();

        expect(mockedFetch).toHaveBeenCalledWith("/api/messenger/rooms");
        expect(result).toEqual(rooms);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("채팅방 목록 조회에 실패하였습니다."));

        await expect(getChatRooms()).rejects.toThrow("채팅방 목록 조회에 실패하였습니다.");
    });
});

describe("getChatRoomMembers", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 참여자 목록을 반환한다", async () => {
        mockedFetch.mockResolvedValue(okJsonResponse({ data: [member] }));

        const result = await getChatRoomMembers(1);

        expect(mockedFetch).toHaveBeenCalledWith("/api/messenger/rooms/1/members");
        expect(result).toEqual([member]);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("채팅방 참여자 조회에 실패하였습니다."));

        await expect(getChatRoomMembers(1)).rejects.toThrow("채팅방 참여자 조회에 실패하였습니다.");
    });
});

describe("getMessages", () => {
    afterEach(() => jest.clearAllMocks());

    it("파라미터가 없으면 쿼리스트링 없이 요청한다", async () => {
        const data = { content: [messageItem], hasNext: false, nextCursorCreatedAt: null, nextCursorMessageId: null };
        mockedFetch.mockResolvedValue(okJsonResponse({ data }));

        const result = await getMessages(1);

        expect(mockedFetch).toHaveBeenCalledWith("/api/messenger/rooms/1/messages");
        expect(result).toEqual(data);
    });

    it("파라미터가 있으면 쿼리스트링을 포함해 요청한다", async () => {
        const data = { content: [], hasNext: false, nextCursorCreatedAt: null, nextCursorMessageId: null };
        mockedFetch.mockResolvedValue(okJsonResponse({ data }));

        await getMessages(1, { cursorCreatedAt: "2026-08-01T00:00:00", cursorMessageId: 3, size: 20 });

        expect(mockedFetch).toHaveBeenCalledWith(
            "/api/messenger/rooms/1/messages?cursorCreatedAt=2026-08-01T00%3A00%3A00&cursorMessageId=3&size=20"
        );
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("메시지 목록 조회에 실패하였습니다."));

        await expect(getMessages(1)).rejects.toThrow("메시지 목록 조회에 실패하였습니다.");
    });
});

describe("sendMessage", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 생성된 메시지 아이디를 반환한다", async () => {
        mockedFetch.mockResolvedValue(okJsonResponse({ data: { messageId: 7 } }));

        const payload = { messageType: "TEXT" as const, content: "안녕하세요" };
        const result = await sendMessage(1, payload);

        expect(mockedFetch).toHaveBeenCalledWith("/api/messenger/rooms/1/messages", {
            method: "POST",
            body: JSON.stringify(payload),
        });
        expect(result).toBe(7);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("메시지 전송에 실패하였습니다."));

        await expect(sendMessage(1, { messageType: "TEXT", content: "내용" })).rejects.toThrow(
            "메시지 전송에 실패하였습니다."
        );
    });
});

describe("updateMessage", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 예외 없이 완료된다", async () => {
        mockedFetch.mockResolvedValue({ ok: true });

        await expect(updateMessage(1, 2, { content: "수정된 내용" })).resolves.toBeUndefined();
        expect(mockedFetch).toHaveBeenCalledWith("/api/messenger/rooms/1/messages/2", {
            method: "PATCH",
            body: JSON.stringify({ content: "수정된 내용" }),
        });
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("메시지 수정에 실패하였습니다."));

        await expect(updateMessage(1, 2, { content: "내용" })).rejects.toThrow("메시지 수정에 실패하였습니다.");
    });
});

describe("deleteMessage", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 예외 없이 완료된다", async () => {
        mockedFetch.mockResolvedValue({ ok: true });

        await expect(deleteMessage(1, 2)).resolves.toBeUndefined();
        expect(mockedFetch).toHaveBeenCalledWith("/api/messenger/rooms/1/messages/2", { method: "DELETE" });
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("메시지 삭제에 실패하였습니다."));

        await expect(deleteMessage(1, 2)).rejects.toThrow("메시지 삭제에 실패하였습니다.");
    });
});

describe("getTaskCards", () => {
    afterEach(() => jest.clearAllMocks());

    it("파라미터가 없으면 쿼리스트링 없이 요청한다", async () => {
        const data = { content: [taskCardItem], hasNext: false, nextCursorCreatedAt: null, nextCursorCardId: null };
        mockedFetch.mockResolvedValue(okJsonResponse({ data }));

        const result = await getTaskCards(1);

        expect(mockedFetch).toHaveBeenCalledWith("/api/messenger/rooms/1/task-cards");
        expect(result).toEqual(data);
    });

    it("파라미터가 있으면 쿼리스트링을 포함해 요청한다", async () => {
        const data = { content: [], hasNext: false, nextCursorCreatedAt: null, nextCursorCardId: null };
        mockedFetch.mockResolvedValue(okJsonResponse({ data }));

        await getTaskCards(1, { cursorCardId: 4, size: 10 });

        expect(mockedFetch).toHaveBeenCalledWith("/api/messenger/rooms/1/task-cards?cursorCardId=4&size=10");
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("업무카드 목록 조회에 실패하였습니다."));

        await expect(getTaskCards(1)).rejects.toThrow("업무카드 목록 조회에 실패하였습니다.");
    });
});

describe("createTaskCard", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 생성된 카드 아이디를 반환한다", async () => {
        mockedFetch.mockResolvedValue(okJsonResponse({ data: { cardId: 9 } }));

        const payload = { content: "보강 안내", assigneeIds: [1, 2] };
        const result = await createTaskCard(1, payload);

        expect(mockedFetch).toHaveBeenCalledWith("/api/messenger/rooms/1/task-cards", {
            method: "POST",
            body: JSON.stringify(payload),
        });
        expect(result).toBe(9);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("업무카드 등록에 실패하였습니다."));

        await expect(createTaskCard(1, { content: "내용", assigneeIds: [1] })).rejects.toThrow(
            "업무카드 등록에 실패하였습니다."
        );
    });
});

describe("updateTaskCard", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 예외 없이 완료된다", async () => {
        mockedFetch.mockResolvedValue({ ok: true });

        const payload = { content: "수정 내용", assigneeIds: [1] };
        await expect(updateTaskCard(1, 2, payload)).resolves.toBeUndefined();
        expect(mockedFetch).toHaveBeenCalledWith("/api/messenger/rooms/1/task-cards/2", {
            method: "PATCH",
            body: JSON.stringify(payload),
        });
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("업무카드 수정에 실패하였습니다."));

        await expect(updateTaskCard(1, 2, { content: "내용", assigneeIds: [1] })).rejects.toThrow(
            "업무카드 수정에 실패하였습니다."
        );
    });
});

describe("deleteTaskCard", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 예외 없이 완료된다", async () => {
        mockedFetch.mockResolvedValue({ ok: true });

        await expect(deleteTaskCard(1, 2)).resolves.toBeUndefined();
        expect(mockedFetch).toHaveBeenCalledWith("/api/messenger/rooms/1/task-cards/2", { method: "DELETE" });
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("업무카드 삭제에 실패하였습니다."));

        await expect(deleteTaskCard(1, 2)).rejects.toThrow("업무카드 삭제에 실패하였습니다.");
    });
});

describe("searchUsers", () => {
    afterEach(() => jest.clearAllMocks());

    it("키워드가 없으면 쿼리스트링 없이 요청한다", async () => {
        const users: MessengerUserSearchItemData[] = [{ userId: 1, name: "김지수", username: "jisu" }];
        mockedFetch.mockResolvedValue(okJsonResponse({ data: users }));

        const result = await searchUsers();

        expect(mockedFetch).toHaveBeenCalledWith("/api/users");
        expect(result).toEqual(users);
    });

    it("키워드가 있으면 쿼리스트링을 포함해 요청한다", async () => {
        mockedFetch.mockResolvedValue(okJsonResponse({ data: [] }));

        await searchUsers("지수");

        expect(mockedFetch).toHaveBeenCalledWith("/api/users?keyword=%EC%A7%80%EC%88%98");
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("사용자 검색에 실패하였습니다."));

        await expect(searchUsers()).rejects.toThrow("사용자 검색에 실패하였습니다.");
    });
});

describe("completeTaskCard", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 예외 없이 완료된다", async () => {
        mockedFetch.mockResolvedValue({ ok: true });

        await expect(completeTaskCard(1, 2)).resolves.toBeUndefined();
        expect(mockedFetch).toHaveBeenCalledWith("/api/messenger/rooms/1/task-cards/2/complete", { method: "PATCH" });
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("업무카드 완료 처리에 실패하였습니다."));

        await expect(completeTaskCard(1, 2)).rejects.toThrow("업무카드 완료 처리에 실패하였습니다.");
    });
});
