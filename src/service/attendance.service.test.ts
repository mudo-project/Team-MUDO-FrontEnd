import { fetchWithAuth } from "@/lib/fetch";
import { buildSignedClientIpHeaders } from "@/lib/clientIpHeaders";
import {
  approveCorrectionRequest,
  checkIn,
  checkOut,
  createCorrectionRequest,
  getAdminCorrectionRequestDetail,
  getAdminCorrectionRequestList,
  getEmployeeWeekly,
  getEmployeesWeekly,
  getMyCorrectionRequestDetail,
  getMyCorrectionRequestList,
  getMyDashboard,
  getMyDayDetail,
  getMyEmploymentSummary,
  getMyLeaveSummary,
  getMyMonthly,
  getMyToday,
  getTeamToday,
  rejectCorrectionRequest,
} from "./attendance.service";

jest.mock("../lib/fetch");
jest.mock("../lib/clientIpHeaders");

const mockedFetch = fetchWithAuth as jest.Mock;
const mockedBuildSignedClientIpHeaders = buildSignedClientIpHeaders as jest.Mock;

const okJsonResponse = (data: unknown) => ({
  ok: true,
  json: () => Promise.resolve(data),
});

const failJsonResponse = (message: string) => ({
  ok: false,
  headers: { get: () => "application/json" },
  json: () => Promise.resolve({ message }),
});

const signedHeaders = {
  "X-Client-IP": "123.45.67.89",
  "X-Client-IP-Timestamp": "1700000000",
  "X-Client-IP-Signature": "signature",
};

describe("checkIn", () => {
  beforeEach(() => {
    mockedBuildSignedClientIpHeaders.mockResolvedValue(signedHeaders);
  });

  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 출근 체크인 데이터를 반환한다", async () => {
    const data: AttendanceCheckInData = { attendanceId: 1, workDate: "2026-08-17", clockInAt: "09:05:00", clockInNote: null, status: "NORMAL" };
    mockedFetch.mockResolvedValue(okJsonResponse({ status: 200, code: "OK", message: "", data }));

    const result = await checkIn({ clockInNote: "지각 사유" });

    expect(mockedBuildSignedClientIpHeaders).toHaveBeenCalledWith("POST", "/api/attendance/check-ins");
    expect(mockedFetch).toHaveBeenCalledWith("/api/attendance/check-ins", {
      method: "POST",
      headers: signedHeaders,
      body: JSON.stringify({ clockInNote: "지각 사유" }),
    });
    expect(result).toEqual(data);
  });

  it("payload가 없으면 빈 객체로 요청한다", async () => {
    const data: AttendanceCheckInData = { attendanceId: 1, workDate: "2026-08-17", clockInAt: "09:00:00", clockInNote: null, status: "NORMAL" };
    mockedFetch.mockResolvedValue(okJsonResponse({ status: 200, code: "OK", message: "", data }));

    await checkIn();

    expect(mockedFetch).toHaveBeenCalledWith("/api/attendance/check-ins", {
      method: "POST",
      headers: signedHeaders,
      body: JSON.stringify({}),
    });
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("출근 체크인에 실패하였습니다."));

    await expect(checkIn()).rejects.toThrow("출근 체크인에 실패하였습니다.");
  });
});

describe("checkOut", () => {
  beforeEach(() => {
    mockedBuildSignedClientIpHeaders.mockResolvedValue(signedHeaders);
  });

  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 퇴근 체크아웃 데이터를 반환한다", async () => {
    const data: AttendanceCheckOutData = {
      attendanceId: 1,
      workDate: "2026-08-17",
      clockInAt: "09:05:00",
      clockOutAt: "18:10:00",
      clockOutType: "NORMAL",
      clockOutNote: null,
      status: "NORMAL",
    };
    mockedFetch.mockResolvedValue(okJsonResponse({ status: 200, code: "OK", message: "", data }));

    const payload: AttendanceCheckOutRequest = { clockOutType: "NORMAL", clockOutNote: "정상 퇴근" };
    const result = await checkOut(payload);

    expect(mockedBuildSignedClientIpHeaders).toHaveBeenCalledWith("POST", "/api/attendance/check-outs");
    expect(mockedFetch).toHaveBeenCalledWith("/api/attendance/check-outs", {
      method: "POST",
      headers: signedHeaders,
      body: JSON.stringify(payload),
    });
    expect(result).toEqual(data);
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("퇴근 체크아웃에 실패하였습니다."));

    await expect(checkOut({ clockOutType: "OVERTIME" })).rejects.toThrow("퇴근 체크아웃에 실패하였습니다.");
  });
});

