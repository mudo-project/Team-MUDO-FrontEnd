import { act, fireEvent, render, screen } from "@testing-library/react";
import MemberSearchInput from "./MemberSearchInput";

const replace = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => ({ replace }),
    useSearchParams: () => new URLSearchParams(),
}));

describe("MemberSearchInput", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.clearAllMocks();
    });

    it("전달받은 keyword를 입력값으로 표시한다", () => {
        render(<MemberSearchInput keyword="김민수" />);

        expect(screen.getByLabelText("이름 또는 역할 검색")).toHaveValue("김민수");
    });

    it("입력값을 변경하면 입력 필드 값을 갱신한다", () => {
        render(<MemberSearchInput keyword="" />);

        fireEvent.change(screen.getByLabelText("이름 또는 역할 검색"), {
            target: { value: "이지은" },
        });

        expect(screen.getByLabelText("이름 또는 역할 검색")).toHaveValue("이지은");
    });

    it("입력 후 500ms가 지나면 검색어를 담아 첫 페이지로 주소를 갱신한다", () => {
        render(<MemberSearchInput keyword="" />);

        fireEvent.change(screen.getByLabelText("이름 또는 역할 검색"), {
            target: { value: "이지은" },
        });

        act(() => {
            jest.advanceTimersByTime(500);
        });

        const params = new URLSearchParams();
        params.set("keyword", "이지은");
        params.set("page", "0");
        expect(replace).toHaveBeenCalledWith(`?${params.toString()}`);
    });

    it("입력값을 모두 지우면 keyword 파라미터를 제거한다", () => {
        render(<MemberSearchInput keyword="이지은" />);

        fireEvent.change(screen.getByLabelText("이름 또는 역할 검색"), {
            target: { value: "" },
        });

        act(() => {
            jest.advanceTimersByTime(500);
        });

        const params = new URLSearchParams();
        params.set("page", "0");
        expect(replace).toHaveBeenCalledWith(`?${params.toString()}`);
    });
});
