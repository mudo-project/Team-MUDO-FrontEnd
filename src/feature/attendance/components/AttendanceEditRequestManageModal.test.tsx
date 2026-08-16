import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AttendanceEditRequestManageModal from "./AttendanceEditRequestManageModal";

function makeRequest(overrides: Partial<AttendanceAdminCorrectionRequestData> = {}): AttendanceAdminCorrectionRequestData {
  return {
    requestId: 1,
    requester: { userId: 1, name: "김강사", position: "강사" },
    workDate: "2026-08-17",
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
    processedBy: null,
    ...overrides,
  };
}

describe("AttendanceEditRequestManageModal", () => {
  it("대기 상태이고 처리 권한이 있으면 승인/반려 버튼을 노출한다", () => {
    render(<AttendanceEditRequestManageModal request={makeRequest()} canProcess={true} isSubmitting={false} onClose={jest.fn()} onApprove={jest.fn()} onReject={jest.fn()} />);

    expect(screen.getByRole("button", { name: "승인" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "반려" })).toBeInTheDocument();
  });

  it("처리 권한이 없으면 승인/반려 버튼 대신 닫기 버튼만 노출한다", () => {
    render(<AttendanceEditRequestManageModal request={makeRequest()} canProcess={false} isSubmitting={false} onClose={jest.fn()} onApprove={jest.fn()} onReject={jest.fn()} />);

    expect(screen.queryByRole("button", { name: "승인" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "반려" })).not.toBeInTheDocument();
    expect(screen.getByText("닫기")).toBeInTheDocument();
  });

  it("승인 버튼을 클릭하면 requestId와 함께 onApprove를 호출한다", () => {
    const onApprove = jest.fn();
    render(<AttendanceEditRequestManageModal request={makeRequest()} canProcess={true} isSubmitting={false} onClose={jest.fn()} onApprove={onApprove} onReject={jest.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "승인" }));

    expect(onApprove).toHaveBeenCalledWith(1);
  });

  it("반려 버튼을 클릭하면 반려 사유 입력 폼이 나타나고, 사유 없이 제출하면 에러 메시지를 노출한다", async () => {
    const onReject = jest.fn();
    render(<AttendanceEditRequestManageModal request={makeRequest()} canProcess={true} isSubmitting={false} onClose={jest.fn()} onApprove={jest.fn()} onReject={onReject} />);

    fireEvent.click(screen.getByRole("button", { name: "반려" }));
    fireEvent.click(screen.getByRole("button", { name: "반려 처리" }));

    expect(await screen.findByText("반려 사유를 입력해주세요.")).toBeInTheDocument();
    expect(onReject).not.toHaveBeenCalled();
  });

  it("반려 사유를 입력하고 제출하면 requestId와 trim된 사유로 onReject를 호출한다", async () => {
    const onReject = jest.fn();
    render(<AttendanceEditRequestManageModal request={makeRequest()} canProcess={true} isSubmitting={false} onClose={jest.fn()} onApprove={jest.fn()} onReject={onReject} />);

    fireEvent.click(screen.getByRole("button", { name: "반려" }));
    fireEvent.change(screen.getByLabelText("반려 사유"), { target: { value: "  사유 불충분  " } });
    fireEvent.click(screen.getByRole("button", { name: "반려 처리" }));

    await waitFor(() => expect(onReject).toHaveBeenCalledWith(1, "사유 불충분"));
  });

  it("처리 완료된(대기가 아닌) 요청이면 반려 사유가 있을 때 함께 노출한다", () => {
    render(
      <AttendanceEditRequestManageModal
        request={makeRequest({ status: "REJECTED", rejectionReason: "증빙 자료 부족" })}
        canProcess={true}
        isSubmitting={false}
        onClose={jest.fn()}
        onApprove={jest.fn()}
        onReject={jest.fn()}
      />,
    );

    expect(screen.getByText("증빙 자료 부족")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "승인" })).not.toBeInTheDocument();
  });
});
