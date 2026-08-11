import { type FormEvent, useState } from "react";
import type { ClassItem, ClassRegistrationFormValue, TimetableTemplate } from "@/feature/timetable/types";

const weekDayNames = ["일", "월", "화", "수", "목", "금", "토"];

type UseClassRegistrationFormParams = {
  activeTemplate: TimetableTemplate;
  onSubmit: (classItem: ClassItem, editingClassKey: string | null) => void;
};

export function useClassRegistrationForm({ activeTemplate, onSubmit }: UseClassRegistrationFormParams) {
  const [form, setForm] = useState<ClassRegistrationFormValue>({ day: "월", room: "", startTime: "09:00", endTime: "11:00", grade: "고3", teacher: "", course: "" });
  const [editingClassKey, setEditingClassKey] = useState<string | null>(null);

  const availableRooms = activeTemplate.roomsByDay[weekDayNames.indexOf(form.day)]?.rooms ?? [];

  const changeForm = (patch: Partial<ClassRegistrationFormValue>) => setForm((current) => ({ ...current, ...patch }));

  const startEdit = (classItem: ClassItem, classKey: string) => {
    setForm({
      day: weekDayNames[classItem.day],
      room: activeTemplate.roomsByDay[classItem.day].rooms[classItem.room],
      startTime: `${String(8 + Math.floor((classItem.start - 1) * activeTemplate.slotMinutes / 60)).padStart(2, "0")}:00`,
      endTime: `${String(8 + Math.floor((classItem.start - 1 + classItem.duration) * activeTemplate.slotMinutes / 60)).padStart(2, "0")}:00`,
      grade: classItem.grade ?? "고3",
      teacher: classItem.teacher,
      course: classItem.course,
    });
    setEditingClassKey(classKey);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const dayIndex = weekDayNames.indexOf(form.day);
    const roomIndex = activeTemplate.roomsByDay[dayIndex]?.rooms.indexOf(form.room) ?? -1;
    const startHour = Number(form.startTime.slice(0, 2));
    const endHour = Number(form.endTime.slice(0, 2));

    if (dayIndex < 0 || roomIndex < 0 || !form.teacher.trim() || !form.course.trim() || endHour <= startHour) return;

    const classItem: ClassItem = {
      day: dayIndex,
      room: roomIndex,
      start: ((startHour - 8) * 60) / activeTemplate.slotMinutes + 1,
      duration: ((endHour - startHour) * 60) / activeTemplate.slotMinutes,
      grade: form.grade,
      course: form.course.trim(),
      teacher: form.teacher.trim(),
      tone: "blue",
    };

    onSubmit(classItem, editingClassKey);
    setForm((current) => ({ ...current, room: "", teacher: "", course: "" }));
    setEditingClassKey(null);
  };

  return {
    availableRooms,
    changeForm,
    editingClassKey,
    form,
    startEdit,
    submit,
  };
}
