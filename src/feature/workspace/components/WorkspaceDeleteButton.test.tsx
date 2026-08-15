import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { deleteWorkspaceAction } from "../actions";
import WorkspaceDeleteButton from "./WorkspaceDeleteButton";
import { toast } from "sonner";

const replace = jest.fn();

jest.mock("../actions", () => ({
    deleteWorkspaceAction: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    useRouter: () => ({ replace }),
}));

jest.mock("sonner", () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

const mockedDeleteWorkspaceAction =
    deleteWorkspaceAction as jest.MockedFunction<
        typeof deleteWorkspaceAction
    >;

const renderDeleteButton = () => {
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
    queryClient.setQueryData(["workspace-list", "MINE"], {
        success: true,
        message: "조회했습니다.",
        data: [],
    });

    render(
        <QueryClientProvider client={queryClient}>
            <WorkspaceDeleteButton workspaceId="1" />
        </QueryClientProvider>,
    );

    return queryClient;
};

const confirmDelete = () => {
    fireEvent.click(screen.getByRole("button", { name: "워크스페이스 삭제" }));
    fireEvent.click(screen.getByRole("button", { name: "확인" }));
};

describe("WorkspaceDeleteButton", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("삭제 성공 시 캐시를 정리하고 내 업무 화면으로 이동한다", async () => {
        mockedDeleteWorkspaceAction.mockResolvedValue({
            success: true,
            message: "워크스페이스를 삭제했습니다.",
        });
        const queryClient = renderDeleteButton();

        confirmDelete();

        await waitFor(() => {
            expect(
                queryClient.getQueryData(["workspace", "1"]),
            ).toBeUndefined();
            expect(
                queryClient.getQueryState(["workspace-list", "MINE"])
                    ?.isInvalidated,
            ).toBe(true);
        });
        expect(replace).toHaveBeenCalledWith("/workspace/my-works");
        expect(toast.success).toHaveBeenCalledWith(
            "워크스페이스를 삭제했습니다.",
        );
    });

    it("삭제 실패 시 오류를 알리고 확인 모달을 유지한다", async () => {
        mockedDeleteWorkspaceAction.mockResolvedValue({
            success: false,
            message: "삭제에 실패했습니다.",
        });
        renderDeleteButton();

        confirmDelete();

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("삭제에 실패했습니다.");
        });
        expect(screen.getByText("삭제하시겠습니까?")).toBeInTheDocument();
        expect(replace).not.toHaveBeenCalled();
    });

    it("삭제 요청 중에는 확인 버튼의 중복 실행을 막는다", async () => {
        let resolveDelete: (
            result: Awaited<ReturnType<typeof deleteWorkspaceAction>>,
        ) => void = () => undefined;
        mockedDeleteWorkspaceAction.mockReturnValue(
            new Promise((resolve) => {
                resolveDelete = resolve;
            }),
        );
        renderDeleteButton();

        confirmDelete();

        const pendingButton = await screen.findByRole("button", {
            name: "처리 중...",
        });
        expect(pendingButton).toBeDisabled();

        await act(async () => {
            resolveDelete({
                success: true,
                message: "워크스페이스를 삭제했습니다.",
            });
        });
        await waitFor(() => {
            expect(screen.queryByText("삭제하시겠습니까?")).not.toBeInTheDocument();
        });
    });
});
