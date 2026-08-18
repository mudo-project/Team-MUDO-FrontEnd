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

    it("전체 일괄 발송 버튼을 클릭하면 확인 모달을 연다", () => {
        render(<PayrollListFilter {...baseProps} onConfirmBatchSend={jest.fn()} />);

        fireEvent.click(screen.getByRole("button", { name: /전체 일괄 발송/ }));

        expect(screen.getByText("전체 급여명세서를 일괄 발송하시겠습니까?")).toBeInTheDocument();
    });

    it("발송을 확정하면 onConfirmBatchSend를 호출하고 모달을 닫는다", async () => {
        const onConfirmBatchSend = jest.fn().mockResolvedValue(undefined);
        render(<PayrollListFilter {...baseProps} onConfirmBatchSend={onConfirmBatchSend} />);

        fireEvent.click(screen.getByRole("button", { name: /전체 일괄 발송/ }));
        fireEvent.click(screen.getByRole("button", { name: "발송 시작" }));

        await waitFor(() => {
            expect(onConfirmBatchSend).toHaveBeenCalled();
        });
        expect(screen.queryByText("전체 급여명세서를 일괄 발송하시겠습니까?")).not.toBeInTheDocument();
    });

    it("취소를 클릭하면 발송하지 않고 모달을 닫는다", () => {
        const onConfirmBatchSend = jest.fn();
        render(<PayrollListFilter {...baseProps} onConfirmBatchSend={onConfirmBatchSend} />);

        fireEvent.click(screen.getByRole("button", { name: /전체 일괄 발송/ }));
        fireEvent.click(screen.getByRole("button", { name: "취소" }));

        expect(onConfirmBatchSend).not.toHaveBeenCalled();
        expect(screen.queryByText("전체 급여명세서를 일괄 발송하시겠습니까?")).not.toBeInTheDocument();
    });

    it("검색어를 입력하면 onChangeSearchQuery를 호출한다", () => {
        const onChangeSearchQuery = jest.fn();
        render(<PayrollListFilter {...baseProps} onChangeSearchQuery={onChangeSearchQuery} onConfirmBatchSend={jest.fn()} />);

        fireEvent.change(screen.getByPlaceholderText("직원명 검색"), { target: { value: "김" } });

        expect(onChangeSearchQuery).toHaveBeenCalledWith("김");
    });
});
