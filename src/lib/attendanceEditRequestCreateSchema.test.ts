import { attendanceEditRequestCreateSchema } from "./attendanceEditRequestCreateSchema";

const baseValues = {
  type: "CLOCK_IN_TIME" as const,
  clockInTime: "09:00",
  clockOutTime: "18:00",
  missingClockInTime: "09:00",
  missingClockOutTime: "18:00",
  noteContent: "",
  reason: "출근 기록 오류",
};

describe("attendanceEditRequestCreateSchema", () => {
  it("사유가 채워지면 검증을 통과한다", () => {
    const result = attendanceEditRequestCreateSchema.safeParse(baseValues);

    expect(result.success).toBe(true);
  });

  it("사유가 비어있으면 에러 메시지와 함께 실패한다", () => {
    const result = attendanceEditRequestCreateSchema.safeParse({ ...baseValues, reason: "" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === "reason" && issue.message === "수정 요청 사유를 입력해주세요.")).toBe(true);
    }
  });

  it("요청 구분이 비고 수정이고 비고 내용이 비어있으면 에러 메시지와 함께 실패한다", () => {
    const result = attendanceEditRequestCreateSchema.safeParse({ ...baseValues, type: "NOTE_CORRECTION", noteContent: "" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === "noteContent" && issue.message === "수정할 비고 내용을 입력해주세요.")).toBe(true);
    }
  });

  it("요청 구분이 비고 수정이고 비고 내용이 채워지면 검증을 통과한다", () => {
    const result = attendanceEditRequestCreateSchema.safeParse({ ...baseValues, type: "NOTE_CORRECTION", noteContent: "수정된 비고" });

    expect(result.success).toBe(true);
  });

  it("요청 구분이 비고 수정이 아니면 비고 내용이 비어있어도 검증을 통과한다", () => {
    const result = attendanceEditRequestCreateSchema.safeParse({ ...baseValues, type: "MISSING_RECORD", noteContent: "" });

    expect(result.success).toBe(true);
  });
});
