export type DataImportRowStatus =
    | "READY"
    | "NEEDS_REVIEW"
    | "DUPLICATE_SUSPECTED"
    | "ERROR";

export interface DataImportApiResponse<T> {
    status: number;
    code: string;
    message: string;
    data: T;
}

export interface DataImportCreateData {
    importId: number;
}

interface DataImportDraftRow {
    rowId: string;
    selected: boolean;
    status: DataImportRowStatus;
    messages: string[];
}

export interface DataImportStudentDraftData extends DataImportDraftRow {
    name: string;
    grade: string;
    school: string;
    phone: string;
    parentPhone: string;
    note: string;
}

export interface DataImportLectureScheduleData {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
}

export interface DataImportLectureDraftData extends DataImportDraftRow {
    name: string;
    grade: string;
    termName: string;
    subjectName: string;
    teacherId: number;
    teacherName: string;
    classroomName: string;
    feeType: string;
    feeAmount: number;
    schedules: DataImportLectureScheduleData[];
}

export interface DataImportEnrollmentDraftData extends DataImportDraftRow {
    studentRowId: string;
    lectureRowId: string;
    studentName: string;
    studentPhone: string;
    lectureName: string;
    teacherName: string;
}

export interface DataImportDraftData {
    students: DataImportStudentDraftData[];
    lectures: DataImportLectureDraftData[];
    enrollments: DataImportEnrollmentDraftData[];
}

export interface DataImportResultData {
    createdStudents: number;
    createdLectures: number;
    createdEnrollments: number;
    skippedRows: number;
    failedRows: number;
}

export type DataImportCreateResponse = DataImportApiResponse<DataImportCreateData>;
export type DataImportDraftResponse = DataImportApiResponse<DataImportDraftData>;
export type DataImportConfirmResponse = DataImportApiResponse<DataImportResultData>;
export type DataImportResultResponse = DataImportApiResponse<DataImportResultData>;
