import { render, screen } from "@testing-library/react";
import PaginationPrev from "./PaginationPrev";

describe("PaginationPrev", () => {
    it("페이지 값이 없으면 0페이지를 기준으로 링크를 만든다", () => {
        render(<PaginationPrev hasNext page={undefined} url="members" />);

        expect(screen.getByRole("link", { name: "이전" })).toHaveAttribute("href", "/members?page=0");
        expect(screen.getByRole("link", { name: "다음" })).toHaveAttribute("href", "/members?page=1");
    });

    it("페이지를 이동해도 기존 검색 조건을 유지한다", () => {
        render(
            <PaginationPrev
                hasNext
                page="2"
                searchParams={{ keyword: "김민수", roleId: "3" }}
                url="members"
            />,
        );

        expect(screen.getByRole("link", { name: "이전" })).toHaveAttribute(
            "href",
            "/members?keyword=%EA%B9%80%EB%AF%BC%EC%88%98&roleId=3&page=1",
        );
        expect(screen.getByRole("link", { name: "다음" })).toHaveAttribute(
            "href",
            "/members?keyword=%EA%B9%80%EB%AF%BC%EC%88%98&roleId=3&page=3",
        );
    });
});
