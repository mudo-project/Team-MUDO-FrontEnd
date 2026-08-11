export type ClassItem = {
  day: number;
  room: number;
  start: number;
  duration: number;
  course: string;
  teacher: string;
  grade?: string;
  tone: "blue" | "green" | "stone" | "sky";
};

export type TimetableTemplate = {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  roomsByDay: { name: string; rooms: string[] }[];
  classes: ClassItem[];
  slotMinutes: 10 | 30 | 60;
};

export type FloorConfig = {
  floor: string;
  rooms: string[];
};

export type TemplateStatus = {
  label: string;
  tone: string;
};
