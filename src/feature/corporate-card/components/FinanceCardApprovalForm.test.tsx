import { act, fireEvent, render, screen } from "@testing-library/react";
import { getUserListAction } from "../../auth/actions";
import { useUserStore } from "../../../store/useUserStore";
import FinanceCardApprovalForm from "./FinanceCardApprovalForm";

jest.mock("../../auth/actions", () => ({
    getUserListAction: jest.fn(),
}));

const mockedGetUserListAction = getUserListAction as jest.Mock;

const users = [
    { userId: 1, name: "본인", username: "me" },
    { userId: 2, name: "박서연", username: "seoyeon" },
    { userId: 3, name: "최민호", username: "minho" },
];

describe("FinanceCardApprovalForm", () => {
    beforeEach(() => {
        mockedGetUserListAction.mockResolvedValue({ success: true, message: "조회했습니다.", data: users });
        act(() => {
            useUserStore.setState({ user: { ...useUserStore.getState().user, sub: "1" } });
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("사용 목적을 변경하면 onChangeExpenseCategory를 호출한다", () => {
        const onChangeExpenseCategory = jest.fn();
        render(
            <FinanceCardApprovalForm
                approvers={[]}
                expenseCategory=""
                onChangeExpenseCategory={onChangeExpenseCategory}
                onChangePurpose={jest.fn()}
                purpose=""
            />
        );

        fireEvent.change(screen.getByLabelText("사용 목적"), { target: { value: "식대" } });

        expect(onChangeExpenseCategory).toHaveBeenCalledWith("식대");
    });

    it("사용 사유를 입력하면 onChangePurpose를 호출한다", () => {
        const onChangePurpose = jest.fn();
        render(
            <FinanceCardApprovalForm
                approvers={[]}
                expenseCategory=""
                onChangeExpenseCategory={jest.fn()}
                onChangePurpose={onChangePurpose}
                purpose=""
            />
        );

        fireEvent.change(screen.getByLabelText("사용 사유"), { target: { value: "팀 회식" } });

        expect(onChangePurpose).toHaveBeenCalledWith("팀 회식");
    });

    it("결재자 후보 목록을 실제 구성원 목록에서 조회하며 본인은 제외한다", async () => {
        render(
            <FinanceCardApprovalForm
                approvers={[]}
                expenseCategory=""
                isResubmission
                onChangeExpenseCategory={jest.fn()}
                onChangePurpose={jest.fn()}
                purpose=""
            />
        );

        expect(await screen.findByRole("option", { name: "박서연 (seoyeon)" })).toBeInTheDocument();
        expect(screen.queryByRole("option", { name: "본인 (me)" })).not.toBeInTheDocument();
    });

    it("결재자를 추가하면 최종 승인자로 표시된다", async () => {
        render(
            <FinanceCardApprovalForm
                approvers={[]}
                expenseCategory=""
                isResubmission
                onChangeExpenseCategory={jest.fn()}
                onChangePurpose={jest.fn()}
                purpose=""
            />
        );

        await screen.findByRole("option", { name: "박서연 (seoyeon)" });
        fireEvent.change(screen.getByText("결재자 추가").closest("select")!, { target: { value: "2" } });

        expect(screen.getByText("최종 승인자")).toBeInTheDocument();
        expect(screen.getByText("박서연")).toBeInTheDocument();
    });

    it("두 번째 결재자를 추가하면 첫 번째는 n차 승인자로, 두 번째가 최종 승인자로 바뀐다", async () => {
        render(
            <FinanceCardApprovalForm
                approvers={[]}
                expenseCategory=""
                isResubmission
                onChangeExpenseCategory={jest.fn()}
                onChangePurpose={jest.fn()}
                purpose=""
            />
        );

        await screen.findByRole("option", { name: "박서연 (seoyeon)" });
        fireEvent.change(screen.getByText("결재자 추가").closest("select")!, { target: { value: "2" } });
        fireEvent.change(screen.getByText("결재자 추가").closest("select")!, { target: { value: "3" } });

        expect(screen.getByText("1차 승인자")).toBeInTheDocument();
        expect(screen.getAllByText("최종 승인자")).toHaveLength(1);
        expect(screen.getByText("최민호")).toBeInTheDocument();
    });

    it("결재선에서 승인자를 제거하면 목록에서 사라지고 남은 승인자가 최종 승인자로 갱신된다", async () => {
        render(
            <FinanceCardApprovalForm
                approvers={[]}
                expenseCategory=""
                isResubmission
                onChangeExpenseCategory={jest.fn()}
                onChangePurpose={jest.fn()}
                purpose=""
            />
        );

        await screen.findByRole("option", { name: "박서연 (seoyeon)" });
        fireEvent.change(screen.getByText("결재자 추가").closest("select")!, { target: { value: "2" } });
        fireEvent.change(screen.getByText("결재자 추가").closest("select")!, { target: { value: "3" } });

        fireEvent.click(screen.getByRole("button", { name: "최민호 결재선에서 제거" }));

        expect(screen.queryByText("최민호")).not.toBeInTheDocument();
        expect(screen.getByText("박서연")).toBeInTheDocument();
        expect(screen.getByText("최종 승인자")).toBeInTheDocument();
    });

    it("이미 결재선에 추가된 후보는 선택지에서 비활성화된다", async () => {
        render(
            <FinanceCardApprovalForm
                approvers={[]}
                expenseCategory=""
                isResubmission
                onChangeExpenseCategory={jest.fn()}
                onChangePurpose={jest.fn()}
                purpose=""
            />
        );

        await screen.findByRole("option", { name: "박서연 (seoyeon)" });
        fireEvent.change(screen.getByText("결재자 추가").closest("select")!, { target: { value: "2" } });

        expect(screen.getByRole("option", { name: "박서연 (seoyeon)" })).toBeDisabled();
    });
});
