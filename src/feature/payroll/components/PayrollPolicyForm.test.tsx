import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { updatePayrollPolicyAction } from "../actions";
import PayrollPolicyForm from "./PayrollPolicyForm";

jest.mock("sonner", () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

jest.mock("../actions", () => ({
    updatePayrollPolicyAction: jest.fn(),
}));

const mockedUpdatePayrollPolicyAction = updatePayrollPolicyAction as jest.MockedFunction<typeof updatePayrollPolicyAction>;

const policy: PayrollPolicyGetData = {
    id: 1,
    payDayType: "FIXED_DAY",
    payDay: 10,
    paymentMonthOffset: 0,
};

describe("PayrollPolicyForm", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("지급일 유형을 매월 말일로 바꾸면 지급일 입력을 비활성화한다", () => {
        render(<PayrollPolicyForm policy={policy} />);

        fireEvent.click(screen.getByRole("button", { name: "매월 말일" }));

        expect(screen.getByLabelText("지급일")).toBeDisabled();
    });

    it("저장을 클릭하면 확인 모달을 열고 확정 시 현재 입력값으로 저장 액션을 호출한다", async () => {
        mockedUpdatePayrollPolicyAction.mockResolvedValue({ success: true, message: "급여 정책이 저장되었습니다." });
        render(<PayrollPolicyForm policy={policy} />);

        fireEvent.change(screen.getByLabelText("지급일"), { target: { value: "15" } });
        fireEvent.click(screen.getByRole("button", { name: "저장" }));
        expect(screen.getByText("급여 정책을 저장하시겠습니까?")).toBeInTheDocument();

        fireEvent.click(screen.getAllByRole("button", { name: "저장" })[1]);

        await waitFor(() => {
            expect(updatePayrollPolicyAction).toHaveBeenCalledWith({
                payDayType: "FIXED_DAY",
                payDay: 15,
                paymentMonthOffset: 0,
            });
        });
        expect(toast.success).toHaveBeenCalledWith("급여 정책이 저장되었습니다.");
        expect(screen.queryByText("급여 정책을 저장하시겠습니까?")).not.toBeInTheDocument();
    });

    it("매월 말일 선택 시 저장 요청의 지급일은 null이다", async () => {
        mockedUpdatePayrollPolicyAction.mockResolvedValue({ success: true, message: "급여 정책이 저장되었습니다." });
        render(<PayrollPolicyForm policy={policy} />);

        fireEvent.click(screen.getByRole("button", { name: "매월 말일" }));
        fireEvent.click(screen.getAllByRole("button", { name: "저장" })[0]);
        fireEvent.click(screen.getAllByRole("button", { name: "저장" })[1]);

        await waitFor(() => {
            expect(updatePayrollPolicyAction).toHaveBeenCalledWith(
                expect.objectContaining({ payDayType: "MONTH_END", payDay: null }),
            );
        });
    });

    it("저장에 실패하면 에러 토스트를 노출한다", async () => {
        mockedUpdatePayrollPolicyAction.mockResolvedValue({ success: false, message: "급여 정책 저장에 실패하였습니다." });
        render(<PayrollPolicyForm policy={policy} />);

        fireEvent.click(screen.getAllByRole("button", { name: "저장" })[0]);
        fireEvent.click(screen.getAllByRole("button", { name: "저장" })[1]);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("급여 정책 저장에 실패하였습니다.");
        });
    });
});
