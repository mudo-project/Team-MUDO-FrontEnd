import { z } from "zod";

export const attendanceOvertimeSchema = z.object({
  reason: z.string().trim().min(1, "초과근무 사유를 입력해주세요."),
});

export type AttendanceOvertimeFormValues = z.infer<typeof attendanceOvertimeSchema>;
