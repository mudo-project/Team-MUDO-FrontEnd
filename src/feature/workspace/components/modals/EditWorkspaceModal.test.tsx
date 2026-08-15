import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
    changeWorkspaceNameAction,
    getWorkspaceDetailAction,
} from "../../actions";
import EditWorkspaceModal from "./EditWorkspaceModal";
import { toast } from "sonner";

jest.mock("../../actions", () => ({
    changeWorkspaceNameAction: jest.fn(),
    getWorkspaceDetailAction: jest.fn(),
}));

jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
    },
}));

jest.mock("next/navigation", () => ({
    useRouter: () => ({ refresh: jest.fn() }),
}));

const mockedGetWorkspaceDetailAction =
    getWorkspaceDetailAction as jest.MockedFunction<
        typeof getWorkspaceDetailAction
    >;
const mockedChangeWorkspaceNameAction =
    changeWorkspaceNameAction as jest.MockedFunction<
        typeof changeWorkspaceNameAction
    >;

const workspaceDetailResult = {
    success: true as const,
    message: "조회했습니다.",
    data: {
        workspaceId: 1,
        name: "기존 워크스페이스",
        memberCount: 0,
        members: [],
        taskCount: 0,
        tasks: [],
    },
};

const renderModal = (closeModal = jest.fn()) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });
    queryClient.setQueryData(["workspace-list", "MINE"], {
        success: true,
        message: "조회했습니다.",
        data: [],
    });

    render(
        <QueryClientProvider client={queryClient}>
            <EditWorkspaceModal closeModal={closeModal} workspaceId="1" />
        </QueryClientProvider>,
    );

    return { closeModal, queryClient };
};

const submitChangedName = async () => {
    const input = await screen.findByDisplayValue("기존 워크스페이스");
    fireEvent.change(input, { target: { value: "변경된 워크스페이스" } });
    fireEvent.submit(
        screen
            .getByRole("button", { name: "워크스페이스 수정" })
            .closest("form")!,
    );
};

describe("EditWorkspaceModal", () => {
    beforeEach(() => {
        mockedGetWorkspaceDetailAction.mockResolvedValue(workspaceDetailResult);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("조회한 워크스페이스 이름을 입력에 표시한다", async () => {
        renderModal();

        expect(await screen.findByDisplayValue("기존 워크스페이스")).toBeInTheDocument();
    });

    it("수정 성공 시 상세와 목록 캐시를 갱신하고 모달을 닫는다", async () => {
        mockedChangeWorkspaceNameAction.mockResolvedValue({
            success: true,
            message: "워크스페이스 이름을 수정했습니다.",
            data: { workspaceId: 1, name: "변경된 워크스페이스" },
        });
        const { closeModal, queryClient } = renderModal();

        await submitChangedName();

        await waitFor(() => {
            expect(
                queryClient.getQueryState(["workspace-list", "MINE"])
                    ?.isInvalidated,
            ).toBe(true);
        });
        expect(mockedGetWorkspaceDetailAction).toHaveBeenCalledTimes(2);
        expect(closeModal).toHaveBeenCalledTimes(1);
        expect(toast.success).toHaveBeenCalledWith(
            "워크스페이스 이름을 수정했습니다.",
        );
    });

    it("수정 실패 시 오류를 표시하고 모달을 유지한다", async () => {
        mockedChangeWorkspaceNameAction.mockResolvedValue({
            success: false,
            message: "이름 수정에 실패했습니다.",
        });
        const { closeModal } = renderModal();

        await submitChangedName();

        expect(
            await screen.findByText("이름 수정에 실패했습니다."),
        ).toHaveAttribute("role", "alert");
        expect(closeModal).not.toHaveBeenCalled();
    });
});
