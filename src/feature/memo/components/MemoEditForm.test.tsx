import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MEMO_COLORS } from "./MemoColorPicker";
import MemoEditForm from "./MemoEditForm";

const memo: MemoData = {
  id: 1,
  title: "기존 제목",
  content: "기존 내용",
  color: "B9827F",
  positionX: null,
  positionY: null,
  width: null,
  height: null,
  createdAt: "2026-08-09T00:00:00.000Z",
  updatedAt: "2026-08-09T00:00:00.000Z",
};

describe("MemoEditForm", () => {
  it("기존 제목과 내용을 표시하고 수정한 값으로 저장 콜백을 호출한다", async () => {
    const onSave = jest.fn();

    render(<MemoEditForm memo={memo} onCancel={jest.fn()} onSave={onSave} />);

    expect(screen.getByLabelText("메모 제목")).toHaveValue("기존 제목");
    expect(screen.getByLabelText("메모 내용")).toHaveValue("기존 내용");

    fireEvent.change(screen.getByLabelText("메모 제목"), { target: { value: "수정 제목" } });
    fireEvent.change(screen.getByLabelText("메모 내용"), { target: { value: "수정 내용" } });
    fireEvent.click(screen.getByRole("button", { name: "메모 색상 779F8A" }));
    fireEvent.click(screen.getByRole("button", { name: "저장" }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith("수정 제목", "수정 내용", MEMO_COLORS[2]);
    });
  });

  it("취소를 클릭하면 취소 콜백을 호출한다", () => {
    const onCancel = jest.fn();

    render(<MemoEditForm memo={memo} onCancel={onCancel} onSave={jest.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
