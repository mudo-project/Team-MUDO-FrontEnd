'use server'

import {
    calculatePayroll,
    confirmPayroll,
    createPayrollDraft,
    createPayrollEarning,
    createPayrollEmailBatch,
    createPayrollEmailDelivery,
    createPayrollRevision,
    deletePayrollEarning,
    getPayroll,
    getPayrollCompensation,
    getPayrollEmailBatchResult,
    getPayrollPolicy,
    getPayrollPreview,
    getPayrollRevisions,
    getPayrolls,
    getPayrollStatementDownloadUrl,
    retryPayrollStatement,
    savePayrollCompensation,
    updatePayroll,
    updatePayrollPolicy,
} from "@/service/payroll.service";

interface PayrollActionState {
    success: boolean;
    message: string;
}

function toErrorMessage(error: unknown, fallbackMessage: string): string {
    return error instanceof Error ? error.message : fallbackMessage;
}

// 월 급여 목록 조회 액션
export const getPayrollsAction = async (params: PayrollListParams): Promise<PayrollListData> => {
    return getPayrolls(params);
};

// 월 급여 초안 생성 액션
export const createPayrollDraftAction = async (
    employeeId: number,
    year: number,
    month: number
): Promise<PayrollActionState & { data?: PayrollAggregateData }> => {
    if (year < 2000) {
        return { success: false, message: "귀속 연도가 올바르지 않습니다." };
    }

    if (month < 1 || month > 12) {
        return { success: false, message: "귀속 월은 1~12월 사이여야 합니다." };
    }

    try {
        const data = await createPayrollDraft(employeeId, { year, month });

        return { success: true, message: "급여 초안을 생성했습니다.", data };
    } catch (error) {
        return { success: false, message: toErrorMessage(error, "급여 초안 생성에 실패하였습니다.") };
    }
};

// 급여 계산 및 재계산 액션
export const calculatePayrollAction = async (
    payrollId: number,
    expectedVersion: number
): Promise<PayrollActionState & { data?: PayrollAggregateData }> => {
    try {
        const data = await calculatePayroll(payrollId, { expectedVersion });

        return { success: true, message: "급여를 계산했습니다.", data };
    } catch (error) {
        return { success: false, message: toErrorMessage(error, "급여 계산에 실패하였습니다.") };
    }
};

// 급여 상세 조회 액션
export const getPayrollAction = async (payrollId: number): Promise<PayrollAggregateData> => {
    return getPayroll(payrollId);
};

// 급여 지급항목 및 메모 수정 액션
export const updatePayrollAction = async (
    payrollId: number,
    expectedVersion: number,
    memo?: string,
    adjustments?: PayrollAdjustmentRequestItem[]
): Promise<PayrollActionState & { data?: PayrollAggregateData }> => {
    if (adjustments?.some((adjustment) => !Number.isFinite(adjustment.amount))) {
        return { success: false, message: "조정할 금액을 올바르게 입력해주세요." };
    }

    try {
        const data = await updatePayroll(payrollId, { expectedVersion, memo, adjustments });

        return { success: true, message: "급여를 수정했습니다.", data };
    } catch (error) {
        return { success: false, message: toErrorMessage(error, "급여 수정에 실패하였습니다.") };
    }
};

// 수기 지급항목 추가 액션
export const createPayrollEarningAction = async (
    payrollId: number,
    expectedVersion: number,
    name: string,
    amount: number
): Promise<PayrollActionState & { data?: PayrollAggregateData }> => {
    if (!name.trim()) {
        return { success: false, message: "지급항목 이름을 입력해주세요." };
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        return { success: false, message: "지급항목 금액을 올바르게 입력해주세요." };
    }

    try {
        const data = await createPayrollEarning(payrollId, { expectedVersion, name: name.trim(), amount });

        return { success: true, message: "지급항목을 추가했습니다.", data };
    } catch (error) {
        return { success: false, message: toErrorMessage(error, "지급항목 추가에 실패하였습니다.") };
    }
};

// 수기 지급항목 삭제 액션
export const deletePayrollEarningAction = async (
    payrollId: number,
    itemId: number,
    expectedVersion: number
): Promise<PayrollActionState & { data?: PayrollAggregateData }> => {
    try {
        const data = await deletePayrollEarning(payrollId, itemId, expectedVersion);

        return { success: true, message: "지급항목을 삭제했습니다.", data };
    } catch (error) {
        return { success: false, message: toErrorMessage(error, "지급항목 삭제에 실패하였습니다.") };
    }
};

// 급여 확정 및 명세서 생성 액션
export const confirmPayrollAction = async (
    payrollId: number,
    expectedVersion: number
): Promise<PayrollActionState & { data?: PayrollAggregateData }> => {
    try {
        const data = await confirmPayroll(payrollId, { expectedVersion });

        return { success: true, message: "급여를 확정했습니다.", data };
    } catch (error) {
        return { success: false, message: toErrorMessage(error, "급여 확정에 실패하였습니다.") };
    }
};

// 급여 정정본 생성 액션
export const createPayrollRevisionAction = async (
    payrollId: number,
    expectedVersion: number
): Promise<PayrollActionState & { data?: PayrollAggregateData }> => {
    try {
        const data = await createPayrollRevision(payrollId, { expectedVersion });

        return { success: true, message: "급여 정정본을 생성했습니다.", data };
    } catch (error) {
        return { success: false, message: toErrorMessage(error, "급여 정정본 생성에 실패하였습니다.") };
    }
};

