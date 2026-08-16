// 공유폴더 항목 종류
type SharedFolderItemKind = "FOLDER" | "FILE";

// 공유폴더 파일 종류
type SharedFolderFileType = "GOOGLE_DOCS" | "GOOGLE_SHEETS" | "GOOGLE_SLIDES" | "UPLOADED";

// 공유폴더 목록 항목(폴더/파일 공통)
interface SharedFolderItemData {
    id: number;
    parentId: number | null;
    kind: SharedFolderItemKind;
    name: string;
    fileType?: SharedFolderFileType;
    modifierName: string;
    modifiedAt: string;
    size: string;
}

// 공유파일 시스템 루트 상태 데이터값
interface SharedFolderRootStatusData {
    ready: boolean;
    rootId: string | null;
}

// 시스템 루트 상태 조회 응답값
interface SharedFolderRootStatusResponse {
    status: number;
    code: string;
    message: string;
    data: SharedFolderRootStatusData;
}

// 시스템 루트 재생성 응답값
interface SharedFolderRootRecreateResponse {
    status: number;
    code: string;
    message: string;
    data: SharedFolderRootStatusData;
}

// Google Drive 파일·폴더 1건
interface SharedFolderDriveItemData {
    id: string;
    name: string;
    mimeType: string;
    viewUrl: string;
    downloadable: boolean;
    modifiedAt: string;
}

// 현재 폴더 목록조회 요청 파라미터
interface SharedFolderContentListParams {
    parentId?: string;
    cursor?: string;
    size?: number;
}

// 목록·검색 공용 데이터값
interface SharedFolderContentListData {
    items: SharedFolderDriveItemData[];
    hasNext: boolean;
    nextCursor: string | null;
}

// 현재 폴더 목록조회 응답값
interface SharedFolderContentListResponse {
    status: number;
    code: string;
    message: string;
    data: SharedFolderContentListData;
}

// 파일·폴더 상세조회 응답값
interface SharedFolderContentDetailResponse {
    status: number;
    code: string;
    message: string;
    data: SharedFolderDriveItemData;
}

// 시스템 루트 전체 검색 대상 종류
type SharedFolderContentSearchType = "FILE" | "FOLDER";

// 시스템 루트 전체 검색 요청 파라미터
interface SharedFolderContentSearchParams {
    keyword: string;
    type?: SharedFolderContentSearchType;
    cursor?: string;
    size?: number;
}

// 시스템 루트 전체 검색 응답값
interface SharedFolderContentSearchResponse {
    status: number;
    code: string;
    message: string;
    data: SharedFolderContentListData;
}

// 하위 폴더 생성 요청값(parentId를 생략하면 공유파일 루트 바로 아래에 생성한다)
interface SharedFolderFolderCreateRequest {
    parentId?: string;
    name: string;
}

// 하위 폴더 생성 응답값
interface SharedFolderFolderCreateResponse {
    status: number;
    code: string;
    message: string;
    data: SharedFolderDriveItemData;
}

// 로컬 파일 업로드 응답값
interface SharedFolderFileUploadResponse {
    status: number;
    code: string;
    message: string;
    data: SharedFolderDriveItemData;
}

// Google 파일 생성 시 선택 가능한 Google Workspace 파일 유형
type SharedFolderGoogleDocType = "DOCS" | "SHEETS" | "SLIDES";

// Google 파일 생성 요청값(parentId를 생략하면 공유파일 루트 바로 아래에 생성한다)
interface SharedFolderGoogleFileCreateRequest {
    parentId?: string;
    name: string;
    type: SharedFolderGoogleDocType;
}

// Google 파일 생성 응답값
interface SharedFolderGoogleFileCreateResponse {
    status: number;
    code: string;
    message: string;
    data: SharedFolderDriveItemData;
}

// 이름 변경·이동 요청값
interface SharedFolderContentUpdateRequest {
    name?: string;
    parentId?: string;
}

// 이름 변경·이동 응답값
interface SharedFolderContentUpdateResponse {
    status: number;
    code: string;
    message: string;
    data: SharedFolderDriveItemData;
}

// 원본·변환 다운로드 시 변환 형식
type SharedFolderDownloadFormat = "PDF" | "DOCX" | "XLSX" | "PPTX";

// 원본·변환 다운로드 요청 파라미터
interface SharedFolderDownloadParams {
    format?: SharedFolderDownloadFormat;
}

// 원본·변환 다운로드 결과
interface SharedFolderDownloadResult {
    blob: Blob;
    mimeType: string;
    fileName: string | null;
}
