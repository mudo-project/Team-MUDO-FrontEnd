'use server'

import {
    batchSubmitCorporateCardExpenses,
    getCorporateCardTransaction,
    getCorporateCardTransactions,
    saveCorporateCardExpense,
    submitCorporateCardExpense,
} from "@/service/corporate-card.service";

interface CorporateCardActionState {
    success: boolean;
    message: string;
}

// 법인카드 사용내역 목록조회 액션
export const getCorporateCardTransactionsAction = async (
    params?: CorporateCardTransactionListParams
): Promise<CorporateCardTransactionListData> => {
    return getCorporateCardTransactions(params);
}

// 법인카드 사용내역 상세조회 액션
export const getCorporateCardTransactionAction = async (
    transactionId: number
): Promise<CorporateCardTransactionData> => {
    return getCorporateCardTransaction(transactionId);
}

// 법인카드 정산 정보 저장 액션
export const saveCorporateCardExpenseAction = async (
    transactionId: number,
    expenseCategory: string,
    purpose: string
): Promise<CorporateCardActionState & { data?: CorporateCardTransactionData }> => {
    if (!expenseCategory.trim()) {
        return {
            success: false,
            message: "사용 목적(분류)을 선택해주세요."
        };
    }

    if (!purpose.trim()) {
        return {
            success: false,
            message: "사용 사유를 입력해주세요."
        };
    }

    try {
        const data = await saveCorporateCardExpense(transactionId, {
            expenseCategory,
            purpose,
        });

        return {
            success: true,
            message: "법인카드 정산 정보가 저장되었습니다.",
            data,
        };
    } catch (error) {
        let errorMessage = "법인카드 정산 정보 저장에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}

// 법인카드 정산 상신(단건) 액션
export const submitCorporateCardExpenseAction = async (
    transactionId: number,
    expenseCategory: string,
    purpose: string,
    approverIds?: number[]
): Promise<CorporateCardActionState & { data?: CorporateCardExpenseSubmitData }> => {
    if (!expenseCategory.trim()) {
        return {
            success: false,
            message: "사용 목적(분류)을 선택해주세요."
        };
    }

    if (!purpose.trim()) {
        return {
            success: false,
            message: "사용 사유를 입력해주세요."
        };
    }

    if (approverIds && new Set(approverIds).size !== approverIds.length) {
        return {
            success: false,
            message: "결재자 목록에 중복된 결재자가 있습니다."
        };
    }

    try {
        const data = await submitCorporateCardExpense(transactionId, {
            expenseCategory,
            purpose,
            approverIds,
        });

        return {
            success: true,
            message: "법인카드 정산이 상신되었습니다.",
            data,
        };
    } catch (error) {
        let errorMessage = "법인카드 정산 상신에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}

// 법인카드 사용내역 일괄 결재 상신 액션
export const batchSubmitCorporateCardExpensesAction = async (
    transactionIds: number[],
    approverIds?: number[]
): Promise<CorporateCardActionState & { data?: CorporateCardBatchSubmitData }> => {
    if (transactionIds.length === 0) {
        return {
            success: false,
            message: "상신할 내역을 하나 이상 선택해주세요."
        };
    }

    if (new Set(transactionIds).size !== transactionIds.length) {
        return {
            success: false,
            message: "중복된 내역이 포함되어 있습니다."
        };
    }

    try {
        const data = await batchSubmitCorporateCardExpenses({
            items: transactionIds.map((transactionId) => ({ transactionId })),
            approverIds,
        });

        return {
            success: true,
            message: "법인카드 사용내역 일괄 상신 처리가 완료되었습니다.",
            data,
        };
    } catch (error) {
        let errorMessage = "법인카드 사용내역 일괄 상신에 실패하였습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}
