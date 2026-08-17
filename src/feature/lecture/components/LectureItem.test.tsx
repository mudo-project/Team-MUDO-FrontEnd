import { fireEvent, render, screen } from "@testing-library/react";
import { LectureListItemData } from "../type";
import LectureItem from "./LectureItem";

jest.mock("./modal/ViewLectureModal", () => jest.fn(() => <div data-testid="view-lecture-modal-stub" />));

const baseLecture: LectureListItemData = {
    id: 1,
    name: "고1 수학 정규반",
    classType: "CLASS",
    grade: "HIGH_1",
    termName: "1학기",
    subjectName: "수학",
    teacherId: 1,
    teacherName: "김선생",
    classroomCode: "A101",
    classroomName: "A동 101호",
    schedules: [{ dayOfWeek: "MONDAY", startTime: "09:00:00", endTime: "10:00:00" }],
    studentCount: 12,
};

describe("LectureItem", () => {
    it("강의 정보를 표시한다", () => {
        render(<LectureItem lecture={baseLecture} />);
        const item = screen.getByRole("button");

        expect(item).toHaveTextContent("고1 수학 정규반");
        expect(item).toHaveTextContent("수학 · 1학기");
        expect(item).toHaveTextContent("정규반");
        expect(item).toHaveTextContent("고1");
        expect(item).toHaveTextContent("김선생");
        expect(item).toHaveTextContent("A동 101호");
        expect(item).toHaveTextContent("09:00:00~10:00:00");
        expect(item).toHaveTextContent("12명");
    });

    it("학년, 담당 선생님, 과목·학기 정보가 없으면 기본값을 표시한다", () => {
        render(
            <LectureItem
                lecture={{
                    ...baseLecture,
                    grade: null,
                    teacherName: null,
                    subjectName: null,
                    termName: null,
                    classroomName: "",
                }}
            />,
        );
        const item = screen.getByRole("button");

        expect(item).toHaveTextContent("- · -");
        expect(item).toHaveTextContent("A101");
    });

    it("강의 항목을 클릭하면 상세 조회 모달이 열린다", () => {
        render(<LectureItem lecture={baseLecture} />);

        expect(screen.queryByTestId("view-lecture-modal-stub")).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole("button"));

        expect(screen.getByTestId("view-lecture-modal-stub")).toBeInTheDocument();
    });
});
