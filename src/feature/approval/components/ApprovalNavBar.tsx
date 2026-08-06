import { Plus } from "lucide-react";
import ApprovalNav from "./ApprovalNav";

const approvalTabs = [
    { label: "내가 신청한 결재", href: '/approval/my' },
    { label: "내게 온 결재", href: '/approval/received' },
    { label: "전체", href: '/approval/all' },
    { label: "템플릿 관리", href: '/approval/templates' },
];


export default function ApprovalNavBar({ buttonType = '결재 상신' }: { buttonType?: string }) {
    return (
        <div className="flex h-9 w-full items-center border-b border-[#D7E8DB] md:h-[39px]">
            {approvalTabs.map((tab) => (
                <ApprovalNav href={tab.href} key={tab.label}>{tab.label}</ApprovalNav>
            ))}

            <button
                className="ml-auto mb-1 flex items-center gap-0.5 rounded-[6px] bg-[#0F172A] px-1.5 py-1 text-[10px] font-medium leading-[18px] text-white sm:gap-1 sm:px-2 md:mb-2 md:gap-1.5 md:rounded-[8px] md:px-3 md:py-1.5 md:text-[11px] lg:px-3.5 lg:text-[12px]"
                type="button"
            >
                <Plus className="size-3 md:size-3.5" strokeWidth={2} />
                {buttonType}
            </button>
        </div>
    )
}
