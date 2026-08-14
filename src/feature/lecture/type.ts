export type LectureGrade =
    | "ELEMENTARY_1" | "ELEMENTARY_2" | "ELEMENTARY_3"
    | "ELEMENTARY_4" | "ELEMENTARY_5" | "ELEMENTARY_6"
    | "MIDDLE_1" | "MIDDLE_2" | "MIDDLE_3"
    | "HIGH_1" | "HIGH_2" | "HIGH_3" | "RETAKE";

export type LectureClassType = "CLASS" | "SPECIAL" | "CLINIC" | "STANDING" | "EXAM";
export type LectureFeeType = "PER_SESSION" | "PER_MONTH";
export type LectureDayOfWeek =
    | "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY"
    | "FRIDAY" | "SATURDAY" | "SUNDAY";

export interface LectureApiResponse<T> {
    status: number;
    code: string;
    message: string;
    data: T;
}

export interface LectureScheduleData {
    dayOfWeek: LectureDayOfWeek;
    startTime: string;
    endTime: string;
}

export interface CreateLectureRequest {
    name: string;
    classType: LectureClassType;
    dayOfWeek: LectureDayOfWeek;
    classroomCode: string;
    startTime: string;
    endTime: string;
    grade?: LectureGrade | null;
    teacherName?: string | null;
    subjectName?: string | null;
    termName?: string | null;
    feeType?: LectureFeeType | null;
    feeAmount?: number | null;
}

export type UpdateLectureRequest = CreateLectureRequest;

export interface CreateLectureData {
    lectureId: number;
}

export type CreateLectureResponse = LectureApiResponse<CreateLectureData>;
export type UpdateLectureResponse = LectureApiResponse<null>;

export interface LectureListQuery {
    termId?: number;
    grade?: LectureGrade;
    subjectName?: string;
    teacherName?: string;
    classroomCode?: string;
    dayOfWeek?: LectureDayOfWeek;
    page?: number;
    size?: number;
}

export interface LectureListItemData {
    id: number;
    name: string;
    classType: LectureClassType;
    grade: LectureGrade | null;
    termName: string | null;
    subjectName: string | null;
    teacherId: number | null;
    teacherName: string | null;
    classroomCode: string;
    classroomName: string;
    schedules: LectureScheduleData[];
    studentCount: number;
}

export interface LectureListData {
    content: LectureListItemData[];
    page: number;
    size: number;
    hasNext: boolean;
}

export type LectureListResponse = LectureApiResponse<LectureListData>;

export interface LectureStudentData {
    id: number;
    name: string;
    grade: LectureGrade;
}

export interface LectureDetailData {
    id: number;
    name: string;
    classType: LectureClassType;
    grade: LectureGrade | null;
    termName: string | null;
    subjectName: string | null;
    teacherId: number | null;
    teacherName: string | null;
    classroomCode: string;
    classroomName: string;
    feeType: LectureFeeType | null;
    feeAmount: number | null;
    schedules: LectureScheduleData[];
    students: LectureStudentData[];
    createdAt: string;
}

export type LectureDetailResponse = LectureApiResponse<LectureDetailData>;
export type LectureNameListResponse = LectureApiResponse<string[]>;

export interface LectureTermData {
    termId: number;
    termName: string;
}

export type LectureTermListResponse = LectureApiResponse<LectureTermData[]>;
