import { fireEvent, render, screen } from "@testing-library/react";
import StudentItem from "./StudentItem";
import { StudentListItemData } from "../type";

jest.mock("./modal/ViewStudentModal", () => function MockViewStudentModal({ studentId }: { studentId: number }) {
    return <div data-testid={`mock-view-student-modal-${studentId}`} />;
});

const student: StudentListItemData = {
    studentId: 1,
    name: "홍길동",
    grade: "MIDDLE_1",
    school: "서울중학교",
    phone: "010-1234-5678",
    parentPhone: "010-2345-6789",
    activeEnrollmentCount: 2,
};

describe("StudentItem", () => {
    it("학생 정보를 표시한다", () => {
        render(<StudentItem index={0} student={student} />);

        expect(screen.getByText("홍길동")).toBeInTheDocument();
        expect(screen.getAllByText("서울중학교")).toHaveLength(2);
        expect(screen.getByText("2개")).toBeInTheDocument();
        expect(
            screen.queryByTestId("mock-view-student-modal-1"),
        ).not.toBeInTheDocument();
    });

    it("항목을 클릭하면 학생 상세 모달을 표시한다", () => {
        render(<StudentItem index={0} student={student} />);

        fireEvent.click(screen.getByTestId("student-list-row-1"));

        expect(screen.getByTestId("mock-view-student-modal-1")).toBeInTheDocument();
    });
});
