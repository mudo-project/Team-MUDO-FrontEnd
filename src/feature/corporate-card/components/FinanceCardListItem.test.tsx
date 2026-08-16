import { fireEvent, render, screen } from "@testing-library/react";
import FinanceCardListItem from "./FinanceCardListItem";

const baseItem: CorporateCardTransactionListItemData = {
    transactionId: 1,
    approvedAt: "2026.08.01",
    merchantName: "OO식당",
    cardName: "신한 1234",
    amount: 32000,
    expenseCategory: "식대",
    status: "APPROVED",
};

describe("FinanceCardListItem", () => {
    it("미작성 상태면 작성하기 버튼과 작성 필요 배지를 노출한다", () => {
        render(
            <table>
                <tbody>
                    <FinanceCardListItem
                        isSelected={false}
                        item={{ ...baseItem, status: "UNWRITTEN", expenseCategory: null }}
                        onSelect={jest.fn()}
                        onToggleSelect={jest.fn()}
                    />
                </tbody>
            </table>
        );

        expect(screen.getByRole("button", { name: /작성하기/ })).toBeInTheDocument();
        expect(screen.getByText("● 작성 필요")).toBeInTheDocument();
    });

    it("승인됨 상태면 상세보기 버튼과 사용목적 배지를 노출한다", () => {
        render(
            <table>
                <tbody>
                    <FinanceCardListItem
                        isSelected={false}
                        item={baseItem}
                        onSelect={jest.fn()}
                        onToggleSelect={jest.fn()}
                    />
                </tbody>
            </table>
        );

        expect(screen.getByRole("button", { name: /상세보기/ })).toBeInTheDocument();
        expect(screen.getByText("식대")).toBeInTheDocument();
    });

    it("체크표시를 클릭하면 onToggleSelect를 해당 내역 id로 호출한다", () => {
        const onToggleSelect = jest.fn();
        render(
            <table>
                <tbody>
                    <FinanceCardListItem
                        isSelected={false}
                        item={baseItem}
                        onSelect={jest.fn()}
                        onToggleSelect={onToggleSelect}
                    />
                </tbody>
            </table>
        );

        fireEvent.click(screen.getByRole("checkbox", { name: "OO식당 선택" }));

        expect(onToggleSelect).toHaveBeenCalledWith(1);
    });

    it("상세보기 버튼을 클릭하면 onSelect를 해당 내역 id로 호출한다", () => {
        const onSelect = jest.fn();
        render(
            <table>
                <tbody>
                    <FinanceCardListItem
                        isSelected={false}
                        item={baseItem}
                        onSelect={onSelect}
                        onToggleSelect={jest.fn()}
                    />
                </tbody>
            </table>
        );

        fireEvent.click(screen.getByRole("button", { name: /상세보기/ }));

        expect(onSelect).toHaveBeenCalledWith(1);
    });
});
