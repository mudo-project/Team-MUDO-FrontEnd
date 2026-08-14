'use server'

import {
    createSharedFolderFolder,
    createSharedFolderGoogleFile,
    deleteSharedFolderContent,
    downloadSharedFolderContent,
    getSharedFolderContentDetail,
    getSharedFolderContentList,
    getSharedFolderRootStatus,
    recreateSharedFolderRoot,
    searchSharedFolderContent,
    updateSharedFolderContent,
    uploadSharedFolderFile,
} from "@/service/sharedFolder.service";

interface SharedFolderActionState {
    success: boolean;
    message: string;
}

const MAX_UPLOAD_FILE_SIZE = 100 * 1024 * 1024; // 100MB

// 시스템 루트 상태 조회 액션
export const getSharedFolderRootStatusAction = async (): Promise<SharedFolderRootStatusData> => {
    return getSharedFolderRootStatus();
}

// 시스템 루트 재생성 액션
export const recreateSharedFolderRootAction = async (): Promise<
    SharedFolderActionState & { data?: SharedFolderRootStatusData }
> => {
    try {
        const data = await recreateSharedFolderRoot();

        return {
            success: true,
            message: "공유폴더 시스템 루트가 재생성되었습니다.",
            data,
        };
    } catch (error) {
        let errorMessage = "공유폴더 시스템 루트 재생성에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage,
        };
    }
}

// 현재 폴더 목록조회 액션
export const getSharedFolderContentListAction = async (
    params?: SharedFolderContentListParams
): Promise<SharedFolderContentListData> => {
    return getSharedFolderContentList(params);
}

// 파일·폴더 상세조회 액션
export const getSharedFolderContentDetailAction = async (itemId: string): Promise<SharedFolderDriveItemData> => {
    return getSharedFolderContentDetail(itemId);
}

// 시스템 루트 전체 검색 액션
export const searchSharedFolderContentAction = async (
    params: SharedFolderContentSearchParams
): Promise<SharedFolderContentListData> => {
    if (!params.keyword.trim()) {
        throw new Error("검색어를 입력해주세요.");
    }

    return searchSharedFolderContent(params);
}

// 하위 폴더 생성 액션
export const createSharedFolderFolderAction = async (
    payload: SharedFolderFolderCreateRequest
): Promise<SharedFolderActionState & { data?: SharedFolderDriveItemData }> => {
    if (!payload.name.trim()) {
        return {
            success: false,
            message: "폴더 이름을 입력해주세요.",
        };
    }

    try {
        const data = await createSharedFolderFolder(payload);

        return {
            success: true,
            message: "폴더가 생성되었습니다.",
            data,
        };
    } catch (error) {
        let errorMessage = "폴더 생성에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage,
        };
    }
}

// 로컬 파일 업로드 액션
export const uploadSharedFolderFileAction = async (
    parentId: string,
    file: File
): Promise<SharedFolderActionState & { data?: SharedFolderDriveItemData }> => {
    if (!parentId.trim()) {
        return {
            success: false,
            message: "상위 폴더를 확인할 수 없습니다.",
        };
    }

    if (file.size > MAX_UPLOAD_FILE_SIZE) {
        return {
            success: false,
            message: "파일은 최대 100MB까지 업로드할 수 있습니다.",
        };
    }

    try {
        const data = await uploadSharedFolderFile(parentId, file);

        return {
            success: true,
            message: "파일이 업로드되었습니다.",
            data,
        };
    } catch (error) {
        let errorMessage = "파일 업로드에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage,
        };
    }
}

// Google 파일 생성 액션
export const createSharedFolderGoogleFileAction = async (
    payload: SharedFolderGoogleFileCreateRequest
): Promise<SharedFolderActionState & { data?: SharedFolderDriveItemData }> => {
    if (!payload.name.trim()) {
        return {
            success: false,
            message: "파일 이름을 입력해주세요.",
        };
    }

    try {
        const data = await createSharedFolderGoogleFile(payload);

        return {
            success: true,
            message: "Google 파일이 생성되었습니다.",
            data,
        };
    } catch (error) {
        let errorMessage = "Google 파일 생성에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage,
        };
    }
}

// 이름 변경·이동 액션
export const updateSharedFolderContentAction = async (
    itemId: string,
    payload: SharedFolderContentUpdateRequest
): Promise<SharedFolderActionState & { data?: SharedFolderDriveItemData }> => {
    const name = payload.name?.trim();
    const parentId = payload.parentId?.trim();

    if (!name && !parentId) {
        return {
            success: false,
            message: "변경할 이름 또는 이동할 위치를 입력해주세요.",
        };
    }

    try {
        const data = await updateSharedFolderContent(itemId, {
            ...(name && { name }),
            ...(parentId && { parentId }),
        });

        return {
            success: true,
            message: "이름 변경·이동이 완료되었습니다.",
            data,
        };
    } catch (error) {
        let errorMessage = "이름 변경·이동에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage,
        };
    }
}

// 휴지통 삭제 액션
export const deleteSharedFolderContentAction = async (itemId: string): Promise<SharedFolderActionState> => {
    try {
        await deleteSharedFolderContent(itemId);

        return {
            success: true,
            message: "휴지통으로 이동되었습니다.",
        };
    } catch (error) {
        let errorMessage = "삭제에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage,
        };
    }
}

// 원본·변환 다운로드 액션(바이너리를 base64로 변환해 반환)
export const downloadSharedFolderContentAction = async (
    itemId: string,
    params?: SharedFolderDownloadParams
): Promise<SharedFolderActionState & { file?: string; mimeType?: string; fileName?: string | null }> => {
    try {
        const result = await downloadSharedFolderContent(itemId, params);
        const buffer = await result.blob.arrayBuffer();

        return {
            success: true,
            message: "다운로드에 성공했습니다.",
            file: Buffer.from(buffer).toString("base64"),
            mimeType: result.mimeType,
            fileName: result.fileName,
        };
    } catch (error) {
        let errorMessage = "다운로드에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage,
        };
    }
}
