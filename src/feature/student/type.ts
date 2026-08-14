export interface StudentListData {
    id: number;
    name: string;
    grade: string;
    phone: string;
    guardianPhone: string;
    courseCount: number;
    school: string;
}

export type StudentGrade =
    | "ELEMENTARY_1"
    | "ELEMENTARY_2"
    | "ELEMENTARY_3"
    | "ELEMENTARY_4"
    | "ELEMENTARY_5"
    | "ELEMENTARY_6"
    | "MIDDLE_1"
    | "MIDDLE_2"
    | "MIDDLE_3"
    | "HIGH_1"
    | "HIGH_2"
    | "HIGH_3"
    | "RETAKE";

export interface StudentApiResponse<T> {
    status: number;
    code: string;
    message: string;
    data: T;
}

export interface CreateStudentRequest {
    name: string;
    grade: StudentGrade;
    school?: string;
    phone?: string;
    parentPhone?: string;
    note?: string;
}

export interface CreateStudentData {
    studentId: number;
}

export type CreateStudentResponse = StudentApiResponse<CreateStudentData>;

export interface StudentListItemData {
    studentId: number;
    name: string;
    grade: StudentGrade;
    school: string | null;
    phone: string | null;
    parentPhone: string | null;
    activeEnrollmentCount: number;
}

export interface StudentListResponseData {
    content: StudentListItemData[];
    page: number;
    size: number;
    hasNext: boolean;
}

export type StudentListResponse = StudentApiResponse<StudentListResponseData>;

export interface StudentEnrollmentData {
    enrollmentId: number;
    lectureId: number;
    lectureName: string;
    teacherName: string | null;
    scheduleText: string | null;
    priceType: "PER_SESSION" | "PER_MONTH" | null;
    priceAmount: number | null;
    enrolledAt: string;
}

export interface StudentDetailData {
    studentId: number;
    name: string;
    grade: StudentGrade;
    school: string | null;
    phone: string | null;
    parentPhone: string | null;
    note: string | null;
    createdAt: string;
    updatedAt: string;
    enrollments: StudentEnrollmentData[];
}

export type StudentDetailResponse = StudentApiResponse<StudentDetailData>;

export type UpdateStudentRequest = CreateStudentRequest;

export interface CreateStudentEnrollmentRequest {
    lectureId: number;
}

export interface CreateStudentEnrollmentData {
    enrollmentId: number;
}

export type CreateStudentEnrollmentResponse =
    StudentApiResponse<CreateStudentEnrollmentData>;
