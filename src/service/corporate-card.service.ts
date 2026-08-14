import { fetchWithAuth } from "@/lib/fetch";
import { getErrorMessage } from "@/lib/stateError";

// 법인카드 사용내역 목록조회 API
export const getCorporateCardTransactions = async (
    params?: CorporateCardTransactionListParams
): Promise<CorporateCardTransactionListData> => {
    const query = new URLSearchParams();
    if (params?.page !== undefined) query.set("page", String(params.page));
    if (params?.size !== undefined) query.set("size", String(params.size));
    const queryString = query.toString();

    const response = await fetchWithAuth(`/api/corporate-card/transactions${queryString ? `?${queryString}` : ""}`);

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "법인카드 사용내역 조회에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as CorporateCardTransactionListResponse;

    return resData.data;
}

// 법인카드 사용내역 상세 조회 API
export const getCorporateCardTransaction = async (
    transactionId: number
): Promise<CorporateCardTransactionData> => {
    const response = await fetchWithAuth(`/api/corporate-card/transactions/${transactionId}`);

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "법인카드 사용내역 상세 조회에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as CorporateCardTransactionDetailResponse;

    return resData.data;
}

// 법인카드 정산 정보 저장 API
export const saveCorporateCardExpense = async (
    transactionId: number,
    payload: CorporateCardExpenseSaveRequest
): Promise<CorporateCardTransactionData> => {
    const response = await fetchWithAuth(`/api/corporate-card/transactions/${transactionId}/expense`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "법인카드 정산 정보 저장에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as CorporateCardExpenseSaveResponse;

    return resData.data;
}

// 법인카드 정산 상신(단건) API
export const submitCorporateCardExpense = async (
    transactionId: number,
    payload: CorporateCardExpenseSubmitRequest
): Promise<CorporateCardExpenseSubmitData> => {
    const response = await fetchWithAuth(`/api/corporate-card/transactions/${transactionId}/submit`, {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "법인카드 정산 상신에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as CorporateCardExpenseSubmitResponse;

    return resData.data;
}

// 법인카드 사용내역 일괄 결재 상신 API
export const batchSubmitCorporateCardExpenses = async (
    payload: CorporateCardBatchSubmitRequest
): Promise<CorporateCardBatchSubmitData> => {
    const response = await fetchWithAuth("/api/corporate-card/transactions/batch-submit", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            "법인카드 사용내역 일괄 상신에 실패하였습니다."
        );

        throw new Error(message);
    }

    const resData = (await response.json()) as CorporateCardBatchSubmitResponse;

    return resData.data;
}
