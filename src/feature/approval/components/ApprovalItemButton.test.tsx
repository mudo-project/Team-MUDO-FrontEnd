import { fireEvent, render, screen } from "@testing-library/react";
import ApprovalItemButton from "./ApprovalItemButton";

jest.mock("./modal/MyApprovalModal", () => ({
    __esModule: true,
    default: ({ id }: { id: number }) => <div>내 결재 모달-{id}</div>,
}));

jest.mock("./modal/ReceivedApprovalModal", () => ({
    __esModule: true,
    default: ({
        id,
        activeModal,
        noneActiveModal,
    }: {
        id: number;
        activeModal: () => void;
        noneActiveModal: () => void;
    }) => (
        <div>
            받은 결재 모달-{id}
            <button onClick={activeModal} type="button">
                승인 트리거
            </button>
            <button onClick={noneActiveModal} type="button">
                반려 트리거
            </button>
        </div>
    ),
}));

jest.mock("./modal/ReceivedReasonModal", () => ({
    __esModule: true,
    default: ({ mode, id }: { mode: string; id: number }) => (
        <div>
            사유 모달-{mode}-{id}
        </div>
    ),
}));

describe("ApprovalItemButton", () => {
    it("type이 my이면 클릭 시 내 결재 모달을 연다", () => {
        render(
            <ApprovalItemButton id={1} type="my">
                항목
            </ApprovalItemButton>,
        );

        fireEvent.click(screen.getByRole("button", { name: "항목" }));

        expect(screen.getByText("내 결재 모달-1")).toBeInTheDocument();
        expect(screen.queryByText("받은 결재 모달-1")).not.toBeInTheDocument();
    });

    it("type이 other이면 클릭 시 받은 결재 모달을 연다", () => {
        render(
            <ApprovalItemButton id={2} type="other">
                항목
            </ApprovalItemButton>,
        );

        fireEvent.click(screen.getByRole("button", { name: "항목" }));

        expect(screen.getByText("받은 결재 모달-2")).toBeInTheDocument();
    });

    it("받은 결재 모달에서 승인을 트리거하면 승인 사유 모달을 연다", () => {
        render(
            <ApprovalItemButton id={2} type="other">
                항목
            </ApprovalItemButton>,
        );

        fireEvent.click(screen.getByRole("button", { name: "항목" }));
        fireEvent.click(screen.getByRole("button", { name: "승인 트리거" }));

        expect(screen.getByText("사유 모달-승인-2")).toBeInTheDocument();
        expect(screen.queryByText("받은 결재 모달-2")).not.toBeInTheDocument();
    });

    it("받은 결재 모달에서 반려를 트리거하면 반려 사유 모달을 연다", () => {
        render(
            <ApprovalItemButton id={2} type="other">
                항목
            </ApprovalItemButton>,
        );

        fireEvent.click(screen.getByRole("button", { name: "항목" }));
        fireEvent.click(screen.getByRole("button", { name: "반려 트리거" }));

        expect(screen.getByText("사유 모달-반려-2")).toBeInTheDocument();
    });
});
