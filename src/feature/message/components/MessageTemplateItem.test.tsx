import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { deleteMessageTemplateAction } from "../actions";
import { MessageTemplateData } from "../type";
import MessageTemplateItem from "./MessageTemplateItem";
import { toast } from "sonner";

const refresh = jest.fn();

jest.mock("../actions", () => ({
    deleteMessageTemplateAction: jest.fn(),
}));

jest.mock("./modals/EditMessageTemplateModal", () => {
    return function MockEditMessageTemplateModal({ closeModal }: { closeModal: () => void }) {
        return (
            <div>
                <p>템플릿 수정 모달</p>
                <button onClick={closeModal} type="button">
                    수정 모달 닫기
                </button>
            </div>
        );
    };
});

jest.mock("next/navigation", () => ({
    useRouter: () => ({ refresh }),
}));

jest.mock("sonner", () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

const mockedDeleteMessageTemplateAction = deleteMessageTemplateAction as jest.MockedFunction<
    typeof deleteMessageTemplateAction
>;

const template: MessageTemplateData = {
    id: 1,
    name: "결석 안내",
    status: "ABSENT",
    content: "오늘 결석하셨습니다.",
    createdAt: "2026-01-05T12:00:00.000Z",
    updatedAt: "2026-01-10T12:00:00.000Z",
};

describe("MessageTemplateItem", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("템플릿 이름, 출결 상태, 내용과 날짜를 표시한다", () => {
        render(<MessageTemplateItem template={template} />);

        expect(screen.getByRole("heading", { name: "결석 안내" })).toBeInTheDocument();
        expect(screen.getByText("결석")).toBeInTheDocument();
        expect(screen.getByText("오늘 결석하셨습니다.")).toBeInTheDocument();
        expect(screen.getByText("수정 2026-01-10")).toBeInTheDocument();
        expect(screen.getByText("생성 2026-01-05")).toBeInTheDocument();
    });

    it("수정 버튼을 클릭하면 수정 모달을 노출한다", () => {
        render(<MessageTemplateItem template={template} />);

        fireEvent.click(screen.getByRole("button", { name: "결석 안내 수정" }));

        expect(screen.getByText("템플릿 수정 모달")).toBeInTheDocument();
    });

    it("삭제 버튼을 클릭하면 삭제 확인 모달을 노출한다", () => {
        render(<MessageTemplateItem template={template} />);

        fireEvent.click(screen.getByRole("button", { name: "결석 안내 삭제" }));

        expect(screen.getByRole("heading", { name: "템플릿 삭제" })).toBeInTheDocument();
        expect(screen.getByText("삭제하시겠습니까?")).toBeInTheDocument();
    });

    it("삭제를 확인하면 삭제 액션을 호출하고 성공하면 토스트를 노출한 후 새로고침한다", async () => {
        mockedDeleteMessageTemplateAction.mockResolvedValue({
            success: true,
            message: "문자 템플릿 삭제에 성공했습니다.",
        });

        render(<MessageTemplateItem template={template} />);

        fireEvent.click(screen.getByRole("button", { name: "결석 안내 삭제" }));
        fireEvent.click(screen.getByRole("button", { name: "확인" }));

        // 삭제 액션 호출 자체는 클릭과 동시에 동기적으로 일어나므로, 이를 기다리는
        // 것만으로는 응답 반영 완료를 보장할 수 없다. refresh 호출을 기준으로 기다린다.
        await waitFor(() => {
            expect(refresh).toHaveBeenCalledTimes(1);
        });
        expect(mockedDeleteMessageTemplateAction).toHaveBeenCalledWith(1);
        expect(toast.success).toHaveBeenCalledWith("문자 템플릿 삭제에 성공했습니다.");
    });

    it("삭제가 실패하면 오류 토스트를 노출하고 확인 모달을 유지한다", async () => {
        mockedDeleteMessageTemplateAction.mockResolvedValue({
            success: false,
            message: "문자 템플릿 삭제에 실패했습니다.",
        });

        render(<MessageTemplateItem template={template} />);

        fireEvent.click(screen.getByRole("button", { name: "결석 안내 삭제" }));
        fireEvent.click(screen.getByRole("button", { name: "확인" }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("문자 템플릿 삭제에 실패했습니다.");
        });
        expect(refresh).not.toHaveBeenCalled();
        expect(screen.getByRole("heading", { name: "템플릿 삭제" })).toBeInTheDocument();
    });
});
