import { attendanceEditRequestRejectSchema } from "./attendanceEditRequestRejectSchema";

describe("attendanceEditRequestRejectSchema", () => {
  it("반려 사유가 채워지면 검증을 통과한다", () => {
    const result = attendanceEditRequestRejectSchema.safeParse({ reason: "증빙 자료 부족" });

    expect(result.success).toBe(true);
  });

  it("반려 사유가 비어있으면 에러 메시지와 함께 실패한다", () => {
    const result = attendanceEditRequestRejectSchema.safeParse({ reason: "" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["reason"]);
      expect(result.error.issues[0].message).toBe("반려 사유를 입력해주세요.");
    }
  });
});
