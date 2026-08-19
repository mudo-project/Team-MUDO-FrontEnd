import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { getUserListAction } from "../../../auth/actions";
import { createWorkspaceAction } from "../../actions";
import CreateWorkspaceModal from "./CreateWorkspaceModal";
import { toast } from "sonner";

jest.mock("../../../auth/actions", () => ({
    getUserListAction: jest.fn(),
}));

jest.mock("../../actions", () => ({
    createWorkspaceAction: jest.fn(),
}));

jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
    },
}));

jest.mock("next/navigation", () => ({
    useRouter: () => ({ refresh: jest.fn() }),
}));

const mockedGetUserListAction = getUserListAction as jest.MockedFunction<
    typeof getUserListAction
>;
const mockedCreateWorkspaceAction = createWorkspaceAction as jest.MockedFunction<
    typeof createWorkspaceAction
>;

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
            <CreateWorkspaceModal closeModal={closeModal} />
        </QueryClientProvider>,
    );

    return { closeModal, queryClient };
};

const submitWorkspace = () => {
    fireEvent.change(screen.getByLabelText("워크스페이스 이름"), {
        target: { value: "신규 워크스페이스" },
    });
    fireEvent.submit(
        screen
            .getByRole("button", { name: "워크스페이스 생성" })
            .closest("form")!,
    );
};

describe("CreateWorkspaceModal", () => {
    beforeEach(() => {
        mockedGetUserListAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: [],
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("생성 성공 시 목록 캐시를 무효화하고 모달을 닫는다", async () => {
        mockedCreateWorkspaceAction.mockResolvedValue({
            success: true,
            message: "워크스페이스를 생성했습니다.",
            data: { workspaceId: 10 },
        });
        const { closeModal, queryClient } = renderModal();

        submitWorkspace();

        await waitFor(() => {
            expect(
                queryClient.getQueryState(["workspace-list", "MINE"])
                    ?.isInvalidated,
            ).toBe(true);
        });
        expect(closeModal).toHaveBeenCalledTimes(1);
        expect(toast.success).toHaveBeenCalledWith(
            "워크스페이스를 생성했습니다.",
        );
    });

    it("생성 실패 시 메시지를 표시하고 모달을 유지한다", async () => {
        mockedCreateWorkspaceAction.mockResolvedValue({
            success: false,
            message: "생성에 실패했습니다.",
        });
        const { closeModal } = renderModal();

        submitWorkspace();

        expect(
            await screen.findByText("생성에 실패했습니다."),
        ).toBeInTheDocument();
        expect(closeModal).not.toHaveBeenCalled();
    });

    it("참여자 검색 결과를 모달에 잘리지 않는 최상위 목록으로 표시하고 선택한다", async () => {
        mockedGetUserListAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: [{ userId: 1, name: "김민수", username: "minsu" }],
        });
        const { closeModal } = renderModal();

        fireEvent.focus(screen.getByPlaceholderText("이름으로 검색"));
        fireEvent.click(await screen.findByRole("button", { name: /김민수/ }));

        expect(screen.getByRole("button", { name: "김민수 참여자 제거" })).toBeInTheDocument();
        expect(closeModal).not.toHaveBeenCalled();
    });
});
