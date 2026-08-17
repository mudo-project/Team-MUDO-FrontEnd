import { render, screen } from "@testing-library/react";
import { LectureListItemData } from "../type";
import LectureList from "./LectureList";

jest.mock("./LectureItem", () => jest.fn(({ lecture }) => (
    <div data-testid={`lecture-item-${lecture.id}`}>{lecture.name}</div>
)));

const buildLecture = (overrides: Partial<LectureListItemData> = {}): LectureListItemData => ({
    id: 1,
    name: "고1 수학",
    classType: "CLASS",
    grade: "HIGH_1",
    termName: "1학기",
    subjectName: "수학",
    teacherId: 1,
    teacherName: "김선생",
    classroomCode: "A101",
    classroomName: "A동 101호",
    schedules: [],
    studentCount: 0,
    ...overrides,
});

describe("LectureList", () => {
    it("강의 목록이 비어있으면 안내 문구를 표시한다", () => {
        render(<LectureList lectures={[]} />);

        expect(screen.getByText("조회된 강의가 없습니다.")).toBeInTheDocument();
    });

    it("강의 목록이 있으면 각 강의 항목을 렌더링한다", () => {
        const lectures = [buildLecture({ id: 1, name: "고1 수학" }), buildLecture({ id: 2, name: "중2 영어" })];

        render(<LectureList lectures={lectures} />);

        expect(screen.queryByText("조회된 강의가 없습니다.")).not.toBeInTheDocument();
        expect(screen.getByTestId("lecture-item-1")).toHaveTextContent("고1 수학");
        expect(screen.getByTestId("lecture-item-2")).toHaveTextContent("중2 영어");
    });
});
