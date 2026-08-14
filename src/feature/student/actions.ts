"use server";

import {
    createStudent,
    createStudentEnrollment,
    deleteStudent,
    endStudentEnrollment,
    getStudentDetail,
    getStudentList,
    updateStudent,
} from "@/service/student.service";
import {
    CreateStudentData,
    CreateStudentEnrollmentData,
    CreateStudentRequest,
    StudentDetailData,
    StudentGrade,
    StudentListResponseData,
    UpdateStudentRequest,
} from "./type";

export interface StudentActionResult<T = undefined> {
    success: boolean;
    message: string;
    data?: T;
}

const studentGrades: StudentGrade[] = [
    "ELEMENTARY_1", "ELEMENTARY_2", "ELEMENTARY_3", "ELEMENTARY_4", "ELEMENTARY_5", "ELEMENTARY_6",
    "MIDDLE_1", "MIDDLE_2", "MIDDLE_3",
    "HIGH_1", "HIGH_2", "HIGH_3", "RETAKE",
];

const isPositiveInteger = (value: number) => Number.isInteger(value) && value > 0;
const getActionErrorMessage = (error: unknown, fallback: string) =>
    error instanceof Error ? error.message : fallback;

const isValidStudentRequest = (payload: CreateStudentRequest) => {
    if (!payload.name.trim() || payload.name.trim().length > 50) {
        return "학생 이름은 1자 이상 50자 이하로 입력해주세요.";
    }

    if (!studentGrades.includes(payload.grade)) {
        return "학생 학년이 올바르지 않습니다.";
    }

    if (
        (payload.school?.length ?? 0) > 100 ||
        (payload.phone?.length ?? 0) > 30 ||
        (payload.parentPhone?.length ?? 0) > 30 ||
        (payload.note?.length ?? 0) > 500
    ) {
        return "학생 정보의 글자 수가 올바르지 않습니다.";
    }
};

export const createStudentAction = async (
    payload: CreateStudentRequest,
): Promise<StudentActionResult<CreateStudentData>> => {
    try {
        const response = await createStudent(payload);
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return { success: false, message: getActionErrorMessage(error, "학생 등록에 실패했습니다.") };
    }
};

export const getStudentListAction = async (
    keyword = "",
    page = 0,
    size = 30,
): Promise<StudentActionResult<StudentListResponseData>> => {
    if (!Number.isInteger(page) || page < 0 || !Number.isInteger(size) || size < 1 || size > 100) {
        return { success: false, message: "학생 목록 페이지 조건이 올바르지 않습니다." };
    }

    try {
        const response = await getStudentList(keyword, page, size);
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return { success: false, message: getActionErrorMessage(error, "학생 목록 조회에 실패했습니다.") };
    }
};

export const getStudentDetailAction = async (
    studentId: number,
): Promise<StudentActionResult<StudentDetailData>> => {
    if (!isPositiveInteger(studentId)) return { success: false, message: "학생 번호가 올바르지 않습니다." };

    try {
        const response = await getStudentDetail(studentId);
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return { success: false, message: getActionErrorMessage(error, "학생 상세 조회에 실패했습니다.") };
    }
};

export const updateStudentAction = async (
    studentId: number,
    payload: UpdateStudentRequest,
): Promise<StudentActionResult> => {
    if (!isPositiveInteger(studentId)) return { success: false, message: "학생 번호가 올바르지 않습니다." };

    const validationMessage = isValidStudentRequest(payload);
    if (validationMessage) return { success: false, message: validationMessage };

    try {
        await updateStudent(studentId, payload);
        return { success: true, message: "학생 정보 수정에 성공했습니다." };
    } catch (error) {
        return { success: false, message: getActionErrorMessage(error, "학생 정보 수정에 실패했습니다.") };
    }
};

export const deleteStudentAction = async (
    studentId: number,
): Promise<StudentActionResult> => {
    if (!isPositiveInteger(studentId)) return { success: false, message: "학생 번호가 올바르지 않습니다." };

    try {
        await deleteStudent(studentId);
        return { success: true, message: "학생 삭제에 성공했습니다." };
    } catch (error) {
        return { success: false, message: getActionErrorMessage(error, "학생 삭제에 실패했습니다.") };
    }
};

export const createStudentEnrollmentAction = async (
    studentId: number,
    lectureId: number,
): Promise<StudentActionResult<CreateStudentEnrollmentData>> => {
    if (!isPositiveInteger(studentId) || !isPositiveInteger(lectureId)) {
        return { success: false, message: "학생 또는 강의 번호가 올바르지 않습니다." };
    }

    try {
        const response = await createStudentEnrollment(studentId, { lectureId });
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return { success: false, message: getActionErrorMessage(error, "학생 수강 등록에 실패했습니다.") };
    }
};

export const endStudentEnrollmentAction = async (
    studentId: number,
    enrollmentId: number,
): Promise<StudentActionResult> => {
    if (!isPositiveInteger(studentId) || !isPositiveInteger(enrollmentId)) {
        return { success: false, message: "학생 또는 수강 번호가 올바르지 않습니다." };
    }

    try {
        await endStudentEnrollment(studentId, enrollmentId);
        return { success: true, message: "학생 수강 종료에 성공했습니다." };
    } catch (error) {
        return { success: false, message: getActionErrorMessage(error, "학생 수강 종료에 실패했습니다.") };
    }
};
