import { fetchWithAuth } from "@/lib/fetch";
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
} from "./payroll.service";

jest.mock("../lib/fetch");

const mockedFetch = fetchWithAuth as jest.Mock;

const okJsonResponse = (data: unknown) => ({
    ok: true,
    json: () => Promise.resolve({ data }),
});

const failJsonResponse = (message: string) => ({
    ok: false,
    headers: { get: () => "application/json" },
    json: () => Promise.resolve({ message }),
});

const aggregate: PayrollAggregateData = {
    payrollId: 10,
    employee: { employeeId: 1, name: "김강사", employmentType: "REGULAR" },
    yearMonth: "2026-08",
    scheduledPayDate: "2026-09-10",
    status: "CALCULATED",
    revisionNo: 0,
    originalPayrollId: null,
    snapshots: null,
    earnings: [],
    deductions: [],
    totalEarnings: 3000000,
    totalDeductions: 200000,
    netPay: 2800000,
    memo: null,
    statement: null,
    version: 1,
};

describe("getPayrolls", () => {
    afterEach(() => jest.clearAllMocks());

    it("필수 파라미터만 있으면 연/월 쿼리스트링으로 요청한다", async () => {
        const data = { content: [], summary: {} };
        mockedFetch.mockResolvedValue(okJsonResponse(data));

        const result = await getPayrolls({ year: 2026, month: 8 });

        expect(mockedFetch).toHaveBeenCalledWith("/api/payrolls?year=2026&month=8");
        expect(result).toEqual(data);
    });

    it("선택 파라미터가 있으면 모두 쿼리스트링에 포함해 요청한다", async () => {
        mockedFetch.mockResolvedValue(okJsonResponse({}));

        await getPayrolls({
            year: 2026,
            month: 8,
            employmentType: "REGULAR",
            status: "DRAFT",
            employeeName: "김",
            page: 1,
            size: 20,
        });

        expect(mockedFetch).toHaveBeenCalledWith(
            "/api/payrolls?year=2026&month=8&employmentType=REGULAR&status=DRAFT&employeeName=%EA%B9%80&page=1&size=20"
        );
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("급여 목록 조회에 실패하였습니다."));

        await expect(getPayrolls({ year: 2026, month: 8 })).rejects.toThrow("급여 목록 조회에 실패하였습니다.");
    });
});

describe("createPayrollDraft", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 생성된 급여 Aggregate를 반환한다", async () => {
        mockedFetch.mockResolvedValue(okJsonResponse(aggregate));

        const result = await createPayrollDraft(1, { year: 2026, month: 8 });

        expect(mockedFetch).toHaveBeenCalledWith("/api/payrolls/employees/1", {
            method: "POST",
            body: JSON.stringify({ year: 2026, month: 8 }),
        });
        expect(result).toEqual(aggregate);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("급여 초안 생성에 실패하였습니다."));

        await expect(createPayrollDraft(1, { year: 2026, month: 8 })).rejects.toThrow(
            "급여 초안 생성에 실패하였습니다."
        );
    });
});

describe("calculatePayroll", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 계산된 급여 Aggregate를 반환한다", async () => {
        mockedFetch.mockResolvedValue(okJsonResponse(aggregate));

        const result = await calculatePayroll(10, { expectedVersion: 1 });

        expect(mockedFetch).toHaveBeenCalledWith("/api/payrolls/10/calculate", {
            method: "PATCH",
            body: JSON.stringify({ expectedVersion: 1 }),
        });
        expect(result).toEqual(aggregate);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("급여 계산에 실패하였습니다."));

        await expect(calculatePayroll(10, { expectedVersion: 1 })).rejects.toThrow("급여 계산에 실패하였습니다.");
    });
});

describe("getPayroll", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 급여 상세 Aggregate를 반환한다", async () => {
        mockedFetch.mockResolvedValue(okJsonResponse(aggregate));

        const result = await getPayroll(10);

        expect(mockedFetch).toHaveBeenCalledWith("/api/payrolls/10");
        expect(result).toEqual(aggregate);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("급여 상세 조회에 실패하였습니다."));

        await expect(getPayroll(10)).rejects.toThrow("급여 상세 조회에 실패하였습니다.");
    });
});

