// 급여 준비 상태
type PayrollPreparationStatus = "NOT_CREATED" | "DRAFT" | "CALCULATED" | "CONFIRMED";

// 급여 대상 직원 고용형태 (API 명세서에는 REGULAR/PART_TIME만 확인됨, FIXED_TERM은 화면 시안 기준 추가)
type PayrollEmploymentType = "REGULAR" | "FIXED_TERM" | "PART_TIME";

// 급여 목록 항목
interface PayrollListItemData {
    employeeId: number;
    employeeName: string;
    employmentType: PayrollEmploymentType | null;
    payrollId: number | null;
    preparationStatus: PayrollPreparationStatus;
    totalEarnings: number | null;
    totalDeductions: number | null;
    netPay: number | null;
    revisionNo: number;
}

// 월 급여 목록 요약
interface PayrollMonthSummaryData {
    targetEmployeeCount: number;
    notCreatedCount: number;
    draftCount: number;
    calculatedCount: number;
    confirmedCount: number;
    totalEarnings: number;
    totalDeductions: number;
    totalNetPay: number;
}

// 이메일 발송 상태(개별)
type PayrollEmailDeliveryStatus = "PENDING" | "SENDING" | "RETRY_WAIT" | "SENT" | "DELIVERED" | "FAILED" | "SKIPPED" | "UNKNOWN";

// 일괄 발송 배치 상태
type PayrollEmailBatchStatus = "PENDING" | "PROCESSING" | "AWAITING_DELIVERY" | "COMPLETED";

// 일괄 발송 대상 1건
interface PayrollEmailDeliveryData {
    deliveryId: number;
    employeeId: number;
    employeeName: string;
    recipientEmailMasked: string;
    status: PayrollEmailDeliveryStatus;
    failureReason: string | null;
}

// 일괄 발송 결과
interface PayrollEmailBatchResultData {
    batchId: number;
    yearMonth: string;
    status: PayrollEmailBatchStatus;
    summary: {
        totalCount: number;
        pendingCount: number;
        sendingCount: number;
        sentCount: number;
        retryWaitCount: number;
        unknownCount: number;
        deliveredCount: number;
        failedCount: number;
        skippedCount: number;
    };
    deliveries: PayrollEmailDeliveryData[];
}

// 급여 지급일 유형
type PayrollPayDayType = "FIXED_DAY" | "MONTH_END";

// 급여형태
type PayrollSalaryType = "MONTHLY" | "HOURLY";

// 고정수당 유형
type PayrollFixedAllowanceType = "MEAL" | "POSITION" | "DUTY" | "TRANSPORTATION" | "OTHER";

// 급여 Aggregate의 직원 정보(목록 조회의 employeeName과 달리 name 필드를 사용한다)
interface PayrollAggregateEmployeeData {
    employeeId: number;
    name: string;
    employmentType: PayrollEmploymentType | null;
}

// 급여 계산 시점의 근태 Snapshot
interface PayrollAttendanceSnapshotData {
    workDays: number;
    workHours: number;
    overtimeHours: number;
    nightHours: number;
    holidayHours: number;
    paidLeaveHours: number;
}

// 급여 계산 시점의 계약 Snapshot
interface PayrollCompensationSnapshotData {
    appliedFrom: string;
    appliedTo: string;
    employmentType: PayrollEmploymentType;
    salaryType: PayrollSalaryType;
    baseSalary: number | null;
    hourlyWage: number | null;
    ordinaryHourlyWage: number;
    weeklyContractHours: number;
}

// 급여 계산 시점의 법정 기준 Snapshot
interface PayrollRuleSnapshotData {
    laborScopeId: number;
    fiveOrMore: boolean;
    overtimeMultiplier: number;
    nightMultiplier: number;
    holidayUnder8Multiplier: number;
    holidayOver8Multiplier: number;
}

// 급여 계산 시점 Snapshot 묶음(DRAFT 상태는 null)
interface PayrollSnapshotsData {
    attendance: PayrollAttendanceSnapshotData;
    compensations?: PayrollCompensationSnapshotData[];
    rule?: PayrollRuleSnapshotData;
}

// 급여 지급/공제 항목(Aggregate 공통)
interface PayrollLineItemData {
    itemId: number;
    type: string;
    name: string;
    sourceType: string;
    amount: number;
    originalAmount?: number | null;
    adjusted?: boolean;
    adjustmentReason?: string | null;
    calculationFormula?: string | null;
    calculationBasis?: string | null;
    editable?: boolean;
}

// 급여명세서 생성 상태(Aggregate 안에 포함되는 statement)
interface PayrollStatementData {
    statementId: number;
    status: "PENDING" | "READY" | "FAILED";
    fileSize: number | null;
    generatedAt: string | null;
    failureReason: string | null;
}

