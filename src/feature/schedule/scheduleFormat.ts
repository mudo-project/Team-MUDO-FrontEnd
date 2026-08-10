import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type { ScheduleEvent } from "./dummySchedules";

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
