import { classRegistrationSchema } from "./classRegistrationSchema";

const validValues = {
  day: "월",
  room: "101",
  startTime: "09:00",
  endTime: "11:00",
  grade: "HIGH_3" as const,
  teacher: "최T",
  course: "공통미적",
  color: "90A9C6",
};

describe("classRegistrationSchema", () => {
  it("필수 값이 모두 채워지면 검증을 통과한다", () => {
    const result = classRegistrationSchema.safeParse(validValues);

    expect(result.success).toBe(true);
  });

  it("요일이 비어있으면 에러를 반환한다", () => {
    const result = classRegistrationSchema.safeParse({ ...validValues, day: "" });

    expect(result.success).toBe(false);
  });

  it("강사를 공백만 입력하면 에러를 반환한다", () => {
    const result = classRegistrationSchema.safeParse({ ...validValues, teacher: "   " });

    expect(result.success).toBe(false);
  });

  it("색상 코드가 6자리 hex가 아니면 에러를 반환한다", () => {
    const result = classRegistrationSchema.safeParse({ ...validValues, color: "12G456" });

    expect(result.success).toBe(false);
  });

  it("종료 시각이 시작 시각보다 빠르면 endTime 필드에 에러를 반환한다", () => {
    const result = classRegistrationSchema.safeParse({ ...validValues, startTime: "11:00", endTime: "09:00" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["endTime"]);
    }
  });

  it("같은 시(hour) 안에서 30분 뒤인 종료 시각은 유효하다", () => {
    const result = classRegistrationSchema.safeParse({ ...validValues, startTime: "09:00", endTime: "09:30" });

    expect(result.success).toBe(true);
  });
});