// 급여 Aggregate(초안생성/계산/상세조회/수정/지급항목추가삭제/확정/정정본생성/미리보기 공통 응답 데이터)
interface PayrollAggregateData {
    payrollId: number;
    employee: PayrollAggregateEmployeeData;
    yearMonth: string;
    scheduledPayDate: string;
    status: PayrollPreparationStatus;
    revisionNo: number;
    originalPayrollId: number | null;
    snapshots: PayrollSnapshotsData | null;
    earnings: PayrollLineItemData[];
    deductions: PayrollLineItemData[];
    totalEarnings: number | null;
    totalDeductions: number | null;
    netPay: number | null;
    memo: string | null;
    statement: PayrollStatementData | null;
    version: number;
}

// 급여 Aggregate 공통 응답 envelope
interface PayrollAggregateResponse {
    status: number;
    code: string;
    message: string;
    data: PayrollAggregateData;
}

// 월 급여 목록 조회 — 요청
interface PayrollListParams {
    year: number;
    month: number;
    employmentType?: PayrollEmploymentType;
    status?: PayrollPreparationStatus;
    employeeName?: string;
    page?: number;
    size?: number;
}

// 월 급여 목록 조회 — 요약
interface PayrollListSummaryData {
    targetEmployeeCount: number;
    notCreatedCount: number;
    calculatedCount: number;
    confirmedCount: number;
    totalEarnings: number;
    totalDeductions: number;
    totalNetPay: number;
}

