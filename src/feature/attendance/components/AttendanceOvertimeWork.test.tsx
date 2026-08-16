import { fireEvent, render, screen } from "@testing-library/react";
import AttendanceOvertimeWork from "./AttendanceOvertimeWork";

function makeToday(overrides: Partial<AttendanceTodayData> = {}): AttendanceTodayData {
  return {
    date: "2026-08-17",
    workStartTime: "09:00:00",
    workEndTime: "18:00:00",
    clockInAt: "09:05:00",
    clockOutAt: null,
    status: "NORMAL",
    serverTime: "2026-08-17T19:00:00",
    ...overrides,
  };
}

describe("AttendanceOvertimeWork", () => {
  it("사유를 입력하지 않고 제출하면 에러 메시지를 노출하고 onConfirm을 호출하지 않는다", async () => {
    const onConfirm = jest.fn();
    render(<AttendanceOvertimeWork now={new Date("2026-08-17T19:00:00")} today={makeToday()} onCancel={jest.fn()} onConfirm={onConfirm} />);

    fireEvent.click(screen.getByRole("button", { name: "초과근무 기록" }));

    expect(await screen.findByText("초과근무 사유를 입력해주세요.")).toBeInTheDocument();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("사유를 입력하고 제출하면 trim된 값으로 onConfirm을 호출한다", () => {
    const onConfirm = jest.fn();
    render(<AttendanceOvertimeWork now={new Date("2026-08-17T19:00:00")} today={makeToday()} onCancel={jest.fn()} onConfirm={onConfirm} />);

    fireEvent.change(screen.getByLabelText("초과근무 사유 (필수)"), {
      target: { value: "  시험 문제 출제  " },
    });
    fireEvent.click(screen.getByRole("button", { name: "초과근무 기록" }));

    expect(onConfirm).toHaveBeenCalledWith("시험 문제 출제");
  });
});
