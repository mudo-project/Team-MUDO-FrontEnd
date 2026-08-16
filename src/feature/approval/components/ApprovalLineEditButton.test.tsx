import { fireEvent, render, screen } from "@testing-library/react";
import ApprovalLineEditButton from "./ApprovalLineEditButton";
import { ApprovalDetailData } from "../type";

const approval: ApprovalDetailData = {
    id: 1,
    templateId: 1,
    templateName: "휴가 신청",
    title: "휴가 신청서",
    contentType: "TEXT",
    text: "내용",
    attachments: [],
    creatorId: 1,
    creatorName: "김민수",
    status: "IN_PROGRESS",
    createdAt: "2026-08-16T00:00:00.000Z",
    lines: [],
};

jest.mock("./modal/EditApprovalModal", () => ({
    __esModule: true,
    default: ({ closeModal, documentId }: { closeModal: () => void; documentId: number }) => (
        <div>
            결재 라인 수정 모달-{documentId}
            <button onClick={closeModal} type="button">
                모달 닫기
            </button>
        </div>
    ),
}));

describe("ApprovalLineEditButton", () => {
    it("클릭하면 결재라인 수정 모달을 연다", () => {
        render(<ApprovalLineEditButton approval={approval} id={1} />);

        expect(screen.queryByText("결재 라인 수정 모달-1")).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "결재라인 수정" }));

        expect(screen.getByText("결재 라인 수정 모달-1")).toBeInTheDocument();
    });

    it("모달에서 닫기를 호출하면 모달을 닫는다", () => {
        render(<ApprovalLineEditButton approval={approval} id={1} />);

        fireEvent.click(screen.getByRole("button", { name: "결재라인 수정" }));
        fireEvent.click(screen.getByRole("button", { name: "모달 닫기" }));

        expect(screen.queryByText("결재 라인 수정 모달-1")).not.toBeInTheDocument();
    });
});
