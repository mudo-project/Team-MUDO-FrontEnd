import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import {
    completeTaskCard,
    createChatRoom,
    createTaskCard,
    deleteMessage,
    deleteTaskCard,
    sendMessage,
    updateMessage,
    updateTaskCard,
} from "@/service/messenger.service";
import {
    completeTaskCardAction,
    createChatRoomAction,
    createTaskCardAction,
    deleteMessageAction,
    deleteTaskCardAction,
    getCurrentUserIdAction,
    sendFileMessageAction,
    sendMessageAction,
    updateMessageAction,
    updateTaskCardAction,
} from "./actions";

jest.mock("../../service/messenger.service");

jest.mock("next/headers", () => ({
    cookies: jest.fn(),
}));

jest.mock("jwt-decode", () => ({
    jwtDecode: jest.fn(),
}));

const mockedCookies = cookies as jest.Mock;
const mockedJwtDecode = jwtDecode as jest.Mock;

describe("getCurrentUserIdAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("accessToken 쿠키가 없으면 null을 반환한다", async () => {
        mockedCookies.mockResolvedValue({ get: () => undefined });

        const result = await getCurrentUserIdAction();

        expect(result).toBeNull();
        expect(jwtDecode).not.toHaveBeenCalled();
    });

    it("payload에 userId가 있으면 userId를 반환한다", async () => {
        mockedCookies.mockResolvedValue({ get: () => ({ value: "token" }) });
        mockedJwtDecode.mockReturnValue({ userId: 10, sub: 20 });

        const result = await getCurrentUserIdAction();

        expect(result).toBe(10);
    });

    it("payload에 userId가 없으면 sub를 반환한다", async () => {
        mockedCookies.mockResolvedValue({ get: () => ({ value: "token" }) });
        mockedJwtDecode.mockReturnValue({ sub: 20, id: 30 });

        const result = await getCurrentUserIdAction();

        expect(result).toBe(20);
    });

    it("payload에 userId, sub가 없으면 id를 반환한다", async () => {
        mockedCookies.mockResolvedValue({ get: () => ({ value: "token" }) });
        mockedJwtDecode.mockReturnValue({ id: 30 });

        const result = await getCurrentUserIdAction();

        expect(result).toBe(30);
    });

    it("숫자로 변환할 수 없는 claim이면 null을 반환한다", async () => {
        mockedCookies.mockResolvedValue({ get: () => ({ value: "token" }) });
        mockedJwtDecode.mockReturnValue({ userId: "abc" });

        const result = await getCurrentUserIdAction();

        expect(result).toBeNull();
    });

    it("토큰 디코딩에 실패하면 null을 반환한다", async () => {
        mockedCookies.mockResolvedValue({ get: () => ({ value: "invalid-token" }) });
        mockedJwtDecode.mockImplementation(() => {
            throw new Error("invalid token");
        });

        const result = await getCurrentUserIdAction();

        expect(result).toBeNull();
    });
});

describe("createChatRoomAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("참여자를 선택하지 않으면 service를 호출하지 않고 실패 결과를 반환한다", async () => {
        const result = await createChatRoomAction([]);

        expect(result).toEqual({ success: false, message: "채팅 상대를 1명 이상 선택해주세요." });
        expect(createChatRoom).not.toHaveBeenCalled();
    });

    it("service 호출이 성공하면 성공 결과와 채팅방 아이디를 반환한다", async () => {
        (createChatRoom as jest.Mock).mockResolvedValue(5);

        const result = await createChatRoomAction([1, 2], "1반 공지방");

        expect(createChatRoom).toHaveBeenCalledWith({ participantIds: [1, 2], name: "1반 공지방" });
        expect(result).toEqual({ success: true, message: "채팅방이 생성되었습니다.", chatRoomId: 5 });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        (createChatRoom as jest.Mock).mockRejectedValue(new Error("이미 존재하는 채팅방입니다."));

        const result = await createChatRoomAction([1]);

        expect(result).toEqual({ success: false, message: "이미 존재하는 채팅방입니다." });
    });
});

