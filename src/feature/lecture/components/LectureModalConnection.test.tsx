import { fireEvent, render, screen } from "@testing-library/react";

import CreateLectureButton from "./CreateLectureButton";
import LectureItem from "./LectureItem";

const lecture = {
    title: "고1 수학 정규반",
    subject: "수학",
    semester: "2026 여름학기",
    type: "정규반",
    grade: "고1",
    teacher: "김선생",
    classroom: "A101",
    schedules: ["월 19:00~21:00"],
    fee: "300,000원",
    feeType: "월정액",
    studentCount: 8,
};

describe("lecture 모달 연결", () => {
    it("강의 등록 버튼으로 등록 모달을 열고 취소 버튼으로 닫는다", () => {
        render(<CreateLectureButton />);

        fireEvent.click(screen.getByRole("button", { name: "강의 등록" }));
        expect(screen.getByRole("heading", { name: "강의 등록" })).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "취소" }));
        expect(screen.queryByRole("heading", { name: "강의 등록" })).not.toBeInTheDocument();
    });

    it("강의 항목으로 상세 모달을 열고 수정 모달로 이동한다", () => {
        render(<LectureItem lecture={lecture} />);

        fireEvent.click(screen.getByRole("button", { name: /고1 수학 정규반/ }));
        expect(screen.getByRole("dialog", { name: "고1 수학 정규반" })).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "수정" }));
        expect(screen.getByRole("heading", { name: "강의 수정" })).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "강의 수정 모달 닫기" }));
        expect(screen.queryByRole("heading", { name: "강의 수정" })).not.toBeInTheDocument();
    });

    it("상세 모달의 삭제 버튼으로 삭제 확인 모달을 열고 닫는다", () => {
        render(<LectureItem lecture={lecture} />);

        fireEvent.click(screen.getByRole("button", { name: /고1 수학 정규반/ }));
        fireEvent.click(screen.getByRole("button", { name: "삭제" }));

        expect(screen.getByRole("heading", { name: "강의 삭제" })).toBeInTheDocument();
        expect(screen.getByText("해당 강의를 삭제하시겠습니까?")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "취소" }));
        expect(screen.queryByRole("heading", { name: "강의 삭제" })).not.toBeInTheDocument();
        expect(screen.getByRole("dialog", { name: "고1 수학 정규반" })).toBeInTheDocument();
    });
});
