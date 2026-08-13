import { z } from "zod";
import { gradeValues } from "@/feature/timetable/constants";

export const classRegistrationSchema = z.object({
  day: z.string().min(1, "요일을 선택해주세요."),
  room: z.string().min(1, "강의실을 선택해주세요."),
  startTime: z.string().min(1, "시작 시각을 선택해주세요."),
  endTime: z.string().min(1, "종료 시각을 선택해주세요."),
  grade: z.enum(gradeValues, { message: "학년을 선택해주세요." }),
  teacher: z.string().trim().min(1, "강사를 입력해주세요."),
  course: z.string().trim().min(1, "과목을 입력해주세요."),
}).refine((values) => Number(values.endTime.slice(0, 2)) > Number(values.startTime.slice(0, 2)), {
  message: "종료 시각은 시작 시각보다 늦어야 해요.",
  path: ["endTime"],
});

export type ClassRegistrationFormValues = z.infer<typeof classRegistrationSchema>;
