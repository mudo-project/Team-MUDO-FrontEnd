import { fetchWithAuth } from "@/lib/fetch";
import { getErrorMessage } from "@/lib/stateError";

// 시간표 세트 생성 API
export const createTimetableSet = async (
    payload: TimetableSetCreateRequest
): Promise<number> => {
    const response = await fetchWithAuth("/api/timetables", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "시간표 세트 생성에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as TimetableSetCreateResponse;

    return resData.data.timetableSetId;
};

// 시간표 세트 목록조회 API
export const getTimetableSetList = async (): Promise<TimetableSetListData[]> => {
    const response = await fetchWithAuth("/api/timetables");

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "시간표 세트 목록 조회에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as TimetableSetListResponse;

    return resData.data;
};

// 시간표 세트 상세조회 API
export const getTimetableSetDetail = async (
    timetableSetId: number
): Promise<TimetableSetDetailData> => {
    const response = await fetchWithAuth(`/api/timetables/${timetableSetId}`);

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "시간표 세트 상세 조회에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as TimetableSetDetailResponse;

    return resData.data;
};

// 시간표 세트 수정 API
export const updateTimetableSet = async (
    timetableSetId: number,
    payload: TimetableSetUpdateRequest
): Promise<void> => {
    const response = await fetchWithAuth(`/api/timetables/${timetableSetId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "시간표 세트 수정에 실패하였습니다."
        );

        throw new Error(message);
    }
};

// 시간표 세트 삭제 API
export const deleteTimetableSet = async (timetableSetId: number): Promise<void> => {
    const response = await fetchWithAuth(`/api/timetables/${timetableSetId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "시간표 세트 삭제에 실패하였습니다."
        );

        throw new Error(message);
    }
};

// 수업 등록 API
export const createTimetableSlot = async (
    timetableSetId: number,
    payload: TimetableSlotCreateRequest
): Promise<number> => {
    const response = await fetchWithAuth(`/api/timetables/${timetableSetId}/slots`, {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "수업 슬롯 등록에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as TimetableSlotCreateResponse;

    return resData.data.timetableSlotId;
};

// 수업 목록조회 API
export const getTimetableSlotList = async (
    timetableSetId: number
): Promise<TimetableSlotData[]> => {
    const response = await fetchWithAuth(`/api/timetables/${timetableSetId}/slots`);

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "수업 슬롯 목록 조회에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as TimetableSlotListResponse;

    return resData.data;
};

// 수업 상세조회 API
export const getTimetableSlotDetail = async (
    timetableSetId: number,
    timetableSlotId: number
): Promise<TimetableSlotData> => {
    const response = await fetchWithAuth(
        `/api/timetables/${timetableSetId}/slots/${timetableSlotId}`
    );

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "수업 슬롯 상세 조회에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as TimetableSlotDetailResponse;

    return resData.data;
};

// 수업 수정 API
export const updateTimetableSlot = async (
    timetableSetId: number,
    timetableSlotId: number,
    payload: TimetableSlotUpdateRequest
): Promise<void> => {
    const response = await fetchWithAuth(
        `/api/timetables/${timetableSetId}/slots/${timetableSlotId}`,
        {
            method: "PATCH",
            body: JSON.stringify(payload),
        }
    );

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "수업 슬롯 수정에 실패하였습니다."
        );

        throw new Error(message);
    }
};

// 수업 삭제 API
export const deleteTimetableSlot = async (
    timetableSetId: number,
    timetableSlotId: number,
    scope: TimetableSlotUpdateScope
): Promise<void> => {
    const response = await fetchWithAuth(
        `/api/timetables/${timetableSetId}/slots/${timetableSlotId}?scope=${scope}`,
        {
            method: "DELETE",
        }
    );

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "수업 슬롯 삭제에 실패하였습니다."
        );

        throw new Error(message);
    }
};

// 시간표 세트 내보내기 API (응답 본문이 파일 바이트이므로 Blob으로 반환)
export const exportTimetableSet = async (
    timetableSetId: number,
    params: TimetableExportParams
): Promise<Blob> => {
    const query = new URLSearchParams({ format: params.format });
    if (params.density) query.set("density", params.density);
    if (params.dayOfWeek) query.set("dayOfWeek", params.dayOfWeek);
    if (params.floor) query.set("floor", params.floor);
    if (params.classType) query.set("classType", params.classType);

    const response = await fetchWithAuth(
        `/api/timetables/${timetableSetId}/export?${query.toString()}`
    );

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "시간표 세트 내보내기에 실패하였습니다."
        );

        throw new Error(message);
    }

    return response.blob();
};
