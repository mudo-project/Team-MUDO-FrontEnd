import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import {
    confirmPayrollAction,
    createPayrollEarningAction,
    createPayrollEmailDeliveryAction,
    createPayrollRevisionAction,
    deletePayrollEarningAction,
    getPayrollAction,
    getPayrollRevisionsAction,
    getPayrollStatementDownloadUrlAction,
    retryPayrollStatementAction,
    updatePayrollAction,
} from "../actions";
import PayrollDetail from "./PayrollDetail";

jest.mock("sonner", () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

jest.mock("../actions", () => ({
    confirmPayrollAction: jest.fn(),
    createPayrollEarningAction: jest.fn(),
    createPayrollEmailDeliveryAction: jest.fn(),
    createPayrollRevisionAction: jest.fn(),
    deletePayrollEarningAction: jest.fn(),
    getPayrollAction: jest.fn(),
    getPayrollRevisionsAction: jest.fn(),
    getPayrollStatementDownloadUrlAction: jest.fn(),
    retryPayrollStatementAction: jest.fn(),
    updatePayrollAction: jest.fn(),
}));

const mockedGetPayrollAction = getPayrollAction as jest.MockedFunction<typeof getPayrollAction>;
const mockedUpdatePayrollAction = updatePayrollAction as jest.MockedFunction<typeof updatePayrollAction>;
const mockedCreatePayrollEarningAction = createPayrollEarningAction as jest.MockedFunction<typeof createPayrollEarningAction>;
const mockedDeletePayrollEarningAction = deletePayrollEarningAction as jest.MockedFunction<typeof deletePayrollEarningAction>;
const mockedConfirmPayrollAction = confirmPayrollAction as jest.MockedFunction<typeof confirmPayrollAction>;
const mockedCreatePayrollRevisionAction = createPayrollRevisionAction as jest.MockedFunction<typeof createPayrollRevisionAction>;
const mockedRetryPayrollStatementAction = retryPayrollStatementAction as jest.MockedFunction<typeof retryPayrollStatementAction>;
const mockedGetPayrollRevisionsAction = getPayrollRevisionsAction as jest.MockedFunction<typeof getPayrollRevisionsAction>;
const mockedGetPayrollStatementDownloadUrlAction = getPayrollStatementDownloadUrlAction as jest.MockedFunction<typeof getPayrollStatementDownloadUrlAction>;
const mockedCreatePayrollEmailDeliveryAction = createPayrollEmailDeliveryAction as jest.MockedFunction<typeof createPayrollEmailDeliveryAction>;

function buildDetail(overrides: Partial<PayrollAggregateData> = {}): PayrollAggregateData {
    return {
        payrollId: 10,
        employee: { employeeId: 1, name: "김강사", employmentType: "REGULAR" },
        yearMonth: "2026-08",
        scheduledPayDate: "2026-09-10",
        status: "CALCULATED",
        revisionNo: 0,
        originalPayrollId: null,
        snapshots: null,
        earnings: [
            { itemId: 1, type: "BASE", name: "기본급", sourceType: "CONTRACT", amount: 3000000, editable: false },
            { itemId: 2, type: "MANUAL", name: "수기 항목", sourceType: "MANUAL", amount: 100000, editable: true },
        ],
        deductions: [
            { itemId: 3, type: "PENSION", name: "국민연금", sourceType: "RULE", amount: 200000, editable: false },
        ],
        totalEarnings: 3100000,
        totalDeductions: 200000,
        netPay: 2900000,
        memo: null,
        statement: null,
        version: 1,
        ...overrides,
    };
}

describe("PayrollDetail", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("계산 완료 상태면 메모 저장과 확정하기 버튼을 노출한다", () => {
        render(<PayrollDetail detail={buildDetail()} onClose={jest.fn()} onListChanged={jest.fn()} />);

        expect(screen.getByPlaceholderText("검토 메모를 입력하세요.")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "확정하기" })).toBeInTheDocument();
    });

    it("확정 상태면 메모는 읽기전용이고 정정 관련 버튼을 노출한다", () => {
        render(<PayrollDetail detail={buildDetail({ status: "CONFIRMED", memo: "확인 완료" })} onClose={jest.fn()} onListChanged={jest.fn()} />);

        expect(screen.queryByPlaceholderText("검토 메모를 입력하세요.")).not.toBeInTheDocument();
        expect(screen.getByText("확인 완료")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "정정 이력 보기" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "정정본 생성" })).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "확정하기" })).not.toBeInTheDocument();
    });

    it("수정 불가능한 지급 항목은 삭제 버튼이 없고, editable 항목만 삭제 버튼이 있다", () => {
        render(<PayrollDetail detail={buildDetail()} onClose={jest.fn()} onListChanged={jest.fn()} />);

        expect(screen.queryByRole("button", { name: "기본급 삭제" })).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: "수기 항목 삭제" })).toBeInTheDocument();
    });

    it("메모를 저장하면 최신 상세를 다시 조회해 반영한다", async () => {
        mockedUpdatePayrollAction.mockResolvedValue({ success: true, message: "메모가 저장되었습니다." });
        mockedGetPayrollAction.mockResolvedValue(buildDetail({ memo: "검토했습니다" }));
        const onListChanged = jest.fn();
        render(<PayrollDetail detail={buildDetail()} onClose={jest.fn()} onListChanged={onListChanged} />);

        fireEvent.change(screen.getByPlaceholderText("검토 메모를 입력하세요."), { target: { value: "검토했습니다" } });
        fireEvent.click(screen.getByRole("button", { name: "메모 저장" }));

        await waitFor(() => {
            expect(updatePayrollAction).toHaveBeenCalledWith(10, 1, "검토했습니다");
        });
        expect(toast.success).toHaveBeenCalledWith("메모가 저장되었습니다.");
        expect(onListChanged).toHaveBeenCalled();
        expect(await screen.findByDisplayValue("검토했습니다")).toBeInTheDocument();
    });

    it("항목명 또는 금액이 비어있으면 수기 항목 추가 액션을 호출하지 않는다", () => {
        render(<PayrollDetail detail={buildDetail()} onClose={jest.fn()} onListChanged={jest.fn()} />);

        fireEvent.click(screen.getByRole("button", { name: "수기 항목 추가" }));
        fireEvent.click(screen.getByRole("button", { name: "추가" }));

        expect(createPayrollEarningAction).not.toHaveBeenCalled();
    });

    it("항목명과 금액을 입력하고 추가하면 수기 항목 추가 액션을 호출한다", async () => {
        mockedCreatePayrollEarningAction.mockResolvedValue({ success: true, message: "지급 항목이 추가되었습니다." });
        mockedGetPayrollAction.mockResolvedValue(buildDetail());
        render(<PayrollDetail detail={buildDetail()} onClose={jest.fn()} onListChanged={jest.fn()} />);

        fireEvent.click(screen.getByRole("button", { name: "수기 항목 추가" }));
        fireEvent.change(screen.getByPlaceholderText("항목명"), { target: { value: "특별수당" } });
        fireEvent.change(screen.getByPlaceholderText("금액"), { target: { value: "50000" } });
        fireEvent.click(screen.getByRole("button", { name: "추가" }));

        await waitFor(() => {
            expect(createPayrollEarningAction).toHaveBeenCalledWith(10, 1, "특별수당", 50000);
        });
        expect(toast.success).toHaveBeenCalledWith("지급 항목이 추가되었습니다.");
    });

    it("editable 지급 항목을 삭제하면 삭제 액션을 호출한다", async () => {
        mockedDeletePayrollEarningAction.mockResolvedValue({ success: true, message: "지급 항목이 삭제되었습니다." });
        mockedGetPayrollAction.mockResolvedValue(buildDetail());
        render(<PayrollDetail detail={buildDetail()} onClose={jest.fn()} onListChanged={jest.fn()} />);

        fireEvent.click(screen.getByRole("button", { name: "수기 항목 삭제" }));

        await waitFor(() => {
            expect(deletePayrollEarningAction).toHaveBeenCalledWith(10, 2, 1);
        });
        expect(toast.success).toHaveBeenCalledWith("지급 항목이 삭제되었습니다.");
    });

    it("확정하기를 클릭하면 확인 모달을 열고 확정 액션을 호출한다", async () => {
        mockedConfirmPayrollAction.mockResolvedValue({ success: true, message: "급여가 확정되었습니다." });
        mockedGetPayrollAction.mockResolvedValue(buildDetail({ status: "CONFIRMED" }));
        const onListChanged = jest.fn();
        render(<PayrollDetail detail={buildDetail()} onClose={jest.fn()} onListChanged={onListChanged} />);

        fireEvent.click(screen.getByRole("button", { name: "확정하기" }));
        fireEvent.click(screen.getAllByRole("button", { name: "확정하기" })[1]);

        await waitFor(() => {
            expect(confirmPayrollAction).toHaveBeenCalledWith(10, 1);
        });
        expect(toast.success).toHaveBeenCalledWith("급여가 확정되었습니다.");
        expect(onListChanged).toHaveBeenCalled();
    });

    it("확정 액션이 실패하면 에러 토스트를 노출하고 상세를 갱신하지 않는다", async () => {
        mockedConfirmPayrollAction.mockResolvedValue({ success: false, message: "급여 확정에 실패하였습니다." });
        render(<PayrollDetail detail={buildDetail()} onClose={jest.fn()} onListChanged={jest.fn()} />);

        fireEvent.click(screen.getByRole("button", { name: "확정하기" }));
        fireEvent.click(screen.getAllByRole("button", { name: "확정하기" })[1]);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("급여 확정에 실패하였습니다.");
        });
        expect(getPayrollAction).not.toHaveBeenCalled();
    });

    it("정정본 생성을 확정하면 정정본 생성 액션을 호출하고 패널을 닫는다", async () => {
        mockedCreatePayrollRevisionAction.mockResolvedValue({ success: true, message: "정정본이 생성되었습니다." });
        const onClose = jest.fn();
        const onListChanged = jest.fn();
        render(<PayrollDetail detail={buildDetail({ status: "CONFIRMED" })} onClose={onClose} onListChanged={onListChanged} />);

        fireEvent.click(screen.getByRole("button", { name: "정정본 생성" }));
        fireEvent.click(screen.getAllByRole("button", { name: "정정본 생성" })[1]);

        await waitFor(() => {
            expect(createPayrollRevisionAction).toHaveBeenCalledWith(10, 1);
        });
        expect(toast.success).toHaveBeenCalledWith("정정본이 생성되었습니다.");
        expect(onListChanged).toHaveBeenCalled();
        expect(onClose).toHaveBeenCalled();
    });

    it("정정 이력 보기를 클릭하면 이력을 조회해 이력 패널을 연다", async () => {
        mockedGetPayrollRevisionsAction.mockResolvedValue([buildDetail({ status: "CONFIRMED" })]);
        render(<PayrollDetail detail={buildDetail({ status: "CONFIRMED" })} onClose={jest.fn()} onListChanged={jest.fn()} />);

        fireEvent.click(screen.getByRole("button", { name: "정정 이력 보기" }));

        expect(await screen.findByText("김강사 · 정정 이력")).toBeInTheDocument();
    });

    it("명세서 상태가 READY면 다운로드와 이메일 발송 버튼을 노출한다", async () => {
        mockedGetPayrollStatementDownloadUrlAction.mockResolvedValue({
            success: true,
            message: "다운로드 URL이 발급되었습니다.",
            data: { statementId: 1, payrollId: 10, fileName: "payslip.pdf", downloadUrl: "https://example.com/payslip.pdf", expiresInSeconds: 300 },
        });
        mockedCreatePayrollEmailDeliveryAction.mockResolvedValue({ success: true, message: "이메일이 발송되었습니다." });
        const openSpy = jest.spyOn(window, "open").mockImplementation(() => null);
        render(
            <PayrollDetail
                detail={buildDetail({ status: "CONFIRMED", statement: { statementId: 1, status: "READY", fileSize: 10240, generatedAt: "2026-08-01", failureReason: null } })}
                onClose={jest.fn()}
                onListChanged={jest.fn()}
            />,
        );

        fireEvent.click(screen.getByRole("button", { name: /PDF 다운로드/ }));
        await waitFor(() => {
            expect(openSpy).toHaveBeenCalledWith("https://example.com/payslip.pdf", "_blank", "noopener,noreferrer");
        });

        fireEvent.click(screen.getByRole("button", { name: /이메일 발송/ }));
        await waitFor(() => {
            expect(createPayrollEmailDeliveryAction).toHaveBeenCalledWith(10);
        });
        expect(toast.success).toHaveBeenCalledWith("이메일이 발송되었습니다.");

        openSpy.mockRestore();
    });

    it("이메일 발송 결과가 있으면 발송 결과 패널을 노출한다", async () => {
        mockedCreatePayrollEmailDeliveryAction.mockResolvedValue({
            success: true,
            message: "이메일이 발송되었습니다.",
            data: { deliveryId: 501, payrollId: 10, status: "PENDING", requestedAt: "2026-08-12T14:30:00", reused: false },
        });
        render(
            <PayrollDetail
                detail={buildDetail({ status: "CONFIRMED", statement: { statementId: 1, status: "READY", fileSize: 10240, generatedAt: "2026-08-01", failureReason: null } })}
                onClose={jest.fn()}
                onListChanged={jest.fn()}
            />,
        );

        fireEvent.click(screen.getByRole("button", { name: /이메일 발송/ }));

        expect(await screen.findByText("이메일 발송 결과")).toBeInTheDocument();
        expect(screen.getByText("신규 발송")).toBeInTheDocument();
    });

    it("명세서가 PENDING이면 상태가 바뀔 때까지 폴링해 자동으로 갱신한다", async () => {
        jest.useFakeTimers();
        mockedGetPayrollAction.mockResolvedValue(
            buildDetail({ status: "CONFIRMED", statement: { statementId: 1, status: "READY", fileSize: 10240, generatedAt: "2026-08-01", failureReason: null } })
        );
        const onListChanged = jest.fn();
        render(
            <PayrollDetail
                detail={buildDetail({ status: "CONFIRMED", statement: { statementId: 1, status: "PENDING", fileSize: null, generatedAt: null, failureReason: null } })}
                onClose={jest.fn()}
                onListChanged={onListChanged}
            />,
        );

        expect(screen.getByText("명세서를 생성하고 있습니다.")).toBeInTheDocument();

        await jest.advanceTimersByTimeAsync(3000);

        expect(getPayrollAction).toHaveBeenCalledWith(10);
        expect(await screen.findByRole("button", { name: /이메일 발송/ })).toBeInTheDocument();
        expect(onListChanged).toHaveBeenCalled();

        jest.useRealTimers();
    });

    it("명세서 상태가 FAILED면 실패 사유와 재시도 버튼을 노출하고 재시도 시 액션을 호출한다", async () => {
        mockedRetryPayrollStatementAction.mockResolvedValue({ success: true, message: "명세서 생성을 재시도합니다." });
        render(
            <PayrollDetail
                detail={buildDetail({ status: "CONFIRMED", statement: { statementId: 1, status: "FAILED", fileSize: null, generatedAt: null, failureReason: "S3 업로드 실패" } })}
                onClose={jest.fn()}
                onListChanged={jest.fn()}
            />,
        );

        expect(screen.getByText("S3 업로드 실패")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: /재시도/ }));
        fireEvent.click(screen.getAllByRole("button", { name: "재시도" })[1]);

        await waitFor(() => {
            expect(retryPayrollStatementAction).toHaveBeenCalledWith(10);
        });
        expect(toast.success).toHaveBeenCalledWith("명세서 생성을 재시도합니다.");
    });

    it("명세서가 없으면 확정 후 생성 안내 문구를 노출한다", () => {
        render(<PayrollDetail detail={buildDetail({ statement: null })} onClose={jest.fn()} onListChanged={jest.fn()} />);

        expect(screen.getByText("급여 확정 후 명세서가 생성됩니다.")).toBeInTheDocument();
    });

    it("닫기 버튼을 클릭하면 onClose를 호출한다", () => {
        const onClose = jest.fn();
        render(<PayrollDetail detail={buildDetail()} onClose={onClose} onListChanged={jest.fn()} />);

        fireEvent.click(screen.getByRole("button", { name: "닫기" }));

        expect(onClose).toHaveBeenCalled();
    });
});
