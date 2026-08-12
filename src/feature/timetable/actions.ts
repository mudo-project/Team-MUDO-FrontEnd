'use server'

import {
    createTimetableSet,
    createTimetableSlot,
    deleteTimetableSet,
    deleteTimetableSlot,
    exportTimetableSet,
    getTimetableSetDetail,
    getTimetableSetList,
    getTimetableSlotDetail,
    getTimetableSlotList,
    updateTimetableSet,
    updateTimetableSlot,
} from "@/service/timetable.service";

interface TimetableActionState {
    success: boolean;
    message: string;
}

const EXPORT_MIME_TYPE: Record<TimetableExportFormat, string> = {
    EXCEL: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    PDF: "application/pdf",
    PNG: "image/png",
};

// 시간표 세트 생성·수정 공용 입력 검증
function validateTimetableSetPayload(
    payload: TimetableSetCreateRequest | TimetableSetUpdateRequest
): string | null {
    if (!payload.name.trim()) {
        return "시간표 세트 이름을 입력해주세요.";
    }

    if (!payload.startDate || !payload.endDate) {
        return "시작일과 종료일을 선택해주세요.";
    }

    if (payload.endDate < payload.startDate) {
        return "종료일은 시작일보다 빠를 수 없습니다.";
    }

    if (payload.operatingDays.length === 0) {
        return "운영 요일을 1개 이상 선택해주세요.";
    }

    if (payload.slotUnitMinutes <= 0) {
        return "슬롯 단위는 양수여야 합니다.";
    }

    const allCodes = payload.classrooms.flatMap((group) => group.codes);
    if (new Set(allCodes).size !== allCodes.length) {
        return "강의실 코드가 중복되었습니다.";
    }

    return null;
}

// 수업 슬롯 등록·수정 공용 입력 검증
function validateTimetableSlotPayload(
    payload: TimetableSlotCreateRequest | TimetableSlotUpdateRequest
): string | null {
    if (!payload.classroomCode.trim()) {
        return "강의실을 선택해주세요.";
    }

    if (!payload.startTime || !payload.endTime) {
        return "시작 시각과 종료 시각을 선택해주세요.";
    }

    if (payload.startTime >= payload.endTime) {
        return "시작 시각은 종료 시각보다 빨라야 합니다.";
    }

    return null;
}

// 시간표 세트 생성 액션
export const createTimetableSetAction = async (
    payload: TimetableSetCreateRequest
): Promise<TimetableActionState & { timetableSetId?: number }> => {
    const validationMessage = validateTimetableSetPayload(payload);
    if (validationMessage) {
        return {
            success: false,
            message: validationMessage,
        };
    }

    try {
        const timetableSetId = await createTimetableSet(payload);

        return {
            success: true,
            message: "시간표 세트가 생성되었습니다.",
            timetableSetId,
        };
    } catch (error) {
        let errorMessage = "시간표 세트 생성에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage,
        };
    }
};

// 시간표 세트 목록조회 액션
export const getTimetableSetListAction = async (): Promise<TimetableSetListData[]> => {
    return getTimetableSetList();
};

// 시간표 세트 상세조회 액션
export const getTimetableSetDetailAction = async (
    timetableSetId: number
): Promise<TimetableSetDetailData> => {
    return getTimetableSetDetail(timetableSetId);
};

// 시간표 세트 수정 액션
export const updateTimetableSetAction = async (
    timetableSetId: number,
    payload: TimetableSetUpdateRequest
): Promise<TimetableActionState> => {
    const validationMessage = validateTimetableSetPayload(payload);
    if (validationMessage) {
        return {
            success: false,
            message: validationMessage,
        };
    }

    try {
        await updateTimetableSet(timetableSetId, payload);

        return {
            success: true,
            message: "시간표 세트가 수정되었습니다.",
        };
    } catch (error) {
        let errorMessage = "시간표 세트 수정에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage,
        };
    }
};

// 시간표 세트 삭제 액션
export const deleteTimetableSetAction = async (
    timetableSetId: number
): Promise<TimetableActionState> => {
    try {
        await deleteTimetableSet(timetableSetId);

        return {
            success: true,
            message: "시간표 세트가 삭제되었습니다.",
        };
    } catch (error) {
        let errorMessage = "시간표 세트 삭제에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage,
        };
    }
};

// 수업 슬롯 등록 액션
export const createTimetableSlotAction = async (
    timetableSetId: number,
    payload: TimetableSlotCreateRequest
): Promise<TimetableActionState & { timetableSlotId?: number }> => {
    const validationMessage = validateTimetableSlotPayload(payload);
    if (validationMessage) {
        return {
            success: false,
            message: validationMessage,
        };
    }

    try {
        const timetableSlotId = await createTimetableSlot(timetableSetId, payload);

        return {
            success: true,
            message: "수업 슬롯이 등록되었습니다.",
            timetableSlotId,
        };
    } catch (error) {
        let errorMessage = "수업 슬롯 등록에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage,
        };
    }
};

// 수업 슬롯 목록조회 액션
export const getTimetableSlotListAction = async (
    timetableSetId: number
): Promise<TimetableSlotData[]> => {
    return getTimetableSlotList(timetableSetId);
};

// 수업 슬롯 상세조회 액션
export const getTimetableSlotDetailAction = async (
    timetableSetId: number,
    timetableSlotId: number
): Promise<TimetableSlotData> => {
    return getTimetableSlotDetail(timetableSetId, timetableSlotId);
};

// 수업 슬롯 수정 액션
export const updateTimetableSlotAction = async (
    timetableSetId: number,
    timetableSlotId: number,
    payload: TimetableSlotUpdateRequest
): Promise<TimetableActionState> => {
    if (payload.scope !== "ALL") {
        return {
            success: false,
            message: "현재는 전체 적용(scope: ALL)만 지원합니다.",
        };
    }

    const validationMessage = validateTimetableSlotPayload(payload);
    if (validationMessage) {
        return {
            success: false,
            message: validationMessage,
        };
    }

    try {
        await updateTimetableSlot(timetableSetId, timetableSlotId, payload);

        return {
            success: true,
            message: "수업 슬롯이 수정되었습니다.",
        };
    } catch (error) {
        let errorMessage = "수업 슬롯 수정에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage,
        };
    }
};

// 수업 슬롯 삭제 액션
export const deleteTimetableSlotAction = async (
    timetableSetId: number,
    timetableSlotId: number,
    scope: TimetableSlotUpdateScope = "ALL"
): Promise<TimetableActionState> => {
    if (scope !== "ALL") {
        return {
            success: false,
            message: "현재는 전체 적용(scope: ALL)만 지원합니다.",
        };
    }

    try {
        await deleteTimetableSlot(timetableSetId, timetableSlotId, scope);

        return {
            success: true,
            message: "수업 슬롯이 삭제되었습니다.",
        };
    } catch (error) {
        let errorMessage = "수업 슬롯 삭제에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage,
        };
    }
};

// 시간표 세트 내보내기 액션 (다운로드 가능한 형태로 변환해 반환)
export const exportTimetableSetAction = async (
    timetableSetId: number,
    params: TimetableExportParams
): Promise<TimetableActionState & { file?: string; mimeType?: string }> => {
    try {
        const blob = await exportTimetableSet(timetableSetId, params);
        const buffer = await blob.arrayBuffer();

        return {
            success: true,
            message: "시간표 세트 내보내기에 성공했습니다.",
            file: Buffer.from(buffer).toString("base64"),
            mimeType: EXPORT_MIME_TYPE[params.format],
        };
    } catch (error) {
        let errorMessage = "시간표 세트 내보내기에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage,
        };
    }
};
