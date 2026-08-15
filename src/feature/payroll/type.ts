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

// 급여 상세의 근태 Snapshot
interface PayrollDetailAttendance {
    workDays: number;
    workHours: number;
    overtimeHours: number;
    nightHours: number;
    holidayHours: number;
    paidLeaveHours: number;
}

// 급여 상세의 계약 Snapshot
interface PayrollDetailContract {
    employmentTypeLabel: string;
    salaryTypeLabel: string;
    baseSalary: number;
    ordinaryHourlyWage: number;
    weeklyContractHours: number;
}

// 급여 상세 지급/공제 항목
interface PayrollDetailLineItem {
    name: string;
    amount: number;
    editable: boolean;
    originalAmount?: number | null;
    adjusted?: boolean;
    adjustmentReason?: string | null;
    calculationFormula?: string | null;
    calculationBasis?: string | null;
}

// 급여명세서 생성 상태
interface PayrollDetailStatement {
    status: "PENDING" | "READY" | "FAILED";
    generatedAt: string | null;
    fileSizeLabel: string | null;
    failureReason?: string | null;
}

// 급여 상세
interface PayrollDetailData {
    payrollId: number;
    employeeName: string;
    employmentType: PayrollEmploymentType;
    preparationStatus: PayrollPreparationStatus;
    yearMonth: string;
    scheduledPayDate: string;
    revisionNo: number;
    memo: string | null;
    attendance: PayrollDetailAttendance;
    contract: PayrollDetailContract;
    earnings: PayrollDetailLineItem[];
    deductions: PayrollDetailLineItem[];
    totalEarnings: number;
    totalDeductions: number;
    netPay: number;
    statement: PayrollDetailStatement | null;
}

// 급여 정정 이력 1건
interface PayrollRevisionSummary {
    payrollId: number;
    revisionNo: number;
    isLatest: boolean;
    preparationStatus: PayrollPreparationStatus;
    totalEarnings: number | null;
    totalDeductions: number | null;
    netPay: number | null;
    confirmedAt: string | null;
}

// 이메일 발송 상태(개별)
type PayrollEmailDeliveryStatus = "PENDING" | "SENDING" | "RETRY_WAIT" | "SENT" | "DELIVERED" | "FAILED" | "SKIPPED" | "UNKNOWN";

// 일괄 발송 배치 상태
type PayrollEmailBatchStatus = "PENDING" | "PROCESSING" | "AWAITING_DELIVERY" | "COMPLETED";

// 일괄 발송 대상 1건
interface PayrollEmailDeliveryData {
    deliveryId: number;
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

// 급여 정책
interface PayrollPolicyData {
    payDayType: PayrollPayDayType;
    payDay: number | null;
    paymentMonthOffset: number;
}

// 급여형태
type PayrollSalaryType = "MONTHLY" | "HOURLY";

// 직원 계약 이력 1건
interface PayrollCompensationRecord {
    id: number;
    employmentType: PayrollEmploymentType;
    salaryType: PayrollSalaryType;
    baseSalary: number | null;
    hourlyWage: number | null;
    weeklyContractHours: number;
    effectiveFrom: string;
    effectiveTo: string | null;
}

// 고정수당 유형
type PayrollFixedAllowanceType = "MEAL" | "POSITION" | "DUTY" | "TRANSPORTATION" | "OTHER";

// 고정수당 이력 1건
interface PayrollFixedAllowanceRecord {
    id: number;
    allowanceType: PayrollFixedAllowanceType;
    name: string;
    amount: number;
    effectiveFrom: string;
    effectiveTo: string | null;
}

// 통상시급 이력 1건
interface PayrollPayBasisRecord {
    id: number;
    ordinaryHourlyWage: number;
    effectiveFrom: string;
    effectiveTo: string | null;
}

// 직원 급여 설정
interface PayrollEmployeeCompensationData {
    employeeId: number;
    employeeName: string;
    compensations: PayrollCompensationRecord[];
    fixedAllowances: PayrollFixedAllowanceRecord[];
    payBases: PayrollPayBasisRecord[];
}
