// 채팅방 생성 요청값
interface MessengerRoomCreateRequest {
    participantIds: number[];
    name?: string | null;
}

// 채팅방 생성 응답 데이터
interface MessengerRoomCreateData {
    chatRoomId: number;
}

// 채팅방 생성 응답값
interface MessengerRoomCreateResponse {
    status: number;
    code: string;
    message: string;
    data: MessengerRoomCreateData;
}

// 채팅방 목록조회 응답 항목
interface MessengerRoomListItemData {
    id: number;
    name: string;
    type: "DM" | "GROUP";
    unreadCount: number;
    lastMessagePreview: string | null;
    lastMessageAt: string | null;
    createdAt: string;
}

// 채팅방 목록조회 응답값
interface MessengerRoomListResponse {
    status: number;
    code: string;
    message: string;
    data: MessengerRoomListItemData[];
}

// 채팅방 참여자 목록조회 응답 항목
interface MessengerRoomMemberData {
    userId: number;
    name: string;
    lastReadAt: string | null;
}

// 채팅방 참여자 목록조회 응답값
interface MessengerRoomMemberListResponse {
    status: number;
    code: string;
    message: string;
    data: MessengerRoomMemberData[];
}

// 메시지 전송 요청값
interface MessengerMessageCreateRequest {
    messageType: "TEXT" | "IMAGE" | "FILE";
    content?: string | null;
    fileUrl?: string | null;
    fileName?: string | null;
}

// 메시지 전송 응답 데이터
interface MessengerMessageCreateData {
    messageId: number;
}

// 메시지 전송 응답값
interface MessengerMessageCreateResponse {
    status: number;
    code: string;
    message: string;
    data: MessengerMessageCreateData;
}

// 메시지 수정 요청값
interface MessengerMessageUpdateRequest {
    content: string;
}

// 메시지 목록조회 요청 파라미터
interface MessengerMessageListParams {
    cursorCreatedAt?: string;
    cursorMessageId?: number;
    size?: number;
}

// 메시지 목록조회 응답 항목
interface MessengerMessageItemData {
    id: number;
    senderId: number;
    senderName: string;
    messageType: "TEXT" | "IMAGE" | "FILE";
    content: string | null;
    fileUrl: string | null;
    fileName: string | null;
    createdAt: string;
    editedAt: string | null;
    deletedAt: string | null;
    deleted: boolean;
    unreadCount: number;
}

// 메시지 목록조회 데이터값
interface MessengerMessageListData {
    content: MessengerMessageItemData[];
    hasNext: boolean;
    nextCursorCreatedAt: string | null;
    nextCursorMessageId: number | null;
}

// 메시지 목록조회 응답값
interface MessengerMessageListResponse {
    status: number;
    code: string;
    message: string;
    data: MessengerMessageListData;
}

// 업무지시 카드 등록 요청값
interface MessengerTaskCardCreateRequest {
    content: string;
    dueDate?: string | null;
    assigneeIds: number[];
}

// 업무지시 카드 등록 응답 데이터
interface MessengerTaskCardCreateData {
    cardId: number;
}

// 업무지시 카드 등록 응답값
interface MessengerTaskCardCreateResponse {
    status: number;
    code: string;
    message: string;
    data: MessengerTaskCardCreateData;
}

// 업무지시 카드 수정 요청값
interface MessengerTaskCardUpdateRequest {
    content: string;
    dueDate?: string | null;
    assigneeIds: number[];
}

// 업무지시 카드 목록조회 요청 파라미터
interface MessengerTaskCardListParams {
    cursorCreatedAt?: string;
    cursorCardId?: number;
    size?: number;
}

// 업무지시 카드 담당자 데이터
interface MessengerTaskCardAssigneeData {
    userId: number;
    name: string;
    completedAt: string | null;
}

// 업무지시 카드 목록조회 응답 항목
interface MessengerTaskCardItemData {
    id: number;
    assignerId: number;
    assignerName: string;
    content: string;
    dueDate: string | null;
    assignees: MessengerTaskCardAssigneeData[];
    completedCount: number;
    assigneeCount: number;
    fullyCompleted: boolean;
    createdAt: string;
}

// 업무지시 카드 목록조회 데이터값
interface MessengerTaskCardListData {
    content: MessengerTaskCardItemData[];
    hasNext: boolean;
    nextCursorCreatedAt: string | null;
    nextCursorCardId: number | null;
}

// 업무지시 카드 목록조회 응답값
interface MessengerTaskCardListResponse {
    status: number;
    code: string;
    message: string;
    data: MessengerTaskCardListData;
}
