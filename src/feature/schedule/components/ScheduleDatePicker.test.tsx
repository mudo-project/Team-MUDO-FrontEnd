import { fireEvent, render, screen } from "@testing-library/react";
import ScheduleDatePicker from "./ScheduleDatePicker";

describe("ScheduleDatePicker", () => {
  it("초기에는 팝오버가 닫혀있고 트리거를 클릭하면 열린다", () => {
    render(<ScheduleDatePicker month={8} year={2026} onChange={jest.fn()} />);

    expect(screen.queryByRole("button", { name: "1월" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "2026년 8월" }));

    expect(screen.getByRole("button", { name: "1월" })).toBeInTheDocument();
  });

  it("연도를 변경하면 현재 월과 함께 변경 콜백을 호출한다", () => {
    const onChange = jest.fn();
    render(<ScheduleDatePicker month={8} year={2026} onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "2026년 8월" }));
    fireEvent.change(screen.getByLabelText("연도"), { target: { value: "2027" } });

    expect(onChange).toHaveBeenCalledWith(2027, 8);
  });

  it("월을 클릭하면 변경 콜백을 호출하고 팝오버가 닫힌다", () => {
    const onChange = jest.fn();
    render(<ScheduleDatePicker month={8} year={2026} onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "2026년 8월" }));
    fireEvent.click(screen.getByRole("button", { name: "3월" }));

    expect(onChange).toHaveBeenCalledWith(2026, 3);
    expect(screen.queryByRole("button", { name: "1월" })).not.toBeInTheDocument();
  });
});
