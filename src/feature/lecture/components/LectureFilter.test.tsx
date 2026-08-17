import { fireEvent, render, screen } from "@testing-library/react";
import { useRouter, useSearchParams } from "next/navigation";
import LectureFilter from "./LectureFilter";

const replace = jest.fn();

jest.mock("next/navigation", () => ({
    usePathname: () => "/lecture",
    useRouter: jest.fn(),
    useSearchParams: jest.fn(),
}));

const mockedUseRouter = useRouter as jest.Mock;
const mockedUseSearchParams = useSearchParams as jest.Mock;

const renderFilter = (search = "") => {
    mockedUseRouter.mockReturnValue({ replace });
    mockedUseSearchParams.mockReturnValue(new URLSearchParams(search));

    return render(
        <LectureFilter
            classrooms={["A101"]}
            subjects={["수학"]}
            teachers={["김선생"]}
            terms={[{ termId: 1, termName: "1학기" }]}
        />,
    );
};

afterEach(() => {
    jest.clearAllMocks();
});

describe("LectureFilter", () => {
    it("학년, 요일, 과목, 선생님, 강의실, 학기 필터를 표시한다", () => {
        renderFilter();

        expect(screen.getByLabelText("학년")).toBeInTheDocument();
        expect(screen.getByLabelText("요일")).toBeInTheDocument();
        expect(screen.getByLabelText("과목")).toBeInTheDocument();
        expect(screen.getByLabelText("선생님")).toBeInTheDocument();
        expect(screen.getByLabelText("강의실")).toBeInTheDocument();
        expect(screen.getByLabelText("학기")).toBeInTheDocument();
    });

    it("학년을 선택하면 grade 파라미터를 포함해 목록을 다시 조회한다", () => {
        renderFilter();

        fireEvent.change(screen.getByLabelText("학년"), { target: { value: "HIGH_1" } });

        expect(replace).toHaveBeenCalledWith("/lecture?grade=HIGH_1");
    });

    it("학기를 선택하면 termId 파라미터를 포함해 목록을 다시 조회한다", () => {
        renderFilter();

        fireEvent.change(screen.getByLabelText("학기"), { target: { value: "1" } });

        expect(replace).toHaveBeenCalledWith("/lecture?termId=1");
    });

    it("필터 값을 비우면 해당 파라미터가 제거된다", () => {
        renderFilter("grade=HIGH_1");

        fireEvent.change(screen.getByLabelText("학년"), { target: { value: "" } });

        expect(replace).toHaveBeenCalledWith("/lecture");
    });

    it("필터를 변경하면 기존 page 파라미터를 제거한다", () => {
        renderFilter("grade=HIGH_1&page=2");

        fireEvent.change(screen.getByLabelText("요일"), { target: { value: "MONDAY" } });

        expect(replace).toHaveBeenCalledWith("/lecture?grade=HIGH_1&dayOfWeek=MONDAY");
    });
});
