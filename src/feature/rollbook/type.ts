import { LectureGrade } from "@/feature/lecture/type";

export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "ONLINE" | "ETC";

export interface RollbookApiResponse<T> {
    status: number;
    code: string;
    message: string;
    data: T;
}

export interface LectureAttendanceEntryData {
    studentId: number;
    studentName: string;
    grade: LectureGrade;
    parentPhone: string;
    status: AttendanceStatus | null;
    note: string | null;
}

export interface LectureAttendanceSummaryData {
    total: number;
    present: number;
    absent: number;
    late: number;
    online: number;
    etc: number;
}

export interface LectureAttendanceData {
    lectureId: number;
    lectureName: string;
    date: string;
    entries: LectureAttendanceEntryData[];
    summary: LectureAttendanceSummaryData;
}

export type LectureAttendanceResponse = RollbookApiResponse<LectureAttendanceData>;

export interface ChangeAttendanceEntryData {
    studentId: number;
    status: AttendanceStatus;
    note: string | null;
}

export interface ChangeAttendanceRequest {
    entries: ChangeAttendanceEntryData[];
}

export interface MessageCandidateData {
    studentId: number;
    studentName: string;
    status: AttendanceStatus;
    parentPhone: string;
    matchedTemplateId: number | null;
    matchedTemplateName: string | null;
    eligible: boolean;
}

export type MessageCandidateListResponse = RollbookApiResponse<MessageCandidateData[]>;

export interface SendAttendanceMessageRequest {
    studentIds: number[];
}

export interface SendAttendanceMessageData {
    studentId: number;
    studentName: string | null;
    sent: boolean;
    failureReason: string | null;
}

export type SendAttendanceMessageResponse = RollbookApiResponse<SendAttendanceMessageData[]>;

export interface MessageTemplateData {
    id: number;
    name: string;
    status: AttendanceStatus;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export type MessageTemplateListResponse = RollbookApiResponse<MessageTemplateData[]>;

export interface CreateMessageTemplateRequest {
    name: string;
    status: AttendanceStatus;
    content: string;
}

export interface CreateMessageTemplateData {
    templateId: number;
}

export type CreateMessageTemplateResponse = RollbookApiResponse<CreateMessageTemplateData>;

export interface ChangeMessageTemplateRequest {
    name: string;
    content: string;
}

export interface RollbookExportData {
    file: string;
    fileName: string;
    mimeType: string;
}