describe("getMyToday", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 오늘 근태 데이터를 반환한다", async () => {
    const data: AttendanceTodayData = {
      date: "2026-08-17",
      workStartTime: "09:00:00",
      workEndTime: "18:00:00",
      clockInAt: null,
      clockOutAt: null,
      status: "UNRECORDED",
      serverTime: "2026-08-17T09:00:00",
    };
    mockedFetch.mockResolvedValue(okJsonResponse({ status: 200, code: "OK", message: "", data }));

    const result = await getMyToday();

    expect(mockedFetch).toHaveBeenCalledWith("/api/attendance/me/today");
    expect(result).toEqual(data);
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("오늘 근태 조회에 실패하였습니다."));

    await expect(getMyToday()).rejects.toThrow("오늘 근태 조회에 실패하였습니다.");
  });
});

describe("getMyDayDetail", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 특정 날짜 근태 상세 데이터를 반환한다", async () => {
    const data: AttendanceDayDetailData = {
      date: "2026-08-17",
      clockInAt: "09:05:00",
      clockOutAt: "18:10:00",
      clockInNote: null,
      clockOutNote: null,
      correctionRequestPending: false,
    };
    mockedFetch.mockResolvedValue(okJsonResponse({ status: 200, code: "OK", message: "", data }));

    const result = await getMyDayDetail("2026-08-17");

    expect(mockedFetch).toHaveBeenCalledWith("/api/attendance/me/days/2026-08-17");
    expect(result).toEqual(data);
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("선택한 날짜의 근태 조회에 실패하였습니다."));

    await expect(getMyDayDetail("2026-08-17")).rejects.toThrow("선택한 날짜의 근태 조회에 실패하였습니다.");
  });
});

describe("getMyMonthly", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 월별 근태 데이터를 반환한다", async () => {
    const data: AttendanceMonthlyData = { year: 2026, month: 8, days: [] };
    mockedFetch.mockResolvedValue(okJsonResponse({ status: 200, code: "OK", message: "", data }));

    const result = await getMyMonthly({ year: 2026, month: 8 });

    expect(mockedFetch).toHaveBeenCalledWith("/api/attendance/me/monthly?year=2026&month=8");
    expect(result).toEqual(data);
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("월별 근태 조회에 실패하였습니다."));

    await expect(getMyMonthly({ year: 2026, month: 8 })).rejects.toThrow("월별 근태 조회에 실패하였습니다.");
  });
});

describe("getMyDashboard", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 근태 대시보드 데이터를 반환한다", async () => {
    const data: AttendanceDashboardData = {
      calendar: { year: 2026, month: 8, days: [] },
      today: {
        date: "2026-08-17",
        workStartTime: "09:00:00",
        workEndTime: "18:00:00",
        clockInAt: null,
        clockOutAt: null,
        status: "UNRECORDED",
        serverTime: "2026-08-17T09:00:00",
      },
      leave: { totalDays: 15, usedDays: 3, pendingDays: 0, remainingDays: 12, nextGrantDate: "2027-01-01" },
      employment: { hireDate: "2024-01-01", tenureDays: 960 },
    };
    mockedFetch.mockResolvedValue(okJsonResponse({ status: 200, code: "OK", message: "", data }));

    const result = await getMyDashboard({ year: 2026, month: 8 });

    expect(mockedFetch).toHaveBeenCalledWith("/api/attendance/me/dashboard?year=2026&month=8");
    expect(result).toEqual(data);
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("근태 대시보드 조회에 실패하였습니다."));

    await expect(getMyDashboard({ year: 2026, month: 8 })).rejects.toThrow("근태 대시보드 조회에 실패하였습니다.");
  });
});

describe("getMyEmploymentSummary", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 재직 정보를 반환한다", async () => {
    const data: AttendanceEmploymentSummaryData = { hireDate: "2024-01-01", tenureDays: 960 };
    mockedFetch.mockResolvedValue(okJsonResponse({ status: 200, code: "OK", message: "", data }));

    const result = await getMyEmploymentSummary();

    expect(mockedFetch).toHaveBeenCalledWith("/api/users/me/employment-summary");
    expect(result).toEqual(data);
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("재직 정보 조회에 실패하였습니다."));

    await expect(getMyEmploymentSummary()).rejects.toThrow("재직 정보 조회에 실패하였습니다.");
  });
});

describe("getMyLeaveSummary", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 연가 현황을 반환한다", async () => {
    const data: AttendanceLeaveSummaryData = { totalDays: 15, usedDays: 3, pendingDays: 0, remainingDays: 12, nextGrantDate: "2027-01-01" };
    mockedFetch.mockResolvedValue(okJsonResponse({ status: 200, code: "OK", message: "", data }));

    const result = await getMyLeaveSummary();

    expect(mockedFetch).toHaveBeenCalledWith("/api/leaves/me/summary");
    expect(result).toEqual(data);
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("연가 현황 조회에 실패하였습니다."));

    await expect(getMyLeaveSummary()).rejects.toThrow("연가 현황 조회에 실패하였습니다.");
  });
});

