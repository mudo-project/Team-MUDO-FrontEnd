export const PAYROLL_STATUS_LABEL: Record<PayrollPreparationStatus, string> = {
    NOT_CREATED: "미작성",
    DRAFT: "작성 중",
    CALCULATED: "계산 완료",
    CONFIRMED: "확정",
};

export const PAYROLL_STATUS_BADGE_CLASS: Record<PayrollPreparationStatus, string> = {
    NOT_CREATED: "bg-[#F1F3F6] text-[#64748B]",
    DRAFT: "bg-[#F6C453] text-[#7A4E11]",
    CALCULATED: "bg-[#EAF1FB] text-[#2B6CB0]",
    CONFIRMED: "bg-[#E7F3EA] text-[#2F7D46]",
};

export const PAYROLL_EMPLOYMENT_TYPE_LABEL: Record<PayrollEmploymentType, string> = {
    REGULAR: "정규직",
    FIXED_TERM: "기간제",
    PART_TIME: "파트타임",
};

export const PAYROLL_EMAIL_STATUS_LABEL: Record<PayrollEmailDeliveryStatus, string> = {
    PENDING: "대기",
    SENDING: "발송 중",
    RETRY_WAIT: "재시도 대기",
    SENT: "발송됨",
    DELIVERED: "전달됨",
    FAILED: "실패",
    SKIPPED: "제외됨",
    UNKNOWN: "확인 불가",
};

export const PAYROLL_EMAIL_STATUS_BADGE_CLASS: Record<PayrollEmailDeliveryStatus, string> = {
    PENDING: "bg-[#F1F3F6] text-[#64748B]",
    SENDING: "bg-[#EAF1FB] text-[#2B6CB0]",
    RETRY_WAIT: "bg-[#FAF4E9] text-[#B78236]",
    SENT: "bg-[#E7F3EA] text-[#2F7D46]",
    DELIVERED: "bg-[#E7F3EA] text-[#2F7D46]",
    FAILED: "bg-[#FBEAEA] text-[#C0392B]",
    SKIPPED: "bg-[#F1F3F6] text-[#94A3B8]",
    UNKNOWN: "bg-[#F1F3F6] text-[#64748B]",
};

export const PAYROLL_SALARY_TYPE_LABEL: Record<PayrollSalaryType, string> = {
    MONTHLY: "월급제",
    HOURLY: "시급제",
};

export const PAYROLL_ALLOWANCE_TYPE_LABEL: Record<PayrollFixedAllowanceType, string> = {
    MEAL: "식대",
    POSITION: "직책수당",
    DUTY: "직무수당",
    TRANSPORTATION: "교통비",
    OTHER: "기타",
};
