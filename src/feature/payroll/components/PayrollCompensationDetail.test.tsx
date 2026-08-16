import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { savePayrollCompensationAction } from "../actions";
import PayrollCompensationDetail from "./PayrollCompensationDetail";

jest.mock("sonner", () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

jest.mock("../actions", () => ({
    savePayrollCompensationAction: jest.fn(),
}));

const mockedSavePayrollCompensationAction = savePayrollCompensationAction as jest.MockedFunction<typeof savePayrollCompensationAction>;

const compensation: PayrollCompensationGetData = {
    employeeId: 1,
    compensations: [],
    fixedAllowances: [
        {
            id: 100,
            employeeId: 1,
            type: "MEAL",
            name: "식대",
            amount: 100000,
            effectiveFrom: "2026-01-01",
            effectiveTo: null,
        },
    ],
    payBases: [],
};

describe("PayrollCompensationDetail", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("수당명 또는 금액이 비어있으면 추가하지 않는다", () => {
        render(<PayrollCompensationDetail compensation={compensation} employeeId={1} employeeName="김강사" onClose={jest.fn()} onSaved={jest.fn()} />);

        fireEvent.click(screen.getByRole("button", { name: "수당 추가" }));
        fireEvent.click(screen.getByRole("button", { name: "추가" }));

        expect(screen.getByPlaceholderText("수당명")).toBeInTheDocument();
        expect(screen.getAllByRole("button", { name: /삭제$/ })).toHaveLength(1);
    });

    it("수당명과 금액을 입력하고 추가하면 목록에 새 수당이 노출된다", () => {
        render(<PayrollCompensationDetail compensation={compensation} employeeId={1} employeeName="김강사" onClose={jest.fn()} onSaved={jest.fn()} />);

        fireEvent.click(screen.getByRole("button", { name: "수당 추가" }));
        fireEvent.change(screen.getByPlaceholderText("수당명"), { target: { value: "교통비" } });
        fireEvent.change(screen.getByPlaceholderText("금액"), { target: { value: "50000" } });
        fireEvent.click(screen.getByRole("button", { name: "추가" }));

        expect(screen.getByText("교통비")).toBeInTheDocument();
        expect(screen.queryByPlaceholderText("수당명")).not.toBeInTheDocument();
    });

    it("삭제 버튼을 클릭하면 목록에서 수당을 제거한다", () => {
        render(<PayrollCompensationDetail compensation={compensation} employeeId={1} employeeName="김강사" onClose={jest.fn()} onSaved={jest.fn()} />);

        fireEvent.click(screen.getByRole("button", { name: "식대 삭제" }));

        expect(screen.queryByText("식대")).not.toBeInTheDocument();
    });

    it("저장을 확정하면 현재 수당 목록으로 저장 액션을 호출하고 onSaved를 호출한다", async () => {
        const saved = { ...compensation, fixedAllowances: [] };
        mockedSavePayrollCompensationAction.mockResolvedValue({ success: true, message: "급여 설정이 저장되었습니다.", data: saved });
        const onSaved = jest.fn();
        render(<PayrollCompensationDetail compensation={compensation} employeeId={1} employeeName="김강사" onClose={jest.fn()} onSaved={onSaved} />);

        fireEvent.click(screen.getByRole("button", { name: "저장" }));
        fireEvent.click(screen.getAllByRole("button", { name: "저장" })[1]);

        await waitFor(() => {
            expect(savePayrollCompensationAction).toHaveBeenCalledWith(1, {
                fixedAllowances: [
                    {
                        allowanceId: 100,
                        allowanceType: "MEAL",
                        allowanceName: "식대",
                        amount: 100000,
                        effectiveFrom: "2026-01-01",
                        effectiveTo: null,
                    },
                ],
            });
        });
        expect(toast.success).toHaveBeenCalledWith("급여 설정이 저장되었습니다.");
        expect(onSaved).toHaveBeenCalledWith(saved);
    });

    it("저장에 실패하면 에러 토스트를 노출하고 onSaved를 호출하지 않는다", async () => {
        mockedSavePayrollCompensationAction.mockResolvedValue({ success: false, message: "급여 설정 저장에 실패하였습니다." });
        const onSaved = jest.fn();
        render(<PayrollCompensationDetail compensation={compensation} employeeId={1} employeeName="김강사" onClose={jest.fn()} onSaved={onSaved} />);

        fireEvent.click(screen.getByRole("button", { name: "저장" }));
        fireEvent.click(screen.getAllByRole("button", { name: "저장" })[1]);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("급여 설정 저장에 실패하였습니다.");
        });
        expect(onSaved).not.toHaveBeenCalled();
    });
});
