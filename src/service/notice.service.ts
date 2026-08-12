import { fetchWithAuth } from "@/lib/fetch";
import { getErrorMessage } from "@/lib/stateError";

// 공지사항 목록조회 API
export const getNoticeList = async (params?: NoticeListParams): Promise<NoticeListData> => {
    const query = new URLSearchParams();
    if (params?.keyword) query.set("keyword", params.keyword);
    if (params?.page !== undefined) query.set("page", String(params.page));
    if (params?.size !== undefined) query.set("size", String(params.size));
    const queryString = query.toString();

    const response = await fetchWithAuth(`/api/notices${queryString ? `?${queryString}` : ""}`);

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "공지사항 목록 조회에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as NoticeListResponse;

    return resData.data;
}

// 공지사항 작성 API
export const createNotice = async (payload: NoticeCreateRequest): Promise<number> => {
    const response = await fetchWithAuth("/api/notices", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "공지사항 작성에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as NoticeCreateResponse;

    return resData.data.noticeId;
}

// 공지사항 상세조회 API
export const getNoticeDetail = async (noticeId: number): Promise<NoticeDetailData> => {
    const response = await fetchWithAuth(`/api/notices/${noticeId}`);

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "공지사항 상세 조회에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as NoticeDetailResponse;

    return resData.data;
}

// 공지사항 읽은 사람 목록조회 API
export const getNoticeReaders = async (noticeId: number): Promise<NoticeReaderData[]> => {
    const response = await fetchWithAuth(`/api/notices/${noticeId}/readers`);

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "공지사항 읽은 사람 목록조회에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as NoticeReaderListResponse;

    return resData.data;
}

// 공지사항 수정 API
export const updateNotice = async (noticeId: number, payload: NoticeUpdateRequest): Promise<void> => {
    const response = await fetchWithAuth(`/api/notices/${noticeId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "공지사항 수정에 실패하였습니다."
        );

        throw new Error(message);
    }
}

// 공지사항 삭제 API
export const deleteNotice = async (noticeId: number): Promise<void> => {
    const response = await fetchWithAuth(`/api/notices/${noticeId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "공지사항 삭제에 실패하였습니다."
        );

        throw new Error(message);
    }
}

// 공지사항 상단고정 API
export const pinNotice = async (noticeId: number): Promise<void> => {
    const response = await fetchWithAuth(`/api/notices/${noticeId}/pin`, {
        method: "POST",
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "공지사항 고정에 실패하였습니다."
        );

        throw new Error(message);
    }
}

// 공지사항 상단고정 삭제 API
export const unpinNotice = async (noticeId: number): Promise<void> => {
    const response = await fetchWithAuth(`/api/notices/${noticeId}/pin`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "공지사항 고정 해제에 실패하였습니다."
        );

        throw new Error(message);
    }
}
