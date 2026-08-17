import { fireEvent, render, screen } from "@testing-library/react";
import { LectureDetailData } from "../type";
import LectureUpdateButton from "./LectureUpdateButton";

jest.mock("./modal/EditLectureModal", () => jest.fn((props) => (
    <div data-testid="edit-lecture-modal-stub">{props.lecture.name}</div>
)));

const baseLecture: LectureDetailData = {
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
    feeType: "PER_MONTH",
    feeAmount: 300000,
    schedules: [],
    students: [],
    createdAt: "2026-01-01T00:00:00",
};

describe("LectureUpdateButton", () => {
    it("초기 렌더링에는 수정 모달을 표시하지 않는다", () => {
        render(<LectureUpdateButton lecture={baseLecture} lectureId={1} onUpdated={jest.fn()} />);

        expect(screen.queryByTestId("edit-lecture-modal-stub")).not.toBeInTheDocument();
    });

    it("수정 버튼을 클릭하면 강의 정보를 담아 수정 모달을 연다", () => {
        render(<LectureUpdateButton lecture={baseLecture} lectureId={1} onUpdated={jest.fn()} />);

        fireEvent.click(screen.getByLabelText("강의 수정"));

        expect(screen.getByTestId("edit-lecture-modal-stub")).toHaveTextContent("고1 수학 정규반");
    });
});
