import ApprovalCreateButton from "./ApprovalCreateButton";
import ApprovalNav from "./ApprovalNav";
import ApprovalTemplateCreateButton from "./ApprovalTemplateCreateButton";

const approvalTabs = [
    { label: "내가 신청한 결재", href: '/approval/my' },
    { label: "내게 온 결재", href: '/approval/received' },
    { label: "전체", href: '/approval/all' },
    { label: "내 결재 이력", href: '/approval/history' },
    { label: "템플릿 관리", href: '/approval/templates' },
];


export default function ApprovalNavBar({ buttonType = '결재 상신' }: { buttonType?: string }) {
    return (
        <div className="flex h-9 w-full items-center border-b border-[#D7E8DB] md:h-[39px]">
            <div className="w-[70%] flex overflow-x-auto ">
                {approvalTabs.map((tab) => (
                    <ApprovalNav href={tab.href} key={tab.label}>{tab.label}</ApprovalNav>
                ))}
            </div>
            {buttonType === '결재 상신' ? <ApprovalCreateButton /> : <ApprovalTemplateCreateButton />}

        </div>
    )
}
