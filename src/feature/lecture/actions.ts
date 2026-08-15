"use server";

import {
    createLecture,
    deleteLecture,
    getLectureClassrooms,
    getLectureDetail,
    getLectureList,
    getLectureSubjects,
    getLectureTeachers,
    getLectureTerms,
    updateLecture,
} from "@/service/lecture.service";
import {
    CreateLectureData,
    CreateLectureRequest,
    LectureDetailData,
    LectureListData,
    LectureListQuery,
    LectureTermData,
    UpdateLectureRequest,
} from "./type";

export interface LectureActionResult<T = undefined> {
    success: boolean;
    message: string;
    data?: T;
}

const getActionErrorMessage = (error: unknown, fallback: string) =>
    error instanceof Error ? error.message : fallback;

const isPositiveInteger = (value: number) => Number.isInteger(value) && value > 0;
const lectureClassTypes = ["CLASS", "SPECIAL", "CLINIC", "STANDING", "EXAM"];
const lectureDays = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
const lectureGrades = [
    "ELEMENTARY_1", "ELEMENTARY_2", "ELEMENTARY_3", "ELEMENTARY_4", "ELEMENTARY_5", "ELEMENTARY_6",
    "MIDDLE_1", "MIDDLE_2", "MIDDLE_3", "HIGH_1", "HIGH_2", "HIGH_3", "RETAKE",
];
const lectureFeeTypes = ["PER_SESSION", "PER_MONTH"];
const timePattern = /^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/;

const validateLectureRequest = (payload: CreateLectureRequest) => {
    if (!payload.name.trim()) return "강의명을 입력해주세요.";
    if (!lectureClassTypes.includes(payload.classType)) return "강의 유형이 올바르지 않습니다.";
    if (!payload.classroomCode.trim()) return "강의실 코드를 입력해주세요.";
    if (payload.schedules.length === 0) return "강의 시간을 한 개 이상 입력해주세요.";
    for (const schedule of payload.schedules) {
        if (!lectureDays.includes(schedule.dayOfWeek)) return "강의 요일이 올바르지 않습니다.";
        if (!timePattern.test(schedule.startTime) || !timePattern.test(schedule.endTime)) return "강의 시간을 입력해주세요.";
        if (schedule.startTime >= schedule.endTime) return "시작 시간은 종료 시간보다 빨라야 합니다.";
    }
    if (payload.grade && !lectureGrades.includes(payload.grade)) return "강의 학년이 올바르지 않습니다.";
    if (payload.feeType && !lectureFeeTypes.includes(payload.feeType)) return "수강료 유형이 올바르지 않습니다.";
    if (
        payload.feeAmount !== undefined &&
        payload.feeAmount !== null &&
        (!Number.isInteger(payload.feeAmount) || payload.feeAmount < 0)
    ) {
        return "수강료 금액이 올바르지 않습니다.";
    }
};

const getOptionalString = (formData: FormData, name: string) => {
    const value = String(formData.get(name) ?? "").trim();
    return value || undefined;
};

const normalizeTime = (value: FormDataEntryValue | undefined) => {
    const time = String(value ?? "");
    return time.length === 5 ? `${time}:00` : time;
};

const getLectureRequest = (formData: FormData): CreateLectureRequest => {
    const feeAmountValue = getOptionalString(formData, "feeAmount");
    const days = formData.getAll("dayOfWeek");
    const startTimes = formData.getAll("startTime");
    const endTimes = formData.getAll("endTime");
    const schedules = days.map((dayOfWeek, index) => ({
        dayOfWeek: String(dayOfWeek) as CreateLectureRequest["schedules"][number]["dayOfWeek"],
        startTime: normalizeTime(startTimes[index]),
        endTime: normalizeTime(endTimes[index]),
    }));

    return {
        name: String(formData.get("name") ?? "").trim(),
        classType: String(formData.get("classType") ?? "") as CreateLectureRequest["classType"],
        classroomCode: String(formData.get("classroomCode") ?? "").trim(),
        schedules,
        grade: getOptionalString(formData, "grade") as CreateLectureRequest["grade"],
        teacherName: getOptionalString(formData, "teacherName"),
        subjectName: getOptionalString(formData, "subjectName"),
        termName: getOptionalString(formData, "termName"),
        feeType: getOptionalString(formData, "feeType") as CreateLectureRequest["feeType"],
        feeAmount: feeAmountValue === undefined ? undefined : Number(feeAmountValue),
    };
};

