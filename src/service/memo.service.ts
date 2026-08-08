import { fetchWithAuth } from "@/lib/fetch";
import { getErrorMessage } from "@/lib/stateError";

export const getMemoList = async (sort?: MemoSortOrder): Promise<MemoData[]> => {
    const query = sort ? `?sort=${sort}` : "";
    const response = await fetchWithAuth(`/api/memos${query}`);

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "메모 목록 조회에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as MemoListResponse;

    return resData.data;
}

export const createMemo = async (payload: MemoCreateRequest): Promise<number> => {
    const response = await fetchWithAuth("/api/memos", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "메모 생성에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as MemoCreateResponse;

    return resData.data.id;
}

export const updateMemo = async (memoId: number, payload: MemoUpdateRequest): Promise<void> => {
    const response = await fetchWithAuth(`/api/memos/${memoId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "메모 수정에 실패하였습니다."
        );

        throw new Error(message);
    }
}

export const changeMemoColor = async (memoId: number, payload: MemoColorChangeRequest): Promise<void> => {
    const response = await fetchWithAuth(`/api/memos/${memoId}/color`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "메모 색상 변경에 실패하였습니다."
        );

        throw new Error(message);
    }
}

export const deleteMemo = async (memoId: number): Promise<void> => {
    const response = await fetchWithAuth(`/api/memos/${memoId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "메모 삭제에 실패하였습니다."
        );

        throw new Error(message);
    }
}
