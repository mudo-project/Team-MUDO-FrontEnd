import {
    CreateFileMetadataRequest,
    CreateFileMetadataResponse,
    CreateFilePresignedUrlRequest,
    CreateFilePresignedUrlResponse,
    FileDownloadUrlResponse,
} from "@/feature/file/type";
import { fetchWithAuth } from "@/lib/fetch";
import { getErrorMessage } from "@/lib/stateError";

export const createFilePresignedUrl = async (
    payload: CreateFilePresignedUrlRequest,
): Promise<CreateFilePresignedUrlResponse> => {
    const response = await fetchWithAuth("/api/files/presigned-url", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "업로드용 URL 발급에 실패했습니다.",
        );

        throw new Error(message);
    }

    return response.json();
};

export const createFileMetadata = async (
    payload: CreateFileMetadataRequest,
): Promise<CreateFileMetadataResponse> => {
    const response = await fetchWithAuth("/api/files", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "파일 등록에 실패했습니다.",
        );

        throw new Error(message);
    }

    return response.json();
};

export const getFileDownloadUrl = async (
    fileId: number,
): Promise<FileDownloadUrlResponse> => {
    const response = await fetchWithAuth(`/api/files/${fileId}/download-url`);

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "다운로드용 URL 조회에 실패했습니다.",
        );

        throw new Error(message);
    }

    return response.json();
};
