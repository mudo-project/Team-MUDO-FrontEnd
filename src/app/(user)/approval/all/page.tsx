import { Plus } from "lucide-react";

const approvalTabs = [
    { label: "내가 신청한 결재", active: false },
    { label: "내게 온 결재", active: false },
    { label: "전체", active: true },
    { label: "템플릿 관리", active: false },
];

const tableColumns = ["문서 제목", "기안자", "유형", "현재 결재자", "상태"];

const approvals = [
    { title: "2025년 1월 연가 신청", date: "2025.01.15", author: "박서연", type: "연가 신청서", approver: "2차 · 김지수", approverColor: "text-[#2C8D50]", status: "진행중", statusColor: "bg-[#DCFCE7] text-[#2C8D50]" },
    { title: "교재 구매 품의서", date: "2025.01.14", author: "이민준", type: "지출결의서", approver: "결재 완료", approverColor: "text-[#B0B8C1]", status: "승인", statusColor: "bg-[#F0FDF4] text-[#0F172A]" },
    { title: "초과근무 수당 신청 (1월 2주차)", date: "2025.01.13", author: "최현우", type: "초과근무 신청", approver: "결재 완료", approverColor: "text-[#B0B8C1]", status: "반려", statusColor: "bg-[#FBF2F4] text-[#BF5970]" },
    { title: "사무용품 구매 품의서", date: "2025.01.12", author: "정다은", type: "지출결의서", approver: "결재 완료", approverColor: "text-[#B0B8C1]", status: "반려", statusColor: "bg-[#FBF2F4] text-[#BF5970]" },
    { title: "12월 월간 업무보고", date: "2025.01.10", author: "강도현", type: "업무보고서", approver: "결재 완료", approverColor: "text-[#B0B8C1]", status: "승인", statusColor: "bg-[#F0FDF4] text-[#0F172A]" },
];

export default function Page() {
    return (
        <main className="min-h-[calc(100dvh-52px)] w-full bg-[#FCFCFC] px-8 py-7">
            <div className="flex h-[39px] w-full items-center border-b border-[#D7E8DB]">
                {approvalTabs.map((tab) => (
                    <button
                        className={`h-[39px] px-[18px] pb-[10px] pt-[9px] text-[13px] leading-[19.5px] ${tab.active ? "border-b-2 border-[#0F172A] font-semibold text-[#0F172A]" : "font-normal text-[#64748B]"}`}
                        key={tab.label}
                        type="button"
                    >
                        {tab.label}
                    </button>
                ))}

                <button className="ml-auto mb-2 flex items-center gap-1.5 rounded-[8px] bg-[#0F172A] px-3.5 py-1.5 text-[12px] font-medium leading-[18px] text-white" type="button">
                    <Plus className="size-3.5" strokeWidth={2} />
                    결재 상신
                </button>
            </div>

            <section className="mt-5 w-full overflow-hidden rounded-[10px] border border-[#D7E8DB] bg-white">
                <div className="grid h-[37px] grid-cols-[minmax(0,1fr)_80px_90px_160px_80px] items-center border-b border-[#D7E8DB] px-5 text-[11px] font-medium leading-[16.5px] text-[#B0B8C1]">
                    {tableColumns.map((column) => <p key={column}>{column}</p>)}
                </div>

                {approvals.map((approval) => (
                    <div className="grid h-[67px] grid-cols-[minmax(0,1fr)_80px_90px_160px_80px] items-center border-b border-[#F7F8F9] px-5 last:border-b-0" key={approval.title}>
                        <div>
                            <p className="text-[13px] font-medium leading-[19.5px] text-[#0F172A]">{approval.title}</p>
                            <p className="pt-0.5 text-[11px] font-normal leading-[16.5px] text-[#C0C8D0]">{approval.date}</p>
                        </div>
                        <p className="text-[12px] font-normal leading-[18px] text-[#6B7280]">{approval.author}</p>
                        <p className="text-[11px] font-normal leading-[16.5px] text-[#64748B]">{approval.type}</p>
                        <p className={`text-[12px] font-normal leading-[18px] ${approval.approverColor}`}>{approval.approver}</p>
                        <span className={`w-full rounded-[20px] px-[9px] py-0.5 text-[11px] font-medium leading-[16.5px] ${approval.statusColor}`}>{approval.status}</span>
                    </div>
                ))}
            </section>
        </main>
    );
}
