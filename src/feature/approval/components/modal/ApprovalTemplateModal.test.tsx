import { fireEvent, render, screen } from "@testing-library/react";
import { getApprovalTemplateDetailAction } from "../../actions";
import ApprovalTemplateModal from "./ApprovalTemplateModal";

jest.mock("../../actions", () => ({
    getApprovalTemplateDetailAction: jest.fn(),
}));

const mockedGetApprovalTemplateDetailAction = getApprovalTemplateDetailAction as jest.Mock;

const templateDetail = {
    id: 1,
    name: "휴가 신청서",
    createdAt: "2026-08-01T00:00:00.000Z",
    creatorId: 3,
    lines: [
        { stepOrder: 1, approverId: 2, approverName: "김민수" },
        { stepOrder: 2, approverId: 4, approverName: "이지은" },
    ],
};

describe("ApprovalTemplateModal", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("템플릿 상세를 조회해 이름과 결재 라인을 표시한다", async () => {
        mockedGetApprovalTemplateDetailAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: templateDetail,
        });

        render(
            <ApprovalTemplateModal
                activeModal={jest.fn()}
                closeModal={jest.fn()}
                id={1}
                noneActiveModal={jest.fn()}
            />,
        );

        expect(await screen.findByRole("heading", { name: "휴가 신청서" })).toBeInTheDocument();
        expect(screen.getByText("1차 · 김민수")).toBeInTheDocument();
        expect(screen.getByText("2차 · 이지은")).toBeInTheDocument();
    });

    it("삭제를 클릭하면 noneActiveModal을 호출한다", async () => {
        mockedGetApprovalTemplateDetailAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: templateDetail,
        });
        const noneActiveModal = jest.fn();

        render(
            <ApprovalTemplateModal
                activeModal={jest.fn()}
                closeModal={jest.fn()}
                id={1}
                noneActiveModal={noneActiveModal}
            />,
        );

        await screen.findByRole("heading", { name: "휴가 신청서" });
        fireEvent.click(screen.getByRole("button", { name: "삭제" }));

        expect(noneActiveModal).toHaveBeenCalledTimes(1);
    });

    it("수정을 클릭하면 activeModal을 호출한다", async () => {
        mockedGetApprovalTemplateDetailAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: templateDetail,
        });
        const activeModal = jest.fn();

        render(
            <ApprovalTemplateModal
                activeModal={activeModal}
                closeModal={jest.fn()}
                id={1}
                noneActiveModal={jest.fn()}
            />,
        );

        await screen.findByRole("heading", { name: "휴가 신청서" });
        fireEvent.click(screen.getByRole("button", { name: "수정" }));

        expect(activeModal).toHaveBeenCalledTimes(1);
    });
});
