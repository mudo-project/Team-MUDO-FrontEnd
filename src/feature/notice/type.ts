// 공지사항 작성 파일 응답값
interface NoticeAttachmentRequest {
    fileUrl: string;
    fileName: string;
    fileType?: string;
}

// 공지사항 작성 요청값
interface NoticeCreateRequest {
    title: string;
    content: string;
    pinned?: boolean;
    attachments?: NoticeAttachmentRequest[];
}

// 공지사항 작성 응답 데이터
interface NoticeCreateData {
    noticeId: number;
}

// 공지사항 작성 응답값
interface NoticeCreateResponse {
    status: number;
    code: string;
    message: string;
    data: NoticeCreateData;
}

// 공지사항 목록조회 요청 파라미터
interface NoticeListParams {
    keyword?: string;
    page?: number;
    size?: number;
}

// 공지사항 목록조회 응답 항목
interface NoticeListItemData {
    id: number;
    title: string;
    authorName: string;
    authorRole: string;
    pinned: boolean;
    read: boolean;
    hasAttachment: boolean;
    createdAt: string;
}

// 공지사항 목록조회 데이터값
interface NoticeListData {
    content: NoticeListItemData[];
    page: number;
    size: number;
    hasNext: boolean;
}

// 공지사항 목록조회 응답값
interface NoticeListResponse {
    status: number;
    code: string;
    message: string;
    data: NoticeListData;
}

// 공지사항 상세조회 파일 데이터
interface NoticeAttachmentData {
    id: number;
    fileUrl: string;
    fileName: string;
    fileType: string;
}

// 공지사항 상세조회 응답 데이터값
interface NoticeDetailData {
    id: number;
    title: string;
    content: string;
    authorUserId: number;
    authorName: string;
    authorRole: string;
    pinned: boolean;
    viewCount: number;
    readerCount: number;
    totalRecipientCount: number;
    createdAt: string;
    updatedAt: string;
    attachments: NoticeAttachmentData[];
}

// 공지사항 상세조회 응답값
interface NoticeDetailResponse {
    status: number;
    code: string;
    message: string;
    data: NoticeDetailData;
}

// 공지사항 읽은 사람 목록조회 데이터값
interface NoticeReaderData {
    userId: number;
    name: string;
    role: string;
    readAt: string;
}

// 공지사항 읽은 사람 목록조회 응답값
interface NoticeReaderListResponse {
    status: number;
    code: string;
    message: string;
    data: NoticeReaderData[];
}

// 공지사항 수정 요청값
interface NoticeUpdateRequest {
    title: string;
    content: string;
}
