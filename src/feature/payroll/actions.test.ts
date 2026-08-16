import {
    calculatePayroll,
    confirmPayroll,
    createPayrollDraft,
    createPayrollEarning,
    createPayrollEmailBatch,
    createPayrollEmailDelivery,
    createPayrollRevision,
    deletePayrollEarning,
    getPayrollStatementDownloadUrl,
    retryPayrollStatement,
    savePayrollCompensation,
    updatePayroll,
    updatePayrollPolicy,
} from "@/service/payroll.service";
import {
    calculatePayrollAction,
    confirmPayrollAction,
    createPayrollDraftAction,
    createPayrollEarningAction,
    createPayrollEmailBatchAction,
    createPayrollEmailDeliveryAction,
    createPayrollRevisionAction,
    deletePayrollEarningAction,
    getPayrollStatementDownloadUrlAction,
    retryPayrollStatementAction,
    savePayrollCompensationAction,
    updatePayrollAction,
    updatePayrollPolicyAction,
} from "./actions";

jest.mock("../../service/payroll.service");

const aggregate = { payrollId: 10, version: 2 } as PayrollAggregateData;

describe("createPayrollDraftAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("귀속 연도가 2000년 미만이면 실패 결과를 반환한다", async () => {
        const result = await createPayrollDraftAction(1, 1999, 8);

        expect(result).toEqual({ success: false, message: "귀속 연도가 올바르지 않습니다." });
        expect(createPayrollDraft).not.toHaveBeenCalled();
    });

    it("귀속 월이 1~12월을 벗어나면 실패 결과를 반환한다", async () => {
        const result = await createPayrollDraftAction(1, 2026, 13);

        expect(result).toEqual({ success: false, message: "귀속 월은 1~12월 사이여야 합니다." });
        expect(createPayrollDraft).not.toHaveBeenCalled();
    });

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        (createPayrollDraft as jest.Mock).mockResolvedValue(aggregate);

        const result = await createPayrollDraftAction(1, 2026, 8);

        expect(createPayrollDraft).toHaveBeenCalledWith(1, { year: 2026, month: 8 });
        expect(result).toEqual({ success: true, message: "급여 초안을 생성했습니다.", data: aggregate });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        (createPayrollDraft as jest.Mock).mockRejectedValue(new Error("급여 초안 생성에 실패하였습니다."));

        const result = await createPayrollDraftAction(1, 2026, 8);

        expect(result).toEqual({ success: false, message: "급여 초안 생성에 실패하였습니다." });
    });
});

describe("calculatePayrollAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        (calculatePayroll as jest.Mock).mockResolvedValue(aggregate);

        const result = await calculatePayrollAction(10, 1);

        expect(calculatePayroll).toHaveBeenCalledWith(10, { expectedVersion: 1 });
        expect(result).toEqual({ success: true, message: "급여를 계산했습니다.", data: aggregate });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        (calculatePayroll as jest.Mock).mockRejectedValue(new Error("급여 계산에 실패하였습니다."));

        const result = await calculatePayrollAction(10, 1);

        expect(result).toEqual({ success: false, message: "급여 계산에 실패하였습니다." });
    });
});

describe("updatePayrollAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("조정 금액이 숫자가 아니면 실패 결과를 반환한다", async () => {
        const result = await updatePayrollAction(10, 1, "메모", [{ itemId: 1, amount: NaN }]);

        expect(result).toEqual({ success: false, message: "조정할 금액을 올바르게 입력해주세요." });
        expect(updatePayroll).not.toHaveBeenCalled();
    });

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        (updatePayroll as jest.Mock).mockResolvedValue(aggregate);

        const result = await updatePayrollAction(10, 1, "메모");

        expect(updatePayroll).toHaveBeenCalledWith(10, { expectedVersion: 1, memo: "메모", adjustments: undefined });
        expect(result).toEqual({ success: true, message: "급여를 수정했습니다.", data: aggregate });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        (updatePayroll as jest.Mock).mockRejectedValue(new Error("급여 수정에 실패하였습니다."));

        const result = await updatePayrollAction(10, 1, "메모");

        expect(result).toEqual({ success: false, message: "급여 수정에 실패하였습니다." });
    });
});

