import { fireEvent, render, screen } from "@testing-library/react";
import PayrollListItem from "./PayrollListItem";

const baseItem: PayrollListItemData = {
    employeeId: 1,
    employeeName: "김강사",
    employmentType: "REGULAR",
    payrollId: 10,
    preparationStatus: "CALCULATED",
    totalEarnings: 3000000,
    totalDeductions: 200000,
    netPay: 2800000,
    revisionNo: 0,
};

describe("PayrollListItem", () => {
    it("준비상태가 계산완료면 미리보기 버튼을 노출한다", () => {
        render(
            <table>
                <tbody>
                    <PayrollListItem item={baseItem} onCalculate={jest.fn()} onPreview={jest.fn()} />
                </tbody>
            </table>,
        );

        expect(screen.getByRole("button", { name: /미리보기/ })).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /계산하기/ })).not.toBeInTheDocument();
    });

    it("준비상태가 작성중이면 계산하기 버튼을 노출한다", () => {
        const item = { ...baseItem, preparationStatus: "DRAFT" as PayrollPreparationStatus, payrollId: null };
        render(
            <table>
                <tbody>
                    <PayrollListItem item={item} onCalculate={jest.fn()} onPreview={jest.fn()} />
                </tbody>
            </table>,
        );

        expect(screen.getByRole("button", { name: /계산하기/ })).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /미리보기/ })).not.toBeInTheDocument();
    });

    it("준비상태가 미작성이면 작업 버튼을 노출하지 않는다", () => {
        const item = { ...baseItem, preparationStatus: "NOT_CREATED" as PayrollPreparationStatus, payrollId: null };
        render(
            <table>
                <tbody>
                    <PayrollListItem item={item} onCalculate={jest.fn()} onPreview={jest.fn()} />
                </tbody>
            </table>,
        );

        expect(screen.queryByRole("button", { name: /미리보기/ })).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /계산하기/ })).not.toBeInTheDocument();
    });

    it("미리보기 버튼을 클릭하면 payrollId로 onPreview를 호출한다", () => {
        const onPreview = jest.fn();
        render(
            <table>
                <tbody>
                    <PayrollListItem item={baseItem} onCalculate={jest.fn()} onPreview={onPreview} />
                </tbody>
            </table>,
        );

        fireEvent.click(screen.getByRole("button", { name: /미리보기/ }));

        expect(onPreview).toHaveBeenCalledWith(10);
    });

    it("계산하기 버튼을 클릭하면 item으로 onCalculate를 호출한다", () => {
        const onCalculate = jest.fn();
        const item = { ...baseItem, preparationStatus: "DRAFT" as PayrollPreparationStatus };
        render(
            <table>
                <tbody>
                    <PayrollListItem item={item} onCalculate={onCalculate} onPreview={jest.fn()} />
                </tbody>
            </table>,
        );

        fireEvent.click(screen.getByRole("button", { name: /계산하기/ }));

        expect(onCalculate).toHaveBeenCalledWith(item);
    });

    it("정정 차수가 1보다 크면 정정 N차로 표시한다", () => {
        const item = { ...baseItem, revisionNo: 2 };
        render(
            <table>
                <tbody>
                    <PayrollListItem item={item} onCalculate={jest.fn()} onPreview={jest.fn()} />
                </tbody>
            </table>,
        );

        expect(screen.getByText("정정 2차")).toBeInTheDocument();
    });
});
