export const weekDayNames = ["일", "월", "화", "수", "목", "금", "토"];

export const times = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"];

export const startTimeOptions = times.slice(0, -1);
export const endTimeOptions = times.slice(1);

export const gradeValues = [
  "ELEMENTARY_1", "ELEMENTARY_2", "ELEMENTARY_3", "ELEMENTARY_4", "ELEMENTARY_5", "ELEMENTARY_6",
  "MIDDLE_1", "MIDDLE_2", "MIDDLE_3",
  "HIGH_1", "HIGH_2", "HIGH_3",
] as const;

export const gradeLabels: Record<Grade, string> = {
  ELEMENTARY_1: "초1",
  ELEMENTARY_2: "초2",
  ELEMENTARY_3: "초3",
  ELEMENTARY_4: "초4",
  ELEMENTARY_5: "초5",
  ELEMENTARY_6: "초6",
  MIDDLE_1: "중1",
  MIDDLE_2: "중2",
  MIDDLE_3: "중3",
  HIGH_1: "고1",
  HIGH_2: "고2",
  HIGH_3: "고3",
};

export const gradeOptions = gradeValues.map((value) => ({ value, label: gradeLabels[value] }));

export const modalSurfaceClass = "flex min-h-[420px] w-full max-w-[520px] flex-col overflow-hidden rounded-xl bg-white shadow-[0_20px_50px_rgba(23,32,51,0.22)]";
