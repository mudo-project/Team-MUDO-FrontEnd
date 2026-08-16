import { fireEvent, render, screen } from "@testing-library/react";
import ApprovalTemplateCreateButton from "./ApprovalTemplateCreateButton";

jest.mock("./modal/CreateApprovalTemplateModal", () => ({
    __esModule: true,
    default: ({ closeModal }: { closeModal: () => void }) => (
        <div>
            템플릿 생성 모달
            <button onClick={closeModal} type="button">
                모달 닫기
            </button>
        </div>
    ),
}));

describe("ApprovalTemplateCreateButton", () => {
    it("템플릿 생성을 클릭하면 템플릿 생성 모달을 연다", () => {
        render(<ApprovalTemplateCreateButton />);

        expect(screen.queryByText("템플릿 생성 모달")).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "템플릿 생성" }));

        expect(screen.getByText("템플릿 생성 모달")).toBeInTheDocument();
    });

    it("모달에서 닫기를 호출하면 모달을 닫는다", () => {
        render(<ApprovalTemplateCreateButton />);

        fireEvent.click(screen.getByRole("button", { name: "템플릿 생성" }));
        fireEvent.click(screen.getByRole("button", { name: "모달 닫기" }));

        expect(screen.queryByText("템플릿 생성 모달")).not.toBeInTheDocument();
    });
});
