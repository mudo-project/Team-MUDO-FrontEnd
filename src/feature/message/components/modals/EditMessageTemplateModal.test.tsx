import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { changeMessageTemplateAction } from "../../actions";
import EditMessageTemplateModal from "./EditMessageTemplateModal";
import { toast } from "sonner";

const refresh = jest.fn();

jest.mock("../../actions", () => ({
    changeMessageTemplateAction: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    useRouter: () => ({ refresh }),
}));

jest.mock("sonner", () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

const mockedChangeMessageTemplateAction = changeMessageTemplateAction as jest.MockedFunction<
    typeof changeMessageTemplateAction
>;

describe("EditMessageTemplateModal", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("기존 템플릿 이름과 내용을 입력값 기본값으로 표시한다", () => {
        render(
            <EditMessageTemplateModal
                closeModal={jest.fn()}
                content="오늘 결석하셨습니다."
                name="결석 안내"
                templateId={3}
            />,
        );

        expect(screen.getByDisplayValue("결석 안내")).toBeInTheDocument();
        expect(screen.getByDisplayValue("오늘 결석하셨습니다.")).toBeInTheDocument();
    });

    it("이름과 내용을 수정하고 저장하면 템플릿 수정 액션을 호출하고 성공 시 새로고침한 후 모달을 닫는다", async () => {
        const closeModal = jest.fn();
        mockedChangeMessageTemplateAction.mockResolvedValue({
            success: true,
            message: "문자 템플릿 수정에 성공했습니다.",
        });

        render(
            <EditMessageTemplateModal
                closeModal={closeModal}
                content="오늘 결석하셨습니다."
                name="결석 안내"
                templateId={3}
            />,
        );
        fireEvent.change(screen.getByDisplayValue("결석 안내"), {
            target: { value: "결석 안내 수정" },
        });
        fireEvent.click(screen.getByRole("button", { name: "저장" }));

        // effect가 반영하는 closeModal 호출을 기다린다. mockedChangeMessageTemplateAction
        // 호출 자체는 제출과 동시에 동기적으로 일어나므로, 이를 기다리는 것만으로는
        // 이후 상태 반영(useEffect)이 끝났다고 보장할 수 없다.
        await waitFor(() => {
            expect(closeModal).toHaveBeenCalledTimes(1);
        });
        expect(mockedChangeMessageTemplateAction).toHaveBeenCalledWith(
            3,
            expect.anything(),
            expect.any(FormData),
        );
        expect(toast.success).toHaveBeenCalledWith("문자 템플릿 수정에 성공했습니다.");
        expect(refresh).toHaveBeenCalledTimes(1);
    });

    it("저장이 실패하면 오류 메시지를 노출하고 모달을 유지한다", async () => {
        const closeModal = jest.fn();
        mockedChangeMessageTemplateAction.mockResolvedValue({
            success: false,
            message: "문자 템플릿 수정에 실패했습니다.",
        });

        render(
            <EditMessageTemplateModal
                closeModal={closeModal}
                content="오늘 결석하셨습니다."
                name="결석 안내"
                templateId={3}
            />,
        );
        fireEvent.click(screen.getByRole("button", { name: "저장" }));

        // 실패 시 컴포넌트는 토스트가 아니라 폼 내부 role="alert" 메시지로만 오류를 알린다.
        expect(await screen.findByText("문자 템플릿 수정에 실패했습니다.")).toHaveAttribute(
            "role",
            "alert",
        );
        expect(closeModal).not.toHaveBeenCalled();
    });

    it("닫기 버튼을 클릭하면 닫기 콜백을 호출한다", () => {
        const closeModal = jest.fn();
        render(
            <EditMessageTemplateModal
                closeModal={closeModal}
                content="오늘 결석하셨습니다."
                name="결석 안내"
                templateId={3}
            />,
        );

        fireEvent.click(screen.getByRole("button", { name: "템플릿 수정 모달 닫기" }));

        expect(closeModal).toHaveBeenCalledTimes(1);
    });

    it("취소 버튼을 클릭하면 닫기 콜백을 호출한다", () => {
        const closeModal = jest.fn();
        render(
            <EditMessageTemplateModal
                closeModal={closeModal}
                content="오늘 결석하셨습니다."
                name="결석 안내"
                templateId={3}
            />,
        );

        fireEvent.click(screen.getByRole("button", { name: "취소" }));

        expect(closeModal).toHaveBeenCalledTimes(1);
    });
});
