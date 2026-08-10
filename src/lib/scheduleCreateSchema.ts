import { z } from "zod";

export const scheduleCreateSchema = z
  .object({
    title: z.string().trim().min(1, "제목을 입력해주세요."),
    date: z.string().trim().min(1, "날짜를 선택해주세요."),
    allDay: z.boolean(),
    startTime: z.string(),
    endTime: z.string(),
    content: z.string().trim(),
  })
  .superRefine((values, ctx) => {
    if (values.allDay) return;

    if (!values.startTime) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["startTime"], message: "시작 시간을 선택해주세요." });
    }
    if (!values.endTime) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["endTime"], message: "종료 시간을 선택해주세요." });
    }
    if (values.startTime && values.endTime && values.startTime >= values.endTime) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["endTime"], message: "종료 시간은 시작 시간보다 늦어야 해요." });
    }
  });

export type ScheduleCreateFormValues = z.infer<typeof scheduleCreateSchema>;
