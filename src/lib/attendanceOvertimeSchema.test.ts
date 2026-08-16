import { attendanceOvertimeSchema } from "./attendanceOvertimeSchema";

describe("attendanceOvertimeSchema", () => {
  it("사유가 채워지면 검증을 통과한다", () => {
    const result = attendanceOvertimeSchema.safeParse({ reason: "학부모 상담 연장" });

    expect(result.success).toBe(true);
  });

  it("사유가 비어있으면 에러 메시지와 함께 실패한다", () => {
    const result = attendanceOvertimeSchema.safeParse({ reason: "" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["reason"]);
      expect(result.error.issues[0].message).toBe("초과근무 사유를 입력해주세요.");
    }
  });
});
