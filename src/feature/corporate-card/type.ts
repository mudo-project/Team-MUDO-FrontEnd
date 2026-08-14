// 법인카드 사용내역 정산·결재 상태
type CorporateCardTransactionStatus = "UNWRITTEN" | "IN_PROGRESS" | "APPROVED" | "REJECTED";

// 법인카드 사용내역 목록조회 쿼리 파라미터
interface CorporateCardTransactionListParams {
    page?: number;
    size?: number;
}

// 법인카드 사용내역 목록 항목
interface CorporateCardTransactionListItemData {
    transactionId: number;
    approvedAt: string;
    merchantName: string;
    cardName: string;
    amount: number;
    expenseCategory: string | null;
    status: CorporateCardTransactionStatus;
}

// 법인카드 사용내역 목록조회 응답 데이터값
interface CorporateCardTransactionListData {
    content: CorporateCardTransactionListItemData[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
}

// 법인카드 사용내역 목록조회 응답값
interface CorporateCardTransactionListResponse {
    status: number;
    code: string;
    message: string;
    data: CorporateCardTransactionListData;
}

// 법인카드 거래 상세(정산 포함) 데이터값
interface CorporateCardTransactionData {
    transactionId: number;
    approvedAt: string;
    approvalNumber: string;
    merchantName: string;
    cardName: string;
    cardNumberMasked: string;
    installmentMonths: number;
    amount: number;
    expenseId: number | null;
    userId: number | null;
    expenseCategory: string | null;
    purpose: string | null;
    approvalDocumentId: number | null;
    status: CorporateCardTransactionStatus;
}

// 법인카드 사용내역 상세 조회 응답값
interface CorporateCardTransactionDetailResponse {
    status: number;
    code: string;
    message: string;
    data: CorporateCardTransactionData;
}

// 법인카드 정산 정보 저장 요청값
interface CorporateCardExpenseSaveRequest {
    expenseCategory: string;
    purpose: string;
}

// 법인카드 정산 정보 저장 응답값
interface CorporateCardExpenseSaveResponse {
    status: number;
    code: string;
    message: string;
    data: CorporateCardTransactionData;
}

// 법인카드 정산 상신(단건) 요청값
interface CorporateCardExpenseSubmitRequest {
    expenseCategory: string;
    purpose: string;
    approverIds?: number[];
}

// 법인카드 정산 상신(단건) 응답 데이터값
type CorporateCardExpenseSubmitData = CorporateCardTransactionData;

// 법인카드 정산 상신(단건) 응답값
interface CorporateCardExpenseSubmitResponse {
    status: number;
    code: string;
    message: string;
    data: CorporateCardExpenseSubmitData;
}

// 법인카드 사용내역 일괄 상신 요청 항목
interface CorporateCardBatchSubmitItem {
    transactionId: number;
}

// 법인카드 사용내역 일괄 상신 요청값
interface CorporateCardBatchSubmitRequest {
    items: CorporateCardBatchSubmitItem[];
    approverIds?: number[];
}

// 법인카드 사용내역 일괄 상신 항목별 결과
interface CorporateCardBatchSubmitResultData {
    transactionId: number;
    success: boolean;
    approvalDocumentId: number | null;
    message: string | null;
}

// 법인카드 사용내역 일괄 상신 응답 데이터값
interface CorporateCardBatchSubmitData {
    successCount: number;
    failureCount: number;
    results: CorporateCardBatchSubmitResultData[];
}

// 법인카드 사용내역 일괄 상신 응답값
interface CorporateCardBatchSubmitResponse {
    status: number;
    code: string;
    message: string;
    data: CorporateCardBatchSubmitData;
}

