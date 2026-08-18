import { scheduleCreateSchema } from "./scheduleCreateSchema";

const validValues = {
  title: "전체 교직원 회의",
  startDate: "2026-08-10",
  endDate: "2026-08-10",
  allDay: false,
  startTime: "09:00",
  endTime: "10:00",
  content: "",
};

describe("scheduleCreateSchema", () => {
  it("필수 값이 모두 채워지면 검증을 통과한다", () => {
    const result = scheduleCreateSchema.safeParse(validValues);

    expect(result.success).toBe(true);
  });

  it("제목이 비어있으면 에러를 반환한다", () => {
    const result = scheduleCreateSchema.safeParse({ ...validValues, title: "  " });

    expect(result.success).toBe(false);
  });

  it("시작일이 비어있으면 에러를 반환한다", () => {
    const result = scheduleCreateSchema.safeParse({ ...validValues, startDate: "" });

    expect(result.success).toBe(false);
  });

  it("종료일이 비어있으면 에러를 반환한다", () => {
    const result = scheduleCreateSchema.safeParse({ ...validValues, endDate: "" });

    expect(result.success).toBe(false);
  });

  it("종일이면 시작/종료 시간이 비어있어도 검증을 통과한다", () => {
    const result = scheduleCreateSchema.safeParse({ ...validValues, allDay: true, startTime: "", endTime: "" });

    expect(result.success).toBe(true);
  });

  it("종일이 아닌데 시작 시간이 비어있으면 startTime 필드에 에러를 반환한다", () => {
    const result = scheduleCreateSchema.safeParse({ ...validValues, startTime: "" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.path)).toContainEqual(["startTime"]);
    }
  });

  it("종일이 아닌데 종료 시간이 비어있으면 endTime 필드에 에러를 반환한다", () => {
    const result = scheduleCreateSchema.safeParse({ ...validValues, endTime: "" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.path)).toContainEqual(["endTime"]);
    }
  });

  it("같은 날인데 종료 시간이 시작 시간보다 빠르거나 같으면 endTime 필드에 에러를 반환한다", () => {
    const result = scheduleCreateSchema.safeParse({ ...validValues, startTime: "10:00", endTime: "09:00" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["endTime"]);
    }
  });

  it("종료일이 시작일과 다르면 종료 시간이 시작 시간보다 빨라도 통과한다", () => {
    const result = scheduleCreateSchema.safeParse({
      ...validValues,
      endDate: "2026-08-12",
      startTime: "10:00",
      endTime: "09:00",
    });

    expect(result.success).toBe(true);
  });

  it("종료일이 시작일보다 빠르면 endDate 필드에 에러를 반환한다", () => {
    const result = scheduleCreateSchema.safeParse({ ...validValues, startDate: "2026-08-10", endDate: "2026-08-09" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.path)).toContainEqual(["endDate"]);
    }
  });
});
