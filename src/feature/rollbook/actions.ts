"use server";

import {
    changeLectureAttendance,
    exportLectureAttendance,
    getLectureAttendance,
    getMessageCandidates,
    sendAttendanceMessage,
} from "@/service/rollbook.service";
import {
    AttendanceStatus,
    ChangeAttendanceRequest,
    LectureAttendanceData,
    MessageCandidateData,
    RollbookExportData,
    SendAttendanceMessageData,
    SendAttendanceMessageRequest,
} from "@/feature/rollbook/type";

export interface RollbookActionResult<T = undefined> {
    success: boolean;
    message: string;
    data?: T;
}

const attendanceStatuses: AttendanceStatus[] = ["PRESENT", "ABSENT", "LATE", "ONLINE", "ETC"];
const isPositiveInteger = (value: number) => Number.isInteger(value) && value > 0;
const isValidDate = (value: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};
const getActionErrorMessage = (error: unknown, fallback: string) =>
    error instanceof Error ? error.message : fallback;

const validateLectureAndDate = (lectureId: number, date: string) => {
    if (!isPositiveInteger(lectureId)) return "강의 번호가 올바르지 않습니다.";
    if (!isValidDate(date)) return "출결 날짜 형식이 올바르지 않습니다.";
};

export const getLectureAttendanceAction = async (
    lectureId: number,
    date: string,
): Promise<RollbookActionResult<LectureAttendanceData>> => {
    const validationMessage = validateLectureAndDate(lectureId, date);
    if (validationMessage) return { success: false, message: validationMessage };

    try {
        const response = await getLectureAttendance(lectureId, date);
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return { success: false, message: getActionErrorMessage(error, "강의 출결부 조회에 실패했습니다.") };
    }
};

export const changeLectureAttendanceAction = async (
    lectureId: number,
    date: string,
    payload: ChangeAttendanceRequest,
): Promise<RollbookActionResult> => {
    const validationMessage = validateLectureAndDate(lectureId, date);
    if (validationMessage) return { success: false, message: validationMessage };
    if (!payload.entries.length) return { success: false, message: "저장할 출결을 선택해주세요." };
    if (payload.entries.some((entry) => !isPositiveInteger(entry.studentId) || !attendanceStatuses.includes(entry.status))) {
        return { success: false, message: "출결 정보가 올바르지 않습니다." };
    }
    if (payload.entries.some((entry) => entry.status === "ETC" && !entry.note?.trim())) {
        return { success: false, message: "기타 출결 사유를 입력해주세요." };
    }

    try {
        await changeLectureAttendance(lectureId, date, payload);
        return { success: true, message: "출결 저장에 성공했습니다." };
    } catch (error) {
        return { success: false, message: getActionErrorMessage(error, "출결 저장에 실패했습니다.") };
    }
};

export const exportLectureAttendanceAction = async (
    lectureId: number,
    date: string,
): Promise<RollbookActionResult<RollbookExportData>> => {
    const validationMessage = validateLectureAndDate(lectureId, date);
    if (validationMessage) return { success: false, message: validationMessage };

    try {
        const blob = await exportLectureAttendance(lectureId, date);
        const buffer = await blob.arrayBuffer();
        return {
            success: true,
            message: "출결부 엑셀 다운로드에 성공했습니다.",
            data: {
                file: Buffer.from(buffer).toString("base64"),
                fileName: `attendance_${lectureId}_${date}.xlsx`,
                mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            },
        };
    } catch (error) {
        return { success: false, message: getActionErrorMessage(error, "출결부 엑셀 다운로드에 실패했습니다.") };
    }
};

export const getMessageCandidatesAction = async (
    lectureId: number,
    date: string,
): Promise<RollbookActionResult<MessageCandidateData[]>> => {
    const validationMessage = validateLectureAndDate(lectureId, date);
    if (validationMessage) return { success: false, message: validationMessage };

    try {
        const response = await getMessageCandidates(lectureId, date);
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return { success: false, message: getActionErrorMessage(error, "문자 발송 대상 조회에 실패했습니다.") };
    }
};

export const sendAttendanceMessageAction = async (
    lectureId: number,
    date: string,
    payload: SendAttendanceMessageRequest,
): Promise<RollbookActionResult<SendAttendanceMessageData[]>> => {
    const validationMessage = validateLectureAndDate(lectureId, date);
    if (validationMessage) return { success: false, message: validationMessage };
    const studentIds = [...new Set(payload.studentIds)];
    if (!studentIds.length) return { success: false, message: "발송할 학생을 최소 1명 이상 선택해주세요." };
    if (studentIds.some((studentId) => !isPositiveInteger(studentId))) {
        return { success: false, message: "학생 번호가 올바르지 않습니다." };
    }

    try {
        const response = await sendAttendanceMessage(lectureId, date, { studentIds });
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return { success: false, message: getActionErrorMessage(error, "출결 안내 문자 발송에 실패했습니다.") };
    }
};

