import { fireEvent, render, screen } from "@testing-library/react";
import { LectureScheduleData } from "../type";
import LectureScheduleFields from "./LectureScheduleFields";

describe("LectureScheduleFields", () => {
    it("초기 렌더링 시 시간표를 한 줄 표시하고 삭제 버튼은 비활성화된다", () => {
        render(<LectureScheduleFields />);

        expect(screen.getAllByLabelText("수업 요일")).toHaveLength(1);
        expect(screen.getByLabelText("수업 요일")).toHaveValue("MONDAY");
        expect(screen.getByLabelText("시간표 삭제")).toBeDisabled();
    });

    it("시간표 추가 버튼을 클릭하면 시간표 행이 추가된다", () => {
        render(<LectureScheduleFields />);

        fireEvent.click(screen.getByRole("button", { name: "시간표 추가" }));

        expect(screen.getAllByLabelText("수업 요일")).toHaveLength(2);
        screen.getAllByLabelText("시간표 삭제").forEach((button) => expect(button).not.toBeDisabled());
    });

    it("시간표가 2개 이상이면 삭제 버튼으로 특정 행을 제거할 수 있다", () => {
        render(<LectureScheduleFields />);

        fireEvent.click(screen.getByRole("button", { name: "시간표 추가" }));
        expect(screen.getAllByLabelText("수업 요일")).toHaveLength(2);

        fireEvent.click(screen.getAllByLabelText("시간표 삭제")[0]);

        expect(screen.getAllByLabelText("수업 요일")).toHaveLength(1);
        expect(screen.getByLabelText("시간표 삭제")).toBeDisabled();
    });

    it("요일, 시작 시간, 종료 시간을 변경할 수 있다", () => {
        render(<LectureScheduleFields />);

        fireEvent.change(screen.getByLabelText("수업 요일"), { target: { value: "FRIDAY" } });
        fireEvent.change(screen.getByLabelText("수업 시작 시간"), { target: { value: "09:00" } });
        fireEvent.change(screen.getByLabelText("수업 종료 시간"), { target: { value: "10:30" } });

        expect(screen.getByLabelText("수업 요일")).toHaveValue("FRIDAY");
        expect(screen.getByLabelText("수업 시작 시간")).toHaveValue("09:00");
        expect(screen.getByLabelText("수업 종료 시간")).toHaveValue("10:30");
    });

    it("initialSchedules가 있으면 초기값으로 채워진 시간표를 표시한다", () => {
        const initialSchedules: LectureScheduleData[] = [
            { dayOfWeek: "TUESDAY", startTime: "09:00:00", endTime: "10:00:00" },
        ];

        render(<LectureScheduleFields initialSchedules={initialSchedules} />);

        expect(screen.getByLabelText("수업 요일")).toHaveValue("TUESDAY");
        expect(screen.getByLabelText("수업 시작 시간")).toHaveValue("09:00");
        expect(screen.getByLabelText("수업 종료 시간")).toHaveValue("10:00");
    });
});