describe("createPayrollEarningAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("항목 이름이 비어있으면 실패 결과를 반환한다", async () => {
        const result = await createPayrollEarningAction(10, 1, "  ", 10000);

        expect(result).toEqual({ success: false, message: "지급항목 이름을 입력해주세요." });
        expect(createPayrollEarning).not.toHaveBeenCalled();
    });

    it("금액이 0 이하이면 실패 결과를 반환한다", async () => {
        const result = await createPayrollEarningAction(10, 1, "특별수당", 0);

        expect(result).toEqual({ success: false, message: "지급항목 금액을 올바르게 입력해주세요." });
        expect(createPayrollEarning).not.toHaveBeenCalled();
    });

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        (createPayrollEarning as jest.Mock).mockResolvedValue(aggregate);

        const result = await createPayrollEarningAction(10, 1, " 특별수당 ", 50000);

        expect(createPayrollEarning).toHaveBeenCalledWith(10, { expectedVersion: 1, name: "특별수당", amount: 50000 });
        expect(result).toEqual({ success: true, message: "지급항목을 추가했습니다.", data: aggregate });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        (createPayrollEarning as jest.Mock).mockRejectedValue(new Error("지급항목 추가에 실패하였습니다."));

        const result = await createPayrollEarningAction(10, 1, "특별수당", 50000);

        expect(result).toEqual({ success: false, message: "지급항목 추가에 실패하였습니다." });
    });
});

describe("deletePayrollEarningAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        (deletePayrollEarning as jest.Mock).mockResolvedValue(aggregate);

        const result = await deletePayrollEarningAction(10, 2, 1);

        expect(deletePayrollEarning).toHaveBeenCalledWith(10, 2, 1);
        expect(result).toEqual({ success: true, message: "지급항목을 삭제했습니다.", data: aggregate });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        (deletePayrollEarning as jest.Mock).mockRejectedValue(new Error("지급항목 삭제에 실패하였습니다."));

        const result = await deletePayrollEarningAction(10, 2, 1);

        expect(result).toEqual({ success: false, message: "지급항목 삭제에 실패하였습니다." });
    });
});

describe("confirmPayrollAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        (confirmPayroll as jest.Mock).mockResolvedValue(aggregate);

        const result = await confirmPayrollAction(10, 1);

        expect(confirmPayroll).toHaveBeenCalledWith(10, { expectedVersion: 1 });
        expect(result).toEqual({ success: true, message: "급여를 확정했습니다.", data: aggregate });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        (confirmPayroll as jest.Mock).mockRejectedValue(new Error("급여 확정에 실패하였습니다."));

        const result = await confirmPayrollAction(10, 1);

        expect(result).toEqual({ success: false, message: "급여 확정에 실패하였습니다." });
    });
});

describe("createPayrollRevisionAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        (createPayrollRevision as jest.Mock).mockResolvedValue(aggregate);

        const result = await createPayrollRevisionAction(10, 1);

        expect(createPayrollRevision).toHaveBeenCalledWith(10, { expectedVersion: 1 });
        expect(result).toEqual({ success: true, message: "급여 정정본을 생성했습니다.", data: aggregate });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        (createPayrollRevision as jest.Mock).mockRejectedValue(new Error("급여 정정본 생성에 실패하였습니다."));

        const result = await createPayrollRevisionAction(10, 1);

        expect(result).toEqual({ success: false, message: "급여 정정본 생성에 실패하였습니다." });
    });
});

describe("getPayrollStatementDownloadUrlAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        const data = { statementId: 1, payrollId: 10, fileName: "payslip.pdf", downloadUrl: "https://example.com", expiresInSeconds: 300 };
        (getPayrollStatementDownloadUrl as jest.Mock).mockResolvedValue(data);

        const result = await getPayrollStatementDownloadUrlAction(10);

        expect(getPayrollStatementDownloadUrl).toHaveBeenCalledWith(10);
        expect(result).toEqual({ success: true, message: "급여명세서 다운로드 URL을 발급했습니다.", data });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        (getPayrollStatementDownloadUrl as jest.Mock).mockRejectedValue(new Error("급여명세서 다운로드 URL 발급에 실패하였습니다."));

        const result = await getPayrollStatementDownloadUrlAction(10);

        expect(result).toEqual({ success: false, message: "급여명세서 다운로드 URL 발급에 실패하였습니다." });
    });
});

