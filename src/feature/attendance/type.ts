type AttendanceStatus = "NORMAL" | "LATE" | "ABSENT" | "UNRECORDED";
// 오늘 팀 근태 현황
type AttendanceTeamTodayStatus = "PRESENT" | "LEAVE" | "ABSENT" | "OFF";
// 근태 수정 요청 처리 상태.
type AttendanceCorrectionStatus = "PENDING" | "APPROVED" | "REJECTED";
// 퇴근 유형
type AttendanceClockOutType = "NORMAL" | "OVERTIME";
// 근태 수정 요청 유형
type AttendanceCorrectionType = string;


// 출근 체크인 요청값
interface AttendanceCheckInRequest {
    clockInNote?: string;
}

// 출근 체크인 응답 데이터
interface AttendanceCheckInData {
    attendanceId: number;
    workDate: string;
    clockInAt: string;
    clockInNote: string | null;
    status: AttendanceStatus;
}

// 출근 체크인 응답값
interface AttendanceCheckInResponse {
    status: number;
    code: string;
    message: string;
    data: AttendanceCheckInData;
}

// 퇴근 체크아웃 요청값
interface AttendanceCheckOutRequest {
    clockOutType: AttendanceClockOutType;
    clockOutNote?: string;
}

// 퇴근 체크아웃 응답 데이터
interface AttendanceCheckOutData {
    attendanceId: number;
    workDate: string;
    clockInAt: string;
    clockOutAt: string;
    clockOutType: AttendanceClockOutType;
    clockOutNote: string | null;
    status: AttendanceStatus;
}

// 퇴근 체크아웃 응답값
interface AttendanceCheckOutResponse {
    status: number;
    code: string;
    message: string;
    data: AttendanceCheckOutData;
}

// 내 오늘 근태 조회 응답 데이터
interface AttendanceTodayData {
    date: string;
    workStartTime: string;
    workEndTime: string;
    clockInAt: string | null;
    clockOutAt: string | null;
    status: AttendanceStatus;
    serverTime: string;
}

// 내 오늘 근태 조회 응답값
interface AttendanceTodayResponse {
    status: number;
    code: string;
    message: string;
    data: AttendanceTodayData;
}

// 특정 날짜 내 근태 상세 조회 응답 데이터
interface AttendanceDayDetailData {
    date: string;
    clockInAt: string | null;
    clockOutAt: string | null;
    clockInNote: string | null;
    clockOutNote: string | null;
    correctionRequestPending: boolean;
}

// 특정 날짜 내 근태 상세 조회 응답값
interface AttendanceDayDetailResponse {
    status: number;
    code: string;
    message: string;
    data: AttendanceDayDetailData;
}

// 내 월별 근태 조회 요청 파라미터
interface AttendanceMonthlyParams {
    year: number;
    month: number;
}

// 내 월별 근태 조회 날짜별 항목
interface AttendanceMonthlyDayData {
    date: string;
    status: AttendanceStatus;
    clockInAt: string | null;
    clockOutAt: string | null;
}

// 내 월별 근태 조회 응답 데이터
interface AttendanceMonthlyData {
    year: number;
    month: number;
    days: AttendanceMonthlyDayData[];
}

// 내 월별 근태 조회 응답값
interface AttendanceMonthlyResponse {
    status: number;
    code: string;
    message: string;
    data: AttendanceMonthlyData;
}

// 내 근태 대시보드 조회 요청 파라미터
interface AttendanceDashboardParams {
    year: number;
    month: number;
}

// 내 근태 대시보드 조회 응답 데이터
interface AttendanceDashboardData {
    calendar: AttendanceMonthlyData;
    today: AttendanceTodayData;
    leave: AttendanceLeaveSummaryData;
    employment: AttendanceEmploymentSummaryData;
}

// 내 근태 대시보드 조회 응답값
interface AttendanceDashboardResponse {
    status: number;
    code: string;
    message: string;
    data: AttendanceDashboardData;
}

// 내 재직 정보 조회 응답 데이터
interface AttendanceEmploymentSummaryData {
    hireDate: string;
    tenureDays: number;
}

