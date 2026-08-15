export type DashboardScope = "ALL" | "ACADEMY";
export type DashboardPeriod = "LAST_HOUR" | "LAST_24_HOURS" | "TODAY";

export type ApiCallCategory =
    | "INITIAL_DATA_READ"
    | "ACCOUNT_ISSUANCE"
    | "CHECK_IN"
    | "ATTENDANCE_EXPORT"
    | "NOTICE_CREATE"
    | "WORKSPACE_TASK_CREATE"
    | "WORKSPACE_TASK_STATUS_CHANGE"
    | "APPROVAL_SUBMISSION"
    | "SETTLEMENT_SUBMISSION"
    | "CALENDAR_CREATE"
    | "MEMO_CREATE";

export interface SuperAdminApiResponse<T> {
    status: number;
    code: string;
    message: string;
    data: T;
}

export interface DashboardQuery {
    scope?: DashboardScope;
    academyCode?: string;
    period?: DashboardPeriod;
}

export interface AcademyData {
    code: string;
}

export type AcademyListResponse = SuperAdminApiResponse<AcademyData[]>;

export interface ApiCallMetricData {
    category: ApiCallCategory;
    count: number;
}

export interface RdsConnectionBudgetData {
    current: number;
    safeBudget: number;
    usedPercent: number;
}

export interface EcsHostHeadroomData {
    cluster: string;
    hostId: string;
    registeredCpu: number;
    registeredMemoryMib: number;
    remainingCpu: number;
    remainingMemoryMib: number;
    academyCodes: string[];
}

export interface OperationalMetricsData {
    scope: DashboardScope;
    academyCode: string | null;
    period: DashboardPeriod;
    apiCallMetrics: ApiCallMetricData[];
    p95ResponseMilliseconds: number;
    errorRatePercent: number;
    rdsConnectionBudget: RdsConnectionBudgetData;
    ecsHostHeadrooms: EcsHostHeadroomData[];
}

export type OperationalMetricsResponse =
    SuperAdminApiResponse<OperationalMetricsData>;

export interface AcademyMemberCountData {
    academyCode: string;
    activeMemberCount: number;
    collectedAt: string;
}

export type AcademyMemberCountResponse =
    SuperAdminApiResponse<AcademyMemberCountData>;

export interface AcademyStorageUsageData {
    academyCode: string;
    databaseBytes: number;
    s3Bytes: number;
    collectedAt: string;
}

export type AcademyStorageUsageResponse =
    SuperAdminApiResponse<AcademyStorageUsageData>;

export interface AcademyApiCallFrequencyData {
    academyCode: string;
    apiCallMetrics: ApiCallMetricData[];
}

export type AcademyApiCallFrequencyResponse =
    SuperAdminApiResponse<AcademyApiCallFrequencyData[]>;

export interface AcademyApiCallRow {
    academyCode: string;
    values: number[];
}

export interface HostResourceData {
    academyCodes: string[];
    cpu: number;
    cpuText: string;
    hostId: string;
    memory: number;
    memoryText: string;
}
