import { z } from "zod";

export const lectureClassTypes = ["CLASS", "SPECIAL", "CLINIC", "STANDING", "EXAM"] as const;
export const lectureDays = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"] as const;
export const lectureGrades = [
    "ELEMENTARY_1", "ELEMENTARY_2", "ELEMENTARY_3", "ELEMENTARY_4", "ELEMENTARY_5", "ELEMENTARY_6",
    "MIDDLE_1", "MIDDLE_2", "MIDDLE_3", "HIGH_1", "HIGH_2", "HIGH_3", "RETAKE",
] as const;
export const lectureFeeTypes = ["PER_SESSION", "PER_MONTH"] as const;

export const createLectureSchema = z.object({
    name: z.string().trim().min(1, "강의명을 입력해주세요."),
    classType: z.enum(lectureClassTypes, { message: "강의 유형을 선택해주세요." }),
    classroomCode: z.string().trim().min(1, "강의실 코드를 입력해주세요."),
    grade: z.enum(lectureGrades).or(z.literal("")),
    teacherName: z.string().trim(),
    subjectName: z.string().trim(),
    termName: z.string().trim(),
    feeType: z.enum(lectureFeeTypes).or(z.literal("")),
    feeAmount: z.string().trim().refine(
        (value) => value === "" || /^\d+$/.test(value),
        "수강료는 0 이상의 정수로 입력해주세요.",
    ),
});

export type CreateLectureFormValues = z.infer<typeof createLectureSchema>;
