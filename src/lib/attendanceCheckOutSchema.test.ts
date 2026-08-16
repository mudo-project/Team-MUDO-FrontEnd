import { attendanceCheckOutSchema } from "./attendanceCheckOutSchema";

describe("attendanceCheckOutSchema", () => {
  it("비고를 입력하면 검증을 통과한다", () => {
    const result = attendanceCheckOutSchema.safeParse({ note: "정상 퇴근" });

    expect(result.success).toBe(true);
  });

  it("비고가 비어있어도 검증을 통과한다", () => {
    const result = attendanceCheckOutSchema.safeParse({ note: "" });

    expect(result.success).toBe(true);
  });
});
