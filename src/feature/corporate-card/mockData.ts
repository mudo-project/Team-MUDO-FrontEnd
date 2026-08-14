// 결재선 지정 UI에서 사용하는 승인자 형태입니다. 결재자 후보 목록 조회 API가 아직 없어 실제 데이터로 대체하지 못했습니다.

export interface FinanceCardApprover {
    name: string;
    role: string;
    order: number;
    isFinal: boolean;
    approvedAt: string | null;
}

export const FINANCE_CARD_PURPOSE_OPTIONS = [
    "식대",
    "도서·교재",
    "사무용품",
    "교통비",
    "시설·비품",
    "교육비",
    "기타",
] as const;
