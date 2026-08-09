import { fetchWithAuth } from "@/lib/fetch";
import { getErrorMessage } from "@/lib/stateError";

// 채팅방 생성 API
export const createChatRoom = async (payload: MessengerRoomCreateRequest): Promise<number> => {
    const response = await fetchWithAuth("/api/messenger/rooms", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "채팅방 생성에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as MessengerRoomCreateResponse;

    return resData.data.chatRoomId;
}

// 채팅방 목록조회 API
export const getChatRooms = async (): Promise<MessengerRoomListItemData[]> => {
    const response = await fetchWithAuth("/api/messenger/rooms");

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "채팅방 목록 조회에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as MessengerRoomListResponse;

    return resData.data;
}

// 채팅방 참여자 목록조회 API
export const getChatRoomMembers = async (roomId: number): Promise<MessengerRoomMemberData[]> => {
    const response = await fetchWithAuth(`/api/messenger/rooms/${roomId}/members`);

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "채팅방 참여자 조회에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as MessengerRoomMemberListResponse;

    return resData.data;
}

// 메시지 목록조회 API
export const getMessages = async (
    roomId: number,
    params?: MessengerMessageListParams
): Promise<MessengerMessageListData> => {
    const query = new URLSearchParams();
    if (params?.cursorCreatedAt) query.set("cursorCreatedAt", params.cursorCreatedAt);
    if (params?.cursorMessageId !== undefined) query.set("cursorMessageId", String(params.cursorMessageId));
    if (params?.size !== undefined) query.set("size", String(params.size));
    const queryString = query.toString();

    const response = await fetchWithAuth(
        `/api/messenger/rooms/${roomId}/messages${queryString ? `?${queryString}` : ""}`
    );

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "메시지 목록 조회에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as MessengerMessageListResponse;

    return resData.data;
}

// 메시지 전송 API
export const sendMessage = async (
    roomId: number,
    payload: MessengerMessageCreateRequest
): Promise<number> => {
    const response = await fetchWithAuth(`/api/messenger/rooms/${roomId}/messages`, {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "메시지 전송에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as MessengerMessageCreateResponse;

    return resData.data.messageId;
}

// 메시지 수정 API
export const updateMessage = async (
    roomId: number,
    messageId: number,
    payload: MessengerMessageUpdateRequest
): Promise<void> => {
    const response = await fetchWithAuth(`/api/messenger/rooms/${roomId}/messages/${messageId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "메시지 수정에 실패하였습니다."
        );

        throw new Error(message);
    }
}

// 메시지 삭제 API
export const deleteMessage = async (roomId: number, messageId: number): Promise<void> => {
    const response = await fetchWithAuth(`/api/messenger/rooms/${roomId}/messages/${messageId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "메시지 삭제에 실패하였습니다."
        );

        throw new Error(message);
    }
}

// 업무지시 카드 목록조회 API
export const getTaskCards = async (
    roomId: number,
    params?: MessengerTaskCardListParams
): Promise<MessengerTaskCardListData> => {
    const query = new URLSearchParams();
    if (params?.cursorCreatedAt) query.set("cursorCreatedAt", params.cursorCreatedAt);
    if (params?.cursorCardId !== undefined) query.set("cursorCardId", String(params.cursorCardId));
    if (params?.size !== undefined) query.set("size", String(params.size));
    const queryString = query.toString();

    const response = await fetchWithAuth(
        `/api/messenger/rooms/${roomId}/task-cards${queryString ? `?${queryString}` : ""}`
    );

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "업무지시 카드 목록 조회에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as MessengerTaskCardListResponse;

    return resData.data;
}

// 업무지시 카드 등록 API
export const createTaskCard = async (
    roomId: number,
    payload: MessengerTaskCardCreateRequest
): Promise<number> => {
    const response = await fetchWithAuth(`/api/messenger/rooms/${roomId}/task-cards`, {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "업무지시 카드 등록에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as MessengerTaskCardCreateResponse;

    return resData.data.cardId;
}

// 업무지시 카드 수정 API
export const updateTaskCard = async (
    roomId: number,
    cardId: number,
    payload: MessengerTaskCardUpdateRequest
): Promise<void> => {
    const response = await fetchWithAuth(`/api/messenger/rooms/${roomId}/task-cards/${cardId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "업무지시 카드 수정에 실패하였습니다."
        );

        throw new Error(message);
    }
}

// 업무지시 카드 삭제 API
export const deleteTaskCard = async (roomId: number, cardId: number): Promise<void> => {
    const response = await fetchWithAuth(`/api/messenger/rooms/${roomId}/task-cards/${cardId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "업무지시 카드 삭제에 실패하였습니다."
        );

        throw new Error(message);
    }
}

// 업무지시 완료 처리 API
export const completeTaskCard = async (roomId: number, cardId: number): Promise<void> => {
    const response = await fetchWithAuth(`/api/messenger/rooms/${roomId}/task-cards/${cardId}/complete`, {
        method: "PATCH",
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "업무지시 완료 처리에 실패하였습니다."
        );

        throw new Error(message);
    }
}