describe("retryPayrollStatementAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        const data = { statementId: 1, payrollId: 10, status: "PENDING", failureReason: null };
        (retryPayrollStatement as jest.Mock).mockResolvedValue(data);

        const result = await retryPayrollStatementAction(10);

        expect(retryPayrollStatement).toHaveBeenCalledWith(10);
        expect(result).toEqual({ success: true, message: "급여명세서 생성을 재시도합니다.", data });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        (retryPayrollStatement as jest.Mock).mockRejectedValue(new Error("급여명세서 생성 재시도에 실패하였습니다."));

        const result = await retryPayrollStatementAction(10);

        expect(result).toEqual({ success: false, message: "급여명세서 생성 재시도에 실패하였습니다." });
    });
});

describe("createPayrollEmailDeliveryAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        const data = { deliveryId: 1, payrollId: 10, status: "SENDING", requestedAt: "2026-08-01", reused: false };
        (createPayrollEmailDelivery as jest.Mock).mockResolvedValue(data);

        const result = await createPayrollEmailDeliveryAction(10);

        expect(createPayrollEmailDelivery).toHaveBeenCalledWith(10);
        expect(result).toEqual({ success: true, message: "급여명세서 이메일 발송을 시작했습니다.", data });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        (createPayrollEmailDelivery as jest.Mock).mockRejectedValue(new Error("급여명세서 이메일 발송에 실패하였습니다."));

        const result = await createPayrollEmailDeliveryAction(10);

        expect(result).toEqual({ success: false, message: "급여명세서 이메일 발송에 실패하였습니다." });
    });
});

describe("createPayrollEmailBatchAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("귀속 연도가 2000년 미만이면 실패 결과를 반환한다", async () => {
        const result = await createPayrollEmailBatchAction(1999, 8);

        expect(result).toEqual({ success: false, message: "귀속 연도가 올바르지 않습니다." });
        expect(createPayrollEmailBatch).not.toHaveBeenCalled();
    });

    it("귀속 월이 1~12월을 벗어나면 실패 결과를 반환한다", async () => {
        const result = await createPayrollEmailBatchAction(2026, 0);

        expect(result).toEqual({ success: false, message: "귀속 월은 1~12월 사이여야 합니다." });
        expect(createPayrollEmailBatch).not.toHaveBeenCalled();
    });

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        const data = { batchId: 1, payrollYearMonth: "2026-08", targetCount: 10, status: "PENDING" };
        (createPayrollEmailBatch as jest.Mock).mockResolvedValue(data);

        const result = await createPayrollEmailBatchAction(2026, 8);

        expect(createPayrollEmailBatch).toHaveBeenCalledWith({ year: 2026, month: 8 });
        expect(result).toEqual({ success: true, message: "급여명세서 이메일 일괄 발송을 시작했습니다.", data });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        (createPayrollEmailBatch as jest.Mock).mockRejectedValue(new Error("급여명세서 이메일 일괄 발송에 실패하였습니다."));

        const result = await createPayrollEmailBatchAction(2026, 8);

        expect(result).toEqual({ success: false, message: "급여명세서 이메일 일괄 발송에 실패하였습니다." });
    });
});

