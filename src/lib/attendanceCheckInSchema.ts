import { z } from "zod";

export const attendanceCheckInSchema = z.object({
  note: z.string().trim().min(1, "지각 사유를 입력해주세요."),
});

export type AttendanceCheckInFormValues = z.infer<typeof attendanceCheckInSchema>;