// 급여 정정 이력 조회 액션
export const getPayrollRevisionsAction = async (payrollId: number): Promise<PayrollAggregateData[]> => {
    return getPayrollRevisions(payrollId);
};

// 급여명세서 미리보기 액션
export const getPayrollPreviewAction = async (payrollId: number): Promise<PayrollAggregateData> => {
    return getPayrollPreview(payrollId);
};

// 급여명세서 다운로드 URL 발급 액션
export const getPayrollStatementDownloadUrlAction = async (
    payrollId: number
): Promise<PayrollActionState & { data?: PayrollStatementDownloadUrlData }> => {
    try {
        const data = await getPayrollStatementDownloadUrl(payrollId);

        return { success: true, message: "급여명세서 다운로드 URL을 발급했습니다.", data };
    } catch (error) {
        return { success: false, message: toErrorMessage(error, "급여명세서 다운로드 URL 발급에 실패하였습니다.") };
    }
};

// 급여명세서 생성 재시도 액션
export const retryPayrollStatementAction = async (
    payrollId: number
): Promise<PayrollActionState & { data?: PayrollStatementRetryData }> => {
    try {
        const data = await retryPayrollStatement(payrollId);

        return { success: true, message: "급여명세서 생성을 재시도합니다.", data };
    } catch (error) {
        return { success: false, message: toErrorMessage(error, "급여명세서 생성 재시도에 실패하였습니다.") };
    }
};

// 급여명세서 개별 이메일 발송 액션
export const createPayrollEmailDeliveryAction = async (
    payrollId: number
): Promise<PayrollActionState & { data?: PayrollEmailDeliveryCreateData }> => {
    try {
        const data = await createPayrollEmailDelivery(payrollId);

        return { success: true, message: "급여명세서 이메일 발송을 시작했습니다.", data };
    } catch (error) {
        return { success: false, message: toErrorMessage(error, "급여명세서 이메일 발송에 실패하였습니다.") };
    }
};

// 급여명세서 이메일 일괄 발송 액션
export const createPayrollEmailBatchAction = async (
    year: number,
    month: number
): Promise<PayrollActionState & { data?: PayrollEmailBatchCreateData }> => {
    if (year < 2000) {
        return { success: false, message: "귀속 연도가 올바르지 않습니다." };
    }

    if (month < 1 || month > 12) {
        return { success: false, message: "귀속 월은 1~12월 사이여야 합니다." };
    }

    try {
        const data = await createPayrollEmailBatch({ year, month });

        return { success: true, message: "급여명세서 이메일 일괄 발송을 시작했습니다.", data };
    } catch (error) {
        return { success: false, message: toErrorMessage(error, "급여명세서 이메일 일괄 발송에 실패하였습니다.") };
    }
};

// 급여명세서 이메일 일괄 발송 결과 조회 액션
export const getPayrollEmailBatchResultAction = async (
    batchId: number,
    params?: PayrollEmailBatchResultParams
): Promise<PayrollEmailBatchResultDetailData> => {
    return getPayrollEmailBatchResult(batchId, params);
};

// 급여 정책 조회 액션
export const getPayrollPolicyAction = async (): Promise<PayrollPolicyGetData> => {
    return getPayrollPolicy();
};

// 급여 정책 수정 액션
export const updatePayrollPolicyAction = async (
    payload: PayrollPolicyUpdateRequest
): Promise<PayrollActionState & { data?: PayrollPolicyGetData }> => {
    if (payload.payDayType === "FIXED_DAY" && (!payload.payDay || payload.payDay < 1 || payload.payDay > 31)) {
        return { success: false, message: "지급일은 1~31 사이여야 합니다." };
    }

    if (payload.payDayType === "MONTH_END" && payload.payDay) {
        return { success: false, message: "매월 말일 지급은 지급일을 입력할 수 없습니다." };
    }

    if (payload.paymentMonthOffset !== undefined && (payload.paymentMonthOffset < 0 || payload.paymentMonthOffset > 12)) {
        return { success: false, message: "지급월 오프셋은 0~12 사이여야 합니다." };
    }

    try {
        const data = await updatePayrollPolicy(payload);

        return { success: true, message: "급여 정책을 수정했습니다.", data };
    } catch (error) {
        return { success: false, message: toErrorMessage(error, "급여 정책 수정에 실패하였습니다.") };
    }
};

// 직원 급여 설정 조회 액션
export const getPayrollCompensationAction = async (employeeId: number): Promise<PayrollCompensationGetData> => {
    return getPayrollCompensation(employeeId);
};

// 직원 급여 설정 저장 액션
export const savePayrollCompensationAction = async (
    employeeId: number,
    payload: PayrollCompensationSaveRequest
): Promise<PayrollActionState & { data?: PayrollCompensationGetData }> => {
    const compensation = payload.compensation;

    if (compensation) {
        if (compensation.weeklyContractHours < 0 || compensation.weeklyContractHours > 168) {
            return { success: false, message: "주 계약시간은 0~168시간 사이여야 합니다." };
        }

        if (compensation.salaryType === "MONTHLY" && !compensation.baseSalary) {
            return { success: false, message: "월급제는 기본급을 입력해주세요." };
        }

        if (compensation.salaryType === "HOURLY" && !compensation.hourlyWage) {
            return { success: false, message: "시급제는 시급을 입력해주세요." };
        }
    }

    try {
        const data = await savePayrollCompensation(employeeId, payload);

        return { success: true, message: "직원 급여 설정을 저장했습니다.", data };
    } catch (error) {
        return { success: false, message: toErrorMessage(error, "직원 급여 설정 저장에 실패하였습니다.") };
    }
};