describe("sendMessageAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("내용이 비어있으면 service를 호출하지 않고 실패 결과를 반환한다", async () => {
        const result = await sendMessageAction(1, "   ");

        expect(result).toEqual({ success: false, message: "메시지 내용을 입력해주세요." });
        expect(sendMessage).not.toHaveBeenCalled();
    });

    it("service 호출이 성공하면 성공 결과와 메시지 아이디를 반환한다", async () => {
        (sendMessage as jest.Mock).mockResolvedValue(7);

        const result = await sendMessageAction(1, "안녕하세요");

        expect(sendMessage).toHaveBeenCalledWith(1, { messageType: "TEXT", content: "안녕하세요" });
        expect(result).toEqual({ success: true, message: "메시지를 전송했습니다.", messageId: 7 });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        (sendMessage as jest.Mock).mockRejectedValue(new Error("채팅방 참여자가 아닙니다."));

        const result = await sendMessageAction(1, "안녕하세요");

        expect(result).toEqual({ success: false, message: "채팅방 참여자가 아닙니다." });
    });
});

describe("sendFileMessageAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("첨부할 파일 아이디가 없으면 service를 호출하지 않고 실패 결과를 반환한다", async () => {
        const result = await sendFileMessageAction(1, "IMAGE", 0);

        expect(result).toEqual({ success: false, message: "첨부할 파일이 없습니다." });
        expect(sendMessage).not.toHaveBeenCalled();
    });

    it("service 호출이 성공하면 성공 결과와 메시지 아이디를 반환한다", async () => {
        (sendMessage as jest.Mock).mockResolvedValue(8);

        const result = await sendFileMessageAction(1, "IMAGE", 123, "a.png");

        expect(sendMessage).toHaveBeenCalledWith(1, { messageType: "IMAGE", fileId: 123, fileName: "a.png" });
        expect(result).toEqual({ success: true, message: "파일을 전송했습니다.", messageId: 8 });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        (sendMessage as jest.Mock).mockRejectedValue(new Error("파일 업로드에 실패했습니다."));

        const result = await sendFileMessageAction(1, "FILE", 456);

        expect(result).toEqual({ success: false, message: "파일 업로드에 실패했습니다." });
    });
});

describe("updateMessageAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("내용이 비어있으면 service를 호출하지 않고 실패 결과를 반환한다", async () => {
        const result = await updateMessageAction(1, 2, "   ");

        expect(result).toEqual({ success: false, message: "메시지 내용을 입력해주세요." });
        expect(updateMessage).not.toHaveBeenCalled();
    });

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        (updateMessage as jest.Mock).mockResolvedValue(undefined);

        const result = await updateMessageAction(1, 2, "수정된 내용");

        expect(updateMessage).toHaveBeenCalledWith(1, 2, { content: "수정된 내용" });
        expect(result).toEqual({ success: true, message: "메시지를 수정했습니다." });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        (updateMessage as jest.Mock).mockRejectedValue(new Error("수정 권한이 없습니다."));

        const result = await updateMessageAction(1, 2, "내용");

        expect(result).toEqual({ success: false, message: "수정 권한이 없습니다." });
    });
});

describe("deleteMessageAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        (deleteMessage as jest.Mock).mockResolvedValue(undefined);

        const result = await deleteMessageAction(1, 2);

        expect(deleteMessage).toHaveBeenCalledWith(1, 2);
        expect(result).toEqual({ success: true, message: "메시지를 삭제했습니다." });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        (deleteMessage as jest.Mock).mockRejectedValue(new Error("삭제 권한이 없습니다."));

        const result = await deleteMessageAction(1, 2);

        expect(result).toEqual({ success: false, message: "삭제 권한이 없습니다." });
    });
});

