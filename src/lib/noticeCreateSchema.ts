import { z } from "zod";

export const noticeCreateSchema = z.object({
    title: z.string().min(1, "제목을 입력하세요"),
    content: z.string().min(1, "내용을 입력하세요"),
    pinned: z.boolean(),
});

export type NoticeCreateFormValues = z.infer<typeof noticeCreateSchema>;
