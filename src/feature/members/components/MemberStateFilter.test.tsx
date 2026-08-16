import { render, screen } from "@testing-library/react";
import MemberStateFilter from "./MemberStateFilter";

describe("MemberStateFilter", () => {
    it("state가 all이면 전체 탭을 활성 표시한다", () => {
        render(<MemberStateFilter state="all" />);

        expect(screen.getByRole("link", { name: "전체" })).toHaveClass("bg-white");
        expect(screen.getByRole("link", { name: "재직" })).not.toHaveClass("bg-white");
        expect(screen.getByRole("link", { name: "비활성" })).not.toHaveClass("bg-white");
    });

    it("state가 employ이면 재직 탭을 활성 표시한다", () => {
        render(<MemberStateFilter state="employ" />);

        expect(screen.getByRole("link", { name: "재직" })).toHaveClass("bg-white");
        expect(screen.getByRole("link", { name: "전체" })).not.toHaveClass("bg-white");
    });

    it("state가 unemploy이면 비활성 탭을 활성 표시한다", () => {
        render(<MemberStateFilter state="unemploy" />);

        expect(screen.getByRole("link", { name: "비활성" })).toHaveClass("bg-white");
        expect(screen.getByRole("link", { name: "전체" })).not.toHaveClass("bg-white");
    });

    it("각 탭은 해당 상태로 이동하는 경로를 제공한다", () => {
        render(<MemberStateFilter state="all" />);

        expect(screen.getByRole("link", { name: "전체" })).toHaveAttribute(
            "href",
            "/members?state=all",
        );
        expect(screen.getByRole("link", { name: "재직" })).toHaveAttribute(
            "href",
            "/members?state=employ",
        );
        expect(screen.getByRole("link", { name: "비활성" })).toHaveAttribute(
            "href",
            "/members?state=unemploy",
        );
    });
});
