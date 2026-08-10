import type { MemoColor } from "@/feature/memo/components/MemoColorPicker";

export type ScheduleEvent = {
  id: number;
  title: string;
  date: Date;
  allDay: boolean;
  startTime?: string; // "HH:mm" (24시간), allDay가 아닐 때만 사용
  endTime?: string;
  color: MemoColor;
  content: string;
  createdAt: string; // "yyyy.MM.dd"
};
