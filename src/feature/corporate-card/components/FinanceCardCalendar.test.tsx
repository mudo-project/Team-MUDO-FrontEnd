import { fireEvent, render, screen } from "@testing-library/react";
import FinanceCardCalendar from "./FinanceCardCalendar";

describe("FinanceCardCalendar", () => {
    it("날짜 선택 버튼을 클릭하면 선택 패널이 열리고 다시 클릭하면 닫힌다", () => {
        render(<FinanceCardCalendar month={new Date(2026, 7, 1)} onChangeMonth={jest.fn()} onSelectDate={jest.fn()} />);

        expect(screen.queryByRole("dialog", { name: "날짜 선택" })).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "2026년 8월" }));
        expect(screen.getByRole("dialog", { name: "날짜 선택" })).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "2026년 8월" }));
        expect(screen.queryByRole("dialog", { name: "날짜 선택" })).not.toBeInTheDocument();
    });

    it("이전 달 버튼을 클릭하면 이전 달로 onChangeMonth를 호출한다", () => {
        const onChangeMonth = jest.fn();
        render(<FinanceCardCalendar month={new Date(2026, 7, 1)} onChangeMonth={onChangeMonth} onSelectDate={jest.fn()} />);

        fireEvent.click(screen.getByRole("button", { name: "이전 달" }));

        expect(onChangeMonth).toHaveBeenCalledWith(new Date(2026, 6, 1));
    });

    it("다음 달 버튼을 클릭하면 다음 달로 onChangeMonth를 호출한다", () => {
        const onChangeMonth = jest.fn();
        render(<FinanceCardCalendar month={new Date(2026, 7, 1)} onChangeMonth={onChangeMonth} onSelectDate={jest.fn()} />);

        fireEvent.click(screen.getByRole("button", { name: "다음 달" }));

        expect(onChangeMonth).toHaveBeenCalledWith(new Date(2026, 8, 1));
    });

    it("월을 선택하면 해당 월로 onChangeMonth를 호출하고 선택 패널을 닫는다", () => {
        const onChangeMonth = jest.fn();
        const onSelectDate = jest.fn();
        render(<FinanceCardCalendar month={new Date(2026, 7, 1)} onChangeMonth={onChangeMonth} onSelectDate={onSelectDate} />);

        fireEvent.click(screen.getByRole("button", { name: "2026년 8월" }));
        fireEvent.click(screen.getByRole("button", { name: "3월" }));

        expect(onChangeMonth).toHaveBeenCalledWith(new Date(2026, 2, 1));
        expect(onSelectDate).toHaveBeenCalledWith(undefined);
        expect(screen.queryByRole("dialog", { name: "날짜 선택" })).not.toBeInTheDocument();
    });
});
