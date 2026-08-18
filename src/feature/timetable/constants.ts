export const weekDayNames = ["일", "월", "화", "수", "목", "금", "토"];

export const times = Array.from({ length: 29 }, (_, index) => {
  const totalMinutes = 8 * 60 + index * 30;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
});

export const startTimeOptions = times.slice(0, -1);
export const endTimeOptions = times.slice(1);

export const gradeValues = [
  "ELEMENTARY_1", "ELEMENTARY_2", "ELEMENTARY_3", "ELEMENTARY_4", "ELEMENTARY_5", "ELEMENTARY_6",
  "MIDDLE_1", "MIDDLE_2", "MIDDLE_3",
  "HIGH_1", "HIGH_2", "HIGH_3",
  "COMMON",
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
  COMMON: "공통",
};

export const gradeOptions = gradeValues.map((value) => ({ value, label: gradeLabels[value] }));

export const modalSurfaceClass = "flex min-h-[420px] w-full max-w-[520px] flex-col overflow-hidden rounded-xl bg-white shadow-[0_20px_50px_rgba(23,32,51,0.22)]";
