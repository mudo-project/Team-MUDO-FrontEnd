import { fireEvent, render, screen } from "@testing-library/react";
import MessageTemplateCreateButton from "./MessageTemplateCreateButton";

jest.mock("./modals/CreateMessageTemplateModal", () => {
    return function MockCreateMessageTemplateModal({ closeModal }: { closeModal: () => void }) {
        return (
            <div>
                <p>템플릿 등록 모달</p>
                <button onClick={closeModal} type="button">
                    모달 닫기
                </button>
            </div>
        );
    };
});

describe("MessageTemplateCreateButton", () => {
    it("템플릿 등록 버튼을 클릭하면 등록 모달을 노출한다", () => {
        render(<MessageTemplateCreateButton />);

        expect(screen.queryByText("템플릿 등록 모달")).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "템플릿 등록" }));

        expect(screen.getByText("템플릿 등록 모달")).toBeInTheDocument();
    });

    it("모달의 닫기 콜백을 호출하면 등록 모달이 사라진다", () => {
        render(<MessageTemplateCreateButton />);

        fireEvent.click(screen.getByRole("button", { name: "템플릿 등록" }));
        fireEvent.click(screen.getByRole("button", { name: "모달 닫기" }));

        expect(screen.queryByText("템플릿 등록 모달")).not.toBeInTheDocument();
    });
});
