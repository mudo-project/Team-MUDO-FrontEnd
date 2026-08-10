import { ApprovalListData, ApprovalDocumentStatus } from "../type";
import ApprovalItemButton from "./ApprovalItemButton";

const statusStyle: Record<ApprovalDocumentStatus, { label: string; className: string }> = {
    IN_PROGRESS: { label: "진행중", className: "bg-[#DCFCE7] text-[#2C8D50]" },
    APPROVED: { label: "승인", className: "bg-[#E8F0FE] text-[#4A78C2]" },
    REJECTED: { label: "반려", className: "bg-[#FDECEC] text-[#D65A5A]" },
    CANCELLED: { label: "취소", className: "bg-[#F0F2F5] text-[#8A94A3]" },
};

interface ApprovalItemProps {
    approval: ApprovalListData;
    type?: 'my' | 'other'
}

export default function ApprovalItem({ approval, type = 'other' }: ApprovalItemProps) {
    const currentApprover = approval.currentApproverName
        ? `${approval.currentApproverStepOrder}차 · ${approval.currentApproverName}`
        : "-";
    const status = statusStyle[approval.status];

    return (
        <ApprovalItemButton id={approval.id} type={type}>
            <div className="col-span-4 lg:col-span-6">
                <p className="text-[10px] font-medium leading-[19.5px] text-[#0F172A] md:text-[12px] lg:text-[13px]">
                    {approval.title}
                </p>
                <p className="pt-0.5 text-[10px] font-normal leading-[16.5px] text-[#C0C8D0] lg:text-[11px]">
                    {approval.createdAt.slice(0, 10).replaceAll("-", ".")}
                </p>
            </div>
            <p className="col-span-1 text-[10px] font-normal leading-[18px] text-[#6B7280] md:text-[11px] lg:text-[12px]">{approval.creatorName}</p>
            <p className="hidden md:block col-span-1 text-[10px] font-normal leading-[16.5px] text-[#64748B] lg:text-[11px]">{approval.templateName}</p>
            <p className="col-span-2 text-[10px] font-normal leading-[18px] text-[#2C8D50] md:text-[11px] lg:text-[12px]">{currentApprover}</p>
            <div className="col-span-1">
                <span className={`rounded-[20px] px-1 py-0.5 text-[10px] font-medium leading-[16.5px] md:px-1.5 lg:px-[9px] lg:text-[11px] ${status.className}`}>{status.label}</span>
            </div>
        </ApprovalItemButton>
    )
}
