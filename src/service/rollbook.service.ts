import { fetchWithAuth } from "@/lib/fetch";
import { getErrorMessage } from "@/lib/stateError";
import {
    ChangeAttendanceRequest,
    LectureAttendanceResponse,
    MessageCandidateListResponse,
    SendAttendanceMessageRequest,
    SendAttendanceMessageResponse,
} from "@/feature/rollbook/type";

const getAttendanceEndpoint = (lectureId: number, date: string, suffix = "") => {
    const query = new URLSearchParams({ date });
    return `/api/rollcall/lectures/${lectureId}/attendance${suffix}?${query.toString()}`;
};

export const getLectureAttendance = async (lectureId: number, date: string): Promise<LectureAttendanceResponse> => {
    const response = await fetchWithAuth(getAttendanceEndpoint(lectureId, date));

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, "강의 출결부 조회에 실패했습니다."));
    }

    return response.json();
};

export const changeLectureAttendance = async (
    lectureId: number,
    date: string,
    payload: ChangeAttendanceRequest,
): Promise<void> => {
    const response = await fetchWithAuth(getAttendanceEndpoint(lectureId, date), {
        method: "PUT",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, "출결 저장에 실패했습니다."));
    }
};

export const exportLectureAttendance = async (lectureId: number, date: string): Promise<Blob> => {
    const response = await fetchWithAuth(getAttendanceEndpoint(lectureId, date, "/export"));

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, "출결부 엑셀 다운로드에 실패했습니다."));
    }

    return response.blob();
};

export const getMessageCandidates = async (lectureId: number, date: string): Promise<MessageCandidateListResponse> => {
    const response = await fetchWithAuth(getAttendanceEndpoint(lectureId, date, "/message-candidates"));

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, "문자 발송 대상 조회에 실패했습니다."));
    }

    return response.json();
};

export const sendAttendanceMessage = async (
    lectureId: number,
    date: string,
    payload: SendAttendanceMessageRequest,
): Promise<SendAttendanceMessageResponse> => {
    const response = await fetchWithAuth(getAttendanceEndpoint(lectureId, date, "/message-candidates/send"), {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, "출결 안내 문자 발송에 실패했습니다."));
    }

    return response.json();
};

