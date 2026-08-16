import { fireEvent, render, screen } from "@testing-library/react";
import AttendanceCommuteInformation from "./AttendanceCommuteInformation";

function makeToday(overrides: Partial<AttendanceTodayData> = {}): AttendanceTodayData {
  return {
    date: "2026-08-17",
    workStartTime: "09:00:00",
    workEndTime: "18:00:00",
    clockInAt: null,
    clockOutAt: null,
    status: "UNRECORDED",
    serverTime: "2026-08-17T09:00:00",
    ...overrides,
  };
}

describe("AttendanceCommuteInformation", () => {
  it("출근 전이면 출근하기 버튼만 노출하고 클릭하면 onClockIn을 호출한다", () => {
    const onClockIn = jest.fn();
    render(
      <AttendanceCommuteInformation
        now={new Date("2026-08-17T09:00:00")}
        today={makeToday()}
        canOvertime={false}
        onClockIn={onClockIn}
        onClockOut={jest.fn()}
        onOvertime={jest.fn()}
      />,
    );

    expect(screen.getByText("출근 전입니다")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "퇴근하기" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "출근하기" }));
    expect(onClockIn).toHaveBeenCalledTimes(1);
  });

  it("출근했고 퇴근 전이면 퇴근하기 버튼만 노출하고 초과근무 버튼은 canOvertime일 때만 노출한다", () => {
    const { rerender } = render(
      <AttendanceCommuteInformation
        now={new Date("2026-08-17T10:00:00")}
        today={makeToday({ clockInAt: "09:05:00", status: "NORMAL" })}
        canOvertime={false}
        onClockIn={jest.fn()}
        onClockOut={jest.fn()}
        onOvertime={jest.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "퇴근하기" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "초과근무" })).not.toBeInTheDocument();

    rerender(
      <AttendanceCommuteInformation
        now={new Date("2026-08-17T19:00:00")}
        today={makeToday({ clockInAt: "09:05:00", status: "NORMAL" })}
        canOvertime={true}
        onClockIn={jest.fn()}
        onClockOut={jest.fn()}
        onOvertime={jest.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "초과근무" })).toBeInTheDocument();
  });

  it("퇴근까지 완료했으면 출근/퇴근 버튼이 모두 사라지고 종료 문구를 노출한다", () => {
    render(
      <AttendanceCommuteInformation
        now={new Date("2026-08-17T19:00:00")}
        today={makeToday({ clockInAt: "09:05:00", clockOutAt: "18:10:00", status: "NORMAL" })}
        canOvertime={false}
        onClockIn={jest.fn()}
        onClockOut={jest.fn()}
        onOvertime={jest.fn()}
      />,
    );

    expect(screen.getByText("근무를 종료했습니다")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "출근하기" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "퇴근하기" })).not.toBeInTheDocument();
  });

  it("지각 상태면 출근 시각 옆에 지각 라벨을 노출한다", () => {
    render(
      <AttendanceCommuteInformation
        now={new Date("2026-08-17T10:00:00")}
        today={makeToday({ clockInAt: "09:40:00", status: "LATE" })}
        canOvertime={false}
        onClockIn={jest.fn()}
        onClockOut={jest.fn()}
        onOvertime={jest.fn()}
      />,
    );

    expect(screen.getByText("지각")).toBeInTheDocument();
  });

  it("퇴근하기/초과근무 버튼을 클릭하면 각각의 콜백을 호출한다", () => {
    const onClockOut = jest.fn();
    const onOvertime = jest.fn();
    render(
      <AttendanceCommuteInformation
        now={new Date("2026-08-17T19:00:00")}
        today={makeToday({ clockInAt: "09:05:00", status: "NORMAL" })}
        canOvertime={true}
        onClockIn={jest.fn()}
        onClockOut={onClockOut}
        onOvertime={onOvertime}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "퇴근하기" }));
    fireEvent.click(screen.getByRole("button", { name: "초과근무" }));

    expect(onClockOut).toHaveBeenCalledTimes(1);
    expect(onOvertime).toHaveBeenCalledTimes(1);
  });
});
