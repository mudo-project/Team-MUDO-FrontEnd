import { fireEvent, render, screen } from "@testing-library/react";
import SelectMessageStudent from "./SelectMessageStudent";

describe("SelectMessageStudent", () => {
    it("checked가 true이면 체크된 상태로 표시한다", () => {
        render(<SelectMessageStudent checked id="recipient-1" onChange={jest.fn()} />);

        expect(screen.getByRole("checkbox")).toBeChecked();
    });

    it("checked가 false이면 체크되지 않은 상태로 표시한다", () => {
        render(<SelectMessageStudent checked={false} id="recipient-1" onChange={jest.fn()} />);

        expect(screen.getByRole("checkbox")).not.toBeChecked();
    });

    it("체크박스를 클릭하면 변경된 값으로 onChange를 호출한다", () => {
        const handleChange = jest.fn();
        render(<SelectMessageStudent checked={false} id="recipient-1" onChange={handleChange} />);

        fireEvent.click(screen.getByRole("checkbox"));

        expect(handleChange).toHaveBeenCalledWith(true);
    });

    it("indeterminate가 true이면 인디터미네이트 상태로 설정한다", () => {
        render(
            <SelectMessageStudent checked={false} id="recipient-1" indeterminate onChange={jest.fn()} />,
        );

        expect(screen.getByRole("checkbox")).toHaveProperty("indeterminate", true);
    });
});
