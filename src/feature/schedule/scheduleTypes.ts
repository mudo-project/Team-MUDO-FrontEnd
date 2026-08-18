import type { MemoColor } from "@/feature/memo/components/MemoColorPicker";

export type ScheduleEvent = {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  startTime?: string; // "HH:mm" (24시간), allDay가 아닐 때만 사용, startDate에 적용
  endTime?: string; // "HH:mm" (24시간), allDay가 아닐 때만 사용, endDate에 적용
  color: MemoColor;
  content: string;
  createdAt: string; // "yyyy.MM.dd"
};
