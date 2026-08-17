import { fireEvent, render, screen } from "@testing-library/react";
import AddStudentLectureFilter from "./AddStudentLectureFilter";

describe("AddStudentLectureFilter", () => {
    it("학년을 선택하면 선택한 값으로 onChange를 호출한다", () => {
        const handleChange = jest.fn();
        render(
            <AddStudentLectureFilter
                classrooms={[]}
                filters={{}}
                onChange={handleChange}
                subjects={[]}
                teachers={[]}
                terms={[]}
            />,
        );

        fireEvent.change(screen.getByLabelText("학년"), { target: { value: "MIDDLE_1" } });

        expect(handleChange).toHaveBeenCalledWith({ grade: "MIDDLE_1" });
    });

    it("학년을 '전체 학년'으로 되돌리면 필터 값을 undefined로 설정한다", () => {
        const handleChange = jest.fn();
        render(
            <AddStudentLectureFilter
                classrooms={[]}
                filters={{ grade: "MIDDLE_1" }}
                onChange={handleChange}
                subjects={[]}
                teachers={[]}
                terms={[]}
            />,
        );

        fireEvent.change(screen.getByLabelText("학년"), { target: { value: "" } });

        expect(handleChange).toHaveBeenCalledWith({ grade: undefined });
    });

    it("과목을 선택하면 기존 필터를 유지한 채 과목 값을 추가한다", () => {
        const handleChange = jest.fn();
        render(
            <AddStudentLectureFilter
                classrooms={[]}
                filters={{ grade: "MIDDLE_1" }}
                onChange={handleChange}
                subjects={["수학", "영어"]}
                teachers={[]}
                terms={[]}
            />,
        );

        fireEvent.change(screen.getByLabelText("과목"), { target: { value: "수학" } });

        expect(handleChange).toHaveBeenCalledWith({ grade: "MIDDLE_1", subjectName: "수학" });
    });

    it("학기를 선택하면 숫자로 변환하여 onChange를 호출한다", () => {
        const handleChange = jest.fn();
        render(
            <AddStudentLectureFilter
                classrooms={[]}
                filters={{}}
                onChange={handleChange}
                subjects={[]}
                teachers={[]}
                terms={[{ termId: 3, termName: "2026-1학기" }]}
            />,
        );

        fireEvent.change(screen.getByLabelText("학기"), { target: { value: "3" } });

        expect(handleChange).toHaveBeenCalledWith({ termId: 3 });
    });

    it("전달받은 강의실 목록을 옵션으로 표시한다", () => {
        render(
            <AddStudentLectureFilter
                classrooms={["A101", "B202"]}
                filters={{}}
                onChange={jest.fn()}
                subjects={[]}
                teachers={[]}
                terms={[]}
            />,
        );

        expect(screen.getByRole("option", { name: "A101" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "B202" })).toBeInTheDocument();
    });
});
