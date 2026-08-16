import { fireEvent, render, screen } from "@testing-library/react";
import AttendanceDetailModal from "./AttendanceDetailModal";

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

describe("AttendanceDetailModal", () => {
  it("출근/퇴근 비고사유가 없으면 비고 영역을 노출하지 않는다", () => {
    render(<AttendanceDetailModal dayDetail={makeDayDetail()} onClose={jest.fn()} onEditRequest={jest.fn()} />);

    expect(screen.queryByText("출근 비고사유")).not.toBeInTheDocument();
    expect(screen.queryByText("퇴근 비고사유")).not.toBeInTheDocument();
    expect(screen.getByText("수정 요청 없음")).toBeInTheDocument();
  });

  it("출근/퇴근 비고사유가 있으면 각각 노출한다", () => {
    render(
      <AttendanceDetailModal
        dayDetail={makeDayDetail({ clockInNote: "버스 지연", clockOutNote: "조기 퇴근" })}
        onClose={jest.fn()}
        onEditRequest={jest.fn()}
      />,
    );

    expect(screen.getByText("출근 비고사유")).toBeInTheDocument();
    expect(screen.getByText("버스 지연")).toBeInTheDocument();
    expect(screen.getByText("퇴근 비고사유")).toBeInTheDocument();
    expect(screen.getByText("조기 퇴근")).toBeInTheDocument();
  });

  it("수정 요청이 처리 중이면 해당 문구를 노출한다", () => {
    render(<AttendanceDetailModal dayDetail={makeDayDetail({ correctionRequestPending: true })} onClose={jest.fn()} onEditRequest={jest.fn()} />);

    expect(screen.getByText("수정 요청 처리 중")).toBeInTheDocument();
  });

  it("수정 버튼을 클릭하면 onEditRequest를, 닫기 버튼을 클릭하면 onClose를 호출한다", () => {
    const onClose = jest.fn();
    const onEditRequest = jest.fn();
    render(<AttendanceDetailModal dayDetail={makeDayDetail()} onClose={onClose} onEditRequest={onEditRequest} />);

    fireEvent.click(screen.getByRole("button", { name: "수정" }));
    fireEvent.click(screen.getByRole("button", { name: "닫기" }));

    expect(onEditRequest).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