// 내 재직 정보 조회 응답값
interface AttendanceEmploymentSummaryResponse {
    status: number;
    code: string;
    message: string;
    data: AttendanceEmploymentSummaryData;
}

// 내 연가 현황 조회 응답 데이터
interface AttendanceLeaveSummaryData {
    totalDays: number;
    usedDays: number;
    pendingDays: number;
    remainingDays: number;
    nextGrantDate: string;
}

// 내 연가 현황 조회 응답값
interface AttendanceLeaveSummaryResponse {
    status: number;
    code: string;
    message: string;
    data: AttendanceLeaveSummaryData;
}

// 오늘 팀 근태 현황 직원 항목
interface AttendanceTeamTodayEmployeeData {
    userId: number;
    name: string;
    status: AttendanceTeamTodayStatus;
    checkInTime: string | null;
}

// 오늘 팀 근태 현황 상태별 요약
interface AttendanceTeamTodaySummaryData {
    presentCount: number;
    absentCount: number;
    offCount: number;
    leaveCount: number;
}

// 오늘 팀 근태 현황 조회 응답 데이터
interface AttendanceTeamTodayData {
    date: string;
    dayOfWeek: string;
    regularWorkStartTime: string;
    regularWorkEndTime: string;
    summary: AttendanceTeamTodaySummaryData;
    employees: AttendanceTeamTodayEmployeeData[];
}

// 오늘 팀 근태 현황 조회 응답값
interface AttendanceTeamTodayResponse {
    status: number;
    code: string;
    message: string;
    data: AttendanceTeamTodayData;
}

// 전 직원 주간 출결 현황 조회 요청 파라미터
interface AttendanceEmployeesWeeklyParams {
    date: string;
    keyword?: string;
    status?: AttendanceStatus;
    page?: number;
    size?: number;
}

// 전 직원 주간 출결 현황의 직원별 날짜 항목
interface AttendanceEmployeesWeeklyDayData {
    date: string;
    status: AttendanceStatus;
    clockInAt: string | null;
}

// 전 직원 주간 출결 현황의 직원별 항목
interface AttendanceEmployeesWeeklyItemData {
    userId: number;
    name: string;
    attendedDays: number;
    scheduledWorkDays: number;
    days: AttendanceEmployeesWeeklyDayData[];
}

// 전 직원 주간 출결 현황 페이지 데이터
interface AttendanceEmployeesWeeklyPageData {
    content: AttendanceEmployeesWeeklyItemData[];
    page: number;
    size: number;
    hasNext: boolean;
}

// 전 직원 주간 출결 현황 조회 응답 데이터
interface AttendanceEmployeesWeeklyData {
    week: AttendanceWeekRangeData;
    scheduledWorkDays: number;
    employees: AttendanceEmployeesWeeklyPageData;
}

// 전 직원 주간 출결 현황 조회 응답값
interface AttendanceEmployeesWeeklyResponse {
    status: number;
    code: string;
    message: string;
    data: AttendanceEmployeesWeeklyData;
}

// 특정 직원 주간 출결 상세 조회 요청 파라미터
interface AttendanceEmployeeWeeklyParams {
    date: string;
}

// 주간 범위(월요일~일요일)
interface AttendanceWeekRangeData {
    startDate: string;
    endDate: string;
}

// 특정 직원 주간 출결 상세의 날짜별 항목
interface AttendanceEmployeeWeeklyDayData {
    date: string;
    status: AttendanceStatus;
    clockInAt: string | null;
    clockOutAt: string | null;
}

// 특정 직원 주간 출결 상세 조회 응답 데이터
interface AttendanceEmployeeWeeklyData {
    employee: {
        userId: number;
        name: string;
        position?: string;
    };
    week: AttendanceWeekRangeData;
    days: AttendanceEmployeeWeeklyDayData[];
    weeklySummary: {
        scheduledWorkDays: number;
        attendedDays: number;
    };
}

