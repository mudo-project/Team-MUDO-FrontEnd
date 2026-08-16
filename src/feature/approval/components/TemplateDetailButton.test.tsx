import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { deleteApprovalTemplateAction } from "../actions";
import TemplateDetailButton from "./TemplateDetailButton";
import { toast } from "sonner";

const refresh = jest.fn();

jest.mock("../actions", () => ({
    deleteApprovalTemplateAction: jest.fn(),
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

jest.mock("./modal/ApprovalTemplateModal", () => ({
    __esModule: true,
    default: ({
        activeModal,
        noneActiveModal,
    }: {
        activeModal: () => void;
        noneActiveModal: () => void;
    }) => (
        <div>
            템플릿 상세 모달
            <button onClick={activeModal} type="button">
                수정 트리거
            </button>
            <button onClick={noneActiveModal} type="button">
                삭제 트리거
            </button>
        </div>
    ),
}));

jest.mock("./modal/EditApprovalTemplateModal", () => ({
    __esModule: true,
    default: () => <div>템플릿 수정 모달</div>,
}));

const mockedDeleteApprovalTemplateAction = deleteApprovalTemplateAction as jest.Mock;

describe("TemplateDetailButton", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("클릭하면 템플릿 상세 모달을 연다", () => {
        render(<TemplateDetailButton id={1}>템플릿 항목</TemplateDetailButton>);

        fireEvent.click(screen.getByRole("button", { name: "템플릿 항목" }));

        expect(screen.getByText("템플릿 상세 모달")).toBeInTheDocument();
    });

    it("수정을 클릭하면 상세 모달을 닫고 수정 모달을 연다", () => {
        render(<TemplateDetailButton id={1}>템플릿 항목</TemplateDetailButton>);

        fireEvent.click(screen.getByRole("button", { name: "템플릿 항목" }));
        fireEvent.click(screen.getByRole("button", { name: "수정 트리거" }));

        expect(screen.getByText("템플릿 수정 모달")).toBeInTheDocument();
        expect(screen.queryByText("템플릿 상세 모달")).not.toBeInTheDocument();
    });

    it("삭제를 클릭하고 확인하면 삭제에 성공해 목록을 새로고침한다", async () => {
        mockedDeleteApprovalTemplateAction.mockResolvedValue({
            success: true,
            message: "템플릿을 삭제했습니다.",
        });

        render(<TemplateDetailButton id={1}>템플릿 항목</TemplateDetailButton>);

        fireEvent.click(screen.getByRole("button", { name: "템플릿 항목" }));
        fireEvent.click(screen.getByRole("button", { name: "삭제 트리거" }));
        fireEvent.click(screen.getByRole("button", { name: "확인" }));

        await waitFor(() => {
            expect(mockedDeleteApprovalTemplateAction).toHaveBeenCalledWith(1);
        });
        expect(toast.success).toHaveBeenCalledWith("템플릿을 삭제했습니다.");
        expect(refresh).toHaveBeenCalledTimes(1);
        expect(screen.queryByText("삭제하시겠습니까?")).not.toBeInTheDocument();
    });

    it("삭제에 실패하면 오류를 알리고 확인 모달을 닫는다", async () => {
        mockedDeleteApprovalTemplateAction.mockResolvedValue({
            success: false,
            message: "삭제에 실패했습니다.",
        });

        render(<TemplateDetailButton id={1}>템플릿 항목</TemplateDetailButton>);

        fireEvent.click(screen.getByRole("button", { name: "템플릿 항목" }));
        fireEvent.click(screen.getByRole("button", { name: "삭제 트리거" }));
        fireEvent.click(screen.getByRole("button", { name: "확인" }));

        // 확인 클릭 시 확인 모달은 삭제 성공 여부와 무관하게 즉시 닫힌다.
        expect(screen.queryByText("삭제하시겠습니까?")).not.toBeInTheDocument();

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("삭제에 실패했습니다.");
        });
        expect(refresh).not.toHaveBeenCalled();
    });
});
