import {
  createTimetableSet,
  createTimetableSlot,
  deleteTimetableSet,
  deleteTimetableSlot,
  exportTimetableSet,
  updateTimetableSet,
  updateTimetableSlot,
} from "@/service/timetable.service";
import {
  createTimetableSetAction,
  createTimetableSlotAction,
  deleteTimetableSetAction,
  deleteTimetableSlotAction,
  exportTimetableSetAction,
  updateTimetableSetAction,
  updateTimetableSlotAction,
} from "./actions";

jest.mock("../../service/timetable.service");

afterEach(() => jest.clearAllMocks());

const validSetPayload: TimetableSetCreateRequest = {
  name: "2026 여름특강",
  startDate: "2026-08-01",
  endDate: "2026-08-31",
  operatingStartTime: "08:30",
  operatingEndTime: "22:00",
  operatingDays: ["MONDAY"],
  slotUnitMinutes: 30,
  classrooms: [{ floor: "1층", codes: ["101"] }],
};

const validSlotPayload: TimetableSlotCreateRequest = {
  classType: "CLASS",
  dayOfWeek: "MONDAY",
  classroomCode: "101",
  startTime: "09:00",
  endTime: "11:00",
  grade: "HIGH_3",
  teacherName: "최T",
  subjectName: "공통미적",
  color: "90A9C6",
};

describe("createTimetableSetAction", () => {
  it("이름이 비어있으면 검증 실패 결과를 반환한다", async () => {
    const result = await createTimetableSetAction({ ...validSetPayload, name: "  " });

    expect(result).toEqual({ success: false, message: "시간표 세트 이름을 입력해주세요." });
    expect(createTimetableSet).not.toHaveBeenCalled();
  });

  it("종료일이 시작일보다 빠르면 검증 실패 결과를 반환한다", async () => {
    const result = await createTimetableSetAction({ ...validSetPayload, startDate: "2026-08-31", endDate: "2026-08-01" });

    expect(result).toEqual({ success: false, message: "종료일은 시작일보다 빠를 수 없습니다." });
  });

  it("운영 요일이 비어있으면 검증 실패 결과를 반환한다", async () => {
    const result = await createTimetableSetAction({ ...validSetPayload, operatingDays: [] });

    expect(result).toEqual({ success: false, message: "운영 요일을 1개 이상 선택해주세요." });
  });

  it("강의실 코드가 중복되면 검증 실패 결과를 반환한다", async () => {
    const result = await createTimetableSetAction({
      ...validSetPayload,
      classrooms: [{ floor: "1층", codes: ["101", "101"] }],
    });

    expect(result).toEqual({ success: false, message: "강의실 코드가 중복되었습니다." });
  });

  it("service 호출이 성공하면 생성된 id와 함께 성공 결과를 반환한다", async () => {
    (createTimetableSet as jest.Mock).mockResolvedValue(1);

    const result = await createTimetableSetAction(validSetPayload);

    expect(result).toEqual({ success: true, message: "시간표 세트가 생성되었습니다.", timetableSetId: 1 });
  });

  it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
    (createTimetableSet as jest.Mock).mockRejectedValue(new Error("서버 오류"));

    const result = await createTimetableSetAction(validSetPayload);

    expect(result).toEqual({ success: false, message: "서버 오류" });
  });
});

describe("updateTimetableSetAction", () => {
  it("검증 실패 시 service를 호출하지 않는다", async () => {
    const result = await updateTimetableSetAction(1, { ...validSetPayload, name: "" });

    expect(result).toEqual({ success: false, message: "시간표 세트 이름을 입력해주세요." });
    expect(updateTimetableSet).not.toHaveBeenCalled();
  });

  it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
    (updateTimetableSet as jest.Mock).mockResolvedValue(undefined);

    const result = await updateTimetableSetAction(1, validSetPayload);

    expect(result).toEqual({ success: true, message: "시간표 세트가 수정되었습니다." });
  });

  it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
    (updateTimetableSet as jest.Mock).mockRejectedValue(new Error("수정 실패"));

    const result = await updateTimetableSetAction(1, validSetPayload);

    expect(result).toEqual({ success: false, message: "수정 실패" });
  });
});

describe("deleteTimetableSetAction", () => {
  it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
    (deleteTimetableSet as jest.Mock).mockResolvedValue(undefined);

    const result = await deleteTimetableSetAction(1);

    expect(result).toEqual({ success: true, message: "시간표 세트가 삭제되었습니다." });
  });

  it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
    (deleteTimetableSet as jest.Mock).mockRejectedValue(new Error("삭제 실패"));

    const result = await deleteTimetableSetAction(1);

    expect(result).toEqual({ success: false, message: "삭제 실패" });
  });
});

