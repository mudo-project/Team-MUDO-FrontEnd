import { act, fireEvent, render, screen } from "@testing-library/react";
import { getUserListAction } from "../../auth/actions";
import { useUserStore } from "../../../store/useUserStore";
import ApprovalLineItem from "./ApprovalLineItem";

jest.mock("../../auth/actions", () => ({
    getUserListAction: jest.fn(),
}));

const mockedGetUserListAction = getUserListAction as jest.Mock;

const users = [
    { userId: 1, name: "본인", username: "me" },
    { userId: 2, name: "김민수", username: "minsu" },
    { userId: 3, name: "이지은", username: "jieun" },
];

describe("ApprovalLineItem", () => {
    beforeEach(() => {
        act(() => {
            useUserStore.setState({ user: { ...useUserStore.getState().user, sub: "1" } });
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("구성원 목록을 조회해 결재자 선택지로 표시한다", async () => {
        mockedGetUserListAction.mockResolvedValue({ success: true, message: "조회했습니다.", data: users });

        render(
            <ApprovalLineItem
                changeApprover={jest.fn()}
                line={{ stepOrder: 1, approverId: "" }}
                removeApprovalLine={jest.fn()}
            />,
        );

        expect(await screen.findByRole("option", { name: "김민수 (minsu)" })).toBeInTheDocument();
    });

    it("본인은 결재자로 선택할 수 없다", async () => {
        mockedGetUserListAction.mockResolvedValue({ success: true, message: "조회했습니다.", data: users });

        render(
            <ApprovalLineItem
                changeApprover={jest.fn()}
                line={{ stepOrder: 1, approverId: "" }}
                removeApprovalLine={jest.fn()}
            />,
        );

        expect(await screen.findByRole("option", { name: "본인 (me)" })).toBeDisabled();
    });

    it("이미 선택된 결재자는 다른 라인에서 선택할 수 없다", async () => {
        mockedGetUserListAction.mockResolvedValue({ success: true, message: "조회했습니다.", data: users });

        render(
            <ApprovalLineItem
                changeApprover={jest.fn()}
                line={{ stepOrder: 2, approverId: "" }}
                removeApprovalLine={jest.fn()}
                selectedApproverIds={[2]}
            />,
        );

        expect(await screen.findByRole("option", { name: "김민수 (minsu)" })).toBeDisabled();
        expect(screen.getByRole("option", { name: "이지은 (jieun)" })).toBeEnabled();
    });

    it("결재자를 변경하면 변경 콜백을 호출한다", async () => {
        mockedGetUserListAction.mockResolvedValue({ success: true, message: "조회했습니다.", data: users });
        const changeApprover = jest.fn();

        render(
            <ApprovalLineItem
                changeApprover={changeApprover}
                line={{ stepOrder: 1, approverId: "" }}
                removeApprovalLine={jest.fn()}
            />,
        );

        await screen.findByRole("option", { name: "김민수 (minsu)" });
        fireEvent.change(screen.getByLabelText("1차 결재자"), { target: { value: "2" } });

        expect(changeApprover).toHaveBeenCalledWith(1, 2);
    });

    it("삭제를 클릭하면 삭제 콜백을 호출한다", async () => {
        mockedGetUserListAction.mockResolvedValue({ success: true, message: "조회했습니다.", data: [] });
        const removeApprovalLine = jest.fn();

        render(
            <ApprovalLineItem
                changeApprover={jest.fn()}
                line={{ stepOrder: 1, approverId: "" }}
                removeApprovalLine={removeApprovalLine}
            />,
        );

        await act(async () => {
            await mockedGetUserListAction.mock.results[0].value;
        });

        fireEvent.click(screen.getByRole("button", { name: "1차 결재자 삭제" }));

        expect(removeApprovalLine).toHaveBeenCalledWith(1);
    });
});
