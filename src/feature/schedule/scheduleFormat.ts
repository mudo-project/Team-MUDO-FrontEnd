import { format, startOfDay } from "date-fns";
import { ko } from "date-fns/locale";
import { MEMO_COLORS, type MemoColor } from "@/feature/memo/components/MemoColorPicker";
import type { ScheduleEvent } from "./scheduleTypes";

type ScheduleFormValues = {
  title: string;
  date: Date;
  allDay: boolean;
  startTime?: string;
  endTime?: string;
  color: MemoColor;
  content: string;
};

export const TIME_OPTIONS = Array.from({ length: 48 }, (_, index) => {
  const hour = String(Math.floor(index / 2)).padStart(2, "0");
  const minute = index % 2 === 0 ? "00" : "30";
  return `${hour}:${minute}`;
});

export function formatTimeLabel(time: string): string {
  const [hourString, minute] = time.split(":");
  const hour = Number(hourString);
  const period = hour < 12 ? "오전" : "오후";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${period} ${displayHour}:${minute}`;
}

export function formatEventTimeRange(event: ScheduleEvent): string {
  if (event.allDay || !event.startTime || !event.endTime) return "종일";
  return `${formatTimeLabel(event.startTime)} - ${formatTimeLabel(event.endTime)}`;
}

export function formatEventDate(date: Date): string {
  return format(date, "M월 d일 (EEEEEE)", { locale: ko });
}

export function formatEventDateFull(date: Date): string {
  return format(date, "yyyy년 M월 d일 (EEEEEE)", { locale: ko });
}

function findColorByCode(code: string | null): MemoColor {
  return MEMO_COLORS.find((color) => color.code === code) ?? MEMO_COLORS[0];
}

// API 응답(ScheduleEventData)을 화면에서 쓰는 ScheduleEvent 형태로 변환한다.
export function toScheduleEvent(data: ScheduleEventData): ScheduleEvent {
  const startDate = new Date(data.eventStartAt);

  return {
    id: data.eventId,
    title: data.title,
    date: startOfDay(startDate),
    allDay: data.allDay,
    startTime: data.allDay ? undefined : format(startDate, "HH:mm"),
    endTime: data.allDay || !data.eventEndAt ? undefined : format(new Date(data.eventEndAt), "HH:mm"),
    color: findColorByCode(data.color),
    content: data.content ?? "",
    createdAt: format(new Date(data.createdAt), "yyyy.MM.dd"),
  };
}

// ScheduleCreateForm의 제출값을 캘린더 생성/수정 API 요청 바디로 변환한다.
export function toScheduleRequestPayload(values: ScheduleFormValues): ScheduleCreateRequest {
  const dateStr = format(values.date, "yyyy-MM-dd");
  const content = values.content.trim() ? values.content.trim() : undefined;
  const color = values.color.code;

  if (values.allDay) {
    return {
      title: values.title,
      content,
      eventStartAt: `${dateStr}T00:00:00`,
      allDay: true,
      color,
    };
  }

  return {
    title: values.title,
    content,
    eventStartAt: `${dateStr}T${values.startTime}:00`,
    eventEndAt: `${dateStr}T${values.endTime}:00`,
    allDay: false,
    color,
  };
}
