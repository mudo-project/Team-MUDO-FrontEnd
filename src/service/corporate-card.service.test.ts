import { fetchWithAuth } from "@/lib/fetch";
import {
    batchSubmitCorporateCardExpenses,
    getCorporateCardTransaction,
    getCorporateCardTransactions,
    saveCorporateCardExpense,
    submitCorporateCardExpense,
} from "./corporate-card.service";

jest.mock("@/lib/fetch");

const mockedFetch = fetchWithAuth as jest.Mock;

const okJsonResponse = (data: unknown) => ({
    ok: true,
    json: () => Promise.resolve(data),
});

const failJsonResponse = (message: string) => ({
    ok: false,
    headers: { get: () => "application/json" },
    json: () => Promise.resolve({ message }),
});

describe("getCorporateCardTransactions", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 목록을 반환한다", async () => {
        const listData = { content: [], page: 0, size: 20, totalElements: 0, totalPages: 0, first: true, last: true, hasNext: false, hasPrevious: false };
        mockedFetch.mockResolvedValue(okJsonResponse({ data: listData }));

        const result = await getCorporateCardTransactions();

        expect(mockedFetch).toHaveBeenCalledWith("/api/corporate-card/transactions");
        expect(result).toEqual(listData);
    });

    it("page, size가 있으면 쿼리스트링을 포함해 호출한다", async () => {
        const listData = { content: [], page: 1, size: 10, totalElements: 0, totalPages: 0, first: false, last: true, hasNext: false, hasPrevious: true };
        mockedFetch.mockResolvedValue(okJsonResponse({ data: listData }));

        await getCorporateCardTransactions({ page: 1, size: 10 });

        expect(mockedFetch).toHaveBeenCalledWith("/api/corporate-card/transactions?page=1&size=10");
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("법인카드 사용내역 조회에 실패하였습니다."));

        await expect(getCorporateCardTransactions()).rejects.toThrow("법인카드 사용내역 조회에 실패하였습니다.");
    });
});

describe("getCorporateCardTransaction", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 상세 정보를 반환한다", async () => {
        const detail = { transactionId: 1, expenseCategory: "식대" };
        mockedFetch.mockResolvedValue(okJsonResponse({ data: detail }));

        const result = await getCorporateCardTransaction(1);

        expect(mockedFetch).toHaveBeenCalledWith("/api/corporate-card/transactions/1");
        expect(result).toEqual(detail);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("법인카드 사용내역 상세 조회에 실패하였습니다."));

        await expect(getCorporateCardTransaction(1)).rejects.toThrow("법인카드 사용내역 상세 조회에 실패하였습니다.");
    });
});

describe("saveCorporateCardExpense", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 저장된 거래 정보를 반환하고 PUT으로 요청한다", async () => {
        const saved = { transactionId: 1, expenseCategory: "식대", purpose: "팀 회식" };
        mockedFetch.mockResolvedValue(okJsonResponse({ data: saved }));

        const result = await saveCorporateCardExpense(1, { expenseCategory: "식대", purpose: "팀 회식" });

        expect(mockedFetch).toHaveBeenCalledWith("/api/corporate-card/transactions/1/expense", {
            method: "PUT",
            body: JSON.stringify({ expenseCategory: "식대", purpose: "팀 회식" }),
        });
        expect(result).toEqual(saved);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("법인카드 정산 정보 저장에 실패하였습니다."));

        await expect(saveCorporateCardExpense(1, { expenseCategory: "식대", purpose: "팀 회식" }))
            .rejects.toThrow("법인카드 정산 정보 저장에 실패하였습니다.");
    });
});

describe("submitCorporateCardExpense", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 상신된 거래 정보를 반환하고 POST로 요청한다", async () => {
        const submitted = { transactionId: 1, status: "IN_PROGRESS" };
        mockedFetch.mockResolvedValue(okJsonResponse({ data: submitted }));

        const result = await submitCorporateCardExpense(1, { expenseCategory: "식대", purpose: "팀 회식", approverIds: [10] });

        expect(mockedFetch).toHaveBeenCalledWith("/api/corporate-card/transactions/1/submit", {
            method: "POST",
            body: JSON.stringify({ expenseCategory: "식대", purpose: "팀 회식", approverIds: [10] }),
        });
        expect(result).toEqual(submitted);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("법인카드 정산 상신에 실패하였습니다."));

        await expect(submitCorporateCardExpense(1, { expenseCategory: "식대", purpose: "팀 회식" }))
            .rejects.toThrow("법인카드 정산 상신에 실패하였습니다.");
    });
});

describe("batchSubmitCorporateCardExpenses", () => {
    afterEach(() => jest.clearAllMocks());

    it("응답이 정상이면 일괄 상신 결과를 반환한다", async () => {
        const batchResult = { successCount: 1, failureCount: 0, results: [{ transactionId: 1, success: true, approvalDocumentId: 1, message: null }] };
        mockedFetch.mockResolvedValue(okJsonResponse({ data: batchResult }));

        const result = await batchSubmitCorporateCardExpenses({ items: [{ transactionId: 1 }] });

        expect(mockedFetch).toHaveBeenCalledWith("/api/corporate-card/transactions/batch-submit", {
            method: "POST",
            body: JSON.stringify({ items: [{ transactionId: 1 }] }),
        });
        expect(result).toEqual(batchResult);
    });

    it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
        mockedFetch.mockResolvedValue(failJsonResponse("법인카드 사용내역 일괄 상신에 실패하였습니다."));

        await expect(batchSubmitCorporateCardExpenses({ items: [{ transactionId: 1 }] }))
            .rejects.toThrow("법인카드 사용내역 일괄 상신에 실패하였습니다.");
    });
});
