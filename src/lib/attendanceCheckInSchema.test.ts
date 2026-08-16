import { attendanceCheckInSchema } from "./attendanceCheckInSchema";

describe("attendanceCheckInSchema", () => {
  it("비고가 채워지면 검증을 통과한다", () => {
    const result = attendanceCheckInSchema.safeParse({ note: "버스 지연" });

    expect(result.success).toBe(true);
  });

  it("비고가 비어있으면 에러 메시지와 함께 실패한다", () => {
    const result = attendanceCheckInSchema.safeParse({ note: "" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["note"]);
      expect(result.error.issues[0].message).toBe("지각 사유를 입력해주세요.");
    }
  });

  it("공백만 입력하면 에러 메시지와 함께 실패한다", () => {
    const result = attendanceCheckInSchema.safeParse({ note: "   " });

    expect(result.success).toBe(false);
  });
});
