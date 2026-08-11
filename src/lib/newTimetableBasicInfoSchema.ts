import { z } from "zod";

export const newTimetableBasicInfoSchema = z.object({
  name: z.string().trim().min(1, "시간표 이름을 입력해주세요."),
  startDate: z.string().min(1, "시작일을 선택해주세요."),
  endDate: z.string().min(1, "종료일을 선택해주세요."),
}).refine((values) => new Date(values.endDate) >= new Date(values.startDate), {
  message: "종료일은 시작일보다 빠를 수 없어요.",
  path: ["endDate"],
});

export type NewTimetableBasicInfoFormValues = z.infer<typeof newTimetableBasicInfoSchema>;
