// 임시로 사용할 더미데이터입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.

export type FinanceCardStatus = "UNWRITTEN" | "IN_PROGRESS" | "APPROVED" | "REJECTED";

export interface FinanceCardApprover {
    name: string;
    role: string;
    order: number;
    isFinal: boolean;
    approvedAt: string | null;
}

export interface FinanceCardRejection {
    reason: string;
    rejectedBy: string;
    rejectedAt: string;
}

export interface FinanceCardItem {
    id: number;
    approvedAt: string;
    merchantName: string;
    merchantType: string;
    cardName: string;
    cardLast4: string;
    amount: number;
    purpose: string | null;
    reason: string | null;
    status: FinanceCardStatus;
    approvalNumber: string;
    installment: string;
    approvers: FinanceCardApprover[];
    rejection: FinanceCardRejection | null;
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

export const financeCardListMock: FinanceCardItem[] = [
    {
        id: 1,
        approvedAt: "08.03 14:22",
        merchantName: "자연분식",
        merchantType: "일반음식점",
        cardName: "법인 1",
        cardLast4: "1234",
        amount: 84000,
        purpose: "식대",
        reason: "강사 전체 회의 점심 식대",
        status: "APPROVED",
        approvalNumber: "30281746",
        installment: "일시불",
        approvers: [
            { name: "이민준", role: "강사", order: 1, isFinal: false, approvedAt: "08.03 15:00" },
            { name: "김지수", role: "원장", order: 2, isFinal: true, approvedAt: "08.03 16:30" },
        ],
        rejection: null,
    },
    {
        id: 2,
        approvedAt: "08.02 11:45",
        merchantName: "교보문고",
        merchantType: "서점",
        cardName: "법인 1",
        cardLast4: "1234",
        amount: 156000,
        purpose: "교재·비품",
        reason: "신규 교재 구매",
        status: "IN_PROGRESS",
        approvalNumber: "30281512",
        installment: "일시불",
        approvers: [
            { name: "이민준", role: "강사", order: 1, isFinal: false, approvedAt: "08.02 13:10" },
            { name: "김지수", role: "원장", order: 2, isFinal: true, approvedAt: null },
        ],
        rejection: null,
    },
    {
        id: 3,
        approvedAt: "08.01 16:30",
        merchantName: "올리브영",
        merchantType: "소매",
        cardName: "법인 2",
        cardLast4: "5678",
        amount: 38500,
        purpose: null,
        reason: null,
        status: "UNWRITTEN",
        approvalNumber: "30281390",
        installment: "일시불",
        approvers: [],
        rejection: null,
    },
    {
        id: 4,
        approvedAt: "07.31 09:15",
        merchantName: "한진주차장",
        merchantType: "주차",
        cardName: "법인 1",
        cardLast4: "1234",
        amount: 5000,
        purpose: "교통비",
        reason: "학부모 상담 방문 주차",
        status: "APPROVED",
        approvalNumber: "30281204",
        installment: "일시불",
        approvers: [
            { name: "이민준", role: "강사", order: 1, isFinal: false, approvedAt: "07.31 10:00" },
            { name: "김지수", role: "원장", order: 2, isFinal: true, approvedAt: "07.31 11:20" },
        ],
        rejection: null,
    },
    {
        id: 5,
        approvedAt: "07.30 18:00",
        merchantName: "스타벅스 강남점",
        merchantType: "카페",
        cardName: "법인 2",
        cardLast4: "5678",
        amount: 32500,
        purpose: null,
        reason: null,
        status: "UNWRITTEN",
        approvalNumber: "30281088",
        installment: "일시불",
        approvers: [],
        rejection: null,
    },
    {
        id: 6,
        approvedAt: "07.29 13:20",
        merchantName: "GS칼텍스 중앙점",
        merchantType: "주유소",
        cardName: "법인 1",
        cardLast4: "1234",
        amount: 89000,
        purpose: "시설관리",
        reason: "통학차량 주유",
        status: "REJECTED",
        approvalNumber: "30280977",
        installment: "일시불",
        approvers: [
            { name: "이민준", role: "강사", order: 1, isFinal: true, approvedAt: null },
        ],
        rejection: {
            reason: "사용목적이 시설관리와 맞지 않습니다. 통학차량 관련 항목으로 다시 작성해주세요.",
            rejectedBy: "김지수 · 원장",
            rejectedAt: "07.29 14:05",
        },
    },
    {
        id: 7,
        approvedAt: "07.28 15:40",
        merchantName: "홈플러스 서초점",
        merchantType: "대형마트",
        cardName: "법인 2",
        cardLast4: "5678",
        amount: 245000,
        purpose: "교재·비품",
        reason: "교구 및 소모품 구매",
        status: "IN_PROGRESS",
        approvalNumber: "30280850",
        installment: "3개월",
        approvers: [
            { name: "이민준", role: "강사", order: 1, isFinal: false, approvedAt: null },
            { name: "김지수", role: "원장", order: 2, isFinal: true, approvedAt: null },
        ],
        rejection: null,
    },
    {
        id: 8,
        approvedAt: "07.27 10:00",
        merchantName: "GS25 역삼점",
        merchantType: "편의점",
        cardName: "법인 1",
        cardLast4: "1234",
        amount: 12300,
        purpose: null,
        reason: null,
        status: "UNWRITTEN",
        approvalNumber: "30280711",
        installment: "일시불",
        approvers: [],
        rejection: null,
    },
];

export const financeCardMonthSummary = {
    monthlyTotalCount: 8,
    approvedCount: 2,
    unwrittenCount: 3,
    inProgressCount: 2,
    monthlyTotalAmount: 1842300,
    usageCount: 37,
    unwrittenPurposeCount: 3,
    approvalProgress: {
        inProgress: 2,
        approved: 2,
        rejected: 1,
    },
};
