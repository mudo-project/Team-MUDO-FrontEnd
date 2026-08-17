import { render, screen } from "@testing-library/react";
import StudentList from "./StudentList";
import { StudentListItemData } from "../type";

const buildStudent = (overrides: Partial<StudentListItemData> = {}): StudentListItemData => ({
    studentId: 1,
    name: "홍길동",
    grade: "MIDDLE_1",
    school: "서울중학교",
    phone: "010-1234-5678",
    parentPhone: "010-2345-6789",
    activeEnrollmentCount: 1,
    ...overrides,
});

describe("StudentList", () => {
    it("학생 목록이 비어있으면 안내 문구를 표시한다", () => {
        render(<StudentList students={[]} />);

        expect(screen.getByText("등록된 원생이 없습니다.")).toBeInTheDocument();
    });

    it("학생 목록이 있으면 각 학생 정보를 표시한다", () => {
        render(
            <StudentList
                students={[
                    buildStudent({ studentId: 1, name: "홍길동" }),
                    buildStudent({ studentId: 2, name: "김철수" }),
                ]}
            />,
        );

        expect(screen.getByText("홍길동")).toBeInTheDocument();
        expect(screen.getByText("김철수")).toBeInTheDocument();
        expect(screen.queryByText("등록된 원생이 없습니다.")).not.toBeInTheDocument();
    });
});
