import { fireEvent, render, screen } from "@testing-library/react";
import AttendanceCreateEditRequestModal from "./AttendanceCreateEditRequestModal";

function makeDayDetail(overrides: Partial<AttendanceDayDetailData> = {}): AttendanceDayDetailData {
  return {
    date: "2026-08-17",
    clockInAt: "09:05:00",
    clockOutAt: "18:10:00",
    clockInNote: null,
    clockOutNote: null,
    correctionRequestPending: false,
    ...overrides,
  };
}

describe("AttendanceCreateEditRequestModal", () => {
  it("기본 요청 구분(출근 시각)이면 요청 시각 select를 노출하고, 사유 없이 제출하면 에러 메시지를 노출한다", async () => {
    const onSubmit = jest.fn();
    render(<AttendanceCreateEditRequestModal dayDetail={makeDayDetail()} onCancel={jest.fn()} onSubmit={onSubmit} />);

    expect(screen.getByLabelText("요청 시각")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "요청하기" }));

    expect(await screen.findByText("수정 요청 사유를 입력해주세요.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("요청 구분을 누락 기록 추가로 바꾸면 출근/퇴근 시간 select 두 개가 나타난다", () => {
    render(<AttendanceCreateEditRequestModal dayDetail={makeDayDetail()} onCancel={jest.fn()} onSubmit={jest.fn()} />);

    fireEvent.click(screen.getByRole("radio", { name: "누락 기록 추가" }));

    expect(screen.getByLabelText("출근 시간")).toBeInTheDocument();
    expect(screen.getByLabelText("퇴근 시간")).toBeInTheDocument();
    expect(screen.queryByLabelText("요청 시각")).not.toBeInTheDocument();
  });

  it("요청 구분을 비고 수정으로 바꾸면 현재 비고와 수정할 비고 입력란이 나타나고, 비고가 비어있으면 에러를 노출한다", async () => {
    render(<AttendanceCreateEditRequestModal dayDetail={makeDayDetail({ clockInNote: null, clockOutNote: null })} onCancel={jest.fn()} onSubmit={jest.fn()} />);

    fireEvent.click(screen.getByRole("radio", { name: "비고 수정" }));

    expect(screen.getByText("등록된 비고가 없습니다")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("수정할 비고 내용"), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText("사유 (필수)"), { target: { value: "비고 정정 요청" } });
    fireEvent.click(screen.getByRole("button", { name: "요청하기" }));

    expect(await screen.findByText("수정할 비고 내용을 입력해주세요.")).toBeInTheDocument();
  });

  it("출근 시각 요청을 사유와 함께 제출하면 요청 구분에 맞는 payload로 onSubmit을 호출한다", () => {
    const onSubmit = jest.fn();
    render(<AttendanceCreateEditRequestModal dayDetail={makeDayDetail()} onCancel={jest.fn()} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText("사유 (필수)"), { target: { value: "출근 시각이 잘못 기록되었습니다" } });
    fireEvent.click(screen.getByRole("button", { name: "요청하기" }));

    expect(onSubmit).toHaveBeenCalledWith({
      type: "CLOCK_IN_TIME",
      requestedClockInTime: "09:05",
      reason: "출근 시각이 잘못 기록되었습니다",
    });
  });

  it("취소 버튼을 클릭하면 onCancel을 호출한다", () => {
    const onCancel = jest.fn();
    render(<AttendanceCreateEditRequestModal dayDetail={makeDayDetail()} onCancel={onCancel} onSubmit={jest.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
