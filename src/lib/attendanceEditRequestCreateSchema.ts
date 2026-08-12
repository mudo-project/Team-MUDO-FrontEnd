import { z } from "zod";

export const attendanceEditRequestCreateSchema = z
  .object({
    type: z.enum(["CLOCK_IN_TIME", "CLOCK_OUT_TIME", "MISSING_RECORD", "NOTE_CORRECTION"]),
    clockInTime: z.string(),
    clockOutTime: z.string(),
    missingClockInTime: z.string(),
    missingClockOutTime: z.string(),
    noteContent: z.string().trim(),
    reason: z.string().trim().min(1, "수정 요청 사유를 입력해주세요."),
  })
  .superRefine((values, ctx) => {
    if (values.type === "NOTE_CORRECTION" && !values.noteContent) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["noteContent"], message: "수정할 비고 내용을 입력해주세요." });
    }
  });

export type AttendanceEditRequestCreateFormValues = z.infer<typeof attendanceEditRequestCreateSchema>;
