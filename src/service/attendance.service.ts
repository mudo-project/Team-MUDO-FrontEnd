import { fetchWithAuth } from "@/lib/fetch";
import { getErrorMessage } from "@/lib/stateError";

// ── 출근/퇴근 ──────────────────────────────────────────

// 출근 체크인 API
export const checkIn = async (payload?: AttendanceCheckInRequest): Promise<AttendanceCheckInData> => {
    const response = await fetchWithAuth("/api/attendance/check-ins", {
        method: "POST",
        body: JSON.stringify(payload ?? {}),
    });

    if (!response.ok) {
        const message = await getErrorMessage(response, "출근 체크인에 실패하였습니다.");

        throw new Error(message);
    }

    const resData = (await response.json()) as AttendanceCheckInResponse;

    return resData.data;
}

// 퇴근 체크아웃 API
export const checkOut = async (payload: AttendanceCheckOutRequest): Promise<AttendanceCheckOutData> => {
    const response = await fetchWithAuth("/api/attendance/check-outs", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(response, "퇴근 체크아웃에 실패하였습니다.");

        throw new Error(message);
    }

    const resData = (await response.json()) as AttendanceCheckOutResponse;

    return resData.data;
}

// ── 내 근태 조회 ──────────────────────────────────────────

// 내 오늘 근태 조회 API
export const getMyToday = async (): Promise<AttendanceTodayData> => {
    const response = await fetchWithAuth("/api/attendance/me/today");

    if (!response.ok) {
        const message = await getErrorMessage(response, "오늘 근태 조회에 실패하였습니다.");

        throw new Error(message);
    }

    const resData = (await response.json()) as AttendanceTodayResponse;

    return resData.data;
}

// 특정 날짜 내 근태 상세 조회 API
export const getMyDayDetail = async (date: string): Promise<AttendanceDayDetailData> => {
    const response = await fetchWithAuth(`/api/attendance/me/days/${date}`);

    if (!response.ok) {
        const message = await getErrorMessage(response, "선택한 날짜의 근태 조회에 실패하였습니다.");

        throw new Error(message);
    }

    const resData = (await response.json()) as AttendanceDayDetailResponse;

    return resData.data;
}

// 내 월별 근태 조회 API
export const getMyMonthly = async (params: AttendanceMonthlyParams): Promise<AttendanceMonthlyData> => {
    const query = new URLSearchParams({
        year: String(params.year),
        month: String(params.month),
    });

    const response = await fetchWithAuth(`/api/attendance/me/monthly?${query.toString()}`);

    if (!response.ok) {
        const message = await getErrorMessage(response, "월별 근태 조회에 실패하였습니다.");

        throw new Error(message);
    }

    const resData = (await response.json()) as AttendanceMonthlyResponse;

    return resData.data;
}

// 내 근태 대시보드 조회 API
export const getMyDashboard = async (params: AttendanceDashboardParams): Promise<AttendanceDashboardData> => {
    const query = new URLSearchParams({
        year: String(params.year),
        month: String(params.month),
    });

    const response = await fetchWithAuth(`/api/attendance/me/dashboard?${query.toString()}`);

    if (!response.ok) {
        const message = await getErrorMessage(response, "근태 대시보드 조회에 실패하였습니다.");

        throw new Error(message);
    }

    const resData = (await response.json()) as AttendanceDashboardResponse;

    return resData.data;
}

// 내 재직 정보 조회 API
export const getMyEmploymentSummary = async (): Promise<AttendanceEmploymentSummaryData> => {
    const response = await fetchWithAuth("/api/users/me/employment-summary");

    if (!response.ok) {
        const message = await getErrorMessage(response, "재직 정보 조회에 실패하였습니다.");

        throw new Error(message);
    }

    const resData = (await response.json()) as AttendanceEmploymentSummaryResponse;

    return resData.data;
}

// 내 연가 현황 조회 API
export const getMyLeaveSummary = async (): Promise<AttendanceLeaveSummaryData> => {
    const response = await fetchWithAuth("/api/leaves/me/summary");

    if (!response.ok) {
        const message = await getErrorMessage(response, "연가 현황 조회에 실패하였습니다.");

        throw new Error(message);
    }

    const resData = (await response.json()) as AttendanceLeaveSummaryResponse;

    return resData.data;
}

// ── 내 근태 수정 요청 ──────────────────────────────────────────

// 내 근태 수정 요청 목록 조회 API
export const getMyCorrectionRequestList = async (): Promise<AttendanceMyCorrectionRequestData[]> => {
    const response = await fetchWithAuth("/api/attendance/me/correction-requests");

    if (!response.ok) {
        const message = await getErrorMessage(response, "내 근태 수정 요청 목록 조회에 실패하였습니다.");

        throw new Error(message);
    }

    const resData = (await response.json()) as AttendanceMyCorrectionRequestListResponse;

    return resData.data;
}

// 내 근태 수정 요청 상세 조회 API
export const getMyCorrectionRequestDetail = async (requestId: number): Promise<AttendanceMyCorrectionRequestData> => {
    const response = await fetchWithAuth(`/api/attendance/me/correction-requests/${requestId}`);

    if (!response.ok) {
        const message = await getErrorMessage(response, "내 근태 수정 요청 상세 조회에 실패하였습니다.");

        throw new Error(message);
    }

    const resData = (await response.json()) as AttendanceMyCorrectionRequestDetailResponse;

    return resData.data;
}