describe("createTaskCardAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("내용이 비어있으면 service를 호출하지 않고 실패 결과를 반환한다", async () => {
        const result = await createTaskCardAction(1, "   ", [1]);

        expect(result).toEqual({ success: false, message: "업무카드 내용을 입력해주세요." });
        expect(createTaskCard).not.toHaveBeenCalled();
    });

    it("담당자가 없으면 service를 호출하지 않고 실패 결과를 반환한다", async () => {
        const result = await createTaskCardAction(1, "보강 안내", []);

        expect(result).toEqual({ success: false, message: "담당자를 1명 이상 선택해주세요." });
        expect(createTaskCard).not.toHaveBeenCalled();
    });

    it("service 호출이 성공하면 성공 결과와 카드 아이디를 반환한다", async () => {
        (createTaskCard as jest.Mock).mockResolvedValue(9);

        const result = await createTaskCardAction(1, "보강 안내", [2], "2026-08-20");

        expect(createTaskCard).toHaveBeenCalledWith(1, { content: "보강 안내", dueDate: "2026-08-20", assigneeIds: [2] });
        expect(result).toEqual({ success: true, message: "업무카드가 등록되었습니다.", cardId: 9 });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        (createTaskCard as jest.Mock).mockRejectedValue(new Error("채팅방 참여자만 지정할 수 있습니다."));

        const result = await createTaskCardAction(1, "보강 안내", [2]);

        expect(result).toEqual({ success: false, message: "채팅방 참여자만 지정할 수 있습니다." });
    });
});

describe("updateTaskCardAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("내용이 비어있으면 service를 호출하지 않고 실패 결과를 반환한다", async () => {
        const result = await updateTaskCardAction(1, 2, "   ", [1]);

        expect(result).toEqual({ success: false, message: "업무카드 내용을 입력해주세요." });
        expect(updateTaskCard).not.toHaveBeenCalled();
    });

    it("담당자가 없으면 service를 호출하지 않고 실패 결과를 반환한다", async () => {
        const result = await updateTaskCardAction(1, 2, "보강 안내", []);

        expect(result).toEqual({ success: false, message: "담당자를 1명 이상 선택해주세요." });
        expect(updateTaskCard).not.toHaveBeenCalled();
    });

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        (updateTaskCard as jest.Mock).mockResolvedValue(undefined);

        const result = await updateTaskCardAction(1, 2, "수정 내용", [3]);

        expect(updateTaskCard).toHaveBeenCalledWith(1, 2, { content: "수정 내용", dueDate: undefined, assigneeIds: [3] });
        expect(result).toEqual({ success: true, message: "업무카드가 수정되었습니다." });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        (updateTaskCard as jest.Mock).mockRejectedValue(new Error("수정 권한이 없습니다."));

        const result = await updateTaskCardAction(1, 2, "내용", [1]);

        expect(result).toEqual({ success: false, message: "수정 권한이 없습니다." });
    });
});

describe("deleteTaskCardAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        (deleteTaskCard as jest.Mock).mockResolvedValue(undefined);

        const result = await deleteTaskCardAction(1, 2);

        expect(deleteTaskCard).toHaveBeenCalledWith(1, 2);
        expect(result).toEqual({ success: true, message: "업무카드가 삭제되었습니다." });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        (deleteTaskCard as jest.Mock).mockRejectedValue(new Error("삭제 권한이 없습니다."));

        const result = await deleteTaskCardAction(1, 2);

        expect(result).toEqual({ success: false, message: "삭제 권한이 없습니다." });
    });
});

describe("completeTaskCardAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        (completeTaskCard as jest.Mock).mockResolvedValue(undefined);

        const result = await completeTaskCardAction(1, 2);

        expect(completeTaskCard).toHaveBeenCalledWith(1, 2);
        expect(result).toEqual({ success: true, message: "업무를 완료 처리했습니다." });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        (completeTaskCard as jest.Mock).mockRejectedValue(new Error("이미 완료 처리된 업무입니다."));

        const result = await completeTaskCardAction(1, 2);

        expect(result).toEqual({ success: false, message: "이미 완료 처리된 업무입니다." });
    });
});
