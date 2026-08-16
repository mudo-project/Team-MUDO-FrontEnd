import {
    batchSubmitCorporateCardExpenses,
    saveCorporateCardExpense,
    submitCorporateCardExpense,
} from "@/service/corporate-card.service";
import {
    batchSubmitCorporateCardExpensesAction,
    saveCorporateCardExpenseAction,
    submitCorporateCardExpenseAction,
} from "./actions";

jest.mock("../../service/corporate-card.service");

const mockedSave = saveCorporateCardExpense as jest.Mock;
const mockedSubmit = submitCorporateCardExpense as jest.Mock;
const mockedBatchSubmit = batchSubmitCorporateCardExpenses as jest.Mock;

describe("saveCorporateCardExpenseAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("사용 목적이 비어있으면 실패 결과를 반환한다", async () => {
        const result = await saveCorporateCardExpenseAction(1, "", "팀 회식");

        expect(result).toEqual({ success: false, message: "사용 목적(분류)을 선택해주세요." });
        expect(saveCorporateCardExpense).not.toHaveBeenCalled();
    });

    it("사용 사유가 비어있으면 실패 결과를 반환한다", async () => {
        const result = await saveCorporateCardExpenseAction(1, "식대", "  ");

        expect(result).toEqual({ success: false, message: "사용 사유를 입력해주세요." });
        expect(saveCorporateCardExpense).not.toHaveBeenCalled();
    });

    it("service 호출이 성공하면 저장된 데이터와 함께 성공 결과를 반환한다", async () => {
        const saved = { transactionId: 1, expenseCategory: "식대", purpose: "팀 회식" };
        mockedSave.mockResolvedValue(saved);

        const result = await saveCorporateCardExpenseAction(1, "식대", "팀 회식");

        expect(saveCorporateCardExpense).toHaveBeenCalledWith(1, { expenseCategory: "식대", purpose: "팀 회식" });
        expect(result).toEqual({ success: true, message: "법인카드 정산 정보가 저장되었습니다.", data: saved });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedSave.mockRejectedValue(new Error("법인카드 정산 정보 저장에 실패하였습니다."));

        const result = await saveCorporateCardExpenseAction(1, "식대", "팀 회식");

        expect(result).toEqual({ success: false, message: "법인카드 정산 정보 저장에 실패하였습니다." });
    });
});

describe("submitCorporateCardExpenseAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("사용 목적이 비어있으면 실패 결과를 반환한다", async () => {
        const result = await submitCorporateCardExpenseAction(1, "", "팀 회식");

        expect(result).toEqual({ success: false, message: "사용 목적(분류)을 선택해주세요." });
        expect(submitCorporateCardExpense).not.toHaveBeenCalled();
    });

    it("사용 사유가 비어있으면 실패 결과를 반환한다", async () => {
        const result = await submitCorporateCardExpenseAction(1, "식대", "");

        expect(result).toEqual({ success: false, message: "사용 사유를 입력해주세요." });
        expect(submitCorporateCardExpense).not.toHaveBeenCalled();
    });

    it("결재자 목록에 중복이 있으면 실패 결과를 반환한다", async () => {
        const result = await submitCorporateCardExpenseAction(1, "식대", "팀 회식", [10, 10]);

        expect(result).toEqual({ success: false, message: "결재자 목록에 중복된 결재자가 있습니다." });
        expect(submitCorporateCardExpense).not.toHaveBeenCalled();
    });

    it("service 호출이 성공하면 상신된 데이터와 함께 성공 결과를 반환한다", async () => {
        const submitted = { transactionId: 1, status: "IN_PROGRESS" };
        mockedSubmit.mockResolvedValue(submitted);

        const result = await submitCorporateCardExpenseAction(1, "식대", "팀 회식", [10, 20]);

        expect(submitCorporateCardExpense).toHaveBeenCalledWith(1, { expenseCategory: "식대", purpose: "팀 회식", approverIds: [10, 20] });
        expect(result).toEqual({ success: true, message: "법인카드 정산이 상신되었습니다.", data: submitted });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedSubmit.mockRejectedValue(new Error("법인카드 정산 상신에 실패하였습니다."));

        const result = await submitCorporateCardExpenseAction(1, "식대", "팀 회식");

        expect(result).toEqual({ success: false, message: "법인카드 정산 상신에 실패하였습니다." });
    });
});

describe("batchSubmitCorporateCardExpensesAction", () => {
    afterEach(() => jest.clearAllMocks());

    it("선택한 내역이 없으면 실패 결과를 반환한다", async () => {
        const result = await batchSubmitCorporateCardExpensesAction([]);

        expect(result).toEqual({ success: false, message: "상신할 내역을 하나 이상 선택해주세요." });
        expect(batchSubmitCorporateCardExpenses).not.toHaveBeenCalled();
    });

    it("중복된 내역이 포함되어 있으면 실패 결과를 반환한다", async () => {
        const result = await batchSubmitCorporateCardExpensesAction([1, 1]);

        expect(result).toEqual({ success: false, message: "중복된 내역이 포함되어 있습니다." });
        expect(batchSubmitCorporateCardExpenses).not.toHaveBeenCalled();
    });

    it("service 호출이 성공하면 결과 데이터와 함께 성공 결과를 반환한다", async () => {
        const batchResult = { successCount: 2, failureCount: 0, results: [] };
        mockedBatchSubmit.mockResolvedValue(batchResult);

        const result = await batchSubmitCorporateCardExpensesAction([1, 2], [10]);

        expect(batchSubmitCorporateCardExpenses).toHaveBeenCalledWith({
            items: [{ transactionId: 1 }, { transactionId: 2 }],
            approverIds: [10],
        });
        expect(result).toEqual({ success: true, message: "법인카드 사용내역 일괄 상신 처리가 완료되었습니다.", data: batchResult });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedBatchSubmit.mockRejectedValue(new Error("법인카드 사용내역 일괄 상신에 실패하였습니다."));

        const result = await batchSubmitCorporateCardExpensesAction([1, 2]);

        expect(result).toEqual({ success: false, message: "법인카드 사용내역 일괄 상신에 실패하였습니다." });
    });
});
