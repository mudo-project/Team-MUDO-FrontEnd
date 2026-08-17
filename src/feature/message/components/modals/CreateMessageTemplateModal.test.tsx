import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMessageTemplateAction } from "../../actions";
import CreateMessageTemplateModal from "./CreateMessageTemplateModal";
import { toast } from "sonner";

const refresh = jest.fn();

jest.mock("../../actions", () => ({
    createMessageTemplateAction: jest.fn(),
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

const mockedCreateMessageTemplateAction = createMessageTemplateAction as jest.MockedFunction<
    typeof createMessageTemplateAction
>;

const submitForm = () => {
    // 라벨 텍스트 뒤에 aria-hidden 처리된 "*" 표시가 붙어 있어(예: "템플릿 이름 *"),
    // 정확히 일치하는 문자열이 아니라 부분 일치(exact: false)로 조회한다.
    fireEvent.change(screen.getByLabelText("템플릿 이름", { exact: false }), {
        target: { value: "결석 안내" },
    });
    fireEvent.change(screen.getByLabelText("내용", { exact: false }), {
        target: { value: "오늘 결석하셨습니다." },
    });
    // 모달 뒤에 가려진 "템플릿 등록" 트리거 버튼의 접근성 이름에도 "등록"이 부분
    // 문자열로 포함되어 있어 exact: true로 제출 버튼만 특정한다.
    fireEvent.click(screen.getByRole("button", { name: "등록", exact: true }));
};

describe("CreateMessageTemplateModal", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("출결 상태 기본값은 결석으로 선택되어 있다", () => {
        render(<CreateMessageTemplateModal closeModal={jest.fn()} />);

        // 라벨 텍스트 뒤에 aria-hidden 처리된 "*" 표시가 붙어 있어(예: "출결 상태 *"),
        // 정확히 일치하는 문자열이 아니라 부분 일치(exact: false)로 조회한다.
        expect(screen.getByLabelText("출결 상태", { exact: false })).toHaveValue("ABSENT");
    });

    it("이름과 내용을 입력하고 등록하면 템플릿 생성 액션을 호출하고 성공 시 토스트를 노출한 후 모달을 닫는다", async () => {
        const closeModal = jest.fn();
        mockedCreateMessageTemplateAction.mockResolvedValue({
            success: true,
            message: "문자 템플릿을 생성했습니다.",
            data: { templateId: 9 },
        });

        render(<CreateMessageTemplateModal closeModal={closeModal} />);
        submitForm();

        await waitFor(() => {
            expect(closeModal).toHaveBeenCalledTimes(1);
        });
        expect(mockedCreateMessageTemplateAction).toHaveBeenCalledWith(
            expect.anything(),
            expect.any(FormData),
        );
        expect(toast.success).toHaveBeenCalledWith("문자 템플릿을 생성했습니다.");
        expect(refresh).toHaveBeenCalledTimes(1);
    });

    it("생성이 실패하면 오류 메시지를 노출한다", async () => {
        const closeModal = jest.fn();
        mockedCreateMessageTemplateAction.mockResolvedValue({
            success: false,
            message: "템플릿 이름과 문자 내용을 입력해주세요.",
        });

        render(<CreateMessageTemplateModal closeModal={closeModal} />);
        submitForm();

        // 실패 시 컴포넌트는 토스트가 아니라 폼 내부 role="alert" 메시지로만 오류를 알린다.
        expect(
            await screen.findByText("템플릿 이름과 문자 내용을 입력해주세요."),
        ).toHaveAttribute("role", "alert");
        expect(closeModal).not.toHaveBeenCalled();
    });

    it("닫기 버튼을 클릭하면 닫기 콜백을 호출한다", () => {
        const closeModal = jest.fn();
        render(<CreateMessageTemplateModal closeModal={closeModal} />);

        fireEvent.click(screen.getByRole("button", { name: "템플릿 등록 모달 닫기" }));

        expect(closeModal).toHaveBeenCalledTimes(1);
    });

    it("취소 버튼을 클릭하면 닫기 콜백을 호출한다", () => {
        const closeModal = jest.fn();
        render(<CreateMessageTemplateModal closeModal={closeModal} />);

        fireEvent.click(screen.getByRole("button", { name: "취소" }));

        expect(closeModal).toHaveBeenCalledTimes(1);
    });
});
