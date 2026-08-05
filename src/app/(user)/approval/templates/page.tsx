import Link from "next/link";
import { Plus } from "lucide-react";

const approvalTabs = [
    { label: "내가 신청한 결재", href: "/approval/my" },
    { label: "내게 온 결재", href: "/approval/received" },
    { label: "전체", href: "/approval/all" },
    { label: "템플릿 관리", href: "/approval/templates", active: true },
];

const tableColumns = ["템플릿 이름", "생성자", "결재 라인", "생성일"];

const templates = [
    {
        name: "연가 신청서",
        creator: "정다은",
        approvalLine: ["1. 이민준", "2. 김지수"],
        createdAt: "2025.01.02",
    },
    {
        name: "지출결의서",
        creator: "정다은",
        approvalLine: ["1. 정다은", "2. 김지수"],
        createdAt: "2025.01.02",
    },
    {
        name: "초과근무 신청",
        creator: "정다은",
        approvalLine: ["1. 이민준", "2. 김지수"],
        createdAt: "2025.01.05",
    },
    {
        name: "업무보고서",
        creator: "정다은",
        approvalLine: ["1. 김지수"],
        createdAt: "2025.01.05",
    },
];

export default function Page() {
    return (
        <main className="min-h-[calc(100dvh-52px)] w-full bg-[#FCFCFC] px-8 py-7">
            <div className="flex h-[39px] w-full items-center border-b border-[#D7E8DB]">
                {approvalTabs.map((tab) => (
                    <Link
                        className={`h-[39px] px-[18px] pb-[10px] pt-[9px] text-[13px] leading-[19.5px] ${
                            tab.active
                                ? "border-b-2 border-[#0F172A] font-semibold text-[#0F172A]"
                                : "font-normal text-[#64748B]"
                        }`}
                        href={tab.href}
                        key={tab.label}
                    >
                        {tab.label}
                    </Link>
                ))}

                <button
                    className="mb-2 ml-auto flex items-center gap-1.5 rounded-[8px] bg-[#0F172A] px-3.5 py-1.5 text-[12px] font-medium leading-[18px] text-white"
                    type="button"
                >
                    <Plus className="size-3.5" strokeWidth={2} />
                    템플릿 추가
                </button>
            </div>

            <section className="mt-5 w-full overflow-hidden rounded-[10px] border border-[#D7E8DB] bg-white">
                <div className="grid h-[37px] grid-cols-[minmax(0,1fr)_120px_180px_90px] items-center border-b border-[#D7E8DB] px-5 text-[11px] font-medium leading-[16.5px] text-[#B0B8C1]">
                    {tableColumns.map((column) => (
                        <p key={column}>{column}</p>
                    ))}
                </div>

                {templates.map((template) => (
                    <div
                        className="grid h-[49px] grid-cols-[minmax(0,1fr)_120px_180px_90px] items-center border-b border-[#F7F8F9] px-5 last:border-b-0"
                        key={template.name}
                    >
                        <p className="text-[13px] font-medium leading-[19.5px] text-[#0F172A]">
                            {template.name}
                        </p>
                        <p className="text-[12px] font-normal leading-[18px] text-[#64748B]">
                            {template.creator}
                        </p>
                        <div className="flex items-center gap-1">
                            {template.approvalLine.map((approver, index) => (
                                <div className="flex items-center gap-1" key={approver}>
                                    <span className="rounded-[20px] bg-[#FCFCFC] px-2 py-0.5 text-[11px] font-normal leading-[16.5px] text-[#0F172A]">
                                        {approver}
                                    </span>
                                    {index < template.approvalLine.length - 1 && (
                                        <span className="text-[10px] font-normal leading-[15px] text-[#D0D5DC]">
                                            →
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                        <p className="text-[12px] font-normal leading-[18px] text-[#B0B8C1]">
                            {template.createdAt}
                        </p>
                    </div>
                ))}
            </section>
        </main>
    );
}
