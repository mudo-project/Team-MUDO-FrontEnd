'use server'

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
} from "@/service/attendance.service";

interface AttendanceActionState {
    success: boolean;
    message: string;
}

// 출근 체크인 액션
export const checkInAction = async (
    payload?: AttendanceCheckInRequest
): Promise<AttendanceActionState & { data?: AttendanceCheckInData }> => {
    try {
        const data = await checkIn(payload);

        return {
            success: true,
            message: "출근이 등록되었습니다.",
            data,
        };
    } catch (error) {
        let errorMessage = "출근 체크인에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}

// 퇴근 체크아웃 액션
export const checkOutAction = async (
    payload: AttendanceCheckOutRequest
): Promise<AttendanceActionState & { data?: AttendanceCheckOutData }> => {
    try {
        const data = await checkOut(payload);

        return {
            success: true,
            message: "퇴근이 등록되었습니다.",
            data,
        };
    } catch (error) {
        let errorMessage = "퇴근 체크아웃에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}

// 내 오늘 근태 조회 액션
export const getMyTodayAction = async (): Promise<AttendanceTodayData> => {
    return getMyToday();
}

// 특정 날짜 내 근태 상세 조회 액션
export const getMyDayDetailAction = async (date: string): Promise<AttendanceDayDetailData> => {
    return getMyDayDetail(date);
}

// 내 월별 근태 조회 액션
export const getMyMonthlyAction = async (params: AttendanceMonthlyParams): Promise<AttendanceMonthlyData> => {
    return getMyMonthly(params);
}

// 내 근태 대시보드 조회 액션
export const getMyDashboardAction = async (params: AttendanceDashboardParams): Promise<AttendanceDashboardData> => {
    return getMyDashboard(params);
}

// 내 재직 정보 조회 액션
export const getMyEmploymentSummaryAction = async (): Promise<AttendanceEmploymentSummaryData> => {
    return getMyEmploymentSummary();
}

// 내 연가 현황 조회 액션
export const getMyLeaveSummaryAction = async (): Promise<AttendanceLeaveSummaryData> => {
    return getMyLeaveSummary();
}

// 내 근태 수정 요청 목록 조회 액션
export const getMyCorrectionRequestListAction = async (): Promise<AttendanceMyCorrectionRequestData[]> => {
    return getMyCorrectionRequestList();
}

// 내 근태 수정 요청 상세 조회 액션
export const getMyCorrectionRequestDetailAction = async (requestId: number): Promise<AttendanceMyCorrectionRequestData> => {
    return getMyCorrectionRequestDetail(requestId);
}

// 근태 수정 요청 등록 액션
export const createCorrectionRequestAction = async (
    payload: AttendanceCorrectionCreateRequest
): Promise<AttendanceActionState & { data?: AttendanceMyCorrectionRequestData }> => {
    if (!payload.date) {
        return {
            success: false,
            message: "대상 날짜를 선택해주세요."
        };
    }

    if (!payload.reason.trim()) {
        return {
            success: false,
            message: "수정 요청 사유를 입력해주세요."
        };
    }

    try {
        const data = await createCorrectionRequest(payload);

        return {
            success: true,
            message: "근태 수정 요청이 등록되었습니다.",
            data,
        };
    } catch (error) {
        let errorMessage = "근태 수정 요청 등록에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}

// 관리자 근태 수정 요청 목록 조회 액션
export const getAdminCorrectionRequestListAction = async (
    params?: AttendanceAdminCorrectionRequestListParams
): Promise<AttendanceAdminCorrectionRequestListData> => {
    return getAdminCorrectionRequestList(params);
}

// 관리자 근태 수정 요청 상세 조회 액션
export const getAdminCorrectionRequestDetailAction = async (requestId: number): Promise<AttendanceAdminCorrectionRequestData> => {
    return getAdminCorrectionRequestDetail(requestId);
}

// 관리자 근태 수정 요청 승인 액션
export const approveCorrectionRequestAction = async (
    requestId: number
): Promise<AttendanceActionState & { data?: AttendanceAdminCorrectionRequestData }> => {
    try {
        const data = await approveCorrectionRequest(requestId);

        return {
            success: true,
            message: "근태 수정 요청이 승인되었습니다.",
            data,
        };
    } catch (error) {
        let errorMessage = "근태 수정 요청 승인에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}

// 관리자 근태 수정 요청 반려 액션
export const rejectCorrectionRequestAction = async (
    requestId: number,
    payload: AttendanceAdminCorrectionRejectRequest
): Promise<AttendanceActionState & { data?: AttendanceAdminCorrectionRequestData }> => {
    if (!payload.reason.trim()) {
        return {
            success: false,
            message: "반려 사유를 입력해주세요."
        };
    }

    try {
        const data = await rejectCorrectionRequest(requestId, payload);

        return {
            success: true,
            message: "근태 수정 요청이 반려되었습니다.",
            data,
        };
    } catch (error) {
        let errorMessage = "근태 수정 요청 반려에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}

// 오늘 팀 근태 현황 조회 액션
export const getTeamTodayAction = async (): Promise<AttendanceTeamTodayData> => {
    return getTeamToday();
}

// 전 직원 주간 출결 현황 조회 액션
export const getEmployeesWeeklyAction = async (params: AttendanceEmployeesWeeklyParams): Promise<AttendanceEmployeesWeeklyData> => {
    return getEmployeesWeekly(params);
}

// 특정 직원 주간 출결 상세 조회 액션
export const getEmployeeWeeklyAction = async (
    userId: number,
    params: AttendanceEmployeeWeeklyParams
): Promise<AttendanceEmployeeWeeklyData> => {
    return getEmployeeWeekly(userId, params);
}
