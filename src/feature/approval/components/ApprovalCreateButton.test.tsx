import { fireEvent, render, screen } from "@testing-library/react";
import ApprovalCreateButton from "./ApprovalCreateButton";

jest.mock("./modal/CreateApprovalModal", () => ({
    __esModule: true,
    default: ({ closeModal }: { closeModal: () => void }) => (
        <div>
            결재 상신 모달
            <button onClick={closeModal} type="button">
                모달 닫기
            </button>
        </div>
    ),
}));

describe("ApprovalCreateButton", () => {
    it("결재 생성을 클릭하면 결재 상신 모달을 연다", () => {
        render(<ApprovalCreateButton />);

        expect(screen.queryByText("결재 상신 모달")).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "결재 생성" }));

        expect(screen.getByText("결재 상신 모달")).toBeInTheDocument();
    });

    it("모달에서 닫기를 호출하면 모달을 닫는다", () => {
        render(<ApprovalCreateButton />);

        fireEvent.click(screen.getByRole("button", { name: "결재 생성" }));
        fireEvent.click(screen.getByRole("button", { name: "모달 닫기" }));

        expect(screen.queryByText("결재 상신 모달")).not.toBeInTheDocument();
    });
});
