import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { getWorkspaceListAction } from "../actions";
import WorkspaceSidebar from "./WorkspaceSidebar";

jest.mock("../actions", () => ({
    getWorkspaceListAction: jest.fn(),
    recordWorkspaceRecentAccessAction: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    usePathname: () => "/workspace/my-works",
    useRouter: () => ({ push: jest.fn() }),
}));

const mockedGetWorkspaceListAction = getWorkspaceListAction as jest.MockedFunction<
    typeof getWorkspaceListAction
>;

const renderSidebar = () => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });

    render(
        <QueryClientProvider client={queryClient}>
            <WorkspaceSidebar />
        </QueryClientProvider>,
    );
};

describe("WorkspaceSidebar", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("조회한 워크스페이스 목록을 표시한다", async () => {
        mockedGetWorkspaceListAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: [
                { workspaceId: 1, name: "운영 워크스페이스", memberCount: 3 },
            ],
        });

        renderSidebar();

        expect(await screen.findByText("운영 워크스페이스")).toBeInTheDocument();
        expect(screen.getByText("참여자 3명")).toBeInTheDocument();
    });

    it("조회한 목록이 비어 있으면 빈 목록 문구를 표시한다", async () => {
        mockedGetWorkspaceListAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: [],
        });

        renderSidebar();

        expect(
            await screen.findByText("생성된 워크스페이스가 없습니다"),
        ).toBeInTheDocument();
    });

    it("Action 조회 실패 메시지를 표시한다", async () => {
        mockedGetWorkspaceListAction.mockResolvedValue({
            success: false,
            message: "조회에 실패했습니다.",
        });

        renderSidebar();

        expect(await screen.findByText("조회에 실패했습니다.")).toBeInTheDocument();
        expect(
            screen.queryByText("생성된 워크스페이스가 없습니다"),
        ).not.toBeInTheDocument();
    });
});
