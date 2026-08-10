import { fetchWithAuth } from "@/lib/fetch";
import { getErrorMessage } from "@/lib/stateError";

// 일정 생성 API
export const createSchedule = async (payload: ScheduleCreateRequest): Promise<number> => {
    const response = await fetchWithAuth("/api/calendars", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "일정 생성에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as ScheduleCreateResponse;

    return resData.data.eventId;
}

// 일정 목록조회 API (date 또는 yearMonth 중 하나만 전달)
export const getScheduleList = async (params: ScheduleListParams): Promise<ScheduleEventData[]> => {
    const query = new URLSearchParams();
    if (params.date) query.set("date", params.date);
    if (params.yearMonth) query.set("yearMonth", params.yearMonth);

    const response = await fetchWithAuth(`/api/calendars?${query.toString()}`);

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "일정 목록 조회에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as ScheduleListResponse;

    return resData.data;
}

// 일정 상세조회 API
export const getScheduleDetail = async (eventId: number): Promise<ScheduleEventData> => {
    const response = await fetchWithAuth(`/api/calendars/${eventId}`);

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "일정 상세 조회에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as ScheduleDetailResponse;

    return resData.data;
}

// 일정 수정 API
export const updateSchedule = async (eventId: number, payload: ScheduleUpdateRequest): Promise<void> => {
    const response = await fetchWithAuth(`/api/calendars/${eventId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "일정 수정에 실패하였습니다."
        );

        throw new Error(message);
    }
}

// 일정 삭제 API
export const deleteSchedule = async (eventId: number): Promise<void> => {
    const response = await fetchWithAuth(`/api/calendars/${eventId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "일정 삭제에 실패하였습니다."
        );

        throw new Error(message);
    }
}
