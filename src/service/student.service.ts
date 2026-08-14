import { fetchWithAuth } from "@/lib/fetch";
import { getErrorMessage } from "@/lib/stateError";
import {
    CreateStudentEnrollmentRequest,
    CreateStudentEnrollmentResponse,
    CreateStudentRequest,
    CreateStudentResponse,
    StudentDetailResponse,
    StudentListResponse,
    UpdateStudentRequest,
} from "@/feature/student/type";

export const createStudent = async (
    payload: CreateStudentRequest,
): Promise<CreateStudentResponse> => {
    const response = await fetchWithAuth("/api/students", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(response, "학생 등록에 실패했습니다.");
        throw new Error(message);
    }

    return response.json();
};

export const getStudentList = async (
    keyword = "",
    page = 0,
    size = 30,
): Promise<StudentListResponse> => {
    const searchParams = new URLSearchParams({
        keyword,
        page: String(page),
        size: String(size),
    });
    const response = await fetchWithAuth(`/api/students?${searchParams}`);

    if (!response.ok) {
        const message = await getErrorMessage(response, "학생 목록 조회에 실패했습니다.");
        throw new Error(message);
    }

    return response.json();
};

export const getStudentDetail = async (
    studentId: number,
): Promise<StudentDetailResponse> => {
    const response = await fetchWithAuth(`/api/students/${studentId}`);

    if (!response.ok) {
        const message = await getErrorMessage(response, "학생 상세 조회에 실패했습니다.");
        throw new Error(message);
    }

    return response.json();
};

export const updateStudent = async (
    studentId: number,
    payload: UpdateStudentRequest,
): Promise<void> => {
    const response = await fetchWithAuth(`/api/students/${studentId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(response, "학생 정보 수정에 실패했습니다.");
        throw new Error(message);
    }
};

export const deleteStudent = async (studentId: number): Promise<void> => {
    const response = await fetchWithAuth(`/api/students/${studentId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const message = await getErrorMessage(response, "학생 삭제에 실패했습니다.");
        throw new Error(message);
    }
};

export const createStudentEnrollment = async (
    studentId: number,
    payload: CreateStudentEnrollmentRequest,
): Promise<CreateStudentEnrollmentResponse> => {
    const response = await fetchWithAuth(`/api/students/${studentId}/enrollments`, {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(response, "학생 수강 등록에 실패했습니다.");
        throw new Error(message);
    }

    return response.json();
};

export const endStudentEnrollment = async (
    studentId: number,
    enrollmentId: number,
): Promise<void> => {
    const response = await fetchWithAuth(
        `/api/students/${studentId}/enrollments/${enrollmentId}/end`,
        { method: "PATCH" },
    );

    if (!response.ok) {
        const message = await getErrorMessage(response, "학생 수강 종료에 실패했습니다.");
        throw new Error(message);
    }
};