// 근태 수정 요청 등록 API
export const createCorrectionRequest = async (payload: AttendanceCorrectionCreateRequest): Promise<AttendanceMyCorrectionRequestData> => {
    const response = await fetchWithAuth("/api/attendance/me/correction-requests", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(response, "근태 수정 요청 등록에 실패하였습니다.");

        throw new Error(message);
    }

    const resData = (await response.json()) as AttendanceCorrectionCreateResponse;

    return resData.data;
}

// ── 관리자 근태 수정 요청 ──────────────────────────────────────────

// 관리자 근태 수정 요청 목록 조회 API
export const getAdminCorrectionRequestList = async (
    params?: AttendanceAdminCorrectionRequestListParams
): Promise<AttendanceAdminCorrectionRequestListData> => {
    const query = new URLSearchParams();
    if (params?.status) query.set("status", params.status);
    if (params?.page !== undefined) query.set("page", String(params.page));
    if (params?.size !== undefined) query.set("size", String(params.size));
    const queryString = query.toString();

    const response = await fetchWithAuth(`/api/attendance/correction-requests${queryString ? `?${queryString}` : ""}`);

    if (!response.ok) {
        const message = await getErrorMessage(response, "근태 수정 요청 목록 조회에 실패하였습니다.");

        throw new Error(message);
    }

    const resData = (await response.json()) as AttendanceAdminCorrectionRequestListResponse;

    return resData.data;
}

// 관리자 근태 수정 요청 상세 조회 API
export const getAdminCorrectionRequestDetail = async (requestId: number): Promise<AttendanceAdminCorrectionRequestData> => {
    const response = await fetchWithAuth(`/api/attendance/correction-requests/${requestId}`);

    if (!response.ok) {
        const message = await getErrorMessage(response, "근태 수정 요청 상세 조회에 실패하였습니다.");

        throw new Error(message);
    }

    const resData = (await response.json()) as AttendanceAdminCorrectionRequestDetailResponse;

    return resData.data;
}

// 관리자 근태 수정 요청 승인 API
export const approveCorrectionRequest = async (requestId: number): Promise<AttendanceAdminCorrectionRequestData> => {
    const response = await fetchWithAuth(`/api/attendance/correction-requests/${requestId}/approve`, {
        method: "POST",
    });

    if (!response.ok) {
        const message = await getErrorMessage(response, "근태 수정 요청 승인에 실패하였습니다.");

        throw new Error(message);
    }

    const resData = (await response.json()) as AttendanceAdminCorrectionApproveResponse;

    return resData.data;
}

// 관리자 근태 수정 요청 반려 API
export const rejectCorrectionRequest = async (
    requestId: number,
    payload: AttendanceAdminCorrectionRejectRequest
): Promise<AttendanceAdminCorrectionRequestData> => {
    const response = await fetchWithAuth(`/api/attendance/correction-requests/${requestId}/reject`, {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(response, "근태 수정 요청 반려에 실패하였습니다.");

        throw new Error(message);
    }

    const resData = (await response.json()) as AttendanceAdminCorrectionRejectResponse;

    return resData.data;
}

// ── 전직원 근태 현황 ──────────────────────────────────────────

// 오늘 팀 근태 현황 조회 API
export const getTeamToday = async (): Promise<AttendanceTeamTodayData> => {
    const response = await fetchWithAuth("/api/attendance/team/today");

    if (!response.ok) {
        const message = await getErrorMessage(response, "오늘 팀 근태 현황 조회에 실패하였습니다.");

        throw new Error(message);
    }

    const resData = (await response.json()) as AttendanceTeamTodayResponse;

    return resData.data;
}

// 전 직원 주간 출결 현황 조회 API
export const getEmployeesWeekly = async (params: AttendanceEmployeesWeeklyParams): Promise<AttendanceEmployeesWeeklyData> => {
    const query = new URLSearchParams({ date: params.date });
    if (params.keyword) query.set("keyword", params.keyword);
    if (params.status) query.set("status", params.status);
    if (params.page !== undefined) query.set("page", String(params.page));
    if (params.size !== undefined) query.set("size", String(params.size));

    const response = await fetchWithAuth(`/api/attendance/employees/weekly?${query.toString()}`);

    if (!response.ok) {
        const message = await getErrorMessage(response, "전 직원 주간 출결 현황 조회에 실패하였습니다.");

        throw new Error(message);
    }

    const resData = (await response.json()) as AttendanceEmployeesWeeklyResponse;

    return resData.data;
}

// 특정 직원 주간 출결 상세 조회 API
export const getEmployeeWeekly = async (
    userId: number,
    params: AttendanceEmployeeWeeklyParams
): Promise<AttendanceEmployeeWeeklyData> => {
    const query = new URLSearchParams({ date: params.date });

    const response = await fetchWithAuth(`/api/attendance/employees/${userId}/weekly?${query.toString()}`);

    if (!response.ok) {
        const message = await getErrorMessage(response, "직원 주간 출결 상세 조회에 실패하였습니다.");

        throw new Error(message);
    }

    const resData = (await response.json()) as AttendanceEmployeeWeeklyResponse;

    return resData.data;
}
