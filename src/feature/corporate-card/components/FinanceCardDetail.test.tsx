import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { saveCorporateCardExpenseAction, submitCorporateCardExpenseAction } from "../actions";
import FinanceCardDetail from "./FinanceCardDetail";

jest.mock("sonner", () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

jest.mock("../actions", () => ({
    saveCorporateCardExpenseAction: jest.fn(),
    submitCorporateCardExpenseAction: jest.fn(),
}));

const mockedSaveAction = saveCorporateCardExpenseAction as jest.MockedFunction<typeof saveCorporateCardExpenseAction>;
const mockedSubmitAction = submitCorporateCardExpenseAction as jest.MockedFunction<typeof submitCorporateCardExpenseAction>;

const baseItem: CorporateCardTransactionData = {
    transactionId: 1,
    approvedAt: "2026.08.01",
    approvalNumber: "12345678",
    merchantName: "OO식당",
    cardName: "신한카드",
    cardNumberMasked: "1234-****-****-5678",
    installmentMonths: 0,
    amount: 32000,
    expenseId: null,
    userId: null,
    expenseCategory: "식대",
    purpose: "팀 회식",
    approvalDocumentId: null,
    status: "APPROVED",
};

describe("FinanceCardDetail", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("item이 없으면 아무것도 렌더링하지 않는다", () => {
        const { container } = render(
            <FinanceCardDetail item={null} onClose={jest.fn()} onSaved={jest.fn()} onSubmitted={jest.fn()} />
        );

        expect(container).toBeEmptyDOMElement();
    });

    it("승인됨/진행중 상태면 조회 전용 사용목적을 표시하고 임시저장·상신 버튼은 없다", () => {
        render(
            <FinanceCardDetail item={baseItem} onClose={jest.fn()} onSaved={jest.fn()} onSubmitted={jest.fn()} />
        );

        expect(screen.getByText("팀 회식")).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "임시저장" })).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "결재 상신" })).not.toBeInTheDocument();
    });

    it("반려됨 상태면 반려 사유와 재상신 버튼을 표시한다", () => {
        render(
            <FinanceCardDetail
                item={{ ...baseItem, status: "REJECTED" }}
                onClose={jest.fn()}
                onSaved={jest.fn()}
                onSubmitted={jest.fn()}
            />
        );

        expect(screen.getByText("반려 사유")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "재상신" })).toBeInTheDocument();
    });

    it("미작성 상태면 반려 사유 없이 결재 상신 버튼을 표시한다", () => {
        render(
            <FinanceCardDetail
                item={{ ...baseItem, status: "UNWRITTEN", expenseCategory: null, purpose: null }}
                onClose={jest.fn()}
                onSaved={jest.fn()}
                onSubmitted={jest.fn()}
            />
        );

        expect(screen.queryByText("반려 사유")).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: "결재 상신" })).toBeInTheDocument();
    });

    it("닫기 버튼을 클릭하면 onClose를 호출한다", () => {
        const onClose = jest.fn();
        render(
            <FinanceCardDetail item={baseItem} onClose={onClose} onSaved={jest.fn()} onSubmitted={jest.fn()} />
        );

        fireEvent.click(screen.getByRole("button", { name: "닫기" }));

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("임시저장에 성공하면 성공 토스트를 노출하고 onSaved를 호출한다", async () => {
        const savedData = { ...baseItem, status: "REJECTED" as const, purpose: "수정된 사유" };
        mockedSaveAction.mockResolvedValue({ success: true, message: "법인카드 정산 정보가 저장되었습니다.", data: savedData });
        const onSaved = jest.fn();

        render(
            <FinanceCardDetail
                item={{ ...baseItem, status: "REJECTED" }}
                onClose={jest.fn()}
                onSaved={onSaved}
                onSubmitted={jest.fn()}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "임시저장" }));

        await waitFor(() => expect(toast.success).toHaveBeenCalledWith("법인카드 정산 정보가 저장되었습니다."));
        expect(onSaved).toHaveBeenCalledWith(savedData);
    });

    it("결재 상신에 실패하면 에러 토스트를 노출하고 onSubmitted를 호출하지 않는다", async () => {
        mockedSubmitAction.mockResolvedValue({ success: false, message: "사용 목적(분류)을 선택해주세요." });
        const onSubmitted = jest.fn();

        render(
            <FinanceCardDetail
                item={{ ...baseItem, status: "UNWRITTEN", expenseCategory: null }}
                onClose={jest.fn()}
                onSaved={jest.fn()}
                onSubmitted={onSubmitted}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "결재 상신" }));

        await waitFor(() => expect(toast.error).toHaveBeenCalledWith("사용 목적(분류)을 선택해주세요."));
        expect(onSubmitted).not.toHaveBeenCalled();
    });
});
