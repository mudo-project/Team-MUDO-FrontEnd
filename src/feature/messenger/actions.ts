'use server'

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
} from "@/service/messenger.service";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

interface MessengerActionState {
    success: boolean;
    message: string;
}

// 사용자 검색 액션
export const searchUsersAction = async (keyword?: string): Promise<MessengerUserSearchItemData[]> => {
    return searchUsers(keyword);
}

// 현재 로그인한 사용자 id 조회 액션
// accessToken의 JWT payload에서 사용자 id를 추출한다.
// TODO: 실제 payload의 사용자 id claim명(userId/sub/id)을 백엔드와 확인 후 정리 필요.
export const getCurrentUserIdAction = async (): Promise<number | null> => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) return null;

    try {
        const payload = jwtDecode<Record<string, unknown>>(accessToken);
        const candidate = payload.userId ?? payload.sub ?? payload.id;
        const userId = Number(candidate);

        return Number.isNaN(userId) ? null : userId;
    } catch {
        return null;
    }
}

// 채팅방 목록조회 액션
export const getChatRoomsAction = async (): Promise<MessengerRoomListItemData[]> => {
    return getChatRooms();
}

// 채팅방 참여자 목록조회 액션
export const getChatRoomMembersAction = async (roomId: number): Promise<MessengerRoomMemberData[]> => {
    return getChatRoomMembers(roomId);
}

// 메시지 목록조회 액션
export const getMessagesAction = async (
    roomId: number,
    params?: MessengerMessageListParams
): Promise<MessengerMessageListData> => {
    return getMessages(roomId, params);
}

// 업무지시 카드 목록조회 액션
export const getTaskCardsAction = async (
    roomId: number,
    params?: MessengerTaskCardListParams
): Promise<MessengerTaskCardListData> => {
    return getTaskCards(roomId, params);
}

// 채팅방 생성 액션
export const createChatRoomAction = async (
    participantIds: number[],
    name?: string
): Promise<MessengerActionState & { chatRoomId?: number }> => {
    if (participantIds.length === 0) {
        return {
            success: false,
            message: "채팅 상대를 1명 이상 선택해주세요."
        };
    }

    try {
        const chatRoomId = await createChatRoom({ participantIds, name });

        return {
            success: true,
            message: "채팅방이 생성되었습니다.",
            chatRoomId,
        };
    } catch (error) {
        let errorMessage = "채팅방 생성에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}

// 메시지 전송 액션
export const sendMessageAction = async (
    roomId: number,
    content: string
): Promise<MessengerActionState & { messageId?: number }> => {
    if (!content.trim()) {
        return {
            success: false,
            message: "메시지 내용을 입력해주세요."
        };
    }

    try {
        const messageId = await sendMessage(roomId, { messageType: "TEXT", content });

        return {
            success: true,
            message: "메시지를 전송했습니다.",
            messageId,
        };
    } catch (error) {
        let errorMessage = "메시지 전송에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}

// 사진/파일 메시지 전송 액션
export const sendFileMessageAction = async (
    roomId: number,
    messageType: "IMAGE" | "FILE",
    fileUrl: string,
    fileName?: string
): Promise<MessengerActionState & { messageId?: number }> => {
    if (!fileUrl.trim()) {
        return {
            success: false,
            message: "첨부할 파일이 없습니다."
        };
    }

    try {
        const messageId = await sendMessage(roomId, { messageType, fileUrl, fileName });

        return {
            success: true,
            message: "파일을 전송했습니다.",
            messageId,
        };
    } catch (error) {
        let errorMessage = "파일 전송에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}

// 메시지 수정 액션
export const updateMessageAction = async (
    roomId: number,
    messageId: number,
    content: string
): Promise<MessengerActionState> => {
    if (!content.trim()) {
        return {
            success: false,
            message: "메시지 내용을 입력해주세요."
        };
    }

    try {
        await updateMessage(roomId, messageId, { content });

        return {
            success: true,
            message: "메시지를 수정했습니다."
        };
    } catch (error) {
        let errorMessage = "메시지 수정에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}

// 메시지 삭제 액션
export const deleteMessageAction = async (
    roomId: number,
    messageId: number
): Promise<MessengerActionState> => {
    try {
        await deleteMessage(roomId, messageId);

        return {
            success: true,
            message: "메시지를 삭제했습니다."
        };
    } catch (error) {
        let errorMessage = "메시지 삭제에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}

// 업무지시 카드 등록 액션
export const createTaskCardAction = async (
    roomId: number,
    content: string,
    assigneeIds: number[],
    dueDate?: string
): Promise<MessengerActionState & { cardId?: number }> => {
    if (!content.trim()) {
        return {
            success: false,
            message: "업무지시 내용을 입력해주세요."
        };
    }

    if (assigneeIds.length === 0) {
        return {
            success: false,
            message: "담당자를 1명 이상 선택해주세요."
        };
    }

    try {
        const cardId = await createTaskCard(roomId, { content, dueDate, assigneeIds });

        return {
            success: true,
            message: "업무지시가 등록되었습니다.",
            cardId,
        };
    } catch (error) {
        let errorMessage = "업무지시 등록에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}

// 업무지시 카드 수정 액션
export const updateTaskCardAction = async (
    roomId: number,
    cardId: number,
    content: string,
    assigneeIds: number[],
    dueDate?: string
): Promise<MessengerActionState> => {
    if (!content.trim()) {
        return {
            success: false,
            message: "업무지시 내용을 입력해주세요."
        };
    }

    if (assigneeIds.length === 0) {
        return {
            success: false,
            message: "담당자를 1명 이상 선택해주세요."
        };
    }

    try {
        await updateTaskCard(roomId, cardId, { content, dueDate, assigneeIds });

        return {
            success: true,
            message: "업무지시가 수정되었습니다."
        };
    } catch (error) {
        let errorMessage = "업무지시 수정에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}

// 업무지시 카드 삭제 액션
export const deleteTaskCardAction = async (
    roomId: number,
    cardId: number
): Promise<MessengerActionState> => {
    try {
        await deleteTaskCard(roomId, cardId);

        return {
            success: true,
            message: "업무지시가 삭제되었습니다."
        };
    } catch (error) {
        let errorMessage = "업무지시 삭제에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}

// 업무지시 완료 처리 액션
export const completeTaskCardAction = async (
    roomId: number,
    cardId: number
): Promise<MessengerActionState> => {
    try {
        await completeTaskCard(roomId, cardId);

        return {
            success: true,
            message: "업무를 완료 처리했습니다."
        };
    } catch (error) {
        let errorMessage = "업무 완료 처리에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}
