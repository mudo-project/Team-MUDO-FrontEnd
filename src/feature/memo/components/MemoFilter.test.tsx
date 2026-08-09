import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import MemoFilter from "./MemoFilter";

function MemoFilterHarness() {
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");

  return <MemoFilter sortOrder={sortOrder} onChangeSortOrder={setSortOrder} />;
}

describe("MemoFilter", () => {
  it("오래된순을 클릭하면 선택 상태를 오래된순으로 변경한다", () => {
    render(<MemoFilterHarness />);

    fireEvent.click(screen.getByRole("button", { name: "오래된순" }));

    expect(screen.getByRole("button", { name: "오래된순" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "최신순" })).toHaveAttribute("aria-pressed", "false");
  });
});
