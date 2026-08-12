"use server";

import {
    createFileMetadata,
    createFilePresignedUrl,
    getFileDownloadUrl,
} from "@/service/file.service";
import {
    CreateFileMetadataData,
    CreateFileMetadataRequest,
    CreateFilePresignedUrlData,
    CreateFilePresignedUrlRequest,
    FileDownloadUrlData,
} from "./type";

export interface FileActionResult<T = undefined> {
    success: boolean;
    message: string;
    data?: T;
}

const getActionErrorMessage = (error: unknown, fallbackMessage: string) =>
    error instanceof Error ? error.message : fallbackMessage;

export const createFilePresignedUrlAction = async (
    payload: CreateFilePresignedUrlRequest,
): Promise<FileActionResult<CreateFilePresignedUrlData>> => {
    if (!payload.fileName.trim() || !payload.contentType.trim()) {
        return {
            success: false,
            message: "파일명과 콘텐츠 타입을 입력해주세요.",
        };
    }

    try {
        const response = await createFilePresignedUrl(payload);

        return {
            success: true,
            message: response.message,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(
                error,
                "업로드용 URL 발급에 실패했습니다.",
            ),
        };
    }
};

export const createFileMetadataAction = async (
    payload: CreateFileMetadataRequest,
): Promise<FileActionResult<CreateFileMetadataData>> => {
    if (!payload.objectKey.trim() || !payload.contentType.trim()) {
        return {
            success: false,
            message: "객체 키와 콘텐츠 타입을 입력해주세요.",
        };
    }

    try {
        const response = await createFileMetadata(payload);

        return {
            success: true,
            message: response.message,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "파일 등록에 실패했습니다."),
        };
    }
};

export const getFileDownloadUrlAction = async (
    fileId: number,
): Promise<FileActionResult<FileDownloadUrlData>> => {
    if (!Number.isInteger(fileId) || fileId <= 0) {
        return {
            success: false,
            message: "파일 번호가 올바르지 않습니다.",
        };
    }

    try {
        const response = await getFileDownloadUrl(fileId);

        return {
            success: true,
            message: response.message,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(
                error,
                "다운로드용 URL 조회에 실패했습니다.",
            ),
        };
    }
};
