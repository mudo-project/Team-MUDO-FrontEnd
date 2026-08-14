import { fetchWithAuth } from "@/lib/fetch";
import { getErrorMessage } from "@/lib/stateError";
import {
    CreateLectureRequest,
    CreateLectureResponse,
    LectureDetailResponse,
    LectureListQuery,
    LectureListResponse,
    LectureNameListResponse,
    LectureTermListResponse,
    UpdateLectureRequest,
    UpdateLectureResponse,
} from "@/feature/lecture/type";

const getLectureQueryString = (query: LectureListQuery) => {
    const searchParams = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
        if (value === undefined || value === "") return;
        searchParams.set(key, String(value));
    });

    return searchParams.toString();
};

export const getLectureList = async (query: LectureListQuery = {}): Promise<LectureListResponse> => {
    const queryString = getLectureQueryString(query);
    const response = await fetchWithAuth(`/api/lectures${queryString ? `?${queryString}` : ""}`);

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, "강의 목록 조회에 실패했습니다."));
    }

    return response.json();
};

export const getLectureDetail = async (lectureId: number): Promise<LectureDetailResponse> => {
    const response = await fetchWithAuth(`/api/lectures/${lectureId}`);

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, "강의 상세 조회에 실패했습니다."));
    }

    return response.json();
};

export const createLecture = async (payload: CreateLectureRequest): Promise<CreateLectureResponse> => {
    const response = await fetchWithAuth("/api/lectures", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, "강의 등록에 실패했습니다."));
    }

    return response.json();
};

export const updateLecture = async (
    lectureId: number,
    payload: UpdateLectureRequest,
): Promise<UpdateLectureResponse> => {
    const response = await fetchWithAuth(`/api/lectures/${lectureId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, "강의 수정에 실패했습니다."));
    }

    return response.json();
};

export const deleteLecture = async (lectureId: number): Promise<void> => {
    const response = await fetchWithAuth(`/api/lectures/${lectureId}`, { method: "DELETE" });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, "강의 삭제에 실패했습니다."));
    }
};

const getLectureNameList = async (endpoint: string, fallbackMessage: string): Promise<LectureNameListResponse> => {
    const response = await fetchWithAuth(endpoint);

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, fallbackMessage));
    }

    return response.json();
};

export const getLectureTeachers = (): Promise<LectureNameListResponse> =>
    getLectureNameList("/api/lectures/teachers", "강의 담당 선생님 목록 조회에 실패했습니다.");

export const getLectureSubjects = (): Promise<LectureNameListResponse> =>
    getLectureNameList("/api/lectures/subjects", "강의 과목 목록 조회에 실패했습니다.");

export const getLectureClassrooms = (): Promise<LectureNameListResponse> =>
    getLectureNameList("/api/lectures/classrooms", "강의실 목록 조회에 실패했습니다.");

export const getLectureTerms = async (): Promise<LectureTermListResponse> => {
    const response = await fetchWithAuth("/api/lectures/terms");

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, "강의 학기 목록 조회에 실패했습니다."));
    }

    return response.json();
};
