import { render, screen } from "@testing-library/react";
import StudentLectureItem from "./StudentLectureItem";
import { LectureListItemData } from "@/feature/lecture/type";

const buildLecture = (overrides: Partial<LectureListItemData> = {}): LectureListItemData => ({
    id: 1,
    name: "수학 클리닉",
    classType: "CLASS",
    grade: "MIDDLE_1",
    termName: "2026-1학기",
    subjectName: "수학",
    teacherId: 1,
    teacherName: "김선생",
    classroomCode: "A101",
    classroomName: "A반",
    schedules: [{ dayOfWeek: "MONDAY", startTime: "10:00:00", endTime: "11:00:00" }],
    studentCount: 5,
    ...overrides,
});

describe("StudentLectureItem", () => {
    it("이미 수강 중인 강의이면 '수강 중'을 표시하고 선택할 수 없다", () => {
        render(
            <StudentLectureItem
                enrolledLectureIds={[1]}
                lecture={buildLecture()}
            />,
        );

        expect(screen.getByText("수강 중")).toBeInTheDocument();
        expect(screen.getByRole("radio", { hidden: true })).toBeDisabled();
    });

    it("수강 중이지 않은 강의는 요일과 시간을 표시하고 선택할 수 있다", () => {
        render(
            <StudentLectureItem
                enrolledLectureIds={[]}
                lecture={buildLecture()}
            />,
        );

        expect(screen.getByText("월 10:00-11:00")).toBeInTheDocument();
        expect(screen.getByRole("radio", { hidden: true })).not.toBeDisabled();
    });

    it("시간표가 없는 강의는 '시간 미등록'을 표시한다", () => {
        render(
            <StudentLectureItem
                enrolledLectureIds={[]}
                lecture={buildLecture({ schedules: [] })}
            />,
        );

        expect(screen.getByText("시간 미등록")).toBeInTheDocument();
    });

    it("담당 선생님이 없으면 '담당자 미등록'을 표시한다", () => {
        render(
            <StudentLectureItem
                enrolledLectureIds={[]}
                lecture={buildLecture({ teacherName: null })}
            />,
        );

        expect(screen.getByText(/담당자 미등록/)).toBeInTheDocument();
    });
});
