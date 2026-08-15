"use server";

import {
    getAcademyApiCallFrequency,
    getAcademyList,
    getAcademyMemberCount,
    getAcademyStorageUsage,
    getOperationalMetrics,
} from "@/service/superadmin.service";
import {
    AcademyApiCallFrequencyData,
    AcademyData,
    AcademyMemberCountData,
    AcademyStorageUsageData,
    DashboardPeriod,
    DashboardQuery,
    DashboardScope,
    OperationalMetricsData,
} from "./type";

export interface SuperAdminActionResult<T = undefined> {
    success: boolean;
    message: string;
    data?: T;
}

const dashboardScopes: DashboardScope[] = ["ALL", "ACADEMY"];
const dashboardPeriods: DashboardPeriod[] = ["LAST_HOUR", "LAST_24_HOURS", "TODAY"];

const getActionErrorMessage = (error: unknown, fallback: string) =>
    error instanceof Error ? error.message : fallback;

const validateDashboardQuery = (query: DashboardQuery) => {
    if (query.scope && !dashboardScopes.includes(query.scope)) {
        return "조회 범위가 올바르지 않습니다.";
    }

    if (query.period && !dashboardPeriods.includes(query.period)) {
        return "조회 기간이 올바르지 않습니다.";
    }

    if (query.scope === "ACADEMY" && !query.academyCode?.trim()) {
        return "학원 코드가 필요합니다.";
    }
};

export const getAcademyListAction = async (): Promise<
    SuperAdminActionResult<AcademyData[]>
> => {
    try {
        const response = await getAcademyList();
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "학원 목록 조회에 실패했습니다."),
        };
    }
};

export const getOperationalMetricsAction = async (
    query: DashboardQuery = {},
): Promise<SuperAdminActionResult<OperationalMetricsData>> => {
    const validationMessage = validateDashboardQuery(query);
    if (validationMessage) return { success: false, message: validationMessage };

    try {
        const response = await getOperationalMetrics(query);
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "운영 성능·자원 지표 조회에 실패했습니다."),
        };
    }
};

export const getAcademyMemberCountAction = async (
    academyCode: string,
): Promise<SuperAdminActionResult<AcademyMemberCountData>> => {
    if (!academyCode.trim()) return { success: false, message: "학원 코드가 필요합니다." };

    try {
        const response = await getAcademyMemberCount(academyCode);
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "학원 회원 수 조회에 실패했습니다."),
        };
    }
};

export const getAcademyStorageUsageAction = async (
    academyCode: string,
): Promise<SuperAdminActionResult<AcademyStorageUsageData>> => {
    if (!academyCode.trim()) return { success: false, message: "학원 코드가 필요합니다." };

    try {
        const response = await getAcademyStorageUsage(academyCode);
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "학원 데이터 보유량 조회에 실패했습니다."),
        };
    }
};

export const getAcademyApiCallFrequencyAction = async (
    query: DashboardQuery = {},
): Promise<SuperAdminActionResult<AcademyApiCallFrequencyData[]>> => {
    const validationMessage = validateDashboardQuery(query);
    if (validationMessage) return { success: false, message: validationMessage };

    try {
        const response = await getAcademyApiCallFrequency(query);
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "학원별 API 호출 빈도 조회에 실패했습니다."),
        };
    }
};