// 특정 직원 주간 출결 상세 조회 응답값
interface AttendanceEmployeeWeeklyResponse {
    status: number;
    code: string;
    message: string;
    data: AttendanceEmployeeWeeklyData;
}

// 내 근태 수정 요청 항목(목록/상세 공용)
interface AttendanceMyCorrectionRequestData {
    requestId: number;
    date: string;
    type: AttendanceCorrectionType;
    status: AttendanceCorrectionStatus;
    originalClockInAt: string | null;
    originalClockOutAt: string | null;
    originalClockInNote: string | null;
    originalClockOutNote: string | null;
    requestedClockInAt: string | null;
    requestedClockOutAt: string | null;
    requestedClockInNote: string | null;
    requestedClockOutNote: string | null;
    reason: string;
    requestedAt: string;
    processedAt: string | null;
    rejectionReason: string | null;
}

// 내 근태 수정 요청 목록 조회 응답값
interface AttendanceMyCorrectionRequestListResponse {
    status: number;
    code: string;
    message: string;
    data: AttendanceMyCorrectionRequestData[];
}

// 내 근태 수정 요청 상세 조회 응답값
interface AttendanceMyCorrectionRequestDetailResponse {
    status: number;
    code: string;
    message: string;
    data: AttendanceMyCorrectionRequestData;
}

// 근태 수정 요청 등록 요청값. 명세 Request Body 표에는 CLOCK_IN_TIME 유형 기준 필드만 명시되어 있다.
interface AttendanceCorrectionCreateRequest {
    date: string;
    type: AttendanceCorrectionType;
    requestedClockInTime?: string;
    reason: string;
}

// 근태 수정 요청 등록 응답값
interface AttendanceCorrectionCreateResponse {
    status: number;
    code: string;
    message: string;
    data: AttendanceMyCorrectionRequestData;
}

// 관리자 근태 수정 요청 목록 조회 요청 파라미터
interface AttendanceAdminCorrectionRequestListParams {
    status?: AttendanceCorrectionStatus;
    page?: number;
    size?: number;
}

// 관리자 근태 수정 요청 항목(목록/상세/승인/반려 공용)
interface AttendanceAdminCorrectionRequestData {
    requestId: number;
    requester: {
        userId: number;
        name: string;
        position: string;
    };
    workDate: string;
    type: AttendanceCorrectionType;
    status: AttendanceCorrectionStatus;
    originalClockInAt: string | null;
    originalClockOutAt: string | null;
    originalClockInNote: string | null;
    originalClockOutNote: string | null;
    requestedClockInAt: string | null;
    requestedClockOutAt: string | null;
    requestedClockInNote: string | null;
    requestedClockOutNote: string | null;
    reason: string;
    requestedAt: string;
    processedAt: string | null;
    processedBy: number | null;
    rejectionReason: string | null;
}

// 관리자 근태 수정 요청 목록 페이지 데이터
interface AttendanceAdminCorrectionRequestListData {
    content: AttendanceAdminCorrectionRequestData[];
    page: number;
    size: number;
    hasNext: boolean;
}

// 관리자 근태 수정 요청 목록 조회 응답값
interface AttendanceAdminCorrectionRequestListResponse {
    status: number;
    code: string;
    message: string;
    data: AttendanceAdminCorrectionRequestListData;
}

// 관리자 근태 수정 요청 상세 조회 응답값
interface AttendanceAdminCorrectionRequestDetailResponse {
    status: number;
    code: string;
    message: string;
    data: AttendanceAdminCorrectionRequestData;
}

// 관리자 근태 수정 요청 승인 응답값
interface AttendanceAdminCorrectionApproveResponse {
    status: number;
    code: string;
    message: string;
    data: AttendanceAdminCorrectionRequestData;
}

// 관리자 근태 수정 요청 반려 요청값
interface AttendanceAdminCorrectionRejectRequest {
    reason: string;
}

// 관리자 근태 수정 요청 반려 응답값
interface AttendanceAdminCorrectionRejectResponse {
    status: number;
    code: string;
    message: string;
    data: AttendanceAdminCorrectionRequestData;
}
