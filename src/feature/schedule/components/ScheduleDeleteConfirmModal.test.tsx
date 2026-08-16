import { fireEvent, render, screen } from "@testing-library/react";
import ScheduleDeleteConfirmModal from "./ScheduleDeleteConfirmModal";

describe("ScheduleDeleteConfirmModal", () => {
  it("삭제 대상 제목을 포함한 안내 문구를 표시한다", () => {
    render(<ScheduleDeleteConfirmModal title="전체 회의" onCancel={jest.fn()} onConfirm={jest.fn()} />);

    expect(screen.getByText('"전체 회의" 일정을 삭제하면 되돌릴 수 없습니다.')).toBeInTheDocument();
  });

  it("취소 버튼을 클릭하면 취소 콜백을 호출한다", () => {
    const onCancel = jest.fn();
    render(<ScheduleDeleteConfirmModal title="전체 회의" onCancel={onCancel} onConfirm={jest.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("삭제 버튼을 클릭하면 확인 콜백을 호출한다", () => {
    const onConfirm = jest.fn();
    render(<ScheduleDeleteConfirmModal title="전체 회의" onCancel={jest.fn()} onConfirm={onConfirm} />);

    fireEvent.click(screen.getByRole("button", { name: "삭제" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("삭제 중이면 버튼이 비활성화되고 문구가 바뀐다", () => {
    render(<ScheduleDeleteConfirmModal isDeleting title="전체 회의" onCancel={jest.fn()} onConfirm={jest.fn()} />);

    expect(screen.getByRole("button", { name: "삭제 중..." })).toBeDisabled();
    expect(screen.getByRole("button", { name: "취소" })).toBeDisabled();
  });
});
