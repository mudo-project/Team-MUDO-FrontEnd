import { render, screen } from "@testing-library/react";
import { LectureListItemData } from "@/feature/lecture/type";
import RollLectureList from "./RollLectureList";

jest.mock(
    "./RollLectureItem",
    () =>
        function MockRollLectureItem({ lecture }: { lecture: LectureListItemData }) {
            return <div>{lecture.name}</div>;
        },
);

const baseLecture: LectureListItemData = {
    id: 1,
    name: "강의 A",
    classType: "CLASS",
    grade: "HIGH_1",
    termName: "2026-2학기",
    subjectName: "수학",
    teacherId: 1,
    teacherName: "박선생",
    classroomCode: "A101",
    classroomName: "1강의실",
    schedules: [],
    studentCount: 10,
};

describe("RollLectureList", () => {
    it("강의 목록이 없으면 안내 문구를 노출한다", () => {
        render(<RollLectureList lectures={[]} />);

        expect(screen.getByText("조회된 강의가 없습니다.")).toBeInTheDocument();
    });

    it("강의 목록이 있으면 강의별 컴포넌트를 표시한다", () => {
        const lectures = [baseLecture, { ...baseLecture, id: 2, name: "강의 B" }];

        render(<RollLectureList lectures={lectures} />);

        expect(screen.getByText("강의 A")).toBeInTheDocument();
        expect(screen.getByText("강의 B")).toBeInTheDocument();
        expect(screen.queryByText("조회된 강의가 없습니다.")).not.toBeInTheDocument();
    });
});
