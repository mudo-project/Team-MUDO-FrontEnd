// 메모 색상 코드. 6자리 16진수 색상 코드(RRGGBB, # 없이). 실제 팔레트·색상값은 FE가 자유롭게 정한다.
type MemoColorCode = string;

// 메모 정렬 기준
type MemoSortOrder = "NEWEST" | "OLDEST";

// 메모 목록조회 응답 데이터값
interface MemoData {
    id: number;
    title: string;
    content: string | null;
    color: MemoColorCode;
    positionX: number | null;
    positionY: number | null;
    width: number | null;
    height: number | null;
    createdAt: string;
    updatedAt: string;
}

// 메모 목록조회 응답값
interface MemoListResponse {
    status: number;
    code: string;
    message: string;
    data: MemoData[];
}

// 메모 생성 요청값
interface MemoCreateRequest {
    title: string;
    content?: string;
    color: MemoColorCode;
}

// 메모 생성 응답 데이터값
interface MemoCreateData {
    id: number;
}

// 메모 생성 응답값
interface MemoCreateResponse {
    status: number;
    code: string;
    message: string;
    data: MemoCreateData;
}

// 메모 수정 요청값
interface MemoUpdateRequest {
    title: string;
    content?: string;
}

// 메모 색상 변경 요청값
interface MemoColorChangeRequest {
    color: MemoColorCode;
}
