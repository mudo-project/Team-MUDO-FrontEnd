export interface FileApiResponse<T> {
    status: number;
    code: string;
    message: string;
    data: T;
}

export interface CreateFilePresignedUrlRequest {
    fileName: string;
    contentType: string;
}

export interface CreateFilePresignedUrlData {
    objectKey: string;
    uploadUrl: string;
}

export type CreateFilePresignedUrlResponse =
    FileApiResponse<CreateFilePresignedUrlData>;

export interface CreateFileMetadataRequest {
    objectKey: string;
    contentType: string;
}

export interface CreateFileMetadataData {
    fileId: number;
}

export type CreateFileMetadataResponse =
    FileApiResponse<CreateFileMetadataData>;

export interface FileDownloadUrlData {
    downloadUrl: string;
}

export type FileDownloadUrlResponse = FileApiResponse<FileDownloadUrlData>;
