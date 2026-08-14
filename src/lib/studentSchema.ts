import { z } from "zod";

export const studentGrades = [
    "ELEMENTARY_1",
    "ELEMENTARY_2",
    "ELEMENTARY_3",
    "ELEMENTARY_4",
    "ELEMENTARY_5",
    "ELEMENTARY_6",
    "MIDDLE_1",
    "MIDDLE_2",
    "MIDDLE_3",
    "HIGH_1",
    "HIGH_2",
    "HIGH_3",
    "RETAKE",
] as const;

export const createStudentSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "이름을 입력해주세요.")
        .max(50, "이름은 50자 이하로 입력해주세요."),
    grade: z.enum(studentGrades, { message: "학년을 선택해주세요." }),
    school: z.string().trim().max(100, "학교명은 100자 이하로 입력해주세요."),
    phone: z
        .string()
        .trim()
        .refine(
            (value) => value === "" || /^\d{3}-\d{4}-\d{4}$/.test(value),
            "전화번호 형식이 맞지 않습니다. (예: 010-1234-5678)",
        ),
    parentPhone: z
        .string()
        .trim()
        .refine(
            (value) => value === "" || /^\d{3}-\d{4}-\d{4}$/.test(value),
            "전화번호 형식이 맞지 않습니다. (예: 010-1234-5678)",
        ),
    note: z.string().trim().max(500, "특이사항은 500자 이하로 입력해주세요."),
});

export type CreateStudentFormValues = z.infer<typeof createStudentSchema>;
