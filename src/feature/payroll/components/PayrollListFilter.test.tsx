import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import PayrollListFilter from "./PayrollListFilter";

const baseProps = {
    employmentTypeFilter: "전체" as const,
    monthLabel: "2026년 8월",
    onChangeEmploymentTypeFilter: jest.fn(),
    onChangeSearchQuery: jest.fn(),
    onChangeStatusFilter: jest.fn(),
    searchQuery: "",
    statusFilter: "전체" as const,
    totalCount: 5,
};

describe("PayrollListFilter", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("선택한 인원이 없으면 발송 버튼이 비활성화된다", () => {
        render(<PayrollListFilter {...baseProps} onConfirmBatchSend={jest.fn()} selectedCount={0} />);

        expect(screen.getByRole("button", { name: /명세서 발송/ })).toBeDisabled();
    });

    it("선택한 인원이 있으면 발송 버튼을 클릭해 확인 모달을 연다", () => {
        render(<PayrollListFilter {...baseProps} onConfirmBatchSend={jest.fn()} selectedCount={2} />);

        fireEvent.click(screen.getByRole("button", { name: /선택한 2명 명세서 발송/ }));

        expect(screen.getByText("선택한 2명에게 명세서를 발송하시겠습니까?")).toBeInTheDocument();
    });

    it("발송을 확정하면 onConfirmBatchSend를 호출하고 결과 패널을 노출한다", async () => {
        const result: PayrollEmailBatchResultData = {
            batchId: 0,
            yearMonth: "2026-08",
            status: "COMPLETED",
            summary: {
                totalCount: 1,
                pendingCount: 0,
                sendingCount: 0,
                sentCount: 1,
                retryWaitCount: 0,
                unknownCount: 0,
                deliveredCount: 0,
                failedCount: 0,
                skippedCount: 0,
            },
            deliveries: [],
        };
        const onConfirmBatchSend = jest.fn().mockResolvedValue(result);
        render(<PayrollListFilter {...baseProps} onConfirmBatchSend={onConfirmBatchSend} selectedCount={1} />);

        fireEvent.click(screen.getByRole("button", { name: /선택한 1명 명세서 발송/ }));
        fireEvent.click(screen.getByRole("button", { name: "발송 시작" }));

        await waitFor(() => {
            expect(onConfirmBatchSend).toHaveBeenCalled();
        });
        expect(await screen.findByText("2026년 8월 명세서 발송 결과")).toBeInTheDocument();
        expect(screen.queryByText("선택한 1명에게 명세서를 발송하시겠습니까?")).not.toBeInTheDocument();
    });

    it("취소를 클릭하면 발송하지 않고 모달을 닫는다", () => {
        const onConfirmBatchSend = jest.fn();
        render(<PayrollListFilter {...baseProps} onConfirmBatchSend={onConfirmBatchSend} selectedCount={1} />);

        fireEvent.click(screen.getByRole("button", { name: /선택한 1명 명세서 발송/ }));
        fireEvent.click(screen.getByRole("button", { name: "취소" }));

        expect(onConfirmBatchSend).not.toHaveBeenCalled();
        expect(screen.queryByText("선택한 1명에게 명세서를 발송하시겠습니까?")).not.toBeInTheDocument();
    });

    it("검색어를 입력하면 onChangeSearchQuery를 호출한다", () => {
        const onChangeSearchQuery = jest.fn();
        render(<PayrollListFilter {...baseProps} onChangeSearchQuery={onChangeSearchQuery} onConfirmBatchSend={jest.fn()} selectedCount={0} />);

        fireEvent.change(screen.getByPlaceholderText("직원명 검색"), { target: { value: "김" } });

        expect(onChangeSearchQuery).toHaveBeenCalledWith("김");
    });
});