describe("getMyCorrectionRequestList", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 내 근태 수정 요청 목록을 반환한다", async () => {
    const data: AttendanceMyCorrectionRequestData[] = [];
    mockedFetch.mockResolvedValue(okJsonResponse({ status: 200, code: "OK", message: "", data }));

    const result = await getMyCorrectionRequestList();

    expect(mockedFetch).toHaveBeenCalledWith("/api/attendance/me/correction-requests");
    expect(result).toEqual(data);
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("내 근태 수정 요청 목록 조회에 실패하였습니다."));

    await expect(getMyCorrectionRequestList()).rejects.toThrow("내 근태 수정 요청 목록 조회에 실패하였습니다.");
  });
});

describe("getMyCorrectionRequestDetail", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 내 근태 수정 요청 상세를 반환한다", async () => {
    const data = { requestId: 1 } as AttendanceMyCorrectionRequestData;
    mockedFetch.mockResolvedValue(okJsonResponse({ status: 200, code: "OK", message: "", data }));

    const result = await getMyCorrectionRequestDetail(1);

    expect(mockedFetch).toHaveBeenCalledWith("/api/attendance/me/correction-requests/1");
    expect(result).toEqual(data);
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("내 근태 수정 요청 상세 조회에 실패하였습니다."));

    await expect(getMyCorrectionRequestDetail(1)).rejects.toThrow("내 근태 수정 요청 상세 조회에 실패하였습니다.");
  });
});

describe("createCorrectionRequest", () => {
  const payload: AttendanceCorrectionCreateRequest = {
    date: "2026-08-17",
    type: "CLOCK_IN_TIME",
    requestedClockInTime: "09:00",
    reason: "출근 기록 오류",
  };

  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 등록된 수정 요청 데이터를 반환한다", async () => {
    const data = { requestId: 1 } as AttendanceMyCorrectionRequestData;
    mockedFetch.mockResolvedValue(okJsonResponse({ status: 200, code: "OK", message: "", data }));

    const result = await createCorrectionRequest(payload);

    expect(mockedFetch).toHaveBeenCalledWith("/api/attendance/me/correction-requests", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    expect(result).toEqual(data);
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("근태 수정 요청 등록에 실패하였습니다."));

    await expect(createCorrectionRequest(payload)).rejects.toThrow("근태 수정 요청 등록에 실패하였습니다.");
  });
});

describe("getAdminCorrectionRequestList", () => {
  afterEach(() => jest.clearAllMocks());

  it("파라미터가 있으면 쿼리 스트링을 포함해 요청한다", async () => {
    const data: AttendanceAdminCorrectionRequestListData = { content: [], page: 0, size: 100, hasNext: false };
    mockedFetch.mockResolvedValue(okJsonResponse({ status: 200, code: "OK", message: "", data }));

    const result = await getAdminCorrectionRequestList({ status: "PENDING", page: 0, size: 100 });

    expect(mockedFetch).toHaveBeenCalledWith("/api/attendance/correction-requests?status=PENDING&page=0&size=100");
    expect(result).toEqual(data);
  });

  it("파라미터가 없으면 쿼리 스트링 없이 요청한다", async () => {
    const data: AttendanceAdminCorrectionRequestListData = { content: [], page: 0, size: 20, hasNext: false };
    mockedFetch.mockResolvedValue(okJsonResponse({ status: 200, code: "OK", message: "", data }));

    await getAdminCorrectionRequestList();

    expect(mockedFetch).toHaveBeenCalledWith("/api/attendance/correction-requests");
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("근태 수정 요청 목록 조회에 실패하였습니다."));

    await expect(getAdminCorrectionRequestList()).rejects.toThrow("근태 수정 요청 목록 조회에 실패하였습니다.");
  });
});

describe("getAdminCorrectionRequestDetail", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 관리자용 수정 요청 상세를 반환한다", async () => {
    const data = { requestId: 1 } as AttendanceAdminCorrectionRequestData;
    mockedFetch.mockResolvedValue(okJsonResponse({ status: 200, code: "OK", message: "", data }));

    const result = await getAdminCorrectionRequestDetail(1);

    expect(mockedFetch).toHaveBeenCalledWith("/api/attendance/correction-requests/1");
    expect(result).toEqual(data);
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("근태 수정 요청 상세 조회에 실패하였습니다."));

    await expect(getAdminCorrectionRequestDetail(1)).rejects.toThrow("근태 수정 요청 상세 조회에 실패하였습니다.");
  });
});