// 월 급여 목록 조회 — 응답 데이터
interface PayrollListData {
    content: PayrollListItemData[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
    summary: PayrollListSummaryData;
}

// 월 급여 목록 조회 — 응답
interface PayrollListResponse {
    status: number;
    code: string;
    message: string;
    data: PayrollListData;
}

// 월 급여 초안 생성 — 요청
interface PayrollDraftCreateRequest {
    year: number;
    month: number;
}

// 급여 계산 및 재계산 — 요청
interface PayrollCalculateRequest {
    expectedVersion?: number;
}

// 급여 지급항목 및 메모 수정 — 조정 항목 1건
interface PayrollAdjustmentRequestItem {
    itemId: number;
    amount: number;
    reason?: string;
}

// 급여 지급항목 및 메모 수정 — 요청
interface PayrollUpdateRequest {
    expectedVersion?: number;
    memo?: string;
    adjustments?: PayrollAdjustmentRequestItem[];
}

// 수기 지급항목 추가 — 요청
interface PayrollEarningCreateRequest {
    expectedVersion?: number;
    name: string;
    amount: number;
}

// 급여 확정 및 명세서 생성 — 요청
interface PayrollConfirmRequest {
    expectedVersion?: number;
}

// 급여 정정본 생성 — 요청
interface PayrollRevisionCreateRequest {
    expectedVersion?: number;
}

// 급여 정정 이력 조회 — 응답
interface PayrollRevisionListResponse {
    status: number;
    code: string;
    message: string;
    data: PayrollAggregateData[];
}

// 급여명세서 다운로드 URL 발급 — 응답 데이터
interface PayrollStatementDownloadUrlData {
    statementId: number;
    payrollId: number;
    fileName: string;
    downloadUrl: string;
    expiresInSeconds: number;
}

// 급여명세서 다운로드 URL 발급 — 응답
interface PayrollStatementDownloadUrlResponse {
    status: number;
    code: string;
    message: string;
    data: PayrollStatementDownloadUrlData;
}

// 급여명세서 생성 재시도 — 응답 데이터
interface PayrollStatementRetryData {
    statementId: number;
    payrollId: number;
    status: string;
    failureReason: string | null;
}

// 급여명세서 생성 재시도 — 응답
interface PayrollStatementRetryResponse {
    status: number;
    code: string;
    message: string;
    data: PayrollStatementRetryData;
}

// 급여명세서 개별 이메일 발송 — 응답 데이터
interface PayrollEmailDeliveryCreateData {
    deliveryId: number;
    payrollId: number;
    status: string;
    requestedAt: string;
    reused: boolean;
}

// 급여명세서 개별 이메일 발송 — 응답
interface PayrollEmailDeliveryCreateResponse {
    status: number;
    code: string;
    message: string;
    data: PayrollEmailDeliveryCreateData;
}

// 급여명세서 이메일 일괄 발송 — 요청
interface PayrollEmailBatchCreateRequest {
    year: number;
    month: number;
}

// 급여명세서 이메일 일괄 발송 — 응답 데이터
interface PayrollEmailBatchCreateData {
    batchId: number;
    payrollYearMonth: string;
    targetCount: number;
    status: string;
}

// 급여명세서 이메일 일괄 발송 — 응답
interface PayrollEmailBatchCreateResponse {
    status: number;
    code: string;
    message: string;
    data: PayrollEmailBatchCreateData;
}

// 일괄 발송 결과 조회 — 요청 Query
interface PayrollEmailBatchResultParams {
    page?: number;
    size?: number;
}

// 일괄 발송 결과 조회 — 발송 대상 1건
interface PayrollEmailDeliveryListItemData {
    deliveryId: number;
    payrollId: number;
    employeeId: number;
    employeeName: string;
    recipientEmail: string;
    status: string;
    failureCode: string | null;
    failureReason: string | null;
    requestedAt: string;
    sentAt: string | null;
    deliveredAt: string | null;
    failedAt: string | null;
}

// 일괄 발송 결과 조회 — 발송 대상 페이지
interface PayrollEmailDeliveryPageData {
    content: PayrollEmailDeliveryListItemData[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
}

// 일괄 발송 결과 조회 — 상태별 집계
interface PayrollEmailBatchResultSummaryData {
    totalCount: number;
    pendingCount: number;
    sendingCount: number;
    sentCount: number;
    retryWaitCount: number;
    unknownCount: number;
    deliveredCount: number;
    failedCount: number;
    skippedCount: number;
}

// 일괄 발송 결과 조회 — 응답 데이터
interface PayrollEmailBatchResultDetailData {
    batchId: number;
    payrollYearMonth: string;
    status: string;
    summary: PayrollEmailBatchResultSummaryData;
    deliveries: PayrollEmailDeliveryPageData;
}

// 일괄 발송 결과 조회 — 응답
interface PayrollEmailBatchResultResponse {
    status: number;
    code: string;
    message: string;
    data: PayrollEmailBatchResultDetailData;
}

// 급여 정책 조회 — 응답 데이터
interface PayrollPolicyGetData {
    id: number;
    payDayType: PayrollPayDayType;
    payDay: number | null;
    paymentMonthOffset: number;
}

// 급여 정책 조회 — 응답
interface PayrollPolicyResponse {
    status: number;
    code: string;
    message: string;
    data: PayrollPolicyGetData;
}

// 급여 정책 수정 — 요청
interface PayrollPolicyUpdateRequest {
    payDayType: PayrollPayDayType;
    payDay?: number | null;
    paymentMonthOffset?: number;
}

// 직원 급여 설정 조회 — 계약 이력 1건
interface PayrollCompensationRecordData {
    id: number;
    userId: number;
    employmentType: PayrollEmploymentType;
    salaryType: PayrollSalaryType;
    baseSalary: number | null;
    hourlyWage: number | null;
    weeklyContractHours: number;
    effectiveFrom: string;
    effectiveTo: string | null;
}

// 직원 급여 설정 조회 — 고정수당 이력 1건
interface PayrollFixedAllowanceRecordData {
    id: number;
    employeeId: number;
    type: PayrollFixedAllowanceType;
    name: string;
    amount: number;
    effectiveFrom: string;
    effectiveTo: string | null;
}

// 직원 급여 설정 조회 — 통상시급 이력 1건
interface PayrollPayBasisRecordData {
    id: number;
    employeeId: number;
    ordinaryHourlyWage: number;
    effectiveFrom: string;
    effectiveTo: string | null;
}

// 직원 급여 설정 조회 — 응답 데이터
interface PayrollCompensationGetData {
    employeeId: number;
    compensations: PayrollCompensationRecordData[];
    fixedAllowances: PayrollFixedAllowanceRecordData[];
    payBases: PayrollPayBasisRecordData[];
}

// 직원 급여 설정 조회 — 응답
interface PayrollCompensationResponse {
    status: number;
    code: string;
    message: string;
    data: PayrollCompensationGetData;
}

// 직원 급여 설정 저장 — 계약 항목
interface PayrollCompensationSaveRequestItem {
    compensationId?: number | null;
    employmentType: PayrollEmploymentType;
    salaryType: PayrollSalaryType;
    baseSalary?: number | null;
    hourlyWage?: number | null;
    weeklyContractHours: number;
    effectiveFrom: string;
    effectiveTo?: string | null;
}

// 직원 급여 설정 저장 — 고정수당 항목
interface PayrollFixedAllowanceSaveRequestItem {
    allowanceId?: number | null;
    allowanceType: PayrollFixedAllowanceType;
    allowanceName: string;
    amount: number;
    effectiveFrom: string;
    effectiveTo?: string | null;
}

// 직원 급여 설정 저장 — 통상시급 항목
interface PayrollPayBasisSaveRequestItem {
    payBasisId?: number | null;
    ordinaryHourlyWage: number;
    effectiveFrom: string;
    effectiveTo?: string | null;
}

// 직원 급여 설정 저장 — 요청
interface PayrollCompensationSaveRequest {
    compensation?: PayrollCompensationSaveRequestItem;
    fixedAllowances?: PayrollFixedAllowanceSaveRequestItem[];
    payBasis?: PayrollPayBasisSaveRequestItem;
}
