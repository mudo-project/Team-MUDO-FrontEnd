import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { getPayrollEmailBatchResultAction } from "../actions";
import PayrollEmailBatchResultView from "./PayrollEmailBatchResultView";

jest.mock("sonner", () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

jest.mock("../actions", () => ({
    getPayrollEmailBatchResultAction: jest.fn(),
}));

const mockedGetPayrollEmailBatchResultAction = getPayrollEmailBatchResultAction as jest.MockedFunction<typeof getPayrollEmailBatchResultAction>;

function buildResult(overrides: Partial<PayrollEmailBatchResultDetailData> = {}): PayrollEmailBatchResultDetailData {
    return {
        batchId: 701,
        payrollYearMonth: "2026-08-01",
        status: "AWAITING_DELIVERY",
        summary: {
            totalCount: 2,
            pendingCount: 0,
            sendingCount: 0,
            sentCount: 1,
            retryWaitCount: 0,
            unknownCount: 0,
            deliveredCount: 0,
            failedCount: 0,
            skippedCount: 1,
        },
        deliveries: {
            content: [
                {
                    deliveryId: 501,
                    payrollId: 100,
                    employeeId: 10,
                    employeeName: "홍길동",
                    recipientEmail: "ho***@example.com",
                    status: "SENT",
                    failureCode: null,
                    failureReason: null,
                    requestedAt: "2026-08-12T14:30:00",
                    sentAt: "2026-08-12T14:30:02",
                    deliveredAt: null,
                    failedAt: null,
                },
            ],
            page: 0,
            size: 20,
            totalElements: 2,
            totalPages: 1,
            first: true,
            last: true,
            hasNext: false,
            hasPrevious: false,
        },
        ...overrides,
    };
}

describe("PayrollEmailBatchResultView", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("배치 요약과 대상자별 발송 상태를 노출한다", () => {
        render(<PayrollEmailBatchResultView batchId={701} initialResult={buildResult()} />);

        expect(screen.getByText("2026년 8월 명세서 일괄 발송 결과")).toBeInTheDocument();
        expect(screen.getByText("홍길동")).toBeInTheDocument();
    });

    it("새로고침을 클릭하면 최신 결과를 다시 조회한다", async () => {
        mockedGetPayrollEmailBatchResultAction.mockResolvedValue(buildResult({ status: "COMPLETED" }));
        render(<PayrollEmailBatchResultView batchId={701} initialResult={buildResult()} />);

        fireEvent.click(screen.getByRole("button", { name: /새로고침/ }));

        await waitFor(() => {
            expect(getPayrollEmailBatchResultAction).toHaveBeenCalledWith(701, { page: 0, size: 20 });
        });
        expect(await screen.findByText("배치 #701 · 완료됨")).toBeInTheDocument();
    });
});
