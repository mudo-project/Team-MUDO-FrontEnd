import { newTimetableBasicInfoSchema } from "./newTimetableBasicInfoSchema";

const validValues = {
  name: "2026 여름특강",
  startDate: "2026-08-01",
  endDate: "2026-08-31",
};

describe("newTimetableBasicInfoSchema", () => {
  it("이름·시작일·종료일이 모두 유효하면 검증을 통과한다", () => {
    const result = newTimetableBasicInfoSchema.safeParse(validValues);

    expect(result.success).toBe(true);
  });

  it("이름을 공백만 입력하면 에러를 반환한다", () => {
    const result = newTimetableBasicInfoSchema.safeParse({ ...validValues, name: "   " });

    expect(result.success).toBe(false);
  });

  it("시작일이 비어있으면 에러를 반환한다", () => {
    const result = newTimetableBasicInfoSchema.safeParse({ ...validValues, startDate: "" });

    expect(result.success).toBe(false);
  });

  it("종료일이 시작일보다 빠르면 endDate 필드에 에러를 반환한다", () => {
    const result = newTimetableBasicInfoSchema.safeParse({
      ...validValues,
      startDate: "2026-08-31",
      endDate: "2026-08-01",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["endDate"]);
    }
  });

  it("종료일이 시작일과 같으면 검증을 통과한다", () => {
    const result = newTimetableBasicInfoSchema.safeParse({
      ...validValues,
      startDate: "2026-08-01",
      endDate: "2026-08-01",
    });

    expect(result.success).toBe(true);
  });
});
