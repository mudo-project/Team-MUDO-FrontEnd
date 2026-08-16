import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createWorkspaceTaskAction } from "../../actions";
import CreateTaskModal from "./CreateTaskModal";
import { toast } from "sonner";

jest.mock("../../actions", () => ({
    createWorkspaceTaskAction: jest.fn(),
}));

jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
    },
}));

const mockedCreateWorkspaceTaskAction = createWorkspaceTaskAction as jest.MockedFunction<
    typeof createWorkspaceTaskAction
>;

const renderModal = (closeModal = jest.fn()) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });
    queryClient.setQueryData(["workspace", "1"], {
        success: true,
        message: "조회했습니다.",
        data: { workspaceId: 1 },
    });

    render(
        <QueryClientProvider client={queryClient}>
            <CreateTaskModal closeModal={closeModal} workspaceId="1" />
        </QueryClientProvider>,
    );

    return { closeModal, queryClient };
};

const submitTask = () => {
    fireEvent.change(screen.getByLabelText("업무 제목"), {
        target: { value: "신규 업무" },
    });
    fireEvent.change(screen.getByLabelText("기한"), {
        target: { value: "2026-08-20" },
    });
    fireEvent.submit(
        screen.getByRole("button", { name: "업무 등록" }).closest("form")!,
    );
};

describe("CreateTaskModal", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("등록 성공 시 워크스페이스 캐시를 무효화하고 모달을 닫는다", async () => {
        mockedCreateWorkspaceTaskAction.mockResolvedValue({
            success: true,
            message: "업무를 등록했습니다.",
            data: { taskId: 1 },
        });
        const { closeModal, queryClient } = renderModal();

        submitTask();

        await waitFor(() => {
            expect(
                queryClient.getQueryState(["workspace", "1"])?.isInvalidated,
            ).toBe(true);
        });
        expect(closeModal).toHaveBeenCalledTimes(1);
        expect(toast.success).toHaveBeenCalledWith("업무를 등록했습니다.");
    });

    it("등록 실패 시 에러 메시지를 표시하고 모달을 유지한다", async () => {
        mockedCreateWorkspaceTaskAction.mockResolvedValue({
            success: false,
            message: "업무 제목은 1자 이상 200자 이하로 입력해주세요.",
        });
        const { closeModal } = renderModal();

        submitTask();

        expect(
            await screen.findByText("업무 제목은 1자 이상 200자 이하로 입력해주세요."),
        ).toBeInTheDocument();
        expect(closeModal).not.toHaveBeenCalled();
    });

    it("닫기 버튼을 클릭하면 closeModal이 호출된다", () => {
        const { closeModal } = renderModal();

        fireEvent.click(screen.getByLabelText("업무 등록 모달 닫기"));

        expect(closeModal).toHaveBeenCalledTimes(1);
    });
});
