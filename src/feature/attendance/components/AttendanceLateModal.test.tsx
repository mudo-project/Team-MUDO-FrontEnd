import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AttendanceLateModal from "./AttendanceLateModal";

describe("AttendanceLateModal", () => {
  it("비고를 입력하지 않고 제출하면 에러 메시지를 노출하고 onConfirm을 호출하지 않는다", async () => {
    const onConfirm = jest.fn();
    render(<AttendanceLateModal date={new Date("2026-08-17T09:40:00")} onCancel={jest.fn()} onConfirm={onConfirm} />);

    fireEvent.click(screen.getByRole("button", { name: "출근하기" }));

    expect(await screen.findByText("지각 사유를 입력해주세요.")).toBeInTheDocument();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("비고를 입력하고 제출하면 trim된 값으로 onConfirm을 호출한다", async () => {
    const onConfirm = jest.fn();
    render(<AttendanceLateModal date={new Date("2026-08-17T09:40:00")} onCancel={jest.fn()} onConfirm={onConfirm} />);

    fireEvent.change(screen.getByLabelText("비고 (필수 — 지각 사유)"), {
      target: { value: "  버스 지연  " },
    });
    fireEvent.click(screen.getByRole("button", { name: "출근하기" }));

    await waitFor(() => expect(onConfirm).toHaveBeenCalledWith("버스 지연"));
  });

  it("취소 버튼을 클릭하면 onCancel을 호출한다", () => {
    const onCancel = jest.fn();
    render(<AttendanceLateModal date={new Date("2026-08-17T09:40:00")} onCancel={onCancel} onConfirm={jest.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
