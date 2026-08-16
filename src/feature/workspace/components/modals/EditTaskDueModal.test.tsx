import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createWorkspaceTaskAction } from "../../actions";
import EditTaskDueModal from "./EditTaskDueModal";
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
            <EditTaskDueModal closeModal={closeModal} workspaceId="1" />
        </QueryClientProvider>,
    );

    return { closeModal, queryClient };
};

const submitDueDate = () => {
    fireEvent.change(screen.getByLabelText("기한"), {
        target: { value: "2026-09-01" },
    });
    fireEvent.submit(
        screen.getByRole("button", { name: "업무 상태 변경" }).closest("form")!,
    );
};

describe("EditTaskDueModal", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("변경 성공 시 워크스페이스 캐시를 무효화하고 모달을 닫는다", async () => {
        mockedCreateWorkspaceTaskAction.mockResolvedValue({
            success: true,
            message: "업무 기한을 변경했습니다.",
            data: { taskId: 1 },
        });
        const { closeModal, queryClient } = renderModal();

        submitDueDate();

        await waitFor(() => {
            expect(
                queryClient.getQueryState(["workspace", "1"])?.isInvalidated,
            ).toBe(true);
        });
        expect(closeModal).toHaveBeenCalledTimes(1);
        expect(toast.success).toHaveBeenCalledWith("업무 기한을 변경했습니다.");
    });

    it("변경 실패 시 에러 메시지를 표시하고 모달을 유지한다", async () => {
        mockedCreateWorkspaceTaskAction.mockResolvedValue({
            success: false,
            message: "마감일 형식이 올바르지 않습니다.",
        });
        const { closeModal } = renderModal();

        submitDueDate();

        expect(
            await screen.findByText("마감일 형식이 올바르지 않습니다."),
        ).toBeInTheDocument();
        expect(closeModal).not.toHaveBeenCalled();
    });
});
