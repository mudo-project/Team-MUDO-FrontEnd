import { fetchWithAuth } from "@/lib/fetch";
import { getErrorMessage } from "@/lib/stateError";

// 시스템 루트 상태 조회 API
export const getSharedFolderRootStatus = async (): Promise<SharedFolderRootStatusData> => {
    const response = await fetchWithAuth("/api/shared-files/root");

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "공유폴더 시스템 루트 상태 조회에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as SharedFolderRootStatusResponse;

    return resData.data;
}

// 시스템 루트 재생성 API
export const recreateSharedFolderRoot = async (): Promise<SharedFolderRootStatusData> => {
    const response = await fetchWithAuth("/api/shared-files/root/recreation", {
        method: "POST",
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "공유폴더 시스템 루트 재생성에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as SharedFolderRootRecreateResponse;

    return resData.data;
}

// 현재 폴더 목록조회 API
export const getSharedFolderContentList = async (
    params?: SharedFolderContentListParams
): Promise<SharedFolderContentListData> => {
    const query = new URLSearchParams();
    if (params?.parentId) query.set("parentId", params.parentId);
    if (params?.cursor) query.set("cursor", params.cursor);
    if (params?.size !== undefined) query.set("size", String(params.size));
    const queryString = query.toString();

    const response = await fetchWithAuth(`/api/shared-files/items${queryString ? `?${queryString}` : ""}`);

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "공유폴더 목록 조회에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as SharedFolderContentListResponse;

    return resData.data;
}

// 파일·폴더 상세조회 API
export const getSharedFolderContentDetail = async (itemId: string): Promise<SharedFolderDriveItemData> => {
    const response = await fetchWithAuth(`/api/shared-files/items/${encodeURIComponent(itemId)}`);

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "파일·폴더 상세 조회에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as SharedFolderContentDetailResponse;

    return resData.data;
}

// 시스템 루트 전체 검색 API
export const searchSharedFolderContent = async (
    params: SharedFolderContentSearchParams
): Promise<SharedFolderContentListData> => {
    const query = new URLSearchParams();
    query.set("keyword", params.keyword);
    if (params.type) query.set("type", params.type);
    if (params.cursor) query.set("cursor", params.cursor);
    if (params.size !== undefined) query.set("size", String(params.size));

    const response = await fetchWithAuth(`/api/shared-files/items/search?${query.toString()}`);

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "공유폴더 검색에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as SharedFolderContentSearchResponse;

    return resData.data;
}

// 하위 폴더 생성 API
export const createSharedFolderFolder = async (
    payload: SharedFolderFolderCreateRequest
): Promise<SharedFolderDriveItemData> => {
    const response = await fetchWithAuth("/api/shared-files/folders", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "폴더 생성에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as SharedFolderFolderCreateResponse;

    return resData.data;
}

// 로컬 파일 업로드 API(parentId를 생략하면 공유파일 루트 바로 아래에 업로드한다)
export const uploadSharedFolderFile = async (
    parentId: string | undefined,
    file: File
): Promise<SharedFolderDriveItemData> => {
    const formData = new FormData();
    formData.append("file", file);

    const query = parentId ? `?parentId=${encodeURIComponent(parentId)}` : "";
    const response = await fetchWithAuth(
        `/api/shared-files/items/upload${query}`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "파일 업로드에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as SharedFolderFileUploadResponse;

    return resData.data;
}

// Google 파일 생성 API
export const createSharedFolderGoogleFile = async (
    payload: SharedFolderGoogleFileCreateRequest
): Promise<SharedFolderDriveItemData> => {
    const response = await fetchWithAuth("/api/shared-files/google-files", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "Google 파일 생성에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as SharedFolderGoogleFileCreateResponse;

    return resData.data;
}

// 이름 변경·이동 API
export const updateSharedFolderContent = async (
    itemId: string,
    payload: SharedFolderContentUpdateRequest
): Promise<SharedFolderDriveItemData> => {
    const response = await fetchWithAuth(`/api/shared-files/items/${encodeURIComponent(itemId)}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "이름 변경·이동에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as SharedFolderContentUpdateResponse;

    return resData.data;
}

// 휴지통 삭제 API
export const deleteSharedFolderContent = async (itemId: string): Promise<void> => {
    const response = await fetchWithAuth(`/api/shared-files/items/${encodeURIComponent(itemId)}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "삭제에 실패하였습니다."
        );

        throw new Error(message);
    }
}

function decodeQEncodedWord(text: string): string {
    const bytes: number[] = [];

    for (let i = 0; i < text.length; i++) {
        if (text[i] === "_") {
            bytes.push(0x20);
        } else if (text[i] === "=" && i + 2 < text.length) {
            bytes.push(parseInt(text.slice(i + 1, i + 3), 16));
            i += 2;
        } else {
            bytes.push(text.charCodeAt(i));
        }
    }

    return Buffer.from(bytes).toString("utf-8");
}

function decodeContentDispositionFilename(contentDisposition: string | null): string | null {
    if (!contentDisposition) return null;

    const filenameStarMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
    if (filenameStarMatch) {
        try {
            return decodeURIComponent(filenameStarMatch[1]);
        } catch {
        }
    }

    const filenameMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
    if (!filenameMatch) return null;

    const rawFilename = filenameMatch[1];
    const encodedWordMatch = rawFilename.match(/^=\?([^?]+)\?([BbQq])\?([^?]*)\?=$/);

    if (encodedWordMatch) {
        const [, , encoding, encodedText] = encodedWordMatch;

        return encoding.toUpperCase() === "B"
            ? Buffer.from(encodedText, "base64").toString("utf-8")
            : decodeQEncodedWord(encodedText);
    }

    try {
        return decodeURIComponent(rawFilename);
    } catch {
        return rawFilename;
    }
}

// 원본·변환 다운로드 API (공통 응답 포맷이 아닌 바이너리 응답)
export const downloadSharedFolderContent = async (
    itemId: string,
    params?: SharedFolderDownloadParams
): Promise<SharedFolderDownloadResult> => {
    const query = new URLSearchParams();
    if (params?.format) query.set("format", params.format);
    const queryString = query.toString();

    const response = await fetchWithAuth(
        `/api/shared-files/items/${encodeURIComponent(itemId)}/download${queryString ? `?${queryString}` : ""}`
    );

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "다운로드에 실패하였습니다."
        );

        throw new Error(message);
    }

    const contentDisposition = response.headers.get("content-disposition");

    return {
        blob: await response.blob(),
        mimeType: response.headers.get("content-type") ?? "application/octet-stream",
        fileName: decodeContentDispositionFilename(contentDisposition),
    };
}
