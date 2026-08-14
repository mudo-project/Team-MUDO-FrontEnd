import { STUDENT_GRADE_LABEL } from "@/feature/student/constants";
import { LectureClassType, LectureDayOfWeek, LectureFeeType, LectureGrade } from "./type";

export const LECTURE_GRADE_LABEL: Record<LectureGrade, string> = STUDENT_GRADE_LABEL;

export const LECTURE_DAY_LABEL: Record<LectureDayOfWeek, string> = {
    MONDAY: "월",
    TUESDAY: "화",
    WEDNESDAY: "수",
    THURSDAY: "목",
    FRIDAY: "금",
    SATURDAY: "토",
    SUNDAY: "일",
};

export const LECTURE_CLASS_TYPE_LABEL: Record<LectureClassType, string> = {
    CLASS: "정규반",
    SPECIAL: "특강",
    CLINIC: "클리닉",
    STANDING: "상설반",
    EXAM: "시험",
};

export const LECTURE_FEE_TYPE_LABEL: Record<LectureFeeType, string> = {
    PER_SESSION: "회당",
    PER_MONTH: "월정액",
};
