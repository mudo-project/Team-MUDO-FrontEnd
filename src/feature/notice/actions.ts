'use server'

import {
    createNotice,
    deleteNotice,
    getNoticeDetail,
    getNoticeList,
    getNoticeReaders,
    pinNotice,
    unpinNotice,
    updateNotice,
} from "@/service/notice.service";

interface NoticeActionState {
    success: boolean;
    message: string;
}

// 공지사항 목록조회 액션
export const getNoticeListAction = async (params?: NoticeListParams): Promise<NoticeListData> => {
    return getNoticeList(params);
}

// 공지사항 상세조회 액션
export const getNoticeDetailAction = async (noticeId: number): Promise<NoticeDetailData> => {
    return getNoticeDetail(noticeId);
}

// 공지사항 읽은 사람 목록조회 액션
export const getNoticeReadersAction = async (noticeId: number): Promise<NoticeReaderData[]> => {
    return getNoticeReaders(noticeId);
}

// 공지사항 작성 액션
export const createNoticeAction = async (
    title: string,
    content: string,
    pinned?: boolean,
    attachments?: NoticeAttachmentRequest[]
): Promise<NoticeActionState & { noticeId?: number }> => {
    if (!title.trim()) {
        return {
            success: false,
            message: "공지 제목은 비어 있을 수 없습니다."
        };
    }

    if (!content.trim()) {
        return {
            success: false,
            message: "공지 내용은 비어 있을 수 없습니다."
        };
    }

    try {
        const noticeId = await createNotice({
            title,
            content,
            pinned,
            attachments,
        });

        return {
            success: true,
            message: "공지사항이 등록되었습니다.",
            noticeId,
        };
    } catch (error) {
        let errorMessage = "공지사항 작성에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}

// 공지사항 수정 액션
export const updateNoticeAction = async (
    noticeId: number,
    title: string,
    content: string,
    attachments?: NoticeAttachmentRequest[]
): Promise<NoticeActionState> => {
    if (!title.trim()) {
        return {
            success: false,
            message: "공지 제목은 비어 있을 수 없습니다."
        };
    }

    if (!content.trim()) {
        return {
            success: false,
            message: "공지 내용은 비어 있을 수 없습니다."
        };
    }

    try {
        await updateNotice(noticeId, { title, content, attachments });

        return {
            success: true,
            message: "공지사항이 수정되었습니다."
        };
    } catch (error) {
        let errorMessage = "공지사항 수정에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}

// 공지사항 삭제 액션
export const deleteNoticeAction = async (noticeId: number): Promise<NoticeActionState> => {
    try {
        await deleteNotice(noticeId);

        return {
            success: true,
            message: "공지사항이 삭제되었습니다."
        };
    } catch (error) {
        let errorMessage = "공지사항 삭제에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}

// 공지사항 상단고정 액션
export const pinNoticeAction = async (noticeId: number): Promise<NoticeActionState> => {
    try {
        await pinNotice(noticeId);

        return {
            success: true,
            message: "공지사항이 상단에 고정되었습니다."
        };
    } catch (error) {
        let errorMessage = "공지사항 고정에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}

// 공지사항 상단고정 삭제 액션
export const unpinNoticeAction = async (noticeId: number): Promise<NoticeActionState> => {
    try {
        await unpinNotice(noticeId);

        return {
            success: true,
            message: "공지사항 고정이 해제되었습니다."
        };
    } catch (error) {
        let errorMessage = "공지사항 고정 해제에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}
