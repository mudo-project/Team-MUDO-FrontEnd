'use server'

import {
    createSchedule,
    deleteSchedule,
    getScheduleDetail,
    getScheduleList,
    updateSchedule,
} from "@/service/schedule.service";

interface ScheduleActionState {
    success: boolean;
    message: string;
}

// 일정 목록조회 액션
export const getScheduleListAction = async (params: ScheduleListParams): Promise<ScheduleEventData[]> => {
    return getScheduleList(params);
}

// 일정 상세조회 액션
export const getScheduleDetailAction = async (eventId: number): Promise<ScheduleEventData> => {
    return getScheduleDetail(eventId);
}

// 일정 생성 액션
export const createScheduleAction = async (
    payload: ScheduleCreateRequest
): Promise<ScheduleActionState & { eventId?: number }> => {
    if (!payload.title.trim()) {
        return {
            success: false,
            message: "일정 제목을 입력해주세요."
        };
    }

    if (!payload.eventStartAt) {
        return {
            success: false,
            message: "일정 날짜와 시작 시간을 선택해주세요."
        };
    }

    if (payload.eventEndAt && payload.eventEndAt < payload.eventStartAt) {
        return {
            success: false,
            message: "종료 시간은 시작 시간보다 늦어야 해요."
        };
    }

    try {
        const eventId = await createSchedule(payload);

        return {
            success: true,
            message: "일정이 등록되었습니다.",
            eventId,
        };
    } catch (error) {
        let errorMessage = "일정 등록에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}

// 일정 수정 액션
export const updateScheduleAction = async (
    eventId: number,
    payload: ScheduleUpdateRequest
): Promise<ScheduleActionState> => {
    if (!payload.title.trim()) {
        return {
            success: false,
            message: "일정 제목을 입력해주세요."
        };
    }

    if (!payload.eventStartAt) {
        return {
            success: false,
            message: "일정 날짜와 시작 시간을 선택해주세요."
        };
    }

    if (payload.eventEndAt && payload.eventEndAt < payload.eventStartAt) {
        return {
            success: false,
            message: "종료 시간은 시작 시간보다 늦어야 해요."
        };
    }

    try {
        await updateSchedule(eventId, payload);

        return {
            success: true,
            message: "일정이 수정되었습니다."
        };
    } catch (error) {
        let errorMessage = "일정 수정에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}

// 일정 삭제 액션
export const deleteScheduleAction = async (eventId: number): Promise<ScheduleActionState> => {
    try {
        await deleteSchedule(eventId);

        return {
            success: true,
            message: "일정이 삭제되었습니다."
        };
    } catch (error) {
        let errorMessage = "일정 삭제에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}
