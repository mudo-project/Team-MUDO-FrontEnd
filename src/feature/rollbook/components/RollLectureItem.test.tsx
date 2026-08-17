import { fireEvent, render, screen } from "@testing-library/react";
import { LectureListItemData } from "@/feature/lecture/type";
import RollLectureItem from "./RollLectureItem";

jest.mock(
    "./modals/ViewRollbookModal",
    () =>
        function MockViewRollbookModal({
            closeModal,
            lectureId,
        }: {
            closeModal: () => void;
            lectureId: number;
        }) {
            return (
                <div>
                    <span>출석 현황 모달 {lectureId}</span>
                    <button onClick={closeModal} type="button">
                        모달 닫기
                    </button>
                </div>
            );
        },
);

const lecture: LectureListItemData = {
    id: 7,
    name: "API 수학 정규반",
    classType: "CLASS",
    grade: "HIGH_1",
    termName: "2026-2학기",
    subjectName: "수학",
    teacherId: 1,
    teacherName: "박선생",
    classroomCode: "A101",
    classroomName: "1강의실",
    schedules: [{ dayOfWeek: "MONDAY", startTime: "18:00", endTime: "20:00" }],
    studentCount: 12,
};

describe("RollLectureItem", () => {
    it("강의 정보를 표시한다", () => {
        render(<RollLectureItem lecture={lecture} />);

        expect(screen.getByText("API 수학 정규반")).toBeInTheDocument();
        expect(screen.getByText("수학 · 2026-2학기")).toBeInTheDocument();
        expect(screen.getByText("정규반")).toBeInTheDocument();
        expect(screen.getByText("고1")).toBeInTheDocument();
        expect(screen.getByText("박선생")).toBeInTheDocument();
        expect(screen.getByText("12")).toBeInTheDocument();
    });

    it("강의를 클릭하면 출석 현황 모달을 연다", () => {
        render(<RollLectureItem lecture={lecture} />);

        expect(screen.queryByText("출석 현황 모달 7")).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: /API 수학 정규반/ }));

        expect(screen.getByText("출석 현황 모달 7")).toBeInTheDocument();
    });

    it("모달을 닫으면 모달이 사라진다", () => {
        render(<RollLectureItem lecture={lecture} />);

        fireEvent.click(screen.getByRole("button", { name: /API 수학 정규반/ }));
        fireEvent.click(screen.getByRole("button", { name: "모달 닫기" }));

        expect(screen.queryByText("출석 현황 모달 7")).not.toBeInTheDocument();
    });
});
