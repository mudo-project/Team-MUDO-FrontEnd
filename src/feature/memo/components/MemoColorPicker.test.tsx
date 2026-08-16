import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import MemoColorPicker, { MEMO_COLORS, type MemoColor } from "./MemoColorPicker";

function MemoColorPickerHarness() {
  const [selectedColor, setSelectedColor] = useState<MemoColor>(MEMO_COLORS[0]);

  return <MemoColorPicker selectedColor={selectedColor} onChange={setSelectedColor} />;
}

describe("MemoColorPicker", () => {
  it("다른 색상을 클릭하면 선택 상태를 변경한다", () => {
    render(<MemoColorPickerHarness />);

    fireEvent.click(screen.getByRole("button", { name: "메모 색상 7894C2" }));

    expect(screen.getByRole("button", { name: "메모 색상 7894C2" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "메모 색상 B9827F" })).toHaveAttribute("aria-pressed", "false");
  });
});