describe("updatePayroll", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 수정된 급여 Aggregate를 반환한다", async () => {
        mockedFetch.mockResolvedValue(okJsonResponse(aggregate));

        const payload = { expectedVersion: 1, memo: "메모" };
        const result = await updatePayroll(10, payload);

        expect(mockedFetch).toHaveBeenCalledWith("/api/payrolls/10", {
            method: "PATCH",
            body: JSON.stringify(payload),
        });
        expect(result).toEqual(aggregate);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("급여 수정에 실패하였습니다."));

        await expect(updatePayroll(10, { expectedVersion: 1 })).rejects.toThrow("급여 수정에 실패하였습니다.");
    });
});

describe("createPayrollEarning", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 수정된 급여 Aggregate를 반환한다", async () => {
        mockedFetch.mockResolvedValue(okJsonResponse(aggregate));

        const payload = { expectedVersion: 1, name: "특별수당", amount: 50000 };
        const result = await createPayrollEarning(10, payload);

        expect(mockedFetch).toHaveBeenCalledWith("/api/payrolls/10/earnings", {
            method: "POST",
            body: JSON.stringify(payload),
        });
        expect(result).toEqual(aggregate);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("지급항목 추가에 실패하였습니다."));

        await expect(
            createPayrollEarning(10, { expectedVersion: 1, name: "특별수당", amount: 50000 })
        ).rejects.toThrow("지급항목 추가에 실패하였습니다.");
    });
});

describe("deletePayrollEarning", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 수정된 급여 Aggregate를 반환한다", async () => {
        mockedFetch.mockResolvedValue(okJsonResponse(aggregate));

        const result = await deletePayrollEarning(10, 2, 1);

        expect(mockedFetch).toHaveBeenCalledWith("/api/payrolls/10/earnings/2?expectedVersion=1", {
            method: "DELETE",
        });
        expect(result).toEqual(aggregate);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("지급항목 삭제에 실패하였습니다."));

        await expect(deletePayrollEarning(10, 2, 1)).rejects.toThrow("지급항목 삭제에 실패하였습니다.");
    });
});

describe("confirmPayroll", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 확정된 급여 Aggregate를 반환한다", async () => {
        mockedFetch.mockResolvedValue(okJsonResponse(aggregate));

        const result = await confirmPayroll(10, { expectedVersion: 1 });

        expect(mockedFetch).toHaveBeenCalledWith("/api/payrolls/10/confirm", {
            method: "PATCH",
            body: JSON.stringify({ expectedVersion: 1 }),
        });
        expect(result).toEqual(aggregate);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("급여 확정에 실패하였습니다."));

        await expect(confirmPayroll(10, { expectedVersion: 1 })).rejects.toThrow("급여 확정에 실패하였습니다.");
    });
});

describe("createPayrollRevision", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 정정본 급여 Aggregate를 반환한다", async () => {
        mockedFetch.mockResolvedValue(okJsonResponse(aggregate));

        const result = await createPayrollRevision(10, { expectedVersion: 1 });

        expect(mockedFetch).toHaveBeenCalledWith("/api/payrolls/10/revisions", {
            method: "POST",
            body: JSON.stringify({ expectedVersion: 1 }),
        });
        expect(result).toEqual(aggregate);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("급여 정정본 생성에 실패하였습니다."));

        await expect(createPayrollRevision(10, { expectedVersion: 1 })).rejects.toThrow(
            "급여 정정본 생성에 실패하였습니다."
        );
    });
});

