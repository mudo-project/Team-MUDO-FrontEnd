import { fireEvent, render, screen } from "@testing-library/react";
import AttendanceMyEditRequest from "./AttendanceMyEditRequest";

function makeRequest(overrides: Partial<AttendanceMyCorrectionRequestData> = {}): AttendanceMyCorrectionRequestData {
  return {
    requestId: 1,
    date: "2026-08-17",
    type: "CLOCK_IN_TIME",
    status: "PENDING",
    originalClockInAt: "09:35:00",
    originalClockOutAt: null,
    originalClockInNote: null,
    originalClockOutNote: null,
    requestedClockInAt: "09:05:00",
    requestedClockOutAt: null,
    requestedClockInNote: null,
    requestedClockOutNote: null,
    reason: "출근 기록 오류",
    requestedAt: "2026-08-17T10:00:00",
    processedAt: null,
    rejectionReason: null,
    ...overrides,
  };
}

describe("AttendanceMyEditRequest", () => {
  it("요청이 없으면 안내 문구를 노출한다", () => {
    render(<AttendanceMyEditRequest requests={[]} onViewAll={jest.fn()} />);

    expect(screen.getByText("처리할 요청이 없습니다")).toBeInTheDocument();
  });

  it("요청이 4건 이상이면 requestedAt 기준 최신 3건만 카드로 노출한다", () => {
    render(
      <AttendanceMyEditRequest
        requests={[
          makeRequest({ requestId: 1, date: "2026-08-01", requestedAt: "2026-08-01T10:00:00" }),
          makeRequest({ requestId: 2, date: "2026-08-05", requestedAt: "2026-08-05T10:00:00" }),
          makeRequest({ requestId: 3, date: "2026-08-10", requestedAt: "2026-08-10T10:00:00" }),
          makeRequest({ requestId: 4, date: "2026-08-15", requestedAt: "2026-08-15T10:00:00" }),
        ]}
        onViewAll={jest.fn()}
      />,
    );

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(screen.queryByText(/8월 1일/)).not.toBeInTheDocument();
  });

  it("전체 보기를 클릭하면 onViewAll을 호출한다", () => {
    const onViewAll = jest.fn();
    render(<AttendanceMyEditRequest requests={[makeRequest()]} onViewAll={onViewAll} />);

    fireEvent.click(screen.getByRole("button", { name: "전체 보기" }));

    expect(onViewAll).toHaveBeenCalledTimes(1);
  });

  it("카드를 클릭하면 상세조회 모달이 열리고, 닫기를 클릭하면 모달이 닫힌다", () => {
    render(<AttendanceMyEditRequest requests={[makeRequest({ reason: "출근 기록 오류" })]} onViewAll={jest.fn()} />);

    expect(screen.queryByText("내 근태 수정 상세조회")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("출근 기록 오류"));

    expect(screen.getByText("내 근태 수정 상세조회")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "닫기" }));

    expect(screen.queryByText("내 근태 수정 상세조회")).not.toBeInTheDocument();
  });
});
