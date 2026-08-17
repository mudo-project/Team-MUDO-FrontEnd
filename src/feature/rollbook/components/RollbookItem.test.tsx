import { fireEvent, render, screen } from "@testing-library/react";
import { LectureAttendanceEntryData } from "@/feature/rollbook/type";
import RollbookItem from "./RollbookItem";

const entry: LectureAttendanceEntryData = {
    studentId: 1,
    studentName: "김민수",
    grade: "HIGH_1",
    parentPhone: "010-1111-2222",
    status: "ABSENT",
    note: "병원",
};

describe("RollbookItem", () => {
    it("draft가 없으면 원본 출결 정보를 표시한다", () => {
        render(<RollbookItem entry={entry} onChange={jest.fn()} />);

        expect(screen.getByText("김민수")).toBeInTheDocument();
        expect(screen.getByText("010-1111-2222")).toBeInTheDocument();
        expect(screen.getByText("고1")).toBeInTheDocument();
        expect(screen.getByLabelText("김민수 출결 상태")).toHaveValue("ABSENT");
        expect(screen.getByLabelText("김민수 비고")).toHaveValue("병원");
    });

    it("draft가 있으면 draft 값을 우선 표시한다", () => {
        render(
            <RollbookItem
                draft={{ status: "LATE", note: "지각 사유 있음" }}
                entry={{ ...entry, status: "PRESENT", note: null }}
                onChange={jest.fn()}
            />,
        );

        expect(screen.getByLabelText("김민수 출결 상태")).toHaveValue("LATE");
        expect(screen.getByLabelText("김민수 비고")).toHaveValue("지각 사유 있음");
    });

    it("출결 상태를 변경하면 onChange를 호출한다", () => {
        const handleChange = jest.fn();
        render(<RollbookItem entry={entry} onChange={handleChange} />);

        fireEvent.change(screen.getByLabelText("김민수 출결 상태"), {
            target: { value: "LATE" },
        });

        expect(handleChange).toHaveBeenCalledWith({ status: "LATE" });
    });

    it("출결 상태를 미입력으로 변경하면 null로 onChange를 호출한다", () => {
        const handleChange = jest.fn();
        render(<RollbookItem entry={entry} onChange={handleChange} />);

        fireEvent.change(screen.getByLabelText("김민수 출결 상태"), {
            target: { value: "" },
        });

        expect(handleChange).toHaveBeenCalledWith({ status: null });
    });

    it("비고를 입력하면 onChange를 호출한다", () => {
        const handleChange = jest.fn();
        render(<RollbookItem entry={entry} onChange={handleChange} />);

        fireEvent.change(screen.getByLabelText("김민수 비고"), {
            target: { value: "조퇴" },
        });

        expect(handleChange).toHaveBeenCalledWith({ note: "조퇴" });
    });
});