describe("updatePayrollPolicyAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("고정일 지급인데 지급일이 없으면 실패 결과를 반환한다", async () => {
        const result = await updatePayrollPolicyAction({ payDayType: "FIXED_DAY", payDay: null });

        expect(result).toEqual({ success: false, message: "지급일은 1~31 사이여야 합니다." });
        expect(updatePayrollPolicy).not.toHaveBeenCalled();
    });

    it("고정일 지급인데 지급일이 범위를 벗어나면 실패 결과를 반환한다", async () => {
        const result = await updatePayrollPolicyAction({ payDayType: "FIXED_DAY", payDay: 32 });

        expect(result).toEqual({ success: false, message: "지급일은 1~31 사이여야 합니다." });
        expect(updatePayrollPolicy).not.toHaveBeenCalled();
    });

    it("매월 말일 지급인데 지급일이 있으면 실패 결과를 반환한다", async () => {
        const result = await updatePayrollPolicyAction({ payDayType: "MONTH_END", payDay: 10 });

        expect(result).toEqual({ success: false, message: "매월 말일 지급은 지급일을 입력할 수 없습니다." });
        expect(updatePayrollPolicy).not.toHaveBeenCalled();
    });

    it("지급월 오프셋이 범위를 벗어나면 실패 결과를 반환한다", async () => {
        const result = await updatePayrollPolicyAction({ payDayType: "MONTH_END", paymentMonthOffset: 13 });

        expect(result).toEqual({ success: false, message: "지급월 오프셋은 0~12 사이여야 합니다." });
        expect(updatePayrollPolicy).not.toHaveBeenCalled();
    });

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        const data = { id: 1, payDayType: "FIXED_DAY", payDay: 10, paymentMonthOffset: 0 };
        (updatePayrollPolicy as jest.Mock).mockResolvedValue(data);

        const payload = { payDayType: "FIXED_DAY" as const, payDay: 10, paymentMonthOffset: 0 };
        const result = await updatePayrollPolicyAction(payload);

        expect(updatePayrollPolicy).toHaveBeenCalledWith(payload);
        expect(result).toEqual({ success: true, message: "급여 정책을 수정했습니다.", data });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        (updatePayrollPolicy as jest.Mock).mockRejectedValue(new Error("급여 정책 수정에 실패하였습니다."));

        const result = await updatePayrollPolicyAction({ payDayType: "FIXED_DAY", payDay: 10 });

        expect(result).toEqual({ success: false, message: "급여 정책 수정에 실패하였습니다." });
    });
});

describe("savePayrollCompensationAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("주 계약시간이 범위를 벗어나면 실패 결과를 반환한다", async () => {
        const result = await savePayrollCompensationAction(1, {
            compensation: {
                employmentType: "REGULAR",
                salaryType: "MONTHLY",
                baseSalary: 3000000,
                weeklyContractHours: 200,
                effectiveFrom: "2026-01-01",
            },
        });

        expect(result).toEqual({ success: false, message: "주 계약시간은 0~168시간 사이여야 합니다." });
        expect(savePayrollCompensation).not.toHaveBeenCalled();
    });

    it("월급제인데 기본급이 없으면 실패 결과를 반환한다", async () => {
        const result = await savePayrollCompensationAction(1, {
            compensation: {
                employmentType: "REGULAR",
                salaryType: "MONTHLY",
                baseSalary: null,
                weeklyContractHours: 40,
                effectiveFrom: "2026-01-01",
            },
        });

        expect(result).toEqual({ success: false, message: "월급제는 기본급을 입력해주세요." });
        expect(savePayrollCompensation).not.toHaveBeenCalled();
    });

    it("시급제인데 시급이 없으면 실패 결과를 반환한다", async () => {
        const result = await savePayrollCompensationAction(1, {
            compensation: {
                employmentType: "PART_TIME",
                salaryType: "HOURLY",
                hourlyWage: null,
                weeklyContractHours: 20,
                effectiveFrom: "2026-01-01",
            },
        });

        expect(result).toEqual({ success: false, message: "시급제는 시급을 입력해주세요." });
        expect(savePayrollCompensation).not.toHaveBeenCalled();
    });

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        const data = { employeeId: 1, compensations: [], fixedAllowances: [], payBases: [] };
        (savePayrollCompensation as jest.Mock).mockResolvedValue(data);

        const payload = { fixedAllowances: [] };
        const result = await savePayrollCompensationAction(1, payload);

        expect(savePayrollCompensation).toHaveBeenCalledWith(1, payload);
        expect(result).toEqual({ success: true, message: "직원 급여 설정을 저장했습니다.", data });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        (savePayrollCompensation as jest.Mock).mockRejectedValue(new Error("직원 급여 설정 저장에 실패하였습니다."));

        const result = await savePayrollCompensationAction(1, {});

        expect(result).toEqual({ success: false, message: "직원 급여 설정 저장에 실패하였습니다." });
    });
});
