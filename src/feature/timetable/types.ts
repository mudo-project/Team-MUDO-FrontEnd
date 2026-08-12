export type ClassItem = {
  slotId: number;
  classType: TimetableClassType;
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
  id: number;
  title: string;
  startDate: Date;
  endDate: Date;
  status: TimetableSetStatus;
  operatingStartTime: string;
  operatingEndTime: string;
  operatingDays: DayOfWeek[];
  roomsByDay: { name: string; rooms: string[] }[];
  classroomGroups: FloorConfig[];
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
