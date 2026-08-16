import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { toast } from "sonner";
import { batchSubmitCorporateCardExpensesAction, getCorporateCardTransactionAction } from "../actions";
import FinanceCorporateCardManagement from "./FinanceCorporateCardManagement";

const refresh = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => ({ refresh }),
}));

jest.mock("sonner", () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

jest.mock("../actions", () => ({
    batchSubmitCorporateCardExpensesAction: jest.fn(),
    getCorporateCardTransactionAction: jest.fn(),
}));

const mockedBatchSubmitAction = batchSubmitCorporateCardExpensesAction as jest.MockedFunction<typeof batchSubmitCorporateCardExpensesAction>;
const mockedGetTransactionAction = getCorporateCardTransactionAction as jest.MockedFunction<typeof getCorporateCardTransactionAction>;

const transactions: CorporateCardTransactionListItemData[] = [
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
    {
        transactionId: 3,
        approvedAt: "2026.08.03",
        merchantName: "OO마트",
        cardName: "삼성 9999",
        amount: 20000,
        expenseCategory: "사무용품",
        status: "IN_PROGRESS",
    },
];

const summary = {
    totalCount: 3,
    approvedCount: 1,
    unwrittenCount: 1,
    inProgressCount: 1,
    rejectedCount: 0,
    totalAmount: 67000,
};

describe("FinanceCorporateCardManagement", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("검색어를 입력하면 일치하는 내역만 노출한다", () => {
        render(<FinanceCorporateCardManagement summary={summary} transactions={transactions} />);

        fireEvent.change(screen.getByPlaceholderText("가맹점·사용자 검색"), { target: { value: "문구" } });

        expect(screen.getByText("OO문구")).toBeInTheDocument();
        expect(screen.queryByText("OO식당")).not.toBeInTheDocument();
        expect(screen.queryByText("OO마트")).not.toBeInTheDocument();
    });

    it("상태 필터를 클릭하면 해당 상태의 내역만 노출한다", () => {
        render(<FinanceCorporateCardManagement summary={summary} transactions={transactions} />);

        fireEvent.click(screen.getByRole("button", { name: "미작성" }));

        expect(screen.getByText("OO문구")).toBeInTheDocument();
        expect(screen.queryByText("OO식당")).not.toBeInTheDocument();
        expect(screen.queryByText("OO마트")).not.toBeInTheDocument();
    });

    it("내역을 하나도 선택하지 않으면 결재 상신 버튼이 비활성화된다", () => {
        render(<FinanceCorporateCardManagement summary={summary} transactions={transactions} />);

        expect(screen.getByRole("button", { name: "결재 상신" })).toBeDisabled();
    });

    it("내역을 하나 선택하면 결재 상신 버튼이 활성화된다", () => {
        render(<FinanceCorporateCardManagement summary={summary} transactions={transactions} />);

        fireEvent.click(screen.getByRole("checkbox", { name: "OO식당 선택" }));

        expect(screen.getByRole("button", { name: "결재 상신" })).toBeEnabled();
    });

    it("전체 선택 체크박스를 클릭하면 노출된 모든 내역이 선택된다", () => {
        render(<FinanceCorporateCardManagement summary={summary} transactions={transactions} />);

        fireEvent.click(screen.getByRole("checkbox", { name: "전체 선택" }));

        expect(screen.getByRole("checkbox", { name: "OO식당 선택" })).toBeChecked();
        expect(screen.getByRole("checkbox", { name: "OO문구 선택" })).toBeChecked();
        expect(screen.getByRole("checkbox", { name: "OO마트 선택" })).toBeChecked();
    });

    it("결재 상신에 성공하면 성공 토스트를 노출하고 선택을 초기화한다", async () => {
        mockedBatchSubmitAction.mockResolvedValue({
            success: true,
            message: "법인카드 사용내역 일괄 상신 처리가 완료되었습니다.",
            data: { successCount: 1, failureCount: 0, results: [] },
        });

        render(<FinanceCorporateCardManagement summary={summary} transactions={transactions} />);

        fireEvent.click(screen.getByRole("checkbox", { name: "OO식당 선택" }));
        fireEvent.click(screen.getByRole("button", { name: "결재 상신" }));

        await waitFor(() => {
            expect(batchSubmitCorporateCardExpensesAction).toHaveBeenCalledWith([1]);
        });
        expect(toast.success).toHaveBeenCalledWith("법인카드 사용내역 일괄 상신 처리가 완료되었습니다.");
        expect(refresh).toHaveBeenCalled();
        expect(screen.getByRole("button", { name: "결재 상신" })).toBeDisabled();
    });

    it("결재 상신에 실패하면 에러 토스트를 노출하고 선택을 유지한다", async () => {
        mockedBatchSubmitAction.mockResolvedValue({ success: false, message: "중복된 내역이 포함되어 있습니다." });

        render(<FinanceCorporateCardManagement summary={summary} transactions={transactions} />);

        fireEvent.click(screen.getByRole("checkbox", { name: "OO식당 선택" }));
        fireEvent.click(screen.getByRole("button", { name: "결재 상신" }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("중복된 내역이 포함되어 있습니다.");
        });
        expect(screen.getByRole("checkbox", { name: "OO식당 선택" })).toBeChecked();
    });

    it("상세보기를 클릭하면 상세 조회 액션을 호출하고 상세 패널을 연다", async () => {
        mockedGetTransactionAction.mockResolvedValue({
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
        });

        render(<FinanceCorporateCardManagement summary={summary} transactions={transactions} />);

        const row = screen.getByText("OO식당").closest("tr")!;
        fireEvent.click(within(row).getByRole("button", { name: /상세보기/ }));

        await waitFor(() => {
            expect(getCorporateCardTransactionAction).toHaveBeenCalledWith(1);
        });
        expect(await screen.findByText("사용내역 상세")).toBeInTheDocument();
        expect(screen.getByText("팀 회식")).toBeInTheDocument();
    });
});
