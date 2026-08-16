import { fireEvent, render, screen } from "@testing-library/react";
import AttendanceLeaveWorkModal from "./AttendanceLeaveWorkModal";

function makeToday(overrides: Partial<AttendanceTodayData> = {}): AttendanceTodayData {
  return {
    date: "2026-08-17",
    workStartTime: "09:00:00",
    workEndTime: "18:00:00",
    clockInAt: "09:05:00",
    clockOutAt: null,
    status: "NORMAL",
    serverTime: "2026-08-17T18:10:00",
    ...overrides,
  };
}

describe("AttendanceLeaveWorkModal", () => {
  it("비고 없이 제출해도 onConfirm이 빈 문자열로 호출된다", () => {
    const onConfirm = jest.fn();
    render(<AttendanceLeaveWorkModal now={new Date("2026-08-17T18:10:00")} today={makeToday()} onCancel={jest.fn()} onConfirm={onConfirm} />);

    fireEvent.click(screen.getByRole("button", { name: "퇴근하기" }));

    expect(onConfirm).toHaveBeenCalledWith("");
  });

  it("비고를 입력하고 제출하면 trim된 값으로 onConfirm을 호출한다", () => {
    const onConfirm = jest.fn();
    render(<AttendanceLeaveWorkModal now={new Date("2026-08-17T18:10:00")} today={makeToday()} onCancel={jest.fn()} onConfirm={onConfirm} />);

    fireEvent.change(screen.getByLabelText("비고 (선택)"), {
      target: { value: "  특이사항 없음  " },
    });
    fireEvent.click(screen.getByRole("button", { name: "퇴근하기" }));

    expect(onConfirm).toHaveBeenCalledWith("특이사항 없음");
  });

  it("취소 버튼을 클릭하면 onCancel을 호출한다", () => {
    const onCancel = jest.fn();
    render(<AttendanceLeaveWorkModal now={new Date("2026-08-17T18:10:00")} today={makeToday()} onCancel={onCancel} onConfirm={jest.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
