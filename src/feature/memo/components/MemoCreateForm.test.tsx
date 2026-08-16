import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MEMO_COLORS } from "./MemoColorPicker";
import MemoCreateForm from "./MemoCreateForm";

describe("MemoCreateForm", () => {
  it("제목과 내용을 입력하지 않고 저장하면 검증 메시지를 노출한다", async () => {
    render(<MemoCreateForm onCancel={jest.fn()} onSave={jest.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "저장" }));

    expect(await screen.findByText("제목을 입력해주세요.")).toBeInTheDocument();
    expect(await screen.findByText("내용을 입력해주세요.")).toBeInTheDocument();
  });

  it("유효한 값을 입력하고 저장하면 선택한 색상과 함께 저장 콜백을 호출한다", async () => {
    const onSave = jest.fn();

    render(<MemoCreateForm onCancel={jest.fn()} onSave={onSave} />);

    fireEvent.change(screen.getByLabelText("메모 제목"), { target: { value: "회의 메모" } });
    fireEvent.change(screen.getByLabelText("메모 내용"), { target: { value: "회의 내용을 정리합니다." } });
    fireEvent.click(screen.getByRole("button", { name: "메모 색상 7894C2" }));
    fireEvent.click(screen.getByRole("button", { name: "저장" }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith("회의 메모", "회의 내용을 정리합니다.", MEMO_COLORS[3]);
    });
  });

  it("취소를 클릭하면 취소 콜백을 호출한다", () => {
    const onCancel = jest.fn();

    render(<MemoCreateForm onCancel={onCancel} onSave={jest.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
