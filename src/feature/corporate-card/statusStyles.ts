import type { FinanceCardStatus } from "./mockData";

export const FINANCE_CARD_STATUS_LABEL: Record<FinanceCardStatus, string> = {
    UNWRITTEN: "미작성",
    PENDING: "대기",
    IN_PROGRESS: "결재중",
    APPROVED: "승인",
    REJECTED: "반려",
};

export const FINANCE_CARD_STATUS_BADGE_CLASS: Record<FinanceCardStatus, string> = {
    UNWRITTEN: "bg-[#FAF4E9] text-[#B78236]",
    PENDING: "bg-[#F1F5F9] text-[#64748B]",
    IN_PROGRESS: "bg-[#EAF1FB] text-[#2B6CB0]",
    APPROVED: "bg-[#E7F3EA] text-[#2F7D46]",
    REJECTED: "bg-[#FBEAEA] text-[#C0392B]",
};
