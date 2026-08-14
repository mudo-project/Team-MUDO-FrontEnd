import type { FinanceCardStatus } from "./mockData";

export const FINANCE_CARD_STATUS_LABEL: Record<FinanceCardStatus, string> = {
    UNWRITTEN: "미작성",
    IN_PROGRESS: "진행중",
    APPROVED: "승인됨",
    REJECTED: "반려됨",
};

export const FINANCE_CARD_STATUS_BADGE_CLASS: Record<FinanceCardStatus, string> = {
    UNWRITTEN: "bg-[#FAF4E9] text-[#B78236]",
    IN_PROGRESS: "bg-[#EAF1FB] text-[#2B6CB0]",
    APPROVED: "bg-[#E7F3EA] text-[#2F7D46]",
    REJECTED: "bg-[#FBEAEA] text-[#C0392B]",
};
