import {
    createFileMetadataAction,
    createFilePresignedUrlAction,
} from "./actions";

const getFileKey = (file: File) =>
    `${file.name}:${file.size}:${file.lastModified}`;

interface UploadFilesResult {
    fileIds: number[];
    uploadedFileIds: Record<string, number>;
}

export const uploadFiles = async (
    files: File[],
    uploadedFileIds: Record<string, number>,
): Promise<UploadFilesResult> => {
    const fileIds: number[] = [];
    const completedFileIds = { ...uploadedFileIds };

    for (const file of files) {
        const fileKey = getFileKey(file);
        const completedFileId = completedFileIds[fileKey];

        if (completedFileId) {
            fileIds.push(completedFileId);
            continue;
        }

        const contentType = file.type || "application/octet-stream";
        const presignedResponse = await createFilePresignedUrlAction({
            fileName: file.name,
            contentType,
        });

        if (!presignedResponse.success || !presignedResponse.data) {
            throw new Error(presignedResponse.message);
        }

        const uploadResponse = await fetch(presignedResponse.data.uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": contentType },
            body: file,
        });

        if (!uploadResponse.ok) {
            throw new Error(`${file.name} 업로드에 실패했습니다.`);
        }

        const metadataResponse = await createFileMetadataAction({
            objectKey: presignedResponse.data.objectKey,
            contentType,
        });

        if (!metadataResponse.success || !metadataResponse.data) {
            throw new Error(metadataResponse.message);
        }

        completedFileIds[fileKey] = metadataResponse.data.fileId;
        fileIds.push(metadataResponse.data.fileId);
    }

    return { fileIds, uploadedFileIds: completedFileIds };
};