describe("getPayrollRevisions", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 정정 이력 목록을 반환한다", async () => {
        mockedFetch.mockResolvedValue(okJsonResponse([aggregate]));

        const result = await getPayrollRevisions(10);

        expect(mockedFetch).toHaveBeenCalledWith("/api/payrolls/10/revisions");
        expect(result).toEqual([aggregate]);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("급여 정정 이력 조회에 실패하였습니다."));

        await expect(getPayrollRevisions(10)).rejects.toThrow("급여 정정 이력 조회에 실패하였습니다.");
    });
});

describe("getPayrollPreview", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 미리보기 Aggregate를 반환한다", async () => {
        mockedFetch.mockResolvedValue(okJsonResponse(aggregate));

        const result = await getPayrollPreview(10);

        expect(mockedFetch).toHaveBeenCalledWith("/api/payrolls/10/preview");
        expect(result).toEqual(aggregate);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("급여명세서 미리보기 조회에 실패하였습니다."));

        await expect(getPayrollPreview(10)).rejects.toThrow("급여명세서 미리보기 조회에 실패하였습니다.");
    });
});

describe("getPayrollStatementDownloadUrl", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 다운로드 URL 데이터를 반환한다", async () => {
        const data = { statementId: 1, payrollId: 10, fileName: "payslip.pdf", downloadUrl: "https://example.com", expiresInSeconds: 300 };
        mockedFetch.mockResolvedValue(okJsonResponse(data));

        const result = await getPayrollStatementDownloadUrl(10);

        expect(mockedFetch).toHaveBeenCalledWith("/api/payrolls/10/statement/download-url");
        expect(result).toEqual(data);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("급여명세서 다운로드 URL 발급에 실패하였습니다."));

        await expect(getPayrollStatementDownloadUrl(10)).rejects.toThrow(
            "급여명세서 다운로드 URL 발급에 실패하였습니다."
        );
    });
});

describe("retryPayrollStatement", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 재시도 결과 데이터를 반환한다", async () => {
        const data = { statementId: 1, payrollId: 10, status: "PENDING", failureReason: null };
        mockedFetch.mockResolvedValue(okJsonResponse(data));

        const result = await retryPayrollStatement(10);

        expect(mockedFetch).toHaveBeenCalledWith("/api/payrolls/10/statement/retry", { method: "PATCH" });
        expect(result).toEqual(data);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("급여명세서 생성 재시도에 실패하였습니다."));

        await expect(retryPayrollStatement(10)).rejects.toThrow("급여명세서 생성 재시도에 실패하였습니다.");
    });
});

describe("createPayrollEmailDelivery", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 발송 결과 데이터를 반환한다", async () => {
        const data = { deliveryId: 1, payrollId: 10, status: "SENDING", requestedAt: "2026-08-01", reused: false };
        mockedFetch.mockResolvedValue(okJsonResponse(data));

        const result = await createPayrollEmailDelivery(10);

        expect(mockedFetch).toHaveBeenCalledWith("/api/payrolls/10/statement/email-deliveries", { method: "POST" });
        expect(result).toEqual(data);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("급여명세서 이메일 발송에 실패하였습니다."));

        await expect(createPayrollEmailDelivery(10)).rejects.toThrow("급여명세서 이메일 발송에 실패하였습니다.");
    });
});

describe("createPayrollEmailBatch", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 배치 생성 데이터를 반환한다", async () => {
        const data = { batchId: 1, payrollYearMonth: "2026-08", targetCount: 10, status: "PENDING" };
        mockedFetch.mockResolvedValue(okJsonResponse(data));

        const payload = { year: 2026, month: 8 };
        const result = await createPayrollEmailBatch(payload);

        expect(mockedFetch).toHaveBeenCalledWith("/api/payrolls/statement/email-delivery-batches", {
            method: "POST",
            body: JSON.stringify(payload),
        });
        expect(result).toEqual(data);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("급여명세서 이메일 일괄 발송에 실패하였습니다."));

        await expect(createPayrollEmailBatch({ year: 2026, month: 8 })).rejects.toThrow(
            "급여명세서 이메일 일괄 발송에 실패하였습니다."
        );
    });
});