describe("approveCorrectionRequest", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 승인된 수정 요청 데이터를 반환한다", async () => {
    const data = { requestId: 1, status: "APPROVED" } as AttendanceAdminCorrectionRequestData;
    mockedFetch.mockResolvedValue(okJsonResponse({ status: 200, code: "OK", message: "", data }));

    const result = await approveCorrectionRequest(1);

    expect(mockedFetch).toHaveBeenCalledWith("/api/attendance/correction-requests/1/approve", { method: "POST" });
    expect(result).toEqual(data);
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("근태 수정 요청 승인에 실패하였습니다."));

    await expect(approveCorrectionRequest(1)).rejects.toThrow("근태 수정 요청 승인에 실패하였습니다.");
  });
});

describe("rejectCorrectionRequest", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 반려된 수정 요청 데이터를 반환한다", async () => {
    const data = { requestId: 1, status: "REJECTED" } as AttendanceAdminCorrectionRequestData;
    mockedFetch.mockResolvedValue(okJsonResponse({ status: 200, code: "OK", message: "", data }));

    const result = await rejectCorrectionRequest(1, { reason: "증빙 부족" });

    expect(mockedFetch).toHaveBeenCalledWith("/api/attendance/correction-requests/1/reject", {
      method: "POST",
      body: JSON.stringify({ reason: "증빙 부족" }),
    });
    expect(result).toEqual(data);
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("근태 수정 요청 반려에 실패하였습니다."));

    await expect(rejectCorrectionRequest(1, { reason: "증빙 부족" })).rejects.toThrow("근태 수정 요청 반려에 실패하였습니다.");
  });
});

describe("getTeamToday", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 오늘 팀 근태 현황을 반환한다", async () => {
    const data: AttendanceTeamTodayData = {
      date: "2026-08-17",
      dayOfWeek: "월",
      regularWorkStartTime: "09:00:00",
      regularWorkEndTime: "18:00:00",
      summary: { presentCount: 1, absentCount: 0, offCount: 0, leaveCount: 0 },
      employees: [],
    };
    mockedFetch.mockResolvedValue(okJsonResponse({ status: 200, code: "OK", message: "", data }));

    const result = await getTeamToday();

    expect(mockedFetch).toHaveBeenCalledWith("/api/attendance/team/today");
    expect(result).toEqual(data);
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("오늘 팀 근태 현황 조회에 실패하였습니다."));

    await expect(getTeamToday()).rejects.toThrow("오늘 팀 근태 현황 조회에 실패하였습니다.");
  });
});

describe("getEmployeesWeekly", () => {
  afterEach(() => jest.clearAllMocks());

  it("검색어·상태 필터가 있으면 쿼리 스트링에 포함해 요청한다", async () => {
    const data: AttendanceEmployeesWeeklyData = {
      week: { startDate: "2026-08-17", endDate: "2026-08-23" },
      scheduledWorkDays: 5,
      employees: { content: [], page: 0, size: 20, hasNext: false },
    };
    mockedFetch.mockResolvedValue(okJsonResponse({ status: 200, code: "OK", message: "", data }));

    const result = await getEmployeesWeekly({ date: "2026-08-17", keyword: "김", status: "LATE" });

    expect(mockedFetch).toHaveBeenCalledWith("/api/attendance/employees/weekly?date=2026-08-17&keyword=%EA%B9%80&status=LATE");
    expect(result).toEqual(data);
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("전 직원 주간 출결 현황 조회에 실패하였습니다."));

    await expect(getEmployeesWeekly({ date: "2026-08-17" })).rejects.toThrow("전 직원 주간 출결 현황 조회에 실패하였습니다.");
  });
});

describe("getEmployeeWeekly", () => {
  afterEach(() => jest.clearAllMocks());

  it("응답이 정상이면 특정 직원 주간 출결 상세를 반환한다", async () => {
    const data: AttendanceEmployeeWeeklyData = {
      employee: { userId: 1, name: "김강사", position: "강사" },
      week: { startDate: "2026-08-17", endDate: "2026-08-23" },
      days: [],
      weeklySummary: { scheduledWorkDays: 5, attendedDays: 3 },
    };
    mockedFetch.mockResolvedValue(okJsonResponse({ status: 200, code: "OK", message: "", data }));

    const result = await getEmployeeWeekly(1, { date: "2026-08-17" });

    expect(mockedFetch).toHaveBeenCalledWith("/api/attendance/employees/1/weekly?date=2026-08-17");
    expect(result).toEqual(data);
  });

  it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
    mockedFetch.mockResolvedValue(failJsonResponse("직원 주간 출결 상세 조회에 실패하였습니다."));

    await expect(getEmployeeWeekly(1, { date: "2026-08-17" })).rejects.toThrow("직원 주간 출결 상세 조회에 실패하였습니다.");
  });
});
