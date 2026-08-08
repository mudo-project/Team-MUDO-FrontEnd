'use server'

import { changeMemoColor, createMemo, deleteMemo, getMemoList, updateMemo } from "@/service/memo.service";

interface MemoActionState {
    success: boolean;
    message: string;
}

const MEMO_COLOR_CODES: MemoColorCode[] = [
    "ROSE",
    "MUSTARD",
    "SAGE",
    "BLUE",
    "LAVENDER",
    "PINK",
    "SLATE",
    "PEACH",
    "TEAL",
    "OLIVE",
    "CLAY",
    "INDIGO",
];

export const getMemoListAction = async (sort?: MemoSortOrder): Promise<MemoData[]> => {
    return getMemoList(sort);
}

export const createMemoAction = async (
    title: string,
    content: string,
    color: MemoColorCode
): Promise<MemoActionState & { id?: number }> => {
    if (!title.trim()) {
        return {
            success: false,
            message: "제목을 입력해주세요."
        };
    }

    if (title.length > 100) {
        return {
            success: false,
            message: "제목은 최대 100자까지 입력할 수 있습니다."
        };
    }

    if (!MEMO_COLOR_CODES.includes(color)) {
        return {
            success: false,
            message: "올바르지 않은 색상입니다."
        };
    }

    try {
        const id = await createMemo({
            title,
            content: content.trim() ? content : undefined,
            color,
        });

        return {
            success: true,
            message: "메모가 생성되었습니다.",
            id,
        };
    } catch (error) {
        let errorMessage = "메모 생성에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}

export const updateMemoAction = async (
    memoId: number,
    title: string,
    content: string
): Promise<MemoActionState> => {
    if (!title.trim()) {
        return {
            success: false,
            message: "제목을 입력해주세요."
        };
    }

    if (title.length > 100) {
        return {
            success: false,
            message: "제목은 최대 100자까지 입력할 수 있습니다."
        };
    }

    try {
        await updateMemo(memoId, {
            title,
            content: content.trim() ? content : undefined,
        });

        return {
            success: true,
            message: "메모가 수정되었습니다."
        };
    } catch (error) {
        let errorMessage = "메모 수정에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}

export const changeMemoColorAction = async (
    memoId: number,
    color: MemoColorCode
): Promise<MemoActionState> => {
    if (!MEMO_COLOR_CODES.includes(color)) {
        return {
            success: false,
            message: "올바르지 않은 색상입니다."
        };
    }

    try {
        await changeMemoColor(memoId, { color });

        return {
            success: true,
            message: "메모 색상이 변경되었습니다."
        };
    } catch (error) {
        let errorMessage = "메모 색상 변경에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}

export const deleteMemoAction = async (memoId: number): Promise<MemoActionState> => {
    try {
        await deleteMemo(memoId);

        return {
            success: true,
            message: "메모가 삭제되었습니다."
        };
    } catch (error) {
        let errorMessage = "메모 삭제에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}
