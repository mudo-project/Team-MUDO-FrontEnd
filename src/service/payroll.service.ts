import { fetchWithAuth } from "@/lib/fetch";
import { getErrorMessage } from "@/lib/stateError";

// 월 급여 목록 조회 API
export const getPayrolls = async (params: PayrollListParams): Promise<PayrollListData> => {
    const query = new URLSearchParams();
    query.set("year", String(params.year));
    query.set("month", String(params.month));
    if (params.employmentType) query.set("employmentType", params.employmentType);
    if (params.status) query.set("status", params.status);
    if (params.employeeName) query.set("employeeName", params.employeeName);
    if (params.page !== undefined) query.set("page", String(params.page));
    if (params.size !== undefined) query.set("size", String(params.size));

    const response = await fetchWithAuth(`/api/payrolls?${query.toString()}`);

    if (!response.ok) {
        const message = await getErrorMessage(response, "급여 목록 조회에 실패하였습니다.");

        throw new Error(message);
    }

    const resData = (await response.json()) as PayrollListResponse;

    return resData.data;
};

// 월 급여 초안 생성 API
export const createPayrollDraft = async (
    employeeId: number,
    payload: PayrollDraftCreateRequest
): Promise<PayrollAggregateData> => {
    const response = await fetchWithAuth(`/api/payrolls/employees/${employeeId}`, {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(response, "급여 초안 생성에 실패하였습니다.");

        throw new Error(message);
    }

    const resData = (await response.json()) as PayrollAggregateResponse;

    return resData.data;
};

// 급여 계산 및 재계산 API
export const calculatePayroll = async (
    payrollId: number,
    payload: PayrollCalculateRequest
): Promise<PayrollAggregateData> => {
    const response = await fetchWithAuth(`/api/payrolls/${payrollId}/calculate`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(response, "급여 계산에 실패하였습니다.");

        throw new Error(message);
    }

    const resData = (await response.json()) as PayrollAggregateResponse;

    return resData.data;
};

// 급여 상세 조회 API
export const getPayroll = async (payrollId: number): Promise<PayrollAggregateData> => {
    const response = await fetchWithAuth(`/api/payrolls/${payrollId}`);

    if (!response.ok) {
        const message = await getErrorMessage(response, "급여 상세 조회에 실패하였습니다.");

        throw new Error(message);
    }

    const resData = (await response.json()) as PayrollAggregateResponse;

    return resData.data;
};

// 급여 지급항목 및 메모 수정 API
export const updatePayroll = async (
    payrollId: number,
    payload: PayrollUpdateRequest
): Promise<PayrollAggregateData> => {
    const response = await fetchWithAuth(`/api/payrolls/${payrollId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(response, "급여 수정에 실패하였습니다.");

        throw new Error(message);
    }

    const resData = (await response.json()) as PayrollAggregateResponse;

    return resData.data;
};

// 수기 지급항목 추가 API
export const createPayrollEarning = async (
    payrollId: number,
    payload: PayrollEarningCreateRequest
): Promise<PayrollAggregateData> => {
    const response = await fetchWithAuth(`/api/payrolls/${payrollId}/earnings`, {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(response, "지급항목 추가에 실패하였습니다.");

        throw new Error(message);
    }

    const resData = (await response.json()) as PayrollAggregateResponse;

    return resData.data;
};

// 수기 지급항목 삭제 API
export const deletePayrollEarning = async (
    payrollId: number,
    itemId: number,
    expectedVersion: number
): Promise<PayrollAggregateData> => {
    const response = await fetchWithAuth(
        `/api/payrolls/${payrollId}/earnings/${itemId}?expectedVersion=${expectedVersion}`,
        { method: "DELETE" }
    );

    if (!response.ok) {
        const message = await getErrorMessage(response, "지급항목 삭제에 실패하였습니다.");

        throw new Error(message);
    }

    const resData = (await response.json()) as PayrollAggregateResponse;

    return resData.data;
};

// 급여 확정 및 명세서 생성 API
export const confirmPayroll = async (
    payrollId: number,
    payload: PayrollConfirmRequest
): Promise<PayrollAggregateData> => {
    const response = await fetchWithAuth(`/api/payrolls/${payrollId}/confirm`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(response, "급여 확정에 실패하였습니다.");

        throw new Error(message);
    }

    const resData = (await response.json()) as PayrollAggregateResponse;

    return resData.data;
};

// 급여 정정본 생성 API
export const createPayrollRevision = async (
    payrollId: number,
    payload: PayrollRevisionCreateRequest
): Promise<PayrollAggregateData> => {
    const response = await fetchWithAuth(`/api/payrolls/${payrollId}/revisions`, {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(response, "급여 정정본 생성에 실패하였습니다.");

        throw new Error(message);
    }

    const resData = (await response.json()) as PayrollAggregateResponse;

    return resData.data;
};

// 급여 정정 이력 조회 API
export const getPayrollRevisions = async (payrollId: number): Promise<PayrollAggregateData[]> => {
    const response = await fetchWithAuth(`/api/payrolls/${payrollId}/revisions`);

    if (!response.ok) {
        const message = await getErrorMessage(response, "급여 정정 이력 조회에 실패하였습니다.");

        throw new Error(message);
    }

    const resData = (await response.json()) as PayrollRevisionListResponse;

    return resData.data;
};

// 급여명세서 미리보기 API
export const getPayrollPreview = async (payrollId: number): Promise<PayrollAggregateData> => {
    const response = await fetchWithAuth(`/api/payrolls/${payrollId}/preview`);

    if (!response.ok) {
        const message = await getErrorMessage(response, "급여명세서 미리보기 조회에 실패하였습니다.");

        throw new Error(message);
    }

    const resData = (await response.json()) as PayrollAggregateResponse;

    return resData.data;
};

// 급여명세서 다운로드 URL 발급 API
export const getPayrollStatementDownloadUrl = async (payrollId: number): Promise<PayrollStatementDownloadUrlData> => {
    const response = await fetchWithAuth(`/api/payrolls/${payrollId}/statement/download-url`);

    if (!response.ok) {
        const message = await getErrorMessage(response, "급여명세서 다운로드 URL 발급에 실패하였습니다.");

        throw new Error(message);
    }

    const resData = (await response.json()) as PayrollStatementDownloadUrlResponse;

    return resData.data;
};

// 급여명세서 생성 재시도 API
export const retryPayrollStatement = async (payrollId: number): Promise<PayrollStatementRetryData> => {
    const response = await fetchWithAuth(`/api/payrolls/${payrollId}/statement/retry`, {
        method: "PATCH",
    });

    if (!response.ok) {
        const message = await getErrorMessage(response, "급여명세서 생성 재시도에 실패하였습니다.");

        throw new Error(message);
    }

    const resData = (await response.json()) as PayrollStatementRetryResponse;

    return resData.data;
};

// 급여명세서 개별 이메일 발송 API
export const createPayrollEmailDelivery = async (payrollId: number): Promise<PayrollEmailDeliveryCreateData> => {
    const response = await fetchWithAuth(`/api/payrolls/${payrollId}/statement/email-deliveries`, {
        method: "POST",
    });

    if (!response.ok) {
        const message = await getErrorMessage(response, "급여명세서 이메일 발송에 실패하였습니다.");

        throw new Error(message);
    }

    const resData = (await response.json()) as PayrollEmailDeliveryCreateResponse;

    return resData.data;
};

// 급여명세서 이메일 일괄 발송 API
export const createPayrollEmailBatch = async (
    payload: PayrollEmailBatchCreateRequest
): Promise<PayrollEmailBatchCreateData> => {
    const response = await fetchWithAuth("/api/payrolls/statement/email-delivery-batches", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(response, "급여명세서 이메일 일괄 발송에 실패하였습니다.");

        throw new Error(message);
    }

    const resData = (await response.json()) as PayrollEmailBatchCreateResponse;

    return resData.data;
};

// 급여명세서 이메일 일괄 발송 결과 조회 API
export const getPayrollEmailBatchResult = async (
    batchId: number,
    params?: PayrollEmailBatchResultParams
): Promise<PayrollEmailBatchResultDetailData> => {
    const query = new URLSearchParams();
    if (params?.page !== undefined) query.set("page", String(params.page));
    if (params?.size !== undefined) query.set("size", String(params.size));
    const queryString = query.toString();

    const response = await fetchWithAuth(
        `/api/payrolls/statement/email-delivery-batches/${batchId}${queryString ? `?${queryString}` : ""}`
    );

    if (!response.ok) {
        const message = await getErrorMessage(response, "급여명세서 이메일 일괄 발송 결과 조회에 실패하였습니다.");

        throw new Error(message);
    }

    const resData = (await response.json()) as PayrollEmailBatchResultResponse;

    return resData.data;
};

// 급여 정책 조회 API
export const getPayrollPolicy = async (): Promise<PayrollPolicyGetData> => {
    const response = await fetchWithAuth("/api/payroll/policies");

    if (!response.ok) {
        const message = await getErrorMessage(response, "급여 정책 조회에 실패하였습니다.");

        throw new Error(message);
    }

    const resData = (await response.json()) as PayrollPolicyResponse;

    return resData.data;
};

// 급여 정책 수정 API
export const updatePayrollPolicy = async (payload: PayrollPolicyUpdateRequest): Promise<PayrollPolicyGetData> => {
    const response = await fetchWithAuth("/api/payroll/policies", {
        method: "PATCH",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(response, "급여 정책 수정에 실패하였습니다.");

        throw new Error(message);
    }

    const resData = (await response.json()) as PayrollPolicyResponse;

    return resData.data;
};

// 직원 급여 설정 조회 API
export const getPayrollCompensation = async (employeeId: number): Promise<PayrollCompensationGetData> => {
    const response = await fetchWithAuth(`/api/payroll/employees/${employeeId}/compensation`);

    if (!response.ok) {
        const message = await getErrorMessage(response, "직원 급여 설정 조회에 실패하였습니다.");

        throw new Error(message);
    }

    const resData = (await response.json()) as PayrollCompensationResponse;

    return resData.data;
};

// 직원 급여 설정 저장 API
export const savePayrollCompensation = async (
    employeeId: number,
    payload: PayrollCompensationSaveRequest
): Promise<PayrollCompensationGetData> => {
    const response = await fetchWithAuth(`/api/payroll/employees/${employeeId}/compensation`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(response, "직원 급여 설정 저장에 실패하였습니다.");

        throw new Error(message);
    }

    const resData = (await response.json()) as PayrollCompensationResponse;

    return resData.data;
};

