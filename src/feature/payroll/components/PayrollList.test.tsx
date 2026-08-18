import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { calculatePayrollAction, getPayrollAction } from "../actions";
import PayrollList from "./PayrollList";

jest.mock("sonner", () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

jest.mock("../actions", () => ({
    calculatePayrollAction: jest.fn(),
    getPayrollAction: jest.fn(),
}));

jest.mock("./PayrollDetail", () => function MockPayrollDetail({ onClose }: { onClose: () => void }) {
    return (
        <div>
            <span>급여 상세</span>
            <button onClick={onClose} type="button">상세 닫기</button>
        </div>
    );
});

const mockedGetPayrollAction = getPayrollAction as jest.MockedFunction<typeof getPayrollAction>;
const mockedCalculatePayrollAction = calculatePayrollAction as jest.MockedFunction<typeof calculatePayrollAction>;

const items: PayrollListItemData[] = [
    {
        employeeId: 1,
        employeeName: "김강사",
        employmentType: "REGULAR",
        payrollId: 10,
        preparationStatus: "CALCULATED",
        totalEarnings: 3000000,
        totalDeductions: 200000,
        netPay: 2800000,
        revisionNo: 0,
    },
    {
        employeeId: 2,
        employeeName: "이강사",
        employmentType: "PART_TIME",
        payrollId: 15,
        preparationStatus: "DRAFT",
        totalEarnings: null,
        totalDeductions: null,
        netPay: null,
        revisionNo: 0,
    },
];

const detail = { payrollId: 10, version: 3 } as PayrollAggregateData;

describe("PayrollList", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("대상 직원이 없으면 안내 문구를 노출한다", () => {
        render(<PayrollList isLoading={false} items={[]} onListChanged={jest.fn()} />);

        expect(screen.getByText("조건에 맞는 직원이 없습니다.")).toBeInTheDocument();
    });

    it("미리보기를 클릭하면 상세를 조회해 패널을 연다", async () => {
        mockedGetPayrollAction.mockResolvedValue(detail);
        render(<PayrollList isLoading={false} items={items} onListChanged={jest.fn()} />);

        fireEvent.click(screen.getByRole("button", { name: /미리보기/ }));

        expect(await screen.findByText("급여 상세")).toBeInTheDocument();
        expect(getPayrollAction).toHaveBeenCalledWith(10);
    });

    it("상세 조회에 실패하면 에러 토스트를 노출한다", async () => {
        mockedGetPayrollAction.mockRejectedValue(new Error("조회 실패"));
        render(<PayrollList isLoading={false} items={items} onListChanged={jest.fn()} />);

        fireEvent.click(screen.getByRole("button", { name: /미리보기/ }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("조회 실패");
        });
        expect(screen.queryByText("급여 상세")).not.toBeInTheDocument();
    });

    it("계산하기를 클릭하면 확인 모달을 열고 확정 시 최신 version으로 계산 액션을 호출한다", async () => {
        mockedGetPayrollAction.mockResolvedValue({ payrollId: 20, version: 5 } as PayrollAggregateData);
        mockedCalculatePayrollAction.mockResolvedValue({ success: true, message: "급여를 계산하였습니다." });
        const onListChanged = jest.fn();
        render(<PayrollList isLoading={false} items={items} onListChanged={onListChanged} />);

        fireEvent.click(screen.getByRole("button", { name: /계산하기/ }));
        expect(screen.getByText("급여를 계산하시겠습니까?")).toBeInTheDocument();

        fireEvent.click(screen.getAllByRole("button", { name: "계산하기" })[1]);

        await waitFor(() => {
            expect(calculatePayrollAction).toHaveBeenCalledWith(15, 5);
        });
        expect(toast.success).toHaveBeenCalledWith("급여를 계산하였습니다.");
        expect(onListChanged).toHaveBeenCalled();
        expect(screen.queryByText("급여를 계산하시겠습니까?")).not.toBeInTheDocument();
    });

    it("계산 액션이 실패를 반환하면 에러 토스트를 노출하고 목록을 갱신하지 않는다", async () => {
        mockedGetPayrollAction.mockResolvedValue({ payrollId: 20, version: 5 } as PayrollAggregateData);
        mockedCalculatePayrollAction.mockResolvedValue({ success: false, message: "급여 계산에 실패하였습니다." });
        const onListChanged = jest.fn();
        render(<PayrollList isLoading={false} items={items} onListChanged={onListChanged} />);

        fireEvent.click(screen.getByRole("button", { name: /계산하기/ }));
        fireEvent.click(screen.getAllByRole("button", { name: "계산하기" })[1]);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("급여 계산에 실패하였습니다.");
        });
        expect(onListChanged).not.toHaveBeenCalled();
    });
});
