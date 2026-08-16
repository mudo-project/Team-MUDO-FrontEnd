import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { decideApprovalAction } from "../../actions";
import ReceivedReasonModal from "./ReceivedReasonModal";
import { toast } from "sonner";

const refresh = jest.fn();

jest.mock("../../actions", () => ({
    decideApprovalAction: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    useRouter: () => ({ refresh }),
}));

jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

const mockedDecideApprovalAction = decideApprovalAction as jest.Mock;

describe("ReceivedReasonModal", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("승인 모드에서 제출하면 승인 결정과 사유를 전달한다", async () => {
        mockedDecideApprovalAction.mockResolvedValue({ success: true, message: "결재를 처리했습니다." });

        render(<ReceivedReasonModal closeModal={jest.fn()} id={5} mode="승인" />);

        fireEvent.change(screen.getByLabelText(/사유/), { target: { value: "승인합니다" } });
        fireEvent.click(screen.getByRole("button", { name: "승인 처리" }));

        await waitFor(() => {
            expect(mockedDecideApprovalAction).toHaveBeenCalledWith(5, {
                decision: "APPROVE",
                comment: "승인합니다",
            });
        });
    });

    it("반려 모드에서 제출하면 반려 결정을 전달한다", async () => {
        mockedDecideApprovalAction.mockResolvedValue({ success: true, message: "결재를 처리했습니다." });

        render(<ReceivedReasonModal closeModal={jest.fn()} id={5} mode="반려" />);

        fireEvent.click(screen.getByRole("button", { name: "반려 처리" }));

        await waitFor(() => {
            expect(mockedDecideApprovalAction).toHaveBeenCalledWith(5, {
                decision: "REJECT",
                comment: "",
            });
        });
    });

    it("처리가 성공하면 성공 메시지를 알리고 모달을 닫은 뒤 새로고침한다", async () => {
        mockedDecideApprovalAction.mockResolvedValue({ success: true, message: "결재를 처리했습니다." });
        const closeModal = jest.fn();

        render(<ReceivedReasonModal closeModal={closeModal} id={5} mode="승인" />);

        fireEvent.click(screen.getByRole("button", { name: "승인 처리" }));

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith("결재를 처리했습니다.");
        });
        expect(closeModal).toHaveBeenCalledTimes(1);
        expect(refresh).toHaveBeenCalledTimes(1);
    });

    it("처리가 실패하면 오류를 알리고 모달을 유지한다", async () => {
        mockedDecideApprovalAction.mockResolvedValue({ success: false, message: "처리에 실패했습니다." });
        const closeModal = jest.fn();

        render(<ReceivedReasonModal closeModal={closeModal} id={5} mode="승인" />);

        fireEvent.click(screen.getByRole("button", { name: "승인 처리" }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("처리에 실패했습니다.");
        });
        expect(closeModal).not.toHaveBeenCalled();
    });

    it("처리 중에는 중복 제출을 막는다", async () => {
        let resolveDecide: (value: { success: boolean; message: string }) => void = () => undefined;
        mockedDecideApprovalAction.mockReturnValue(
            new Promise((resolve) => {
                resolveDecide = resolve;
            }),
        );

        render(<ReceivedReasonModal closeModal={jest.fn()} id={5} mode="승인" />);

        fireEvent.click(screen.getByRole("button", { name: "승인 처리" }));

        const pendingButton = await screen.findByRole("button", { name: "처리 중..." });
        expect(pendingButton).toBeDisabled();

        await act(async () => {
            resolveDecide({ success: true, message: "결재를 처리했습니다." });
        });
    });
});
