import { fetchWithAuth } from "@/lib/fetch";
import { getErrorMessage } from "@/lib/stateError";
import {
    AcademyApiCallFrequencyResponse,
    AcademyListResponse,
    AcademyMemberCountResponse,
    AcademyStorageUsageResponse,
    DashboardQuery,
    OperationalMetricsResponse,
} from "@/feature/superadmin/type";

const createDashboardSearchParams = (query: DashboardQuery) => {
    const searchParams = new URLSearchParams();

    if (query.scope) searchParams.set("scope", query.scope);
    if (query.academyCode) searchParams.set("academyCode", query.academyCode);
    if (query.period) searchParams.set("period", query.period);

    return searchParams.toString();
};

const withSearchParams = (path: string, query: DashboardQuery) => {
    const searchParams = createDashboardSearchParams(query);
    return searchParams ? `${path}?${searchParams}` : path;
};

export const getAcademyList = async (): Promise<AcademyListResponse> => {
    const response = await fetchWithAuth("/api/platform/academies");

    if (!response.ok) {
        const message = await getErrorMessage(response, "학원 목록 조회에 실패했습니다.");
        throw new Error(message);
    }

    return response.json();
};

export const getOperationalMetrics = async (
    query: DashboardQuery = {},
): Promise<OperationalMetricsResponse> => {
    const response = await fetchWithAuth(
        withSearchParams("/api/platform/operational-metrics", query),
    );

    if (!response.ok) {
        const message = await getErrorMessage(response, "운영 성능·자원 지표 조회에 실패했습니다.");
        throw new Error(message);
    }

    return response.json();
};

export const getAcademyMemberCount = async (
    academyCode: string,
): Promise<AcademyMemberCountResponse> => {
    const response = await fetchWithAuth(
        `/api/platform/academies/${encodeURIComponent(academyCode)}/member-count`,
    );

    if (!response.ok) {
        const message = await getErrorMessage(response, "학원 회원 수 조회에 실패했습니다.");
        throw new Error(message);
    }

    return response.json();
};

export const getAcademyStorageUsage = async (
    academyCode: string,
): Promise<AcademyStorageUsageResponse> => {
    const response = await fetchWithAuth(
        `/api/platform/academies/${encodeURIComponent(academyCode)}/storage-usage`,
    );

    if (!response.ok) {
        const message = await getErrorMessage(response, "학원 데이터 보유량 조회에 실패했습니다.");
        throw new Error(message);
    }

    return response.json();
};

export const getAcademyApiCallFrequency = async (
    query: DashboardQuery = {},
): Promise<AcademyApiCallFrequencyResponse> => {
    const response = await fetchWithAuth(
        withSearchParams("/api/platform/api-call-frequency", query),
    );

    if (!response.ok) {
        const message = await getErrorMessage(response, "학원별 API 호출 빈도 조회에 실패했습니다.");
        throw new Error(message);
    }

    return response.json();
};