describe("createTimetableSlotAction", () => {
  it("강의실이 비어있으면 검증 실패 결과를 반환한다", async () => {
    const result = await createTimetableSlotAction(1, { ...validSlotPayload, classroomCode: "" });

    expect(result).toEqual({ success: false, message: "강의실을 선택해주세요." });
    expect(createTimetableSlot).not.toHaveBeenCalled();
  });

  it("시작 시각이 종료 시각보다 늦으면 검증 실패 결과를 반환한다", async () => {
    const result = await createTimetableSlotAction(1, { ...validSlotPayload, startTime: "12:00", endTime: "09:00" });

    expect(result).toEqual({ success: false, message: "시작 시각은 종료 시각보다 빨라야 합니다." });
  });

  it("색상 코드가 올바르지 않으면 검증 실패 결과를 반환한다", async () => {
    const result = await createTimetableSlotAction(1, { ...validSlotPayload, color: "GGGGGG" });

    expect(result).toEqual({ success: false, message: "올바른 색상 코드를 선택해주세요." });
  });

  it("service 호출이 성공하면 생성된 id와 함께 성공 결과를 반환한다", async () => {
    (createTimetableSlot as jest.Mock).mockResolvedValue(10);

    const result = await createTimetableSlotAction(1, validSlotPayload);

    expect(result).toEqual({ success: true, message: "수업 정보가 등록되었습니다.", timetableSlotId: 10 });
  });

  it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
    (createTimetableSlot as jest.Mock).mockRejectedValue(new Error("등록 실패"));

    const result = await createTimetableSlotAction(1, validSlotPayload);

    expect(result).toEqual({ success: false, message: "등록 실패" });
  });
});

describe("updateTimetableSlotAction", () => {
  const updatePayload: TimetableSlotUpdateRequest = { scope: "ALL", ...validSlotPayload };

  it("scope이 ALL이 아니면 미지원 실패 결과를 반환한다", async () => {
    const result = await updateTimetableSlotAction(1, 10, { ...updatePayload, scope: "FROM_NOW" });

    expect(result).toEqual({ success: false, message: "현재는 전체 적용(scope: ALL)만 지원합니다." });
    expect(updateTimetableSlot).not.toHaveBeenCalled();
  });

  it("검증에 실패하면 service를 호출하지 않는다", async () => {
    const result = await updateTimetableSlotAction(1, 10, { ...updatePayload, classroomCode: "" });

    expect(result).toEqual({ success: false, message: "강의실을 선택해주세요." });
    expect(updateTimetableSlot).not.toHaveBeenCalled();
  });

  it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
    (updateTimetableSlot as jest.Mock).mockResolvedValue(undefined);

    const result = await updateTimetableSlotAction(1, 10, updatePayload);

    expect(result).toEqual({ success: true, message: "수업 정보가 수정되었습니다." });
  });

  it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
    (updateTimetableSlot as jest.Mock).mockRejectedValue(new Error("수정 실패"));

    const result = await updateTimetableSlotAction(1, 10, updatePayload);

    expect(result).toEqual({ success: false, message: "수정 실패" });
  });
});

describe("deleteTimetableSlotAction", () => {
  it("scope이 ALL이 아니면 미지원 실패 결과를 반환한다", async () => {
    const result = await deleteTimetableSlotAction(1, 10, "FROM_NOW");

    expect(result).toEqual({ success: false, message: "현재는 전체 적용(scope: ALL)만 지원합니다." });
    expect(deleteTimetableSlot).not.toHaveBeenCalled();
  });

  it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
    (deleteTimetableSlot as jest.Mock).mockResolvedValue(undefined);

    const result = await deleteTimetableSlotAction(1, 10, "ALL");

    expect(result).toEqual({ success: true, message: "수업 정보가 삭제되었습니다." });
  });

  it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
    (deleteTimetableSlot as jest.Mock).mockRejectedValue(new Error("삭제 실패"));

    const result = await deleteTimetableSlotAction(1, 10, "ALL");

    expect(result).toEqual({ success: false, message: "삭제 실패" });
  });
});

describe("exportTimetableSetAction", () => {
  it("service 호출이 성공하면 base64 파일과 함께 성공 결과를 반환한다", async () => {
    const fileBytes = Uint8Array.from([102, 105, 108, 101]).buffer;
    const blob = { arrayBuffer: () => Promise.resolve(fileBytes) };
    (exportTimetableSet as jest.Mock).mockResolvedValue(blob);

    const result = await exportTimetableSetAction(1, { format: "EXCEL" });

    expect(result).toEqual({
      success: true,
      message: "시간표 세트 내보내기에 성공했습니다.",
      file: Buffer.from(fileBytes).toString("base64"),
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  });

  it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
    (exportTimetableSet as jest.Mock).mockRejectedValue(new Error("내보내기 실패"));

    const result = await exportTimetableSetAction(1, { format: "PDF" });

    expect(result).toEqual({ success: false, message: "내보내기 실패" });
  });
});
