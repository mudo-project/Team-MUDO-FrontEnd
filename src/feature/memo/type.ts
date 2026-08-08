type MemoColorCode =
    | "ROSE"
    | "MUSTARD"
    | "SAGE"
    | "BLUE"
    | "LAVENDER"
    | "PINK"
    | "SLATE"
    | "PEACH"
    | "TEAL"
    | "OLIVE"
    | "CLAY"
    | "INDIGO";

type MemoSortOrder = "NEWEST" | "OLDEST";

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

interface MemoListResponse {
    status: number;
    code: string;
    message: string;
    data: MemoData[];
}

interface MemoCreateRequest {
    title: string;
    content?: string;
    color: MemoColorCode;
}

interface MemoCreateData {
    id: number;
}

interface MemoCreateResponse {
    status: number;
    code: string;
    message: string;
    data: MemoCreateData;
}

interface MemoUpdateRequest {
    title: string;
    content?: string;
}

interface MemoColorChangeRequest {
    color: MemoColorCode;
}