export const getLectureListAction = async (
    query: LectureListQuery = {},
): Promise<LectureActionResult<LectureListData>> => {
    if (
        (query.termId !== undefined && !isPositiveInteger(query.termId)) ||
        (query.page !== undefined && (!Number.isInteger(query.page) || query.page < 0)) ||
        (query.size !== undefined && (!Number.isInteger(query.size) || query.size < 1 || query.size > 100))
    ) {
        return { success: false, message: "강의 목록 조회 조건이 올바르지 않습니다." };
    }

    try {
        const response = await getLectureList(query);
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return { success: false, message: getActionErrorMessage(error, "강의 목록 조회에 실패했습니다.") };
    }
};

export const getLectureDetailAction = async (
    lectureId: number,
): Promise<LectureActionResult<LectureDetailData>> => {
    if (!isPositiveInteger(lectureId)) return { success: false, message: "강의 번호가 올바르지 않습니다." };

    try {
        const response = await getLectureDetail(lectureId);
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return { success: false, message: getActionErrorMessage(error, "강의 상세 조회에 실패했습니다.") };
    }
};

export const createLectureAction = async (
    _prevState: LectureActionResult<CreateLectureData>,
    formData: FormData,
): Promise<LectureActionResult<CreateLectureData>> => {
    const payload = getLectureRequest(formData);
    const validationMessage = validateLectureRequest(payload);
    if (validationMessage) return { success: false, message: validationMessage };

    try {
        const response = await createLecture(payload);
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return { success: false, message: getActionErrorMessage(error, "강의 등록에 실패했습니다.") };
    }
};

export const updateLectureAction = async (
    lectureId: number,
    _prevState: LectureActionResult,
    formData: FormData,
): Promise<LectureActionResult> => {
    if (!isPositiveInteger(lectureId)) return { success: false, message: "강의 번호가 올바르지 않습니다." };

    const payload: UpdateLectureRequest = getLectureRequest(formData);
    const validationMessage = validateLectureRequest(payload);
    if (validationMessage) return { success: false, message: validationMessage };

    try {
        const response = await updateLecture(lectureId, payload);
        return { success: true, message: response.message };
    } catch (error) {
        return { success: false, message: getActionErrorMessage(error, "강의 수정에 실패했습니다.") };
    }
};

export const deleteLectureAction = async (lectureId: number): Promise<LectureActionResult> => {
    if (!isPositiveInteger(lectureId)) return { success: false, message: "강의 번호가 올바르지 않습니다." };

    try {
        await deleteLecture(lectureId);
        return { success: true, message: "강의 삭제에 성공했습니다." };
    } catch (error) {
        return { success: false, message: getActionErrorMessage(error, "강의 삭제에 실패했습니다.") };
    }
};

export const getLectureTeachersAction = async (): Promise<LectureActionResult<string[]>> => {
    try {
        const response = await getLectureTeachers();
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return { success: false, message: getActionErrorMessage(error, "강의 담당 선생님 목록 조회에 실패했습니다.") };
    }
};

export const getLectureSubjectsAction = async (): Promise<LectureActionResult<string[]>> => {
    try {
        const response = await getLectureSubjects();
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return { success: false, message: getActionErrorMessage(error, "강의 과목 목록 조회에 실패했습니다.") };
    }
};

export const getLectureClassroomsAction = async (): Promise<LectureActionResult<string[]>> => {
    try {
        const response = await getLectureClassrooms();
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return { success: false, message: getActionErrorMessage(error, "강의실 목록 조회에 실패했습니다.") };
    }
};

export const getLectureTermsAction = async (): Promise<LectureActionResult<LectureTermData[]>> => {
    try {
        const response = await getLectureTerms();
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return { success: false, message: getActionErrorMessage(error, "강의 학기 목록 조회에 실패했습니다.") };
    }
};