describe("getPayrollEmailBatchResult", () => {
    afterEach(() => jest.clearAllMocks());

    it("파라미터가 없으면 쿼리스트링 없이 요청한다", async () => {
        mockedFetch.mockResolvedValue(okJsonResponse({}));

        await getPayrollEmailBatchResult(1);

        expect(mockedFetch).toHaveBeenCalledWith("/api/payrolls/statement/email-delivery-batches/1");
    });

    it("파라미터가 있으면 쿼리스트링을 포함해 요청한다", async () => {
        mockedFetch.mockResolvedValue(okJsonResponse({}));

        await getPayrollEmailBatchResult(1, { page: 0, size: 20 });

        expect(mockedFetch).toHaveBeenCalledWith("/api/payrolls/statement/email-delivery-batches/1?page=0&size=20");
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("급여명세서 이메일 일괄 발송 결과 조회에 실패하였습니다."));

        await expect(getPayrollEmailBatchResult(1)).rejects.toThrow(
            "급여명세서 이메일 일괄 발송 결과 조회에 실패하였습니다."
        );
    });
});

describe("getPayrollPolicy", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 정책 데이터를 반환한다", async () => {
        const data = { id: 1, payDayType: "FIXED_DAY", payDay: 10, paymentMonthOffset: 0 };
        mockedFetch.mockResolvedValue(okJsonResponse(data));

        const result = await getPayrollPolicy();

        expect(mockedFetch).toHaveBeenCalledWith("/api/payroll/policies");
        expect(result).toEqual(data);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("급여 정책 조회에 실패하였습니다."));

        await expect(getPayrollPolicy()).rejects.toThrow("급여 정책 조회에 실패하였습니다.");
    });
});

describe("updatePayrollPolicy", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 수정된 정책 데이터를 반환한다", async () => {
        const data = { id: 1, payDayType: "MONTH_END", payDay: null, paymentMonthOffset: 1 };
        mockedFetch.mockResolvedValue(okJsonResponse(data));

        const payload = { payDayType: "MONTH_END" as const, payDay: null, paymentMonthOffset: 1 };
        const result = await updatePayrollPolicy(payload);

        expect(mockedFetch).toHaveBeenCalledWith("/api/payroll/policies", {
            method: "PATCH",
            body: JSON.stringify(payload),
        });
        expect(result).toEqual(data);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("급여 정책 수정에 실패하였습니다."));

        await expect(updatePayrollPolicy({ payDayType: "MONTH_END" })).rejects.toThrow(
            "급여 정책 수정에 실패하였습니다."
        );
    });
});

describe("getPayrollCompensation", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 직원 급여 설정 데이터를 반환한다", async () => {
        const data = { employeeId: 1, compensations: [], fixedAllowances: [], payBases: [] };
        mockedFetch.mockResolvedValue(okJsonResponse(data));

        const result = await getPayrollCompensation(1);

        expect(mockedFetch).toHaveBeenCalledWith("/api/payroll/employees/1/compensation");
        expect(result).toEqual(data);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("직원 급여 설정 조회에 실패하였습니다."));

        await expect(getPayrollCompensation(1)).rejects.toThrow("직원 급여 설정 조회에 실패하였습니다.");
    });
});

describe("savePayrollCompensation", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 저장된 직원 급여 설정 데이터를 반환한다", async () => {
        const data = { employeeId: 1, compensations: [], fixedAllowances: [], payBases: [] };
        mockedFetch.mockResolvedValue(okJsonResponse(data));

        const payload = { fixedAllowances: [] };
        const result = await savePayrollCompensation(1, payload);

        expect(mockedFetch).toHaveBeenCalledWith("/api/payroll/employees/1/compensation", {
            method: "PATCH",
            body: JSON.stringify(payload),
        });
        expect(result).toEqual(data);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("직원 급여 설정 저장에 실패하였습니다."));

        await expect(savePayrollCompensation(1, {})).rejects.toThrow("직원 급여 설정 저장에 실패하였습니다.");
    });
});
