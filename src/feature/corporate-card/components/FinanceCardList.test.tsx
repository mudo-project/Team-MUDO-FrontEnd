import { fireEvent, render, screen } from "@testing-library/react";
import FinanceCardList from "./FinanceCardList";

const items: CorporateCardTransactionListItemData[] = [
    {
        transactionId: 1,
        approvedAt: "2026.08.01",
        merchantName: "OO식당",
        cardName: "신한 1234",
        amount: 32000,
        expenseCategory: "식대",
        status: "APPROVED",
    },
    {
        transactionId: 2,
        approvedAt: "2026.08.02",
        merchantName: "OO문구",
        cardName: "국민 5678",
        amount: 15000,
        expenseCategory: null,
        status: "UNWRITTEN",
    },
];

describe("FinanceCardList", () => {
    it("선택된 내역이 없으면 전체 선택 체크박스가 체크되지 않는다", () => {
        render(
            <FinanceCardList items={items} onSelectItem={jest.fn()} onToggleAll={jest.fn()} onToggleItem={jest.fn()} selectedItemIds={[]} />
        );

        expect(screen.getByRole("checkbox", { name: "전체 선택" })).not.toBeChecked();
    });

    it("노출된 모든 내역이 선택되어 있으면 전체 선택 체크박스가 체크된다", () => {
        render(
            <FinanceCardList items={items} onSelectItem={jest.fn()} onToggleAll={jest.fn()} onToggleItem={jest.fn()} selectedItemIds={[1, 2]} />
        );

        expect(screen.getByRole("checkbox", { name: "전체 선택" })).toBeChecked();
    });

    it("전체 선택 체크박스를 클릭하면 onToggleAll을 호출한다", () => {
        const onToggleAll = jest.fn();
        render(
            <FinanceCardList items={items} onSelectItem={jest.fn()} onToggleAll={onToggleAll} onToggleItem={jest.fn()} selectedItemIds={[]} />
        );

        fireEvent.click(screen.getByRole("checkbox", { name: "전체 선택" }));

        expect(onToggleAll).toHaveBeenCalledTimes(1);
    });

    it("각 내역을 행으로 렌더링한다", () => {
        render(
            <FinanceCardList items={items} onSelectItem={jest.fn()} onToggleAll={jest.fn()} onToggleItem={jest.fn()} selectedItemIds={[]} />
        );

        expect(screen.getByText("OO식당")).toBeInTheDocument();
        expect(screen.getByText("OO문구")).toBeInTheDocument();
    });
});
