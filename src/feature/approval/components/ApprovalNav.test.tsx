import { act, render, screen } from "@testing-library/react";
import ApprovalNav from "./ApprovalNav";
import { useUserStore } from "../../../store/useUserStore";

const mockedUsePathname = jest.fn();

jest.mock("next/navigation", () => ({
    usePathname: () => mockedUsePathname(),
}));

jest.mock("next/link", () => ({
    __esModule: true,
    default: ({
        href,
        children,
        className,
    }: {
        href: string;
        children: React.ReactNode;
        className?: string;
    }) => (
        <a className={className} href={href}>
            {children}
        </a>
    ),
}));

describe("ApprovalNav", () => {
    afterEach(() => {
        act(() => {
            useUserStore.setState({ permissions: [] });
        });
        jest.clearAllMocks();
    });

    it("현재 경로와 일치하면 활성 탭 스타일로 표시한다", () => {
        mockedUsePathname.mockReturnValue("/approval/my");

        render(<ApprovalNav href="/approval/my">내가 신청한 결재</ApprovalNav>);

        expect(screen.getByRole("link", { name: "내가 신청한 결재" })).toHaveClass("border-[#0F172A]");
    });

    it("현재 경로와 일치하지 않으면 비활성 탭 스타일로 표시한다", () => {
        mockedUsePathname.mockReturnValue("/approval/received");

        render(<ApprovalNav href="/approval/my">내가 신청한 결재</ApprovalNav>);

        expect(screen.getByRole("link", { name: "내가 신청한 결재" })).not.toHaveClass("border-[#0F172A]");
    });

    it("전체 조회 권한이 없으면 전체 탭을 숨긴다", () => {
        mockedUsePathname.mockReturnValue("/approval/my");
        act(() => {
            useUserStore.setState({ permissions: [] });
        });

        render(<ApprovalNav href="/approval/all">전체</ApprovalNav>);

        expect(screen.getByRole("link", { name: "전체" })).toHaveClass("hidden");
    });

    it("전체 조회 권한이 있으면 전체 탭을 표시한다", () => {
        mockedUsePathname.mockReturnValue("/approval/my");
        act(() => {
            useUserStore.setState({ permissions: ["APPROVAL:READ_ALL"] });
        });

        render(<ApprovalNav href="/approval/all">전체</ApprovalNav>);

        expect(screen.getByRole("link", { name: "전체" })).toHaveClass("block");
    });

    it("템플릿 관리 권한이 없으면 템플릿 관리 탭을 숨긴다", () => {
        mockedUsePathname.mockReturnValue("/approval/my");
        act(() => {
            useUserStore.setState({ permissions: [] });
        });

        render(<ApprovalNav href="/approval/templates">템플릿 관리</ApprovalNav>);

        expect(screen.getByRole("link", { name: "템플릿 관리" })).toHaveClass("hidden");
    });

    it("템플릿 관리 권한이 있으면 템플릿 관리 탭을 표시한다", () => {
        mockedUsePathname.mockReturnValue("/approval/my");
        act(() => {
            useUserStore.setState({ permissions: ["APPROVAL:TEMPLATE_MANAGE"] });
        });

        render(<ApprovalNav href="/approval/templates">템플릿 관리</ApprovalNav>);

        expect(screen.getByRole("link", { name: "템플릿 관리" })).toHaveClass("block");
    });
});
