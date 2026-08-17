import { fireEvent, render, screen } from "@testing-library/react";
import StudentUpdateButton from "./StudentUpdateButton";
import { StudentDetailData } from "../type";

jest.mock("./modal/UpdateStudentModal", () => function MockUpdateStudentModal() {
    return <div data-testid="mock-update-student-modal" />;
});

const student: StudentDetailData = {
    studentId: 1,
    name: "홍길동",
    grade: "MIDDLE_1",
    school: "서울중학교",
    phone: "010-1234-5678",
    parentPhone: "010-2345-6789",
    note: null,
    createdAt: "2026-08-01",
    updatedAt: "2026-08-01",
    enrollments: [],
};

describe("StudentUpdateButton", () => {
    it("버튼을 클릭하면 학생 정보 수정 모달을 표시한다", () => {
        render(
            <StudentUpdateButton
                refreshStudent={jest.fn()}
                student={student}
                studentId={1}
            />,
        );

        expect(screen.queryByTestId("mock-update-student-modal")).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "학생 수정" }));

        expect(screen.getByTestId("mock-update-student-modal")).toBeInTheDocument();
    });

    it("student 정보가 없으면 버튼을 클릭해도 모달을 표시하지 않는다", () => {
        render(
            <StudentUpdateButton
                refreshStudent={jest.fn()}
                student={undefined}
                studentId={1}
            />,
        );

        fireEvent.click(screen.getByRole("button", { name: "학생 수정" }));

        expect(screen.queryByTestId("mock-update-student-modal")).not.toBeInTheDocument();
    });
});
