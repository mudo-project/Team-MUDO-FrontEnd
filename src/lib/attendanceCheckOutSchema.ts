import { z } from "zod";

export const attendanceCheckOutSchema = z.object({
  note: z.string().trim(),
});

export type AttendanceCheckOutFormValues = z.infer<typeof attendanceCheckOutSchema>;
