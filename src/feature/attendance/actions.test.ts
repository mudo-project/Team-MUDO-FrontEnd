import {
  approveCorrectionRequest,
  checkIn,
  checkOut,
  createCorrectionRequest,
  rejectCorrectionRequest,
} from "@/service/attendance.service";
import {
  approveCorrectionRequestAction,
  checkInAction,
  checkOutAction,
  createCorrectionRequestAction,
  rejectCorrectionRequestAction,
} from "./actions";

jest.mock("../../service/attendance.service");

describe("checkInAction", () => {
  afterEach(() => jest.clearAllMocks());

  it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
    const data: AttendanceCheckInData = { attendanceId: 1, workDate: "2026-08-17", clockInAt: "09:05:00", clockInNote: null, status: "NORMAL" };
    (checkIn as jest.Mock).mockResolvedValue(data);

    const result = await checkInAction();

    expect(result).toEqual({ success: true, message: "출근이 등록되었습니다.", data });
  });

  it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
    (checkIn as jest.Mock).mockRejectedValue(new Error("출근 체크인에 실패하였습니다."));

    const result = await checkInAction();

    expect(result).toEqual({ success: false, message: "출근 체크인에 실패하였습니다." });
  });
});

describe("checkOutAction", () => {
  afterEach(() => jest.clearAllMocks());

  it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
    const data: AttendanceCheckOutData = {
      attendanceId: 1,
      workDate: "2026-08-17",
      clockInAt: "09:05:00",
      clockOutAt: "18:10:00",
      clockOutType: "NORMAL",
      clockOutNote: null,
      status: "NORMAL",
    };
    (checkOut as jest.Mock).mockResolvedValue(data);

    const result = await checkOutAction({ clockOutType: "NORMAL" });

    expect(result).toEqual({ success: true, message: "퇴근이 등록되었습니다.", data });
  });

  it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
    (checkOut as jest.Mock).mockRejectedValue(new Error("퇴근 체크아웃에 실패하였습니다."));

    const result = await checkOutAction({ clockOutType: "OVERTIME" });

    expect(result).toEqual({ success: false, message: "퇴근 체크아웃에 실패하였습니다." });
  });
});

describe("createCorrectionRequestAction", () => {
  afterEach(() => jest.clearAllMocks());

  it("대상 날짜가 없으면 실패 결과를 반환한다", async () => {
    const result = await createCorrectionRequestAction({
      date: "",
      type: "CLOCK_IN_TIME",
      requestedClockInTime: "09:00",
      reason: "출근 기록 오류",
    });

    expect(result).toEqual({ success: false, message: "대상 날짜를 선택해주세요." });
    expect(createCorrectionRequest).not.toHaveBeenCalled();
  });

  it("사유가 비어있으면 실패 결과를 반환한다", async () => {
    const result = await createCorrectionRequestAction({
      date: "2026-08-17",
      type: "CLOCK_IN_TIME",
      requestedClockInTime: "09:00",
      reason: "   ",
    });

    expect(result).toEqual({ success: false, message: "수정 요청 사유를 입력해주세요." });
    expect(createCorrectionRequest).not.toHaveBeenCalled();
  });

  it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
    const data = { requestId: 1 } as AttendanceMyCorrectionRequestData;
    (createCorrectionRequest as jest.Mock).mockResolvedValue(data);

    const result = await createCorrectionRequestAction({
      date: "2026-08-17",
      type: "CLOCK_IN_TIME",
      requestedClockInTime: "09:00",
      reason: "출근 기록 오류",
    });

    expect(result).toEqual({ success: true, message: "근태 수정 요청이 등록되었습니다.", data });
  });

  it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
    (createCorrectionRequest as jest.Mock).mockRejectedValue(new Error("근태 수정 요청 등록에 실패하였습니다."));

    const result = await createCorrectionRequestAction({
      date: "2026-08-17",
      type: "CLOCK_IN_TIME",
      requestedClockInTime: "09:00",
      reason: "출근 기록 오류",
    });

    expect(result).toEqual({ success: false, message: "근태 수정 요청 등록에 실패하였습니다." });
  });
});

describe("approveCorrectionRequestAction", () => {
  afterEach(() => jest.clearAllMocks());

  it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
    const data = { requestId: 1, status: "APPROVED" } as AttendanceAdminCorrectionRequestData;
    (approveCorrectionRequest as jest.Mock).mockResolvedValue(data);

    const result = await approveCorrectionRequestAction(1);

    expect(result).toEqual({ success: true, message: "근태 수정 요청이 승인되었습니다.", data });
  });

  it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
    (approveCorrectionRequest as jest.Mock).mockRejectedValue(new Error("근태 수정 요청 승인에 실패하였습니다."));

    const result = await approveCorrectionRequestAction(1);

    expect(result).toEqual({ success: false, message: "근태 수정 요청 승인에 실패하였습니다." });
  });
});

describe("rejectCorrectionRequestAction", () => {
  afterEach(() => jest.clearAllMocks());

  it("반려 사유가 비어있으면 실패 결과를 반환한다", async () => {
    const result = await rejectCorrectionRequestAction(1, { reason: "  " });

    expect(result).toEqual({ success: false, message: "반려 사유를 입력해주세요." });
    expect(rejectCorrectionRequest).not.toHaveBeenCalled();
  });

  it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
    const data = { requestId: 1, status: "REJECTED" } as AttendanceAdminCorrectionRequestData;
    (rejectCorrectionRequest as jest.Mock).mockResolvedValue(data);

    const result = await rejectCorrectionRequestAction(1, { reason: "증빙 부족" });

    expect(result).toEqual({ success: true, message: "근태 수정 요청이 반려되었습니다.", data });
  });

  it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
    (rejectCorrectionRequest as jest.Mock).mockRejectedValue(new Error("근태 수정 요청 반려에 실패하였습니다."));

    const result = await rejectCorrectionRequestAction(1, { reason: "증빙 부족" });

    expect(result).toEqual({ success: false, message: "근태 수정 요청 반려에 실패하였습니다." });
  });
});
